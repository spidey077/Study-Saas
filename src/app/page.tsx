'use client'

export const dynamic = 'force-dynamic'

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_36%),linear-gradient(180deg,_#fafafa_0%,_#ffffff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_36%),linear-gradient(180deg,_#0a0a0a_0%,_#111111_100%)] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-colors duration-150">
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
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-slate-900 dark:border-primary-900/50 dark:bg-primary-950/30">
                <Sparkles className="h-4 w-4 text-slate-900" />
                <span>Powered by GPT-4o</span>
                <span className="rounded-full bg-primary-200/70 px-2 py-0.5 text-xs font-semibold dark:bg-primary-800/50">NEW</span>
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                  Study smarter with{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
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
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-700"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition-colors duration-150 hover:border-primary-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-primary-500 dark:hover:bg-slate-800"
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
              <div className="absolute -inset-4 rounded-[50px] bg-primary-500/10 blur-3xl" />
              <div className="relative rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
                <div className="grid gap-5">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div 
                        key={feature.title} 
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 transition-colors duration-150 hover:border-primary-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-primary-500 dark:hover:bg-slate-900"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-slate-900 shadow-sm dark:bg-primary-950/40">
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
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-colors duration-150 hover:border-primary-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500 dark:hover:bg-slate-900"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-slate-900 dark:bg-primary-950/40">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-slate-300">{feature.desc}</p>
                </div>
              )
            })}
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 p-12 shadow-sm dark:border-slate-800 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-400/10" />
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" />
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
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-700"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-transparent px-8 py-4 text-base font-semibold text-white transition-colors duration-150 hover:bg-slate-800"
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
