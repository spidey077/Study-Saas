import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateStudyPlan } from '@/lib/gemini'
import { differenceInDays, parseISO } from 'date-fns'

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { subjectId, subjectName, examDate, totalTopics, difficulty, hoursPerDay } = body

  const daysUntilExam = differenceInDays(parseISO(examDate), new Date())

  if (daysUntilExam < 1) {
    return NextResponse.json({ error: 'Exam date must be in the future' }, { status: 400 })
  }

  try {
    // Delete existing plan for this subject
    await supabaseAdmin
      .from('study_plans')
      .delete()
      .eq('subject_id', subjectId)
      .eq('user_id', userId)

    // Generate new plan from AI
    const plan = await generateStudyPlan(
      subjectName, examDate, totalTopics, difficulty, hoursPerDay, daysUntilExam
    )

    // Save each day to Supabase
    const rows = plan.map((item) => ({
      user_id: userId,
      subject_id: subjectId,
      plan_date: item.date,
      topic: item.topic,
      description: item.description,
      estimated_hours: item.hours,
      is_completed: false,
    }))

    const { data, error } = await supabaseAdmin
      .from('study_plans')
      .insert(rows)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, count: data.length })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
