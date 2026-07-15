'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Calendar, Filter, Search } from 'lucide-react'
import { Select } from '@/components/ui/Input'
import DayCard from '@/components/study-plan/DayCard'
import { StudyPlan, Subject } from '@/types'

export default function StudyPlanPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [topicSearch, setTopicSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPlans = useCallback(async () => {
    try {
      const url = selectedSubject
        ? `/api/progress?subjectId=${selectedSubject}`
        : '/api/progress'
      const [planRes, subRes] = await Promise.all([
        fetch(url),
        fetch('/api/subjects'),
      ])
      const [ps, subs] = await Promise.all([planRes.json(), subRes.json()])
      setPlans(Array.isArray(ps) ? ps : [])
      setSubjects(Array.isArray(subs) ? subs : [])
    } catch {
      toast.error('Failed to load study plan')
    } finally {
      setLoading(false)
    }
  }, [selectedSubject])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  useEffect(() => {
    if (selectedSubject && !subjects.some((s) => s.id === selectedSubject)) {
      setSelectedSubject('')
    }
  }, [subjects, selectedSubject])

  async function handleQuizComplete() {
    fetchPlans()
  }

  function handleTaskToggle(updated: StudyPlan) {
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
  }

  const filteredPlans = useMemo(() => {
    const q = topicSearch.trim().toLowerCase()
    if (!q) return plans
    return plans.filter(
      (p) =>
        p.topic.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.subject?.name.toLowerCase().includes(q)
    )
  }, [plans, topicSearch])

  // Group plans by date
  const groupedPlans = filteredPlans.reduce((acc, plan) => {
    if (!acc[plan.plan_date]) acc[plan.plan_date] = []
    acc[plan.plan_date].push(plan)
    return acc
  }, {} as Record<string, StudyPlan[]>)

  const sortedDates = Object.keys(groupedPlans).sort()

  const totalCompleted = filteredPlans.filter((p) => p.is_completed).length
  const totalPlans = filteredPlans.length
  const pct = totalPlans > 0 ? Math.round((totalCompleted / totalPlans) * 100) : 0
  const isSearching = topicSearch.trim().length > 0

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Loading study plan...</p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">Study Plan</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-base leading-7">
            {totalPlans > 0
              ? `${totalCompleted}/${totalPlans} topics completed (${pct}%)`
              : 'No study plan yet. Add subjects and generate a plan.'}
          </p>
        </div>

        {subjects.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by topic..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-56 rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <Select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-48"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </motion.div>

      {/* Overall progress bar */}
      {totalPlans > 0 && (
        <motion.div
          className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Overall Progress</span>
            <span className="font-semibold text-slate-950 dark:text-white">{pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Plan grouped by day */}
      {sortedDates.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {sortedDates.map((date, index) => (
            <DayCard
              key={date}
              date={date}
              tasks={groupedPlans[date]}
              onTaskToggle={handleTaskToggle}
              onQuizComplete={handleQuizComplete}
            />
          ))}
        </motion.div>
      ) : isSearching && plans.length > 0 ? (
        <motion.div
          className="rounded-2xl border border-slate-200/80 bg-white/90 py-20 text-center dark:border-slate-800 dark:bg-slate-950/70"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Search className="mx-auto mb-4 h-12 w-12 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">No matching topics</h3>
          <p className="text-slate-600 dark:text-slate-400">
            No topics match &quot;{topicSearch.trim()}&quot;. Try a different search term.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="rounded-2xl border border-slate-200/80 bg-white/90 py-20 text-center dark:border-slate-800 dark:bg-slate-950/70"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Calendar className="mx-auto mb-4 h-12 w-12 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">No study plan yet</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Go to <strong>Subjects</strong> and click &quot;Generate AI Study Plan&quot; on a subject.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
