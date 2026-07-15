'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { motion as motionConfig, prefersReducedMotion } from '@/lib/motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export default function AnimatedCounter({
  value,
  duration = 800,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const frameRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayValue(value)
      return
    }

    setIsAnimating(true)
    startTimeRef.current = performance.now()
    const startValue = displayValue

    const animate = (currentTime: number) => {
      const elapsed = currentTime - (startTimeRef.current || 0)
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out quart
      const easeProgress = 1 - Math.pow(1 - progress, 4)
      
      const currentValue = startValue + (value - startValue) * easeProgress
      setDisplayValue(currentValue)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [value, duration, displayValue])

  const formattedValue = displayValue.toFixed(decimals)

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  )
}
