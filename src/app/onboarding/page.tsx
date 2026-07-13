'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { BookOpen, Bell, Clock, Globe } from 'lucide-react'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Language } from '@/types'

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.firstName || '',
    reminder_time: '08:00',
    reminder_enabled: true,
    summary_enabled: false,
    language: 'english' as Language,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: user?.primaryEmailAddress?.emailAddress || '',
          reminder_enabled: form.reminder_enabled,
          reminder_time: form.reminder_time,
          summary_enabled: form.summary_enabled,
          language: form.language,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save profile')
      }
      toast.success('Welcome to StudyFlow!')
      router.push('/dashboard')
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_36%),linear-gradient(180deg,_#fafafa_0%,_#ffffff_100%)] px-4 py-12 dark:bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_36%),linear-gradient(180deg,_#0a0a0a_0%,_#111111_100%)]">
      <div className="animate-fade-in mx-auto w-full max-w-lg rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to StudyFlow</h1>
          <p className="mt-2 text-slate-600">Set your profile and get ready to study with AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            name="name"
            label="What should we call you?"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-4 flex items-center gap-3 text-sm font-bold text-slate-900">
              <Globe className="h-4 w-4 text-primary-600" />
              Language / زبان
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500">
              <div className="relative">
                <input
                  type="radio"
                  name="language"
                  value="english"
                  checked={form.language === 'english'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${form.language === 'english' ? 'border-primary-500 bg-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {form.language === 'english' && <div className="absolute inset-1 bg-white rounded-full" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">English</p>
                <p className="text-xs text-slate-500">Study plans in English</p>
              </div>
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500">
              <div className="relative">
                <input
                  type="radio"
                  name="language"
                  value="urdu"
                  checked={form.language === 'urdu'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${form.language === 'urdu' ? 'border-primary-500 bg-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {form.language === 'urdu' && <div className="absolute inset-1 bg-white rounded-full" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">اردو (Urdu)</p>
                <p className="text-xs text-slate-500">AI study plans in Urdu</p>
              </div>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-4 flex items-center gap-3 text-sm font-bold text-slate-900">
              <Bell className="h-4 w-4 text-primary-600" />
              Daily Reminders
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500">
              <div className="relative">
                <input
                  type="checkbox"
                  name="reminder_enabled"
                  id="reminder_enabled"
                  checked={form.reminder_enabled}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`h-6 w-11 rounded-full transition-all duration-300 ${form.reminder_enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      form.reminder_enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Enable daily email reminders</p>
                <p className="text-xs text-slate-500">Get your study plan every morning.</p>
              </div>
            </label>

            {form.reminder_enabled && (
              <div className="mt-4 flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-500" />
                <Select
                  id="reminder_time"
                  name="reminder_time"
                  value={form.reminder_time}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM (recommended)</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </Select>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-4 flex items-center gap-3 text-sm font-bold text-slate-900">
              <Bell className="h-4 w-4 text-primary-600" />
              Progress Summary Emails
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500">
              <div className="relative">
                <input
                  type="checkbox"
                  name="summary_enabled"
                  id="summary_enabled"
                  checked={form.summary_enabled}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`h-6 w-11 rounded-full transition-all duration-300 ${form.summary_enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      form.summary_enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Enable daily progress summaries</p>
                <p className="text-xs text-slate-500">Receive study summaries any day.</p>
              </div>
            </label>
          </div>

          <Button type="submit" isLoading={loading} className="w-full" size="lg">
            Get Started Free
          </Button>
        </form>
      </div>
    </div>
  )
}
