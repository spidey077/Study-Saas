import { differenceInDays, parseISO } from 'date-fns'
import { supabaseAdmin } from '@/lib/supabase'
import { getExamConfig } from '@/lib/examConfig'
import { SpecificExam } from '@/types'
import { PredictScoreParams } from '@/lib/predictScore'

export async function fetchSubjectPredictionStats(
  subjectId: string,
  userId: string,
  quizScores: number[]
): Promise<PredictScoreParams | null> {
  const { data: subject, error: subjectError } = await supabaseAdmin
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .eq('user_id', userId)
    .single()

  if (subjectError || !subject) return null

  const { data: plans, error: plansError } = await supabaseAdmin
    .from('study_plans')
    .select('is_completed, estimated_hours')
    .eq('subject_id', subjectId)
    .eq('user_id', userId)

  if (plansError) return null

  const completedTopics = plans?.filter((p) => p.is_completed).length ?? 0
  const hoursStudied =
    plans
      ?.filter((p) => p.is_completed)
      .reduce((sum, p) => sum + (p.estimated_hours ?? 0), 0) ?? 0

  const daysRemaining = differenceInDays(parseISO(subject.exam_date), new Date())
  const examConfig = subject.specific_exam
    ? getExamConfig(subject.specific_exam as SpecificExam)
    : undefined
  const examName = examConfig?.name ?? (subject.exam_type === 'pakistani' ? 'Pakistani Entry Test' : 'International Exam')

  return {
    subjectId: subject.id,
    subjectName: subject.name,
    examName,
    totalTopics: subject.total_topics,
    completedTopics,
    quizScores,
    daysRemaining,
    hoursStudied,
  }
}
