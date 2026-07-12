import { GoogleGenerativeAI } from '@google/generative-ai'
import { Language } from '@/types'

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
}

export { getGeminiModel }

export async function generateStudyPlan(
  subjectName: string,
  examDate: string,
  totalTopics: number,
  difficulty: string,
  hoursPerDay: number,
  daysUntilExam: number,
  language: Language = 'english'
): Promise<Array<{ date: string; topic: string; description: string; hours: number }>> {
  const isUrdu = language === 'urdu'
  
  const prompt = `You are an expert study planner. Generate a day-by-day study plan${isUrdu ? ' in Urdu language' : ''}.

Subject: ${subjectName}
Exam Date: ${examDate}
Days until exam: ${daysUntilExam}
Total topics to cover: ${totalTopics}
Difficulty: ${difficulty}
Available study hours per day: ${hoursPerDay}

${isUrdu ? 'IMPORTANT: Generate the entire response in Urdu language. The topic names and descriptions should be in Urdu. Only the dates and numbers should remain in English format.' : ''}

Return ONLY a valid JSON array. No explanation, no markdown, no code blocks. Just the raw JSON array.

Format:
[
  {
    "date": "YYYY-MM-DD",
    "topic": "Topic name${isUrdu ? ' (in Urdu)' : ''}",
    "description": "What to study in 1-2 sentences${isUrdu ? ' (in Urdu)' : ''}",
    "hours": 1.5
  }
]

Rules:
- Start from tomorrow's date
- End 1 day before exam date
- Spread topics evenly across available days
- Each day max ${hoursPerDay} hours
- Add revision days in the last 2 days before exam
- Make topics specific and actionable
${isUrdu ? '- All topic names and descriptions must be in Urdu' : ''}`

  const model = getGeminiModel()

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
  explanation?: string
}

export async function generateQuizQuestions(
  topic: string,
  description: string,
  subjectName: string,
  examType: 'pakistani' | 'international' = 'international',
  language: Language = 'english'
): Promise<QuizQuestion[]> {
  const isUrdu = language === 'urdu'
  const isPakistani = examType === 'pakistani'
  
  const examContext = isPakistani 
    ? 'Pakistani entrance exams (NTS, NET, FAST, ECAT)' 
    : 'International standardized tests (SAT, GRE, IELTS, GMAT)'

  const prompt = `You are an expert exam preparation tutor for ${examContext}. Generate high-quality multiple-choice questions that test understanding and application.

Topic: ${topic}
Description: ${description}
Subject: ${subjectName}
Exam Type: ${examType}
Language: ${language}

${isUrdu ? 'IMPORTANT: Generate all questions and options in Urdu language. Only technical terms can remain in English.' : ''}
${isPakistani ? 'Focus on concepts commonly tested in Pakistani entrance exams. Include numerical problems where applicable.' : 'Focus on concepts commonly tested in international standardized tests. Include analytical reasoning questions.'}

Generate exactly 5 multiple-choice questions. Each question should:
- Be clear and unambiguous
- Test understanding, not just memorization
- Include 4 plausible answer options
- Have one clearly correct answer
- Include a brief explanation of why the correct answer is right

Return ONLY valid JSON with the following structure:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswerIndex": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Rules:
- Questions should be exam-style and challenging
- Options should be similar in length and plausibility
- Explanation should be concise (1-2 sentences)
- correctAnswerIndex must be a number between 0 and 3
${isUrdu ? '- All text except technical terms should be in Urdu' : ''}
${isPakistani ? '- Include at least 1 numerical/calculation question if applicable to the topic' : '- Include at least 1 critical thinking/analytical question'}`

  const model = getGeminiModel()

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
