'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { StudyPlan } from '@/types'
import QuizModal from '@/components/QuizModal'
import { cn } from '@/lib/utils'

interface TopicItemProps {
  task: StudyPlan
  onToggle: (updated: StudyPlan) => void
}

export default function TopicItem({ task, onToggle }: TopicItemProps) {
  const [updating, setUpdating] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  async function handleToggle() {
    if (!task.is_completed) {
      setQuizOpen(true)
      return
    }

    setUpdating(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, is_completed: false }),
      })
      if (!res.ok) throw new Error('Failed to update')
      const updated = await res.json()
      onToggle(updated)
      toast.success('Marked as incomplete')
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(false)
    }
  }

  async function handleQuizPassed(task: StudyPlan) {
    setUpdating(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, is_completed: true }),
      })
      if (!res.ok) throw new Error('Failed to update')
      const updated = await res.json()
      onToggle(updated)
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(false)
      setQuizOpen(false)
    }
  }

  return (
    <>
      <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
        task.is_completed
          ? 'bg-[#fff4b0] border border-[#f7d46a]'
          : 'bg-white border border-[#f5e3a2] hover:border-[#f7d46a] hover:bg-[#fff9d1]'
      )}
    >
      <button
        onClick={handleToggle}
        disabled={updating}
        className="mt-0.5 flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:opacity-50"
      >
        {task.is_completed ? (
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
        ) : (
          <Circle className="w-5 h-5 text-slate-800 hover:text-slate-950" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm font-medium',
              task.is_completed ? 'line-through text-slate-600' : 'text-slate-950'
            )}
          >
            {task.topic}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600 flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span>{task.estimated_hours}h</span>
          </div>
        </div>

        {task.subject && (
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: task.subject.color }}
            />
            <span className="text-xs font-medium text-slate-700">
              {task.subject.name}
            </span>
          </div>
        )}

        {task.description && (
          <p className="text-xs mt-1.5 text-slate-600">
            {task.description}
          </p>
        )}
      </div>
    </div>
      <QuizModal
        open={quizOpen}
        task={task}
        onClose={() => setQuizOpen(false)}
        onPassed={handleQuizPassed}
      />
    </>
  )
}
