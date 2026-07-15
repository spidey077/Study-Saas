'use client'

import { motion } from 'framer-motion'
import { motion as motionConfig, prefersReducedMotion } from '@/lib/motion'

interface AnimatedProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  color?: string
  bgColor?: string
}

export default function AnimatedProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className = '',
  showPercentage = true,
  color = 'currentColor',
  bgColor = 'rgba(255, 255, 255, 0.1)',
}: AnimatedProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const shouldAnimate = !prefersReducedMotion()

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: shouldAnimate ? circumference : strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={shouldAnimate ? {
            duration: 0.9,
            ease: [0, 0, 0.2, 1],
          } : { duration: 0 }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showPercentage && (
        <span className="absolute text-xs font-semibold text-slate-950 dark:text-white">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
