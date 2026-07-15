'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { format, parseISO, differenceInDays, subDays } from 'date-fns'
import { BookOpen, CheckSquare, TrendingUp, Calendar } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import ProgressChart from '@/components/dashboard/ProgressChart'
import TodayPlan from '@/components/dashboard/TodayPlan'
import TopicsPerSubjectChart from '@/components/dashboard/TopicsPerSubjectChart'
import CompletedVsRemainingChart from '@/components/dashboard/CompletedVsRemainingChart'
import PredictedScoreCard from '@/components/dashboard/PredictedScoreCard'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { StudyPlan, Subject } from '@/types'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const { user } = useUser()
  const pathname = usePathname()
  const [allPlans, setAllPlans] = useState<StudyPlan[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const today = format(new Date(), 'yyyy-MM-dd')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch('/api/subjects')
      if (res.ok) {
        const subs = await res.json()
        setSubjects(Array.isArray(subs) ? subs : [])
      }
    } catch {
      // subjects will refresh on next navigation
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [plansRes, subjectsRes] = await Promise.all([
        fetch('/api/progress'),
        fetch('/api/subjects'),
      ])
      const [plans, subs] = await Promise.all([plansRes.json(), subjectsRes.json()])
      setAllPlans(Array.isArray(plans) ? plans : [])
      setSubjects(Array.isArray(subs) ? subs : [])
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (pathname === '/dashboard') {
      fetchSubjects()
    }
  }, [pathname, fetchSubjects])

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        fetchSubjects()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchSubjects])

  // Stats
  const todayTasks = allPlans.filter((p) => p.plan_date === today)
  const upcomingTasks = allPlans.filter((p) => p.plan_date > today).slice(0, 5)
  const completedTopics = allPlans.filter((p) => p.is_completed).length
  const totalTopics = allPlans.length
  const completionPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  // Next exam
  const upcomingExams = [...subjects].sort((a, b) =>
    differenceInDays(parseISO(a.exam_date), new Date()) - differenceInDays(parseISO(b.exam_date), new Date())
  )
  const nextExam = upcomingExams[0]
  const daysToNextExam = nextExam ? Math.max(0, differenceInDays(parseISO(nextExam.exam_date), new Date())) : null

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

  function handleQuizComplete(updatedSubject?: Subject) {
    if (updatedSubject) {
      setSubjects((prev) =>
        prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
      )
    } else {
      fetchSubjects()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {greeting}, {user?.firstName || 'Student'}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-7">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Empty State */}
      {subjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Card className="border border-dashed border-slate-200/80 bg-slate-50/70 py-16 text-center dark:border-slate-800 dark:bg-slate-950/50">
            <motion.div
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-300"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <BookOpen className="w-8 h-8" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No subjects yet</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm mx-auto text-base sm:text-lg leading-8">
              Add your first subject and let AI generate a personalized study plan for you.
            </p>
            <Link href="/subjects">
              <Button size="lg">Add Your First Subject</Button>
            </Link>
          </Card>
        </motion.div>
      )}

      {subjects.length > 0 && (
        <>
          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <StatsCard
              title="Total Subjects"
              value={subjects.length}
              icon={BookOpen}
              iconColor="text-primary-600"
              iconBg="bg-gradient-to-br from-primary-100 to-blue-50"
            />
            <StatsCard
              title="Topics Completed"
              value={completedTopics}
              subtitle={`of ${totalTopics} total`}
              icon={CheckSquare}
              iconColor="text-primary-600"
              iconBg="bg-gradient-to-br from-primary-100 to-blue-50"
            />
            <StatsCard
              title="Completion"
              value={`${completionPct}%`}
              icon={TrendingUp}
              iconColor="text-primary-600"
              iconBg="bg-gradient-to-br from-primary-100 to-blue-50"
            />
            <StatsCard
              title="Days to Next Exam"
              value={daysToNextExam !== null ? Math.max(0, daysToNextExam) : '—'}
              subtitle={nextExam?.name || ''}
              icon={Calendar}
              iconColor={daysToNextExam !== null && daysToNextExam <= 7 ? 'text-red-600' : 'text-primary-600'}
              iconBg={daysToNextExam !== null && daysToNextExam <= 7 ? 'bg-gradient-to-br from-red-100 to-red-50' : 'bg-gradient-to-br from-primary-100 to-blue-50'}
            />
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="grid lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Today's Plan (wider) */}
            <div className="lg:col-span-2 space-y-6">
              <TodayPlan
                tasks={todayTasks}
                upcomingTasks={upcomingTasks}
                onTaskToggle={handleTaskToggle}
                onQuizComplete={handleQuizComplete}
              />
            </div>

            {/* Upcoming Exams */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border border-slate-200/80 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Upcoming Exams</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {upcomingExams.slice(0, 5).map((subject, index) => {
                    const days = differenceInDays(parseISO(subject.exam_date), new Date())
                    return (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        whileHover={{ x: 4 }}
                        className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 transition-all duration-300 hover:border-primary-300 hover:shadow-sm dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:border-primary-500"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{subject.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{format(parseISO(subject.exam_date), 'MMM d, yyyy')}</p>
                        </div>
                        <Badge
                          variant={days <= 7 ? 'danger' : days <= 14 ? 'warning' : 'success'}
                        >
                          {days}d
                        </Badge>
                      </motion.div>
                    )
                  })}
                  {upcomingExams.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No upcoming exams</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Predicted Scores */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {subjects.map((subject) => (
              <PredictedScoreCard key={subject.id} subject={subject} />
            ))}
          </motion.div>

          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <ProgressChart data={chartData} />
          </motion.div>

          {/* Additional Charts */}
          <motion.div
            className="grid lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <TopicsPerSubjectChart subjects={subjects} plans={allPlans} />
            <CompletedVsRemainingChart subjects={subjects} plans={allPlans} />
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
