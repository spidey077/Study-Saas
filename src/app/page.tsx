'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { BookOpen, Sparkles, BarChart2, Bell, ArrowRight, Zap, Target, Calendar, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) return

    const hasSeenLanding = window.localStorage.getItem('studyflowHasSeenLanding')

    if (hasSeenLanding === 'true') {
      router.replace('/dashboard')
    } else {
      window.localStorage.setItem('studyflowHasSeenLanding', 'true')
    }
  }, [isLoaded, isSignedIn, router])

  const features = [
    {
      icon: Sparkles,
      title: 'AI Plan Generation',
      description: 'Our AI analyzes your subjects, exam dates, and available hours to create a personalized day-by-day study schedule.',
    },
    {
      icon: BarChart2,
      title: 'Progress Tracking',
      description: 'Check off topics as you complete them. Visualize your progress with beautiful charts and stay motivated.',
    },
    {
      icon: Bell,
      title: 'Daily Reminders',
      description: 'Get a personalized email every morning with your study plan for the day — so you never forget to study.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/30 text-slate-900 dark:text-white">
      <header className="border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/30 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">StudyFlow</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI-powered study planning</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
          {/* Hero Section */}
          <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center pt-4 lg:pt-2">
            <div className="space-y-7 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200/60 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Powered by GPT-4o</span>
                <span className="bg-amber-200/50 px-2 py-0.5 rounded-full text-xs font-semibold">NEW</span>
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                  Study smarter with{' '}
                  <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                    AI-powered planning
                  </span>
                </h1>
                <p className="max-w-2xl text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300">
                  Stop guessing what to study. Let AI build your personalized day-by-day study plan in English or Urdu. Perfect for Pakistani (NTS, NET, FAST, ECAT) and International (SAT, GRE, IELTS, GMAT) exams.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-8 py-4 text-base font-semibold text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-600 font-medium">Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-[50px] blur-3xl" />
              <div className="relative rounded-[40px] border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50">
                <div className="grid gap-5">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div 
                        key={feature.title} 
                        className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 p-6 transition-all duration-300 hover:border-yellow-300/60 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-amber-600 dark:text-amber-400 shadow-md">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                        <p className="mt-2 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Generate study plans in seconds with AI' },
              { icon: Target, title: 'Goal Oriented', desc: 'Track progress towards your exam goals' },
              { icon: Calendar, title: 'Smart Scheduling', desc: 'Automatic daily reminders and deadlines' },
              { icon: BarChart2, title: 'Visual Analytics', desc: 'Beautiful charts to track your journey' },
              { icon: Bell, title: 'Never Miss', desc: 'Daily email reminders for your tasks' },
              { icon: Sparkles, title: 'AI Powered', desc: 'GPT-4o powered intelligent planning' },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div 
                  key={feature.title} 
                  className="group rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-300/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-amber-600 dark:text-amber-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">{feature.desc}</p>
                </div>
              )
            })}
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-[40px] border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-12 lg:p-16 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="relative max-w-3xl mx-auto space-y-8 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Ready to study smarter?
              </h2>
              <p className="text-lg sm:text-xl leading-8 text-slate-300 dark:text-slate-200">
                Join thousands of students using AI study planning, progress tracking, and smart reminders to stay ahead of their exams.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-600 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-sm text-slate-400">No credit card required · Start in seconds</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
