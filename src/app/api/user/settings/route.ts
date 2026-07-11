import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function resolveSubscriptionTier(publicMetadata: Record<string, unknown> | undefined) {
  const tier = publicMetadata?.subscription_tier
  return tier === 'tier1' || tier === 'tier2' ? tier : 'free'
}

async function getOrCreateUser(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId)
  const subscriptionTier = resolveSubscriptionTier(clerkUser.publicMetadata)

  const { data: existingUsers, error: readError } = await supabaseAdmin
    .from('users')
    .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
    .eq('clerk_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (readError) throw readError

  const existingUser = existingUsers?.[0] || null

  if (existingUser) {
    return existingUser
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: userId,
      email: `${userId}@clerk.local`,
      name: null,
      language: 'english',
      reminder_enabled: true,
      reminder_time: '09:00',
      summary_enabled: true,
      subscription_tier: subscriptionTier,
      role: 'user',
    })
    .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')

  if (error) {
    return {
      language: 'english',
      reminder_enabled: true,
      reminder_time: '09:00',
      summary_enabled: true,
      subscription_tier: subscriptionTier,
    }
  }

  return data?.[0] || {
    language: 'english',
    reminder_enabled: true,
    reminder_time: '09:00',
    summary_enabled: true,
    subscription_tier: subscriptionTier,
  }
}

// GET — fetch user settings
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getOrCreateUser(userId)
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json(
      {
        language: 'english',
        reminder_enabled: true,
        reminder_time: '09:00',
        summary_enabled: true,
        subscription_tier: 'free',
      },
      { status: 200 }
    )
  }
}

// PATCH — update user settings
export async function PATCH(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { language, reminder_enabled, reminder_time, summary_enabled } = body

  try {
    const existing = await getOrCreateUser(userId)

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        language: language || existing.language || 'english',
        reminder_enabled: reminder_enabled ?? existing.reminder_enabled ?? true,
        reminder_time: reminder_time || existing.reminder_time || '09:00',
        summary_enabled: summary_enabled ?? existing.summary_enabled ?? true,
      })
      .eq('clerk_id', userId)
      .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data?.[0] || existing)
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save settings' }, { status: 500 })
  }
}
