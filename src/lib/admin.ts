import 'server-only'

import { clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ADMIN_EMAIL } from '@/lib/admin-constants'

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || ''
}

export async function isAdminUser(clerkId: string) {
  const clerkUser = await clerkClient.users.getUser(clerkId).catch(() => null)
  const email = normalizeEmail(clerkUser?.emailAddresses?.[0]?.emailAddress)

  if (email === ADMIN_EMAIL) {
    return true
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('clerk_id', clerkId)
    .maybeSingle()

  return !error && data?.role === 'admin'
}

export async function getAdminUsers() {
  const [supabaseUsersResult, clerkUsersResult] = await Promise.all([
    supabaseAdmin.from('users').select('*').order('created_at', { ascending: false }),
    clerkClient.users.getUserList({ limit: 200 }),
  ])

  if (supabaseUsersResult.error) {
    throw new Error(supabaseUsersResult.error.message)
  }

  const supabaseUsers = supabaseUsersResult.data || []
  const clerkUsers = clerkUsersResult || []

  const mergedUsers = [...supabaseUsers]
  const existingIds = new Set(supabaseUsers.map((user) => user.clerk_id))

  for (const clerkUser of clerkUsers) {
    if (existingIds.has(clerkUser.id)) {
      continue
    }

    const email = normalizeEmail(clerkUser.emailAddresses?.[0]?.emailAddress)
    mergedUsers.push({
      id: clerkUser.id,
      clerk_id: clerkUser.id,
      email,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || null,
      reminder_enabled: true,
      reminder_time: '08:00',
      summary_enabled: false,
      language: 'english',
      subscription_tier: 'free',
      role: email === ADMIN_EMAIL ? 'admin' : 'user',
      created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
    })
  }

  return mergedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
