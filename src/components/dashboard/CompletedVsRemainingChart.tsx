'use client'

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart
} from 'recharts'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

interface CompletedVsRemainingChartProps {
  subjects: Array<{ id: string; name: string; total_topics: number; color: string }>
  plans: Array<{ subject_id: string; is_completed: boolean }>
}

export default function CompletedVsRemainingChart({ subjects, plans }: CompletedVsRemainingChartProps) {
  const data = subjects.map(subject => {
    const subjectPlans = plans.filter(p => p.subject_id === subject.id)
    const completed = subjectPlans.filter(p => p.is_completed).length
    const remaining = subject.total_topics - completed
    
    return {
      name: subject.name.length > 12 ? subject.name.substring(0, 12) + '...' : subject.name,
      fullName: subject.name,
      completed,
      remaining,
      color: subject.color
    }
  })

  if (data.length === 0) {
    return (
      <Card className="border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Completed vs Remaining</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Progress breakdown by subject</p>
        </CardHeader>
        <div className="h-56 flex items-center justify-center">
          <p className="text-sm text-slate-500">No subjects to display</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle>Completed vs Remaining</CardTitle>
        <p className="text-sm text-slate-500 mt-1">Progress breakdown by subject</p>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#0f172a', fontWeight: '600' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [value, name === 'completed' ? 'Completed' : 'Remaining']}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(label: any) => {
                const item = data.find(d => d.name === label)
                return item?.fullName || label
              }}
            />
            <Bar dataKey="completed" fill="#22c55e" radius={[0, 4, 4, 0]} name="completed" />
            <Bar dataKey="remaining" fill="#f59e0b" radius={[0, 4, 4, 0]} name="remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
