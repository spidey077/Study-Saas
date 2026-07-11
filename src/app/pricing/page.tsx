'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Check, BookOpen, Zap, Crown } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import { SubscriptionTier } from '@/types'

export default function PricingPage() {
  const { isSignedIn } = useUser()
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null)

  async function startCheckout(tier: Exclude<SubscriptionTier, 'free'>) {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }

    setLoadingTier(tier)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      if (!data.url) {
        throw new Error('Stripe checkout URL was not returned')
      }

      window.location.href = data.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout')
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/30 px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            AI-powered study planning for Pakistani and International exams
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border-2 border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up stagger-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Free</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get started</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">Rs 0</span>
              <span className="text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>1 subject</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Basic AI study plans</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Daily reminders</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full" disabled>
              Current Plan
            </Button>
          </div>

          {/* Tier 1 - Pakistani */}
          <div className="rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 relative animate-slide-up stagger-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                POPULAR IN PAKISTAN
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tier 1</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pakistani Exams</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">Rs 500</span>
              <span className="text-slate-500 dark:text-slate-400">-1500/month</span>
            </div>
            <p className="text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300 mb-6">
              Perfect for NTS, NET, FAST, ECAT prep
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Unlimited subjects</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced AI study plans</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Urdu language support</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Quiz generation</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="w-full" onClick={() => startCheckout('tier1')} isLoading={loadingTier === 'tier1'}>
              Upgrade Now
            </Button>
          </div>

          {/* Tier 2 - International */}
          <div className="rounded-3xl border-2 border-purple-400/60 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 relative animate-slide-up stagger-3">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                INTERNATIONAL
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tier 2</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">International Exams</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">$15</span>
              <span className="text-slate-500 dark:text-slate-400">-30/month</span>
            </div>
            <p className="text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300 mb-6">
              For SAT, GRE, IELTS, GMAT prep
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Everything in Tier 1</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>International exam focus</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Study group features</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>24/7 premium support</span>
              </li>
            </ul>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-purple-600"
              onClick={() => startCheckout('tier2')}
              isLoading={loadingTier === 'tier2'}
            >
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/90 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What&apos;s the difference between Tier 1 and Tier 2?</h3>
              <p className="text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                Tier 1 is optimized for Pakistani exams (NTS, NET, FAST, ECAT) with pricing in PKR. 
                Tier 2 is for international exams (SAT, GRE, IELTS, GMAT) with pricing in USD and additional features.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/90 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I switch between tiers?</h3>
              <p className="text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/90 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is Urdu language available in all plans?</h3>
              <p className="text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                Yes, Urdu language support is available in Tier 1 and Tier 2 plans. The free plan includes English only.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/sign-up">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
