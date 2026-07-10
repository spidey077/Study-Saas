import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300',
      className
    )}
    {...props}
  >
    {children}
  </div>
))

Card.displayName = 'Card'

export const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-6 space-y-2', className)} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-xl font-bold text-slate-900 dark:text-white tracking-tight', className)} {...props}>
    {children}
  </h3>
)

export const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-slate-600 dark:text-slate-300 leading-relaxed', className)} {...props}>
    {children}
  </div>
)

export default Card
