import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'easy' | 'medium' | 'hard'
}

const variantClasses = {
  default: 'bg-[#fff4b0] text-slate-950 ring-1 ring-[#f7d46a]/60',
  success: 'bg-[#d7f7d0] text-[#166534] ring-1 ring-[#a3e635]/30',
  warning: 'bg-[#fff4b0] text-[#92400e] ring-1 ring-[#facc15]/30',
  danger: 'bg-[#fee2e2] text-[#991b1b] ring-1 ring-[#fca5a5]/40',
  info: 'bg-[#dbeafe] text-[#1e3a8a] ring-1 ring-[#7dd3fc]/40',
  easy: 'bg-[#dcfce7] text-[#14532d] ring-1 ring-[#86efac]/30',
  medium: 'bg-[#fef3c7] text-[#78350f] ring-1 ring-[#fbbf24]/30',
  hard: 'bg-[#fed7d7] text-[#7f1d1d] ring-1 ring-[#fca5a5]/30',
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
