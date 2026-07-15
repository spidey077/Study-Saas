import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
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
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString())
  const isNumeric = !isNaN(numericValue)
  const animatedValue = isNumeric ? Math.max(0, numericValue) : numericValue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
    >
      <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/90 transition-colors duration-150 hover:border-primary-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-primary-500 h-full">
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isNumeric ? (
                  <AnimatedCounter value={animatedValue} duration={800} />
                ) : (
                  value
                )}
              </p>
              {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
              {trend && (
                <motion.p
                  className={cn('mt-2 text-sm font-semibold', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
                </motion.p>
              )}
            </div>
            <motion.div
              className={cn('p-3 rounded-xl shadow-md', iconBg)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Icon className={cn('w-6 h-6', iconColor)} />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
