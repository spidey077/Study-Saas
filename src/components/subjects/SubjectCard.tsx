'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Sparkles, Calendar, BookOpen } from 'lucide-react'
import { differenceInDays, parseISO, format } from 'date-fns'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Subject, Difficulty } from '@/types'
import { cn } from '@/lib/utils'

interface SubjectCardProps {
  subject: Subject
  completedTopics: number
  onDelete: (id: string) => void
  onPlanGenerated: () => void
}

export default function SubjectCard({ subject, completedTopics, onDelete, onPlanGenerated }: SubjectCardProps) {
  const [generating, setGenerating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [hoursPerDay, setHoursPerDay] = useState(2)

  const daysLeft = differenceInDays(parseISO(subject.exam_date), new Date())
  const progressPct = subject.total_topics > 0 ? Math.round((completedTopics / subject.total_topics) * 100) : 0

  const difficultyVariant: Record<Difficulty, 'easy' | 'medium' | 'hard'> = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
  }

  async function handleGeneratePlan() {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: subject.id,
          subjectName: subject.name,
          examDate: subject.exam_date,
          totalTopics: subject.total_topics,
          difficulty: subject.difficulty,
          hoursPerDay,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate plan')
      }
      const result = await res.json()
      toast.success(`AI generated ${result.count} study sessions!`)
      onPlanGenerated()
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(err instanceof Error ? err.message : 'Failed to generate plan')
    } finally {
      setGenerating(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${subject.name}"? This will also remove its study plan.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/subjects?id=${subject.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success(`"${subject.name}" deleted`)
      onDelete(subject.id)
    } catch {
      toast.error('Failed to delete subject')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group">
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
        style={{ backgroundColor: subject.color }}
      />

      <div className="flex items-start justify-between mt-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: subject.color + '20' }}
          >
            <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={difficultyVariant[subject.difficulty]}>
                {subject.difficulty}
              </Badge>
              <span className="text-xs text-slate-500 font-medium">{subject.total_topics} topics</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Exam countdown */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-slate-500" />
        <span className="text-slate-600 font-medium">{format(parseISO(subject.exam_date), 'MMM d, yyyy')}</span>
        <span className={cn(
          'ml-auto font-bold px-2 py-1 rounded-lg text-xs',
          daysLeft <= 7 ? 'bg-red-100 text-red-600' : daysLeft <= 14 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
        )}>
          {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today!' : 'Past'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
          <span>{completedTopics}/{subject.total_topics} topics</span>
          <span className="font-bold">{progressPct}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 shadow-sm"
            style={{
              width: `${progressPct}%`,
              backgroundColor: subject.color,
            }}
          />
        </div>
      </div>

      {/* Generate plan section */}
      <div className="mt-5 pt-5 border-t border-slate-200/60">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Hours/day:</label>
          <input
            type="number"
            min={0.5}
            max={8}
            step={0.5}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            className="w-20 rounded-xl border-2 border-slate-200/60 bg-white px-3 py-2 text-sm text-center text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300/60 transition-all"
          />
        </div>
        <Button
          onClick={handleGeneratePlan}
          isLoading={generating}
          className="w-full"
          size="md"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'AI is thinking...' : 'Generate AI Study Plan'}
        </Button>
      </div>
    </Card>
  )
}
