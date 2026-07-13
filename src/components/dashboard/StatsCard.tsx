import { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: { value: number; label: string }
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBg = 'bg-gradient-to-br from-primary-100 to-blue-50',
  trend,
}: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/90 transition-colors duration-150 hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          {trend && (
            <p className={cn('mt-2 text-sm font-semibold', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </Card>
  )
}
