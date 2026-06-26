'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Calendar, Filter } from 'lucide-react'
import { Select } from '@/components/ui/Input'
import DayCard from '@/components/study-plan/DayCard'
import { StudyPlan, Subject } from '@/types'

export default function StudyPlanPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState('')
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

  function handleTaskToggle(updated: StudyPlan) {
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
  }

  // Group plans by date
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.plan_date]) acc[plan.plan_date] = []
    acc[plan.plan_date].push(plan)
    return acc
  }, {} as Record<string, StudyPlan[]>)

  const sortedDates = Object.keys(groupedPlans).sort()

  const totalCompleted = plans.filter((p) => p.is_completed).length
  const totalPlans = plans.length
  const pct = totalPlans > 0 ? Math.round((totalCompleted / totalPlans) * 100) : 0

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
          <h1 className="text-2xl font-bold text-slate-950">Study Plan</h1>
          <p className="text-slate-600 mt-1">
            {totalPlans > 0
              ? `${totalCompleted}/${totalPlans} topics completed (${pct}%)`
              : 'No study plan yet. Add subjects and generate a plan.'}
          </p>
        </div>

        {subjects.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-700" />
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
        )}
      </div>

      {/* Overall progress bar */}
      {totalPlans > 0 && (
        <div className="rounded-xl border border-[#f5e3a2] bg-[#fff9d1] p-4">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Overall Progress</span>
            <span className="font-semibold text-slate-950">{pct}%</span>
          </div>
          <div className="h-3 bg-[#fff4b0] rounded-full overflow-hidden">
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-[#f5e3a2] bg-white">
          <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-950 mb-2">No study plan yet</h3>
          <p className="text-slate-600">
            Go to <strong>Subjects</strong> and click &quot;Generate AI Study Plan&quot; on a subject.
          </p>
        </div>
      )}
    </div>
  )
}
