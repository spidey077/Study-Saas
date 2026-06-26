'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { format, parseISO, differenceInDays, subDays } from 'date-fns'
import { BookOpen, CheckSquare, TrendingUp, Calendar } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import ProgressChart from '@/components/dashboard/ProgressChart'
import TodayPlan from '@/components/dashboard/TodayPlan'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { StudyPlan, Subject } from '@/types'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const { user } = useUser()
  const [allPlans, setAllPlans] = useState<StudyPlan[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const today = format(new Date(), 'yyyy-MM-dd')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const fetchData = useCallback(async () => {
    try {
      const [plansRes, subjectsRes] = await Promise.all([
        fetch('/api/progress'),
        fetch('/api/subjects'),
      ])
      const [plans, subs] = await Promise.all([plansRes.json(), subjectsRes.json()])
      setAllPlans(Array.isArray(plans) ? plans : [])
      setSubjects(Array.isArray(subs) ? subs : [])
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Stats
  const todayTasks = allPlans.filter((p) => p.plan_date === today)
  const completedTopics = allPlans.filter((p) => p.is_completed).length
  const totalTopics = allPlans.length
  const completionPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  // Next exam
  const upcomingExams = [...subjects].sort((a, b) =>
    differenceInDays(parseISO(a.exam_date), new Date()) - differenceInDays(parseISO(b.exam_date), new Date())
  )
  const nextExam = upcomingExams[0]
  const daysToNextExam = nextExam ? differenceInDays(parseISO(nextExam.exam_date), new Date()) : null

  // 7-day chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    const dayPlans = allPlans.filter((p) => p.plan_date === d)
    return {
      date: d,
      completed: dayPlans.filter((p) => p.is_completed).length,
      total: dayPlans.length,
    }
  })

  function handleTaskToggle(updated: StudyPlan) {
    setAllPlans((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {greeting}, {user?.firstName || 'Student'}!
        </h1>
        <p className="text-slate-500 text-lg">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Empty State */}
      {subjects.length === 0 && (
        <Card className="text-center py-16 border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-600 mb-6 shadow-lg">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No subjects yet</h3>
          <p className="text-slate-600 mb-8 max-w-sm mx-auto text-lg">
            Add your first subject and let AI generate a personalized study plan for you.
          </p>
          <Link href="/subjects">
            <Button size="lg">Add Your First Subject</Button>
          </Link>
        </Card>
      )}

      {subjects.length > 0 && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up stagger-1">
            <StatsCard
              title="Total Subjects"
              value={subjects.length}
              icon={BookOpen}
              iconColor="text-amber-600"
              iconBg="bg-gradient-to-br from-amber-100 to-yellow-100"
            />
            <StatsCard
              title="Topics Completed"
              value={completedTopics}
              subtitle={`of ${totalTopics} total`}
              icon={CheckSquare}
              iconColor="text-amber-600"
              iconBg="bg-gradient-to-br from-amber-100 to-yellow-100"
            />
            <StatsCard
              title="Completion"
              value={`${completionPct}%`}
              icon={TrendingUp}
              iconColor="text-amber-600"
              iconBg="bg-gradient-to-br from-amber-100 to-yellow-100"
            />
            <StatsCard
              title="Days to Next Exam"
              value={daysToNextExam !== null ? `${daysToNextExam}d` : '—'}
              subtitle={nextExam?.name || ''}
              icon={Calendar}
              iconColor={daysToNextExam !== null && daysToNextExam <= 7 ? 'text-red-600' : 'text-amber-600'}
              iconBg={daysToNextExam !== null && daysToNextExam <= 7 ? 'bg-gradient-to-br from-red-100 to-red-50' : 'bg-gradient-to-br from-amber-100 to-yellow-100'}
            />
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6 animate-slide-up stagger-2">
            {/* Today's Plan (wider) */}
            <div className="lg:col-span-2 space-y-6">
              <TodayPlan tasks={todayTasks} onTaskToggle={handleTaskToggle} />
            </div>

            {/* Upcoming Exams */}
            <div>
              <Card className="border-2 border-slate-200/60">
                <CardHeader>
                  <CardTitle>Upcoming Exams</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {upcomingExams.slice(0, 5).map((subject) => {
                    const days = differenceInDays(parseISO(subject.exam_date), new Date())
                    return (
                      <div key={subject.id} className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white hover:border-amber-300/60 hover:shadow-md hover:shadow-amber-500/10 transition-all duration-300">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{subject.name}</p>
                          <p className="text-xs text-slate-500">{format(parseISO(subject.exam_date), 'MMM d, yyyy')}</p>
                        </div>
                        <Badge
                          variant={days <= 7 ? 'danger' : days <= 14 ? 'warning' : 'success'}
                        >
                          {days}d
                        </Badge>
                      </div>
                    )
                  })}
                  {upcomingExams.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-8">No upcoming exams</p>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="animate-slide-up stagger-3">
            <ProgressChart data={chartData} />
          </div>
        </>
      )}
    </div>
  )
}
