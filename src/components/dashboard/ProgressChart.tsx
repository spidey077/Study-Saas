'use client'

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

interface ProgressChartProps {
  data: Array<{ date: string; completed: number; total: number }>
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const formattedData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <Card className="border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
      <CardHeader>
        <CardTitle>7-Day Progress</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Topics completed over the last 7 days</p>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--chart-axis-tick)' }}
              axisLine={false}
              tickLine={false}
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
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--chart-tooltip-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: 'var(--chart-tooltip-color)', fontWeight: '600' }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#completedGradient)"
              name="Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
