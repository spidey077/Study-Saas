'use client'

import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'border border-[#f7e6a4] dark:border-slate-600 rounded-2xl px-3 py-2 w-full text-sm text-slate-950 dark:text-white bg-[#fffbe3] dark:bg-slate-700 placeholder-[#6b7280] dark:placeholder-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-[#f7d46a]/70 dark:focus:ring-blue-500/50 focus:border-transparent',
            'transition-colors duration-200',
            error && 'border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'border border-[#f7e6a4] dark:border-slate-600 rounded-2xl px-3 py-2 w-full text-sm text-slate-950 dark:text-white bg-[#fffbe3] dark:bg-slate-700',
            'focus:outline-none focus:ring-2 focus:ring-[#f7d46a]/70 dark:focus:ring-blue-500/50 focus:border-transparent',
            'transition-colors duration-200',
            error && 'border-rose-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Input
