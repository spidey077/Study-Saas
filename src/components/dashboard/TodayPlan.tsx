'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Circle, Clock, BookOpen } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import QuizModal from '@/components/QuizModal'
import { StudyPlan } from '@/types'
import { cn } from '@/lib/utils'

interface TodayPlanProps {
  tasks: StudyPlan[]
  onTaskToggle?: (updatedTask: StudyPlan) => void
}

export default function TodayPlan({ tasks, onTaskToggle }: TodayPlanProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [quizTask, setQuizTask] = useState<StudyPlan | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)

  async function updateProgress(task: StudyPlan, is_completed: boolean) {
    const res = await fetch('/api/progress', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, is_completed }),
    })
    if (!res.ok) throw new Error('Failed to update')
    const updated = await res.json()
    onTaskToggle?.(updated)
    return updated
  }

  async function toggleComplete(task: StudyPlan) {
    if (!task.is_completed) {
      setQuizTask(task)
      setQuizOpen(true)
      return
    }

    setUpdating(task.id)
    try {
      await updateProgress(task, false)
      toast.success('Topic unmarked')
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(null)
    }
  }

  async function handleQuizPassed(task: StudyPlan) {
    setUpdating(task.id)
    try {
      await updateProgress(task, true)
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(null)
      setQuizOpen(false)
      setQuizTask(null)
    }
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Plan</CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="w-10 h-10 text-yellow-600 mb-3" />
          <p className="text-slate-950 text-sm">No study tasks for today.</p>
          <p className="text-slate-600 text-xs mt-1">Add subjects and generate a plan to get started!</p>
        </div>
      </Card>
    )
  }

  const completedCount = tasks.filter((t) => t.is_completed).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Today&apos;s Plan</CardTitle>
          <span className="text-sm text-slate-600">
            {completedCount}/{tasks.length} done
          </span>
        </div>
        <div className="mt-3 h-1.5 bg-[#fff4b0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f7d46a] to-[#f4c64c] rounded-full transition-all duration-500"
            style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </CardHeader>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-3xl transition-all duration-200 border',
              task.is_completed
                ? 'bg-[#fff4b0] border border-[#f7d46a]'
                : 'bg-white border border-[#f5e3a2] hover:border-[#f7d46a] hover:bg-[#fff9d1]'
            )}
          >
            <button
              onClick={() => toggleComplete(task)}
              disabled={updating === task.id}
              className="mt-0.5 flex-shrink-0 transition-transform duration-200 hover:scale-110"
            >
              {task.is_completed ? (
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
              ) : (
                <Circle className="w-5 h-5 text-slate-800" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-semibold', task.is_completed ? 'line-through text-slate-700' : 'text-slate-950')}>
                {task.topic}
              </p>
              {task.subject && (
                <p className="text-xs text-slate-800 mt-0.5">{task.subject.name}</p>
              )}
              {task.description && (
                <p className="text-xs text-slate-800 mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-700 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{task.estimated_hours}h</span>
            </div>
          </div>
        ))}
      </div>
      <QuizModal
        open={quizOpen}
        task={quizTask ?? tasks[0]}
        onClose={() => {
          setQuizOpen(false)
          setQuizTask(null)
        }}
        onPassed={handleQuizPassed}
      />
    </Card>
  )
}
