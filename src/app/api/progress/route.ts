import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET — fetch study plan with optional date filter
export async function GET(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const subjectId = searchParams.get('subjectId')

  let query = supabaseAdmin
    .from('study_plans')
    .select('*, subject:subjects(*)')
    .eq('user_id', userId)
    .order('plan_date', { ascending: true })

  if (date) query = query.eq('plan_date', date)
  if (subjectId) query = query.eq('subject_id', subjectId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — mark a topic as complete or incomplete
export async function PATCH(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, is_completed } = body

  const { data, error } = await supabaseAdmin
    .from('study_plans')
    .update({
      is_completed,
      completed_at: is_completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
