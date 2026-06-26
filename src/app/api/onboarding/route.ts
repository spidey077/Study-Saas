import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, email, reminder_enabled, reminder_time } = body

  // Upsert user record (create or update)
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert(
      {
        clerk_id: userId,
        email,
        name,
        reminder_enabled: reminder_enabled ?? true,
        reminder_time: reminder_time ?? '08:00',
      },
      { onConflict: 'clerk_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
