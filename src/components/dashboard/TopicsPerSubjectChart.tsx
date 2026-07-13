'use client'

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

interface TopicsPerSubjectChartProps {
  subjects: Array<{ id: string; name: string; total_topics: number; color: string }>
  plans: Array<{ subject_id: string; is_completed: boolean }>
}

export default function TopicsPerSubjectChart({ subjects, plans }: TopicsPerSubjectChartProps) {
  const data = subjects.map(subject => {
    const subjectPlans = plans.filter(p => p.subject_id === subject.id)
    const completed = subjectPlans.filter(p => p.is_completed).length
    const remaining = subject.total_topics - completed
    
    return {
      name: subject.name.length > 15 ? subject.name.substring(0, 15) + '...' : subject.name,
      fullName: subject.name,
      total: subject.total_topics,
      completed,
      remaining,
      color: subject.color
    }
  })

  if (data.length === 0) {
    return (
      <Card className="border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
        <CardHeader>
          <CardTitle>Topics per Subject</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total topics breakdown by subject</p>
        </CardHeader>
        <div className="h-56 flex items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">No subjects to display</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <CardHeader>
        <CardTitle>Topics per Subject</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total topics breakdown by subject</p>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--chart-axis-tick)' }}
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--chart-axis-tick)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--chart-tooltip-background)',
                border: '1px solid var(--chart-grid-stroke)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--chart-tooltip-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: 'var(--chart-tooltip-color)', fontWeight: '600' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                const label = name === 'total' ? 'Total Topics' : name === 'completed' ? 'Completed' : 'Remaining'
                return [value, label]
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(label: any) => {
                const item = data.find(d => d.name === label)
                return item?.fullName || label
              }}
            />
            <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} name="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
