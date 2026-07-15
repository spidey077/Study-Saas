'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Shield, Bell, Globe, CreditCard, User, Crown, Camera } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { Language, SubscriptionTier } from '@/types'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'subscription'>('profile')
  const [hasChanges, setHasChanges] = useState(false)
  const [userData, setUserData] = useState({
    language: 'english' as Language,
    reminder_enabled: true,
    reminder_time: '09:00',
    summary_enabled: true,
    subscription_tier: 'free' as SubscriptionTier,
  })

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'preferences' as const, label: 'Preferences', icon: Bell },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard },
  ]

  const handleUserDataChange = (key: string, value: string | boolean) => {
    setUserData({ ...userData, [key]: value })
    setHasChanges(true)
  }

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
      setHasChanges(false)
      toast.success('Settings saved successfully')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-64 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20" />
        </motion.div>
        <motion.p
          className="text-sm text-slate-600 dark:text-slate-400 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading settings...
        </motion.p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage your account preferences and settings</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative inline-flex rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-700"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          )
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-slate-200/60 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <motion.div
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
                      {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U'}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user?.emailAddresses[0]?.emailAddress}</p>
                    <motion.p
                      className="text-xs text-slate-500 dark:text-slate-400 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </motion.p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-slate-200/60 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-3">
                    <Globe className="w-4 h-4" />
                    Language
                  </label>
                  <div className="relative">
                    <select
                      id="language"
                      value={userData.language}
                      onChange={(e) => handleUserDataChange('language', e.target.value as Language)}
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white cursor-pointer"
                    >
                      <option value="english">English</option>
                      <option value="urdu">اردو (Urdu)</option>
                    </select>
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      animate={{ rotate: activeTab === 'preferences' ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-3">
                    <Bell className="w-4 h-4" />
                    Daily Reminder
                  </label>
                  <div className="flex items-center gap-4">
                    <ToggleSwitch
                      checked={userData.reminder_enabled}
                      onChange={(checked) => handleUserDataChange('reminder_enabled', checked)}
                    />
                    <motion.input
                      type="time"
                      id="reminder_time"
                      value={userData.reminder_time}
                      onChange={(e) => handleUserDataChange('reminder_time', e.target.value)}
                      disabled={!userData.reminder_enabled}
                      className={cn(
                        'px-3 py-2 border rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-white transition-all',
                        userData.reminder_enabled
                          ? 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600'
                          : 'border-slate-200 opacity-50 cursor-not-allowed dark:border-slate-700'
                      )}
                      animate={{
                        opacity: userData.reminder_enabled ? 1 : 0.5,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-3">
                    <Shield className="w-4 h-4" />
                    Weekly Summary
                  </label>
                  <ToggleSwitch
                    checked={userData.summary_enabled}
                    onChange={(checked) => handleUserDataChange('summary_enabled', checked)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'subscription' && (
          <motion.div
            key="subscription"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-slate-200/60 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      userData.subscription_tier === 'tier2'
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    )}>
                      {userData.subscription_tier === 'tier2' ? (
                        <Crown className="w-5 h-5 text-white" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Plan</p>
                      <p className="font-semibold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                        {userData.subscription_tier}
                        {userData.subscription_tier === 'tier2' && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                            Premium
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {userData.subscription_tier !== 'tier2' && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      <Button variant="secondary" size="sm">
                        Upgrade
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="shadow-lg shadow-indigo-500/30 px-6 py-3"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </motion.div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
