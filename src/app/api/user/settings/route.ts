import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ADMIN_EMAIL } from '@/lib/admin-constants'

async function getOrCreateUser(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId)
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
  const name = clerkUser.firstName || clerkUser.username || null
  const role = email.trim().toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'

  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .maybeSingle()

  if (existingUser) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        email,
        name,
        role,
      })
      .eq('clerk_id', userId)
      .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: userId,
      email,
      name,
      language: 'english',
      reminder_enabled: true,
      reminder_time: '09:00',
      summary_enabled: true,
      subscription_tier: 'free',
      role,
    })
    .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
    .single()

  if (error) throw error
  return data
}

// GET — fetch user settings
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getOrCreateUser(userId)
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load settings' }, { status: 500 })
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
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save settings' }, { status: 500 })
  }
}
