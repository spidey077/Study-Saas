import Stripe from 'stripe'

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required.')
  }

  return new Stripe(secretKey)
}

export async function getStripePriceId(tier: 'tier1' | 'tier2') {
  const priceId = tier === 'tier1' ? process.env.STRIPE_PRICE_TIER1 : process.env.STRIPE_PRICE_TIER2

  if (!priceId) {
    const productId = tier === 'tier1' ? process.env.STRIPE_PRODUCT_TIER1 : process.env.STRIPE_PRODUCT_TIER2

    if (!productId) {
      throw new Error(`Stripe price ID or product ID is required for ${tier}.`)
    }

    const stripe = getStripe()
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 100,
    })

    const recurringPrice = prices.data.find((price) => Boolean(price.recurring))

    if (!recurringPrice?.id) {
      throw new Error(`No active recurring price found for ${tier} product ${productId}.`)
    }

    return recurringPrice.id
  }

  return priceId
}

export function getAppUrl(request?: Request) {
  const envUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL

  if (envUrl) {
    return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`
  }

  if (request) {
    return new URL(request.url).origin
  }

  return 'https://studysmartsaas.vercel.app'
}
