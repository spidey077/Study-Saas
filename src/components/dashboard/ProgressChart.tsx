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
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
    >
      <Card className="border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
        <CardHeader>
          <CardTitle>7-Day Progress</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Topics completed over the last 7 days</p>
        </CardHeader>
        <motion.div
          className="h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'var(--chart-axis-tick)', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={5}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--chart-axis-tick)', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--chart-tooltip-background)',
                  border: '1px solid var(--chart-grid-stroke)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--chart-tooltip-color)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: '12px',
                }}
                labelStyle={{ color: 'var(--chart-tooltip-color)', fontWeight: '600', marginBottom: '4px' }}
                animationDuration={200}
                formatter={(value: any) => [value, 'Completed']}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#completedGradient)"
                name="Completed"
                animationDuration={1000}
                animationEasing="ease-out"
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </Card>
    </motion.div>
  )
}
