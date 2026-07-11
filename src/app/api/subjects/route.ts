import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isValidSubjectForExam, isValidSubjectForExamType } from '@/lib/examConfig'
import { supabaseAdmin } from '@/lib/supabase'
import { SpecificExam } from '@/types'

// GET — fetch all subjects for logged in user
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .order('exam_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — create a new subject
export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, exam_date, total_topics, difficulty, exam_type, specific_exam, color } = body
  const normalizedName = typeof name === 'string' ? name.trim() : ''
  const normalizedSpecificExam = typeof specific_exam === 'string' && specific_exam.trim() ? specific_exam.trim() : null

  if (!normalizedName || !exam_date || !total_topics) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (normalizedSpecificExam) {
    const isValid = isValidSubjectForExam(normalizedName, normalizedSpecificExam as SpecificExam)
    if (!isValid) {
      return NextResponse.json(
        { error: 'This subject is not approved for the selected exam.' },
        { status: 400 }
      )
    }
  } else if (exam_type) {
    const isValid = isValidSubjectForExamType(normalizedName, exam_type)
    if (!isValid) {
      return NextResponse.json(
        { error: 'This subject is not approved for the selected exam type.' },
        { status: 400 }
      )
    }
  }

  // Check user's subscription tier and subject limit
  const clerkUser = await clerkClient.users.getUser(userId)
  const clerkTier = clerkUser.publicMetadata?.subscription_tier

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('subscription_tier')
    .eq('clerk_id', userId)
    .maybeSingle()

  const subscriptionTier = clerkTier === 'tier1' || clerkTier === 'tier2' ? clerkTier : userData?.subscription_tier || 'free'

  if (subscriptionTier === 'free') {
    // Count existing subjects
    const { count } = await supabaseAdmin
      .from('subjects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (count && count >= 2) {
      return NextResponse.json(
        { error: 'Free users can only add up to 2 subjects. Upgrade to Premium for unlimited subjects.' },
        { status: 403 }
      )
    }
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .insert({
      user_id: userId,
      name: normalizedName,
      exam_date,
      total_topics,
      difficulty,
      exam_type,
      specific_exam: normalizedSpecificExam,
      color,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// DELETE — delete a subject by id
export async function DELETE(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing subject id' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('subjects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
