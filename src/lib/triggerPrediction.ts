import { predictScore } from '@/lib/predictScore'
import { fetchSubjectPredictionStats } from '@/lib/fetchSubjectPredictionStats'
import { supabaseAdmin } from '@/lib/supabase'
import { Subject } from '@/types'

export async function triggerPrediction(
  subjectId: string,
  userId: string,
  quizScores: number[]
): Promise<Subject | null> {
  if (quizScores.length === 0) return null

  try {
    const stats = await fetchSubjectPredictionStats(subjectId, userId, quizScores)
    if (!stats) return null
    await predictScore(stats)

    const { data } = await supabaseAdmin
      .from('subjects')
      .select('*')
      .eq('id', subjectId)
      .eq('user_id', userId)
      .single()

    return data ?? null
  } catch (error) {
    console.error('Failed to generate score prediction:', error)
    return null
  }
}
