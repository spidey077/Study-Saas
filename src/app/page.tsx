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

  const benefits = [
    'Personalized AI-generated study plans',
    'Track completion across all subjects',
    'Daily email reminders',
    'Analytics dashboard with charts',
    'Smart scheduling based on difficulty',
    'Exam countdown timers',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50/30 text-slate-900">
      <header className="border-b border-slate-200/50 px-6 py-4 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/30 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 tracking-tight">StudyFlow</p>
              <p className="text-xs text-slate-500 font-medium">AI-powered study planning</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Hero Section */}
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200/60 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Powered by GPT-4o</span>
                <span className="bg-amber-200/50 px-2 py-0.5 rounded-full text-xs font-semibold">NEW</span>
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Study smarter with{' '}
                  <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                    AI-powered planning
                  </span>
                </h1>
                <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                  Stop guessing what to study. Let AI build your personalized day-by-day study plan, track progress, and keep you focused with a sleek study dashboard.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-600 font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-600 font-medium">Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-slate-600 font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-[50px] blur-3xl" />
              <div className="relative rounded-[40px] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/50">
                <div className="grid gap-5">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div 
                        key={feature.title} 
                        className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-6 transition-all duration-300 hover:border-yellow-300/60 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-600 shadow-md">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
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
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={feature.title} 
                  className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-300/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
                </div>
              )
            })}
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-[40px] border border-slate-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 lg:p-16 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="relative max-w-3xl mx-auto space-y-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Ready to study smarter?
              </h2>
              <p className="text-xl leading-8 text-slate-300">
                Join thousands of students using AI study planning, progress tracking, and smart reminders to stay ahead of their exams.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Start for Free
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
