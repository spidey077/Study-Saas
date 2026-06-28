import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { generateQuizQuestions } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { topic, description, subjectName, subjectId } = body

  if (!topic) {
    return NextResponse.json({ error: 'Missing topic' }, { status: 400 })
  }

  try {
    // Get user's language preference
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('language')
      .eq('clerk_id', userId)
      .single()
    
    const language = userData?.language || 'english'

    // Get subject's exam type if subjectId is provided
    let examType: 'pakistani' | 'international' = 'international'
    if (subjectId) {
      const { data: subjectData } = await supabaseAdmin
        .from('subjects')
        .select('exam_type')
        .eq('id', subjectId)
        .single()
      
      examType = (subjectData?.exam_type === 'pakistani' || subjectData?.exam_type === 'international') 
        ? subjectData.exam_type 
        : 'international'
    }

    const questions = await generateQuizQuestions(
      topic, 
      description || '', 
      subjectName || '',
      examType,
      language
    )
    return NextResponse.json(questions)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate quiz'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
