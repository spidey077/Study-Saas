import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAppUrl, getStripe, getStripePriceId } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const tier = body?.tier

  if (tier !== 'tier1' && tier !== 'tier2') {
    return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const priceId = await getStripePriceId(tier)
    const clerkUser = await clerkClient.users.getUser(userId)
    const email = clerkUser.emailAddresses?.[0]?.emailAddress
    const appUrl = getAppUrl(request)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      client_reference_id: userId,
      metadata: {
        clerkId: userId,
        tier,
      },
      subscription_data: {
        metadata: {
          clerkId: userId,
          tier,
        },
      },
      success_url: `${appUrl}/settings?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?billing=cancelled`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe checkout session did not return a URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create checkout session' }, { status: 500 })
  }
}