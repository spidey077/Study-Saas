'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Shield, Bell, Globe, CreditCard } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Language, SubscriptionTier } from '@/types'
import Link from 'next/link'

export default function SettingsPage() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState({
    language: 'english' as Language,
    reminder_enabled: true,
    reminder_time: '09:00',
    summary_enabled: true,
    subscription_tier: 'free' as SubscriptionTier,
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setTimeout> | undefined
    const billingStatus = searchParams.get('billing')
    const sessionId = searchParams.get('session_id')

    if (billingStatus === 'success') {
      toast.success('Payment completed successfully. Your plan will update shortly.')
      ;(async () => {
        let confirmedTier: SubscriptionTier | null = null

        if (sessionId) {
          const response = await fetch('/api/stripe/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data?.tier === 'tier1' || data?.tier === 'tier2') {
              confirmedTier = data.tier
              setUserData((current) => ({ ...current, subscription_tier: data.tier }))
            }
          }
        }

        refreshTimer = setTimeout(() => {
          if (!confirmedTier) {
            fetchUserData()
          }
        }, 500)
      })()
    }

    if (billingStatus === 'cancelled') {
      toast.info('Checkout was canceled before payment completed.')
    }

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer)
      }
    }
  }, [searchParams])

  async function fetchUserData() {
    try {
      const res = await fetch('/api/user/settings')
      if (res.ok) {
        const data = await res.json()
        setUserData(data)
      }
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: userData.language,
          reminder_enabled: userData.reminder_enabled,
          reminder_time: userData.reminder_time,
          summary_enabled: userData.summary_enabled,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || 'Failed to save')
      }
      const data = await res.json()
      setUserData((current) => ({ ...current, ...data }))
      toast.success('Settings saved successfully')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage your account preferences and settings</p>
      </div>

      {/* Profile Card */}
      <Card className="border-2 border-slate-200/60 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
              {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U'}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{user?.emailAddresses[0]?.emailAddress}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences Card */}
      <Card className="border-2 border-slate-200/60 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-2">
              <Globe className="w-4 h-4" />
              Language
            </label>
            <Select
              id="language"
              value={userData.language}
              onChange={(e) => setUserData({ ...userData, language: e.target.value as Language })}
            >
              <option value="english">English</option>
              <option value="urdu">اردو (Urdu)</option>
            </Select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-2">
              <Bell className="w-4 h-4" />
              Daily Reminder
            </label>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="reminder_enabled"
                checked={userData.reminder_enabled}
                onChange={(e) => setUserData({ ...userData, reminder_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
              />
              <input
                type="time"
                id="reminder_time"
                value={userData.reminder_time}
                onChange={(e) => setUserData({ ...userData, reminder_time: e.target.value })}
                disabled={!userData.reminder_enabled}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-2">
              <Shield className="w-4 h-4" />
              Weekly Summary
            </label>
            <input
              type="checkbox"
              id="summary_enabled"
              checked={userData.summary_enabled}
              onChange={(e) => setUserData({ ...userData, summary_enabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
            />
          </div>
        </div>
      </Card>

      {/* Subscription Card */}
      <Card className="border-2 border-slate-200/60 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Current Plan</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{userData.subscription_tier}</p>
              </div>
            </div>
            <Link href="/pricing">
              <Button variant="secondary" size="sm">
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={saveSettings} disabled={saving} className="flex-1">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
