'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
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
                className="pl-10 pr-4 py-2 w-56 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
      </div>

      {/* Overall progress bar */}
      {totalPlans > 0 && (
        <div className="rounded-xl border border-[#f5e3a2] dark:border-amber-600 bg-[#fff9d1] dark:bg-slate-900 p-4">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Overall Progress</span>
            <span className="font-semibold text-slate-950 dark:text-white">{pct}%</span>
          </div>
          <div className="h-3 bg-[#fff4b0] dark:bg-amber-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f7d46a] to-[#f4c64c] rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Plan grouped by day */}
      {sortedDates.length > 0 ? (
        <div>
          {sortedDates.map((date) => (
            <DayCard
              key={date}
              date={date}
              tasks={groupedPlans[date]}
              onTaskToggle={handleTaskToggle}
              onQuizComplete={handleQuizComplete}
            />
          ))}
        </div>
      ) : isSearching && plans.length > 0 ? (
        <div className="text-center py-20 rounded-xl border border-[#f5e3a2] dark:border-slate-700 bg-white dark:bg-slate-900">
          <Search className="w-12 h-12 text-yellow-600 dark:text-yellow-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">No matching topics</h3>
          <p className="text-slate-600 dark:text-slate-400">
            No topics match &quot;{topicSearch.trim()}&quot;. Try a different search term.
          </p>
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-[#f5e3a2] dark:border-slate-700 bg-white dark:bg-slate-900">
          <Calendar className="w-12 h-12 text-yellow-600 dark:text-yellow-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">No study plan yet</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Go to <strong>Subjects</strong> and click &quot;Generate AI Study Plan&quot; on a subject.
          </p>
        </div>
      )}
    </div>
  )
}
