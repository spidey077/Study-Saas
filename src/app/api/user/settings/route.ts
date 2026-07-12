import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const DEFAULT_SETTINGS = {
  language: 'english',
  reminder_enabled: true,
  reminder_time: '09:00',
  summary_enabled: true,
  subscription_tier: 'free',
}

async function getClerkUserDetails(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId)
  const email =
    clerkUser.emailAddresses.find((entry) => entry.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    `${userId}@clerk.local`
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null

  return { email, name }
}

// GET — fetch user settings
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
      .eq('clerk_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error
    if (users?.[0]) return NextResponse.json(users[0])

    return NextResponse.json(DEFAULT_SETTINGS)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

// PATCH — update user settings
export async function PATCH(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { language, reminder_enabled, reminder_time, summary_enabled } = body

  try {
    const { email, name } = await getClerkUserDetails(userId)

    const updatePayload: Record<string, unknown> = {
      language: language || DEFAULT_SETTINGS.language,
      reminder_enabled: reminder_enabled ?? DEFAULT_SETTINGS.reminder_enabled,
      reminder_time: reminder_time || DEFAULT_SETTINGS.reminder_time,
    }

    if (summary_enabled !== undefined) {
      updatePayload.summary_enabled = summary_enabled
    }

    const { data: updatedUsers, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updatePayload)
      .eq('clerk_id', userId)
      .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')

    if (updateError) throw updateError

    if (updatedUsers && updatedUsers.length > 0) {
      return NextResponse.json(updatedUsers[0])
    }

    const insertPayload: Record<string, unknown> = {
      clerk_id: userId,
      email,
      name,
      language: updatePayload.language,
      reminder_enabled: updatePayload.reminder_enabled,
      reminder_time: updatePayload.reminder_time,
      subscription_tier: DEFAULT_SETTINGS.subscription_tier,
    }

    if (summary_enabled !== undefined) {
      insertPayload.summary_enabled = summary_enabled
    }

    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(insertPayload)
      .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
      .single()

    if (insertError) throw insertError
    return NextResponse.json(insertedUser)
  } catch (error: unknown) {
    console.error('Settings save error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save settings' },
      { status: 500 }
    )
  }
}
