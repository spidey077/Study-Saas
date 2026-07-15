'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Trash2, Sparkles, Calendar, BookOpen, Minus, Plus } from 'lucide-react'
import { differenceInDays, parseISO, format } from 'date-fns'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import AnimatedProgressRing from '@/components/ui/AnimatedProgressRing'
import { Subject, Difficulty, ExamType } from '@/types'
import { cn } from '@/lib/utils'
import { removeQuizScores } from '@/lib/quizScoreStorage'

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

  const examTypeConfig: Record<ExamType, { label: string; icon: string }> = {
    pakistani: { label: '🇵🇰 Pakistani', icon: '🇵🇰' },
    international: { label: '🌍 International', icon: '🌍' },
  }

  // Generate gradient based on subject color
  const getSubjectGradient = (color: string) => {
    return `linear-gradient(135deg, ${color}40, ${color}15)`
  }

  const getAccentGradient = (color: string) => {
    return `linear-gradient(135deg, ${color}, ${color}CC)`
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
    setDeleting(true)
    try {
      const res = await fetch(`/api/subjects?id=${subject.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      removeQuizScores(subject.id)
      toast.success(`"${subject.name}" deleted`)
      onDelete(subject.id)
    } catch {
      toast.error('Failed to delete subject')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      whileHover={{
        y: -4,
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70"
        style={{
          background: getSubjectGradient(subject.color),
        }}
      >
        {/* Color accent bar with glow */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
          style={{ 
            background: getAccentGradient(subject.color),
            boxShadow: `0 0 20px ${subject.color}40`,
          }}
        />

      <div className="flex items-start justify-between mt-3">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{ backgroundColor: subject.color + '30' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
          </motion.div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{subject.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={difficultyVariant[subject.difficulty]} className="px-2.5 py-1">
                {subject.difficulty}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subject.total_topics} topics</span>
              {subject.exam_type && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  {examTypeConfig[subject.exam_type]?.icon} {examTypeConfig[subject.exam_type]?.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Circular progress ring */}
          <AnimatedProgressRing
            progress={progressPct}
            size={48}
            strokeWidth={3}
            color={subject.color}
            bgColor="rgba(255, 255, 255, 0.2)"
          />
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exam countdown */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span className="text-slate-600 dark:text-slate-400 font-medium">{format(parseISO(subject.exam_date), 'MMM d, yyyy')}</span>
        <motion.span
          className={cn(
            'ml-auto rounded-lg px-2.5 py-1 text-xs font-bold',
            daysLeft <= 7
              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
              : 'bg-green-100 text-green-700 dark:bg-emerald-950/60 dark:text-emerald-300'
          )}
          animate={daysLeft <= 7 ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today!' : 'Past'}
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
          <span>{completedTopics}/{subject.total_topics} topics</span>
          <span className="font-bold text-slate-900 dark:text-white">{progressPct}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
            style={{
              background: getAccentGradient(subject.color),
            }}
          />
        </div>
      </div>

      {/* Generate plan section */}
      <div className="mt-5 pt-5 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">Hours/day:</label>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => setHoursPerDay(Math.max(0.5, hoursPerDay - 0.5))}
              disabled={hoursPerDay <= 0.5}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <motion.span
              key={hoursPerDay}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="w-12 text-center font-bold text-slate-900 dark:text-white"
            >
              {hoursPerDay}
            </motion.span>
            <motion.button
              type="button"
              onClick={() => setHoursPerDay(Math.min(8, hoursPerDay + 0.5))}
              disabled={hoursPerDay >= 8}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        <motion.div className="relative">
          {generating && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <Button
            onClick={handleGeneratePlan}
            isLoading={generating}
            className="w-full"
            size="md"
            style={{
              background: generating ? undefined : getAccentGradient(subject.color),
            }}
          >
            <motion.div
              animate={generating ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: generating ? Infinity : 0, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            {generating ? 'AI is thinking...' : 'Generate AI Study Plan'}
          </Button>
        </motion.div>
      </div>
    </Card>
    </motion.div>
  )
}
