import { predictScore } from '@/lib/predictScore'
import { fetchSubjectPredictionStats } from '@/lib/fetchSubjectPredictionStats'

export async function triggerPrediction(
  subjectId: string,
  userId: string,
  quizScores: number[]
): Promise<void> {
  if (quizScores.length === 0) return

  try {
    const stats = await fetchSubjectPredictionStats(subjectId, userId, quizScores)
    if (!stats) return
    await predictScore(stats)
  } catch (error) {
    console.error('Failed to generate score prediction:', error)
  }
}
