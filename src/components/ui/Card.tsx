import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300',
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
  <h3 className={cn('text-xl font-bold text-slate-900 tracking-tight', className)} {...props}>
    {children}
  </h3>
)

export const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-slate-600 leading-relaxed', className)} {...props}>
    {children}
  </div>
)

export default Card
