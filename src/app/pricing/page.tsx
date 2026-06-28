'use client'

import Link from 'next/link'
import { Check, BookOpen, Zap, Crown } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50/30 px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI-powered study planning for Pakistani and International exams
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border-2 border-slate-200/60 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up stagger-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Free</h2>
                <p className="text-sm text-slate-500">Get started</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Rs 0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>1 subject</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Basic AI study plans</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Daily reminders</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full" disabled>
              Current Plan
            </Button>
          </div>

          {/* Tier 1 - Pakistani */}
          <div className="rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-50 to-yellow-50 p-8 shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 relative animate-slide-up stagger-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                POPULAR IN PAKISTAN
              </span>
              <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                BETA - FREE
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tier 1</h2>
                <p className="text-sm text-slate-500">Pakistani Exams</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Rs 500</span>
              <span className="text-slate-500">-1500/month</span>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Perfect for NTS, NET, FAST, ECAT prep
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Unlimited subjects</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced AI study plans</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Urdu language support</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Quiz generation</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="w-full">
              Upgrade Now
            </Button>
          </div>

          {/* Tier 2 - International */}
          <div className="rounded-3xl border-2 border-purple-400/60 bg-gradient-to-br from-purple-50 to-indigo-50 p-8 shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 relative animate-slide-up stagger-3">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                INTERNATIONAL
              </span>
              <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                BETA - FREE
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tier 2</h2>
                <p className="text-sm text-slate-500">International Exams</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">$15</span>
              <span className="text-slate-500">-30/month</span>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              For SAT, GRE, IELTS, GMAT prep
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Everything in Tier 1</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>International exam focus</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Study group features</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>24/7 premium support</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-purple-600">
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-2">What&apos;s the difference between Tier 1 and Tier 2?</h3>
              <p className="text-sm text-slate-600">
                Tier 1 is optimized for Pakistani exams (NTS, NET, FAST, ECAT) with pricing in PKR. 
                Tier 2 is for international exams (SAT, GRE, IELTS, GMAT) with pricing in USD and additional features.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Can I switch between tiers?</h3>
              <p className="text-sm text-slate-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Is Urdu language available in all plans?</h3>
              <p className="text-sm text-slate-600">
                Yes, Urdu language support is available in Tier 1 and Tier 2 plans. The free plan includes English only.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/sign-up">
            <Button size="lg">
              Start Free Today
            </Button>
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            No credit card required for free trial
          </p>
        </div>
      </div>
    </div>
  )
}
