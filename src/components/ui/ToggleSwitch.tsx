'use client'

import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  className = '',
  size = 'md',
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8',
  }

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const thumbTranslate = {
    sm: checked ? 'translateX(16px)' : 'translateX(2px)',
    md: checked ? 'translateX(20px)' : 'translateX(2px)',
    lg: checked ? 'translateX(24px)' : 'translateX(2px)',
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: checked
          ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
          : '#8e8e91',
        border: '1px solid #6b7280',
      }}
    >
      <motion.span
        className={`inline-block rounded-full bg-white shadow-md ${thumbSizeClasses[size]}`}
        initial={false}
        animate={{
          x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      />
    </button>
  )
}
