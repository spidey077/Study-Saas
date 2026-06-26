import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateStudyPlan(
  subjectName: string,
  examDate: string,
  totalTopics: number,
  difficulty: string,
  hoursPerDay: number,
  daysUntilExam: number
): Promise<Array<{ date: string; topic: string; description: string; hours: number }>> {
  const prompt = `You are an expert study planner. Generate a day-by-day study plan.

Subject: ${subjectName}
Exam Date: ${examDate}
Days until exam: ${daysUntilExam}
Total topics to cover: ${totalTopics}
Difficulty: ${difficulty}
Available study hours per day: ${hoursPerDay}

Return ONLY a valid JSON array. No explanation, no markdown, no code blocks. Just the raw JSON array.

Format:
[
  {
    "date": "YYYY-MM-DD",
    "topic": "Topic name",
    "description": "What to study in 1-2 sentences",
    "hours": 1.5
  }
]

Rules:
- Start from tomorrow's date
- End 1 day before exam date
- Spread topics evenly across available days
- Each day max ${hoursPerDay} hours
- Add revision days in the last 2 days before exam
- Make topics specific and actionable`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const result = await model.generateContent(prompt)
  const response = await result.response
  const content = response.text()

  try {
    const cleaned = content.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Failed to parse AI response. Try generating again.')
  }
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswerIndex: number
}

export async function generateQuizQuestions(
  topic: string,
  description: string,
  subjectName: string
): Promise<QuizQuestion[]> {
  const prompt = `You are a study assistant that generates short multiple-choice questions about a single learning task.

Topic: ${topic}
Description: ${description}
Subject: ${subjectName}

Generate exactly 3 multiple-choice questions. Each question should include 4 answer options.
Return ONLY valid JSON with the following structure:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswerIndex": 0
  }
]

Do not include any explanations, markdown, or extra text. Ensure correctAnswerIndex is a number between 0 and 3.`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const result = await model.generateContent(prompt)
  const response = await result.response
  const content = response.text()

  try {
    const cleaned = content.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Failed to parse AI quiz response. Try again.')
  }
}
