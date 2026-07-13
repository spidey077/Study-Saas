'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import { StudyPlan, Subject } from '@/types'
import { addQuizScore } from '@/lib/quizScoreStorage'

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswerIndex: number
}

interface QuizModalProps {
  open: boolean
  task: StudyPlan
  onClose: () => void
  onPassed: (task: StudyPlan, percentage: number, quizScores: number[]) => Promise<void>
  onQuizComplete?: (updatedSubject?: Subject) => void
}

export default function QuizModal({ open, task, onClose, onPassed, onQuizComplete }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setLoading(true)
    setQuestions([])
    setSelectedAnswers([])
    setError(null)

    fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: task.topic,
        description: task.description,
        subjectName: task.subject?.name,
        subjectId: task.subject_id || task.subject?.id,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error || 'Failed to generate quiz')
        }
        return res.json()
      })
      .then((data: QuizQuestion[]) => {
        setQuestions(data)
        setSelectedAnswers(Array(data.length).fill(-1))
      })
      .catch((err) => {
        setError(err.message || 'Unable to generate quiz')
        toast.error(err.message || 'Unable to generate quiz')
      })
      .finally(() => setLoading(false))
  }, [open, task])

  function updateAnswer(questionIndex: number, answerIndex: number) {
    setSelectedAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = answerIndex
      return next
    })
  }

  async function triggerPrediction(studyPlanId: string, quizScores: number[]) {
    try {
      const res = await fetch('/api/quiz-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyPlanId, quizScore: quizScores[quizScores.length - 1], quizScores }),
      })
      if (res.ok) {
        const data = await res.json()
        onQuizComplete?.(data.subject ?? undefined)
      }
    } catch (err) {
      console.error('Failed to trigger prediction:', err)
    }
  }

  async function handleSubmit() {
    if (questions.length === 0) return

    setSubmitting(true)
    const score = questions.reduce((sum, question, index) => {
      return sum + (selectedAnswers[index] === question.correctAnswerIndex ? 1 : 0)
    }, 0)
    const percentage = Math.round((score / questions.length) * 100)

    const subjectId = task.subject_id || task.subject?.id
    const quizScores = subjectId ? addQuizScore(subjectId, percentage) : [percentage]

    try {
      if (percentage >= 50) {
        await onPassed(task, percentage, quizScores)
        toast.success(`Great job! You scored ${percentage}% and the task is marked complete.`)
      } else {
        toast.error(`You scored ${percentage}%. The task remains incomplete.`)
        await triggerPrediction(task.id, quizScores)
      }
      onClose()
    } catch {
      toast.error('Failed to update progress. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
        <Card className="max-h-[90vh] w-full max-w-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:max-w-2xl">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Quick quiz for &quot;{task.topic}&quot;</CardTitle>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Answer at least 50% correctly to complete this task automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </CardHeader>

        <div className="space-y-4 overflow-y-auto px-4 pb-4 sm:px-6 max-h-[70vh]">
          {loading && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-100/90 p-6 text-center text-sm font-medium text-slate-950 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100">
              Generating quiz questions...
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-rose-950/70 border border-rose-700 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}

          {!loading && !error && questions.length > 0 && (
            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="font-medium text-sm text-slate-950 dark:text-slate-100">{questionIndex + 1}. {question.question}</p>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2 transition-colors hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500"
                      >
                        <input
                          type="radio"
                          name={`quiz-${task.id}-${questionIndex}`}
                          checked={selectedAnswers[questionIndex] === optionIndex}
                          onChange={() => updateAnswer(questionIndex, optionIndex)}
                          className="h-4 w-4 text-slate-950 dark:text-slate-200"
                        />
                        <span className="text-sm text-slate-950 dark:text-slate-200">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={loading || submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || submitting || questions.length === 0 || selectedAnswers.some((answer) => answer === -1)}
              className="px-6 py-3"
            >
              {submitting ? 'Saving...' : 'Submit answers'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
