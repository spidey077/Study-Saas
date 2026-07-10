import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET — fetch user settings
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('language, reminder_enabled, reminder_time, summary_enabled, subscription_tier')
    .eq('clerk_id', userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — update user settings
export async function PATCH(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { language, reminder_enabled, reminder_time, summary_enabled } = body

  // First try to get the user to see if they exist
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  let data, error

  if (existingUser) {
    // Update existing user
    const result = await supabaseAdmin
      .from('users')
      .update({
        language,
        reminder_enabled,
        reminder_time,
        summary_enabled,
      })
      .eq('clerk_id', userId)
      .select()
      .single()
    data = result.data
    error = result.error
  } else {
    // Create user record if it doesn't exist
    const result = await supabaseAdmin
      .from('users')
      .insert({
        clerk_id: userId,
        email: '',
        name: null,
        language: language || 'english',
        reminder_enabled: reminder_enabled ?? true,
        reminder_time: reminder_time || '09:00',
        summary_enabled: summary_enabled ?? true,
        subscription_tier: 'free',
        role: 'user',
      })
      .select()
      .single()
    data = result.data
    error = result.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
