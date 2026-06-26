'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import { StudyPlan } from '@/types'

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswerIndex: number
}

interface QuizModalProps {
  open: boolean
  task: StudyPlan
  onClose: () => void
  onPassed: (task: StudyPlan) => void
}

export default function QuizModal({ open, task, onClose, onPassed }: QuizModalProps) {
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
        console.error(err)
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

  async function handleSubmit() {
    if (questions.length === 0) return

    setSubmitting(true)
    const score = questions.reduce((sum, question, index) => {
      return sum + (selectedAnswers[index] === question.correctAnswerIndex ? 1 : 0)
    }, 0)
    const percentage = Math.round((score / questions.length) * 100)

    if (percentage >= 50) {
      toast.success(`Great job! You scored ${percentage}% and the task is marked complete.`)
      onPassed(task)
      onClose()
    } else {
      toast.error(`You scored ${percentage}%. The task remains incomplete.`)
      onClose()
    }

    setSubmitting(false)
  }

  if (!open) return null

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 p-4">
        <Card className="w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-hidden shadow-xl border border-[#f5e3a2] bg-white">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Quick quiz for &quot;{task.topic}&quot;</CardTitle>
              <p className="text-sm text-slate-700">
                Answer at least 50% correctly to complete this task automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-700 hover:text-slate-950"
            >
              Close
            </button>
          </div>
        </CardHeader>

        <div className="space-y-4 overflow-y-auto px-4 pb-4 sm:px-6 max-h-[70vh]">
          {loading && (
            <div className="rounded-xl bg-[#fff9d1] p-6 text-center text-sm text-slate-700">
              Generating quiz questions...
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-[#fee2e2] border border-[#fecaca] p-4 text-sm text-slate-950">
              {error}
            </div>
          )}

          {!loading && !error && questions.length > 0 && (
            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="rounded-xl border border-[#f5e3a2] bg-[#fff9d1] p-4">
                  <p className="font-medium text-sm text-slate-950">{questionIndex + 1}. {question.question}</p>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-3 rounded-lg border border-[#f5e3a2] px-3 py-2 cursor-pointer transition-colors hover:border-[#f7d46a]"
                      >
                        <input
                          type="radio"
                          name={`quiz-${task.id}-${questionIndex}`}
                          checked={selectedAnswers[questionIndex] === optionIndex}
                          onChange={() => updateAnswer(questionIndex, optionIndex)}
                          className="h-4 w-4 text-slate-950"
                        />
                        <span className="text-sm text-slate-950">{option}</span>
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
            >
              Submit answers
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
