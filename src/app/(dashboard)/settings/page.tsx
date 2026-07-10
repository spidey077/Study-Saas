'use client'

import { useState, useEffect } from 'react'
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
        body: JSON.stringify(userData),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your account preferences and settings</p>
      </div>

      {/* Profile Card */}
      <Card className="border-2 border-slate-200/60 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
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
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500"
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
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500"
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
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
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
