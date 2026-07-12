import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { triggerPrediction } from '@/lib/triggerPrediction'

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { studyPlanId, quizScore, quizScores } = body

  if (!studyPlanId || typeof quizScore !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: plan, error: planError } = await supabaseAdmin
    .from('study_plans')
    .select('subject_id')
    .eq('id', studyPlanId)
    .eq('user_id', userId)
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: 'Study plan not found' }, { status: 404 })
  }

  const scores = Array.isArray(quizScores) && quizScores.length > 0
    ? quizScores
    : [quizScore]

  const subject = await triggerPrediction(plan.subject_id, userId, scores)

  return NextResponse.json({ success: true, subject })
}
