'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { BookOpen, Bell, Clock } from 'lucide-react'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.firstName || '',
    reminder_time: '08:00',
    reminder_enabled: true,
    summary_enabled: false,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50/30 px-4 py-12">
      <div className="mx-auto w-full max-w-lg rounded-3xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-xl p-10 shadow-xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30">
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

          <div className="rounded-2xl border-2 border-slate-200/60 bg-gradient-to-br from-amber-50 to-yellow-50 p-5">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-900 mb-4">
              <Bell className="h-4 w-4 text-amber-600" />
              Daily Reminders
            </div>
            <label className="flex items-center gap-3 rounded-2xl border-2 border-slate-200/60 bg-white p-4 transition hover:border-amber-300/60 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="reminder_enabled"
                  id="reminder_enabled"
                  checked={form.reminder_enabled}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`h-6 w-11 rounded-full transition-all duration-300 ${form.reminder_enabled ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-slate-200'}`}>
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

          <div className="rounded-2xl border-2 border-slate-200/60 bg-gradient-to-br from-amber-50 to-yellow-50 p-5">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-900 mb-4">
              <Bell className="h-4 w-4 text-amber-600" />
              Progress Summary Emails
            </div>
            <label className="flex items-center gap-3 rounded-2xl border-2 border-slate-200/60 bg-white p-4 transition hover:border-amber-300/60 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="summary_enabled"
                  id="summary_enabled"
                  checked={form.summary_enabled}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`h-6 w-11 rounded-full transition-all duration-300 ${form.summary_enabled ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-slate-200'}`}>
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
