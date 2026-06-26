import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { generateQuizQuestions } from '@/lib/gemini'

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { topic, description, subjectName } = body

  if (!topic) {
    return NextResponse.json({ error: 'Missing topic' }, { status: 400 })
  }

  try {
    const questions = await generateQuizQuestions(topic, description || '', subjectName || '')
    return NextResponse.json(questions)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate quiz'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
