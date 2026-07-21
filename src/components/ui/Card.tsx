import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.18)] transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-none',
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
