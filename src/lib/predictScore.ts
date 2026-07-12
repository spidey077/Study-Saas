import { supabaseAdmin } from '@/lib/supabase'
import { getGeminiModel } from '@/lib/gemini'

export interface PredictScoreParams {
  subjectId: string
  subjectName: string
  examName: string
  totalTopics: number
  completedTopics: number
  quizScores: number[]
  daysRemaining: number
  hoursStudied: number
}

interface PredictionResult {
  predicted_score: number
  status: 'on_track' | 'behind' | 'critical'
  action: string
}

export async function predictScore(params: PredictScoreParams): Promise<void> {
  const {
    subjectId,
    subjectName,
    examName,
    totalTopics,
    completedTopics,
    quizScores,
    daysRemaining,
    hoursStudied,
  } = params

  if (quizScores.length === 0) return

  const average = Math.round(
    quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
  )

  const daysForPrompt = daysRemaining <= 0 ? 0 : daysRemaining

  const prompt = `You are an exam performance predictor for Pakistani university entry tests.

Student data:
- Exam Subject: ${subjectName} for ${examName}
- Topics completed: ${completedTopics} out of ${totalTopics}
- Quiz scores so far: ${quizScores.join(', ')}%
- Average quiz score: ${average}%
- Days remaining to exam: ${daysForPrompt}
- Study hours logged: ${hoursStudied}h

Based on this data predict:
1. Their likely exam score as a percentage (be realistic, not optimistic)
2. Whether they are on_track, behind, or critical
3. One specific action they should take this week (max 15 words)

Reply in JSON only, no explanation, no markdown:
{
  "predicted_score": 67,
  "status": "behind",
  "action": "Complete Thermodynamics this week — it appears frequently in past papers"
}`

  const model = getGeminiModel()
  const result = await model.generateContent(prompt)
  const response = await result.response
  const content = response.text()?.trim()

  if (!content) throw new Error('Empty response from Gemini')

  const cleaned = content.replace(/```json|```/g, '').trim()
  const parsed: PredictionResult = JSON.parse(cleaned)

  const { error } = await supabaseAdmin
    .from('subjects')
    .update({
      predicted_score: parsed.predicted_score,
      prediction_status: parsed.status,
      prediction_action: parsed.action,
      prediction_updated_at: new Date().toISOString(),
    })
    .eq('id', subjectId)

  if (error) throw error
}
