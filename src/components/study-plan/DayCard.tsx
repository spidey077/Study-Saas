import { format, parseISO } from 'date-fns'
import { StudyPlan, Subject } from '@/types'
import TopicItem from './TopicItem'

interface DayCardProps {
  date: string
  tasks: StudyPlan[]
  onTaskToggle: (updated: StudyPlan) => void
  onQuizComplete?: (updatedSubject?: Subject) => void
}

export default function DayCard({ date, tasks, onTaskToggle, onQuizComplete }: DayCardProps) {
  const parsedDate = parseISO(date)
  const isToday = format(new Date(), 'yyyy-MM-dd') === date
  const isPast = parsedDate < new Date() && !isToday

  const completedCount = tasks.filter((t) => t.is_completed).length
  const totalHours = tasks.reduce((sum, t) => sum + t.estimated_hours, 0)

  return (
    <div className="mb-6">
      {/* Date header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${isToday ? 'bg-amber-500 text-slate-950 dark:bg-amber-400 dark:text-slate-950' : isPast ? 'bg-amber-900/20 text-slate-950 dark:bg-amber-900/30 dark:text-slate-100' : 'bg-slate-200 text-slate-950 dark:bg-slate-800 dark:text-slate-100'}`}>
          <span className="text-xs font-medium">{format(parsedDate, 'MMM')}</span>
          <span className="text-lg font-bold leading-none">{format(parsedDate, 'd')}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-950 dark:text-slate-100">
              {isToday ? 'Today' : format(parsedDate, 'EEEE')}
            </h3>
            {isToday && (
              <span className="text-xs bg-amber-500 text-slate-950 dark:bg-amber-400 dark:text-slate-950 px-2 py-0.5 rounded-full font-medium">Today</span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {completedCount}/{tasks.length} done · {totalHours}h total
          </p>
        </div>
        <div className="ml-auto flex-1 max-w-32">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-[#f7d46a] to-[#f4c64c] rounded-full transition-all duration-500"
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
