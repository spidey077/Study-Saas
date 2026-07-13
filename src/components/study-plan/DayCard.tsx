import { format, parseISO } from 'date-fns'
import { StudyPlan, Subject } from '@/types'
import TopicItem from './TopicItem'

interface DayCardProps {
  date: string
  tasks: StudyPlan[]
  onTaskToggle: (updated: StudyPlan) => void
  onQuizComplete?: (updatedSubject?: Subject) => void
  className?: string
}

export default function DayCard({ date, tasks, onTaskToggle, onQuizComplete, className }: DayCardProps) {
  const parsedDate = parseISO(date)
  const isToday = format(new Date(), 'yyyy-MM-dd') === date
  const isPast = parsedDate < new Date() && !isToday

  const completedCount = tasks.filter((t) => t.is_completed).length
  const totalHours = tasks.reduce((sum, t) => sum + t.estimated_hours, 0)

  return (
    <div className={`mb-6 ${className || ''}`}>
      {/* Date header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl ${isToday ? 'bg-primary-600 text-white' : isPast ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
          <span className="text-xs font-medium">{format(parsedDate, 'MMM')}</span>
          <span className="text-lg font-bold leading-none">{format(parsedDate, 'd')}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-950 dark:text-slate-100">
              {isToday ? 'Today' : format(parsedDate, 'EEEE')}
            </h3>
            {isToday && (
              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">Today</span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {completedCount}/{tasks.length} done · {totalHours}h total
          </p>
        </div>
        <div className="ml-auto flex-1 max-w-32">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topic items */}
      <div className="space-y-2 ml-15">
        {tasks.map((task) => (
          <TopicItem key={task.id} task={task} onToggle={onTaskToggle} onQuizComplete={onQuizComplete} />
        ))}
      </div>
    </div>
  )
}
