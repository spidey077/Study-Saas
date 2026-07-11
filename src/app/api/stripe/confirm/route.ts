import Stripe from 'stripe'
import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

async function getClerkProfile(clerkId: string) {
  try {
    const clerkUser = await clerkClient.users.getUser(clerkId)
    return {
      email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
      name: clerkUser.firstName || clerkUser.username || null,
    }
  } catch {
    return { email: null, name: null }
  }
}

async function syncUserTier(clerkId: string, tier: 'free' | 'tier1' | 'tier2') {

  const { data: existingUsers, error: readError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (readError) throw readError

  const existingUser = existingUsers?.[0] || null

  if (existingUser) {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ subscription_tier: tier })
      .eq('clerk_id', clerkId)

    if (error) throw error
  } else {
    const { error } = await supabaseAdmin.from('users').insert({
      clerk_id: clerkId,
      email: `${clerkId}@stripe.local`,
      name: null,
      language: 'english',
      reminder_enabled: true,
      reminder_time: '09:00',
      summary_enabled: true,
      subscription_tier: tier,
      role: 'user',
    })

    if (error) throw error
  }

  await clerkClient.users.updateUserMetadata(clerkId, {
    publicMetadata: {
      subscription_tier: tier,
    },
  })
}

function resolveTierFromSubscription(subscription: Stripe.Subscription): 'free' | 'tier1' | 'tier2' {
  const metadataTier = subscription.metadata?.tier

  if (metadataTier === 'tier1' || metadataTier === 'tier2') {
    return metadataTier
  }

  const recurringPriceId = subscription.items.data[0]?.price?.id
  const productId = typeof subscription.items.data[0]?.price?.product === 'string'
    ? subscription.items.data[0].price.product
    : subscription.items.data[0]?.price?.product?.id

  if (recurringPriceId && recurringPriceId === process.env.STRIPE_PRICE_TIER1) {
    return 'tier1'
  }

  if (recurringPriceId && recurringPriceId === process.env.STRIPE_PRICE_TIER2) {
    return 'tier2'
  }

  if (productId && productId === process.env.STRIPE_PRODUCT_TIER1) {
    return 'tier1'
  }

  if (productId && productId === process.env.STRIPE_PRODUCT_TIER2) {
    return 'tier2'
  }

  return 'free'
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const sessionId = body?.sessionId

  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    const clerkId = session.metadata?.clerkId || session.client_reference_id

    if (!clerkId || clerkId !== userId) {
      return NextResponse.json({ error: 'Session does not belong to the current user' }, { status: 403 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Checkout session is not paid yet' }, { status: 400 })
    }

    const subscription = session.subscription
    const tier = subscription && typeof subscription !== 'string'
      ? resolveTierFromSubscription(subscription)
      : resolveTierFromSubscription(await stripe.subscriptions.retrieve(session.subscription as string))

    await syncUserTier(clerkId, tier)

    return NextResponse.json({ success: true, tier })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to confirm subscription' }, { status: 500 })
  }
}