'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle2, Circle, Clock, BookOpen } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import QuizModal from '@/components/QuizModal'
import { StudyPlan, Subject } from '@/types'
import { cn } from '@/lib/utils'

interface TodayPlanProps {
  tasks: StudyPlan[]
  upcomingTasks?: StudyPlan[]
  onTaskToggle?: (updatedTask: StudyPlan) => void
  onQuizComplete?: (updatedSubject?: Subject) => void
}

export default function TodayPlan({ tasks, upcomingTasks, onTaskToggle, onQuizComplete }: TodayPlanProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [quizTask, setQuizTask] = useState<StudyPlan | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)

  async function updateProgress(task: StudyPlan, is_completed: boolean, quizScores?: number[]) {
    const res = await fetch('/api/progress', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, is_completed, quizScores }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.error || 'Failed to update')
    }
    const updated = await res.json()
    onTaskToggle?.({ ...task, ...updated, is_completed: updated.is_completed ?? is_completed })
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

  async function handleQuizPassed(task: StudyPlan, _percentage: number, quizScores: number[]) {
    setUpdating(task.id)
    try {
      const updated = await updateProgress(task, true, quizScores)
      onQuizComplete?.(updated.subject ?? undefined)
    } catch {
      toast.error('Failed to update progress')
      throw new Error('Failed to update progress')
    } finally {
      setUpdating(null)
      setQuizOpen(false)
      setQuizTask(null)
    }
  }

  if (tasks.length === 0) {
    if (upcomingTasks && upcomingTasks.length > 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No tasks for today. Here are your next upcoming tasks:</p>
          </CardHeader>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05,
                }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 transition-all duration-200 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Circle className="w-5 h-5 text-slate-800 dark:text-slate-300 mt-0.5 flex-shrink-0" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{task.topic}</p>
                  {task.subject && (
                    <p className="text-xs text-slate-800 dark:text-slate-300 mt-0.5">{task.subject.name}</p>
                  )}
                  {task.description && (
                    <p className="text-xs text-slate-800 dark:text-slate-300 mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {new Date(task.plan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimated_hours}h</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Plan</CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-primary-600" />
          <p className="text-slate-950 dark:text-white text-sm">No study tasks for today.</p>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Add subjects and generate a plan to get started!</p>
        </div>
      </Card>
    )
  }

  const completedCount = tasks.filter((t) => t.is_completed).length
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Today&apos;s Plan</CardTitle>
          <motion.span
            key={completedCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm text-slate-600 dark:text-slate-400 font-semibold"
          >
            {completedCount}/{tasks.length} done
          </motion.span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          />
        </div>
      </CardHeader>
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: index * 0.05,
              }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-3xl transition-all duration-200 border',
                task.is_completed
                  ? 'border-primary-200 bg-primary-50/80 dark:border-primary-900/40 dark:bg-primary-950/20'
                  : 'border-slate-200/80 bg-slate-50/90 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500'
              )}
            >
              <motion.button
                onClick={() => toggleComplete(task)}
                disabled={updating === task.id}
                className="mt-0.5 flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {task.is_completed ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-slate-950 dark:text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="incomplete"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -180 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Circle className="w-5 h-5 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.div
                className="flex-1 min-w-0"
                animate={{
                  opacity: task.is_completed ? 0.6 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <p className={cn('text-sm font-semibold', task.is_completed ? 'line-through text-slate-700 dark:text-slate-400' : 'text-slate-950 dark:text-white')}>
                  {task.topic}
                </p>
                {task.subject && (
                  <p className="text-xs text-slate-800 dark:text-slate-300 mt-0.5">{task.subject.name}</p>
                )}
                {task.description && (
                  <p className="text-xs text-slate-800 dark:text-slate-300 mt-1 line-clamp-2">{task.description}</p>
                )}
              </motion.div>
              <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span>{task.estimated_hours}h</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      <QuizModal
        open={quizOpen}
        task={quizTask ?? tasks[0]}
        onClose={() => {
          setQuizOpen(false)
          setQuizTask(null)
        }}
        onPassed={handleQuizPassed}
        onQuizComplete={onQuizComplete}
      />
    </Card>
  )
}
