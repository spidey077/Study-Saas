import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

async function upsertUserSubscription(clerkId: string, subscriptionTier: 'free' | 'tier1' | 'tier2', email?: string | null, name?: string | null) {
  const payload = {
    clerk_id: clerkId,
    email: `${clerkId}@stripe.local`,
    name: null,
    language: 'english',
    reminder_enabled: true,
    reminder_time: '09:00',
    summary_enabled: true,
    subscription_tier: subscriptionTier,
  }

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
      .update({ subscription_tier: subscriptionTier })
      .eq('clerk_id', clerkId)

    if (error) throw error
  } else {
    const { error } = await supabaseAdmin.from('users').insert(payload)

    if (error) throw error
  }

  await clerkClient.users.updateUserMetadata(clerkId, {
    publicMetadata: {
      subscription_tier: subscriptionTier,
    },
  })
}

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
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is required.' }, { status: 500 })
  }

  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid webhook payload' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const clerkId = session.metadata?.clerkId || session.client_reference_id
        const tier = session.metadata?.tier

        if (clerkId && (tier === 'tier1' || tier === 'tier2')) {
          await upsertUserSubscription(clerkId, tier)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const clerkId = subscription.metadata?.clerkId

        if (clerkId) {
          const tier = resolveTierFromSubscription(subscription)
          await upsertUserSubscription(clerkId, tier)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const clerkId = subscription.metadata?.clerkId

        if (clerkId) {
          await upsertUserSubscription(clerkId, 'free')
        }
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook handler failed' }, { status: 500 })
  }
}