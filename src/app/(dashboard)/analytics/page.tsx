'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { format, subDays, parseISO } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Subject, StudyPlan, Difficulty } from '@/types'

export default function AnalyticsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [subRes, planRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/progress'),
      ])
      const [subs, ps] = await Promise.all([subRes.json(), planRes.json()])
      setSubjects(Array.isArray(subs) ? subs : [])
      setPlans(Array.isArray(ps) ? ps : [])
    } catch {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalCompleted = plans.filter((p) => p.is_completed).length
  const totalPlans = plans.length
  const overallPct = totalPlans > 0 ? Math.round((totalCompleted / totalPlans) * 100) : 0

  const subjectData = subjects.map((s) => {
    const subjectPlans = plans.filter((p) => p.subject_id === s.id)
    const completed = subjectPlans.filter((p) => p.is_completed).length
    const remaining = subjectPlans.length - completed
    return {
      name: s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name,
      fullName: s.name,
      completed,
      remaining,
      total: subjectPlans.length,
      color: s.color,
    }
  })

  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const d = format(subDays(new Date(), 13 - i), 'yyyy-MM-dd')
    const dayPlans = plans.filter((p) => p.plan_date === d && p.is_completed)
    const hours = dayPlans.reduce((sum, p) => sum + p.estimated_hours, 0)
    return {
      date: d,
      label: format(parseISO(d), 'MMM d'),
      hours: Math.round(hours * 10) / 10,
    }
  })

  const difficultyBadge = (d: Difficulty) =>
    d === 'easy' ? 'easy' : d === 'medium' ? 'medium' : 'hard'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Loading analytics...</p>
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-base leading-7">Track your study progress and performance</p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="text-center sm:col-span-1 border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Completion</p>
          <div className="mt-4 relative w-28 h-28 mx-auto">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="10"
                strokeDasharray={`${overallPct * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{overallPct}%</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {totalCompleted} of {totalPlans} topics
          </p>
        </Card>

        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950 h-full">
              <p className="text-sm text-slate-900 dark:text-slate-400">Total Subjects</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{subjects.length}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950 h-full">
              <p className="text-sm text-slate-900 dark:text-slate-400">Topics Completed</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{totalCompleted}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950 h-full">
              <p className="text-sm text-slate-900 dark:text-slate-400">Topics Remaining</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalPlans - totalCompleted}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950 h-full">
              <p className="text-sm text-slate-900 dark:text-slate-400">Study Hours Logged</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {plans.filter((p) => p.is_completed).reduce((s, p) => s + p.estimated_hours, 0).toFixed(1)}h
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {subjectData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950">
          <CardHeader>
            <CardTitle>Topics per Subject</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Completed vs remaining by subject</p>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--chart-axis-tick)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--chart-axis-tick)', fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ background: 'var(--chart-tooltip-background)', border: '1px solid var(--chart-grid-stroke)', borderRadius: '8px', fontSize: '13px', color: 'var(--chart-tooltip-color)', padding: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                  labelStyle={{ color: 'var(--chart-tooltip-color)', fontWeight: '600', marginBottom: '4px' }}
                  formatter={(value, name) => [value, name === 'completed' ? 'Completed' : 'Remaining']}
                />
                <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} name="completed" maxBarSize={60} />
                <Bar dataKey="remaining" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="remaining" maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950">
        <CardHeader>
          <CardTitle>Daily Study Hours</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hours of completed topics over the last 14 days</p>
        </CardHeader>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--chart-axis-tick)', fontWeight: 500 }} axisLine={false} tickLine={false} dy={5} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--chart-axis-tick)', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--chart-tooltip-background)', border: '1px solid var(--chart-grid-stroke)', borderRadius: '8px', fontSize: '13px', color: 'var(--chart-tooltip-color)', padding: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                labelStyle={{ color: 'var(--chart-tooltip-color)', fontWeight: '600', marginBottom: '4px' }}
                formatter={(v) => [`${v}h`, 'Hours studied']}
              />
              <Area type="monotone" dataKey="hours" stroke="#4f46e5" strokeWidth={2.5} fill="url(#hoursGradient)" dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      </motion.div>

      {subjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-950">
          <CardHeader>
            <CardTitle>Subject Summary</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Subject</th>
                  <th className="text-center py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Difficulty</th>
                  <th className="text-center py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Total</th>
                  <th className="text-center py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Done</th>
                  <th className="text-center py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Left</th>
                  <th className="text-center py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Exam Date</th>
                  <th className="text-center py-3 px-2 text-slate-600 dark:text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => {
                  const sp = plans.filter((p) => p.subject_id === s.id)
                  const done = sp.filter((p) => p.is_completed).length
                  const left = sp.length - done
                  const pct2 = sp.length > 0 ? Math.round((done / sp.length) * 100) : 0
                  return (
                    <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700 dark:hover:bg-slate-800">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="font-medium text-slate-900 dark:text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={difficultyBadge(s.difficulty)}>{s.difficulty}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-700 dark:text-slate-300">{sp.length}</td>
                      <td className="py-3 px-2 text-center font-medium text-primary-600">{done}</td>
                      <td className="py-3 px-2 text-center text-slate-900 dark:text-white font-medium">{left}</td>
                      <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">{format(parseISO(s.exam_date), 'MMM d, yyyy')}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={pct2 === 100 ? 'success' : pct2 >= 50 ? 'info' : 'warning'}>
                          {pct2}%
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
