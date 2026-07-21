'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/motion'

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
  const frameRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayValue(value)
      return
    }

    // Reset to 0 before starting animation
    setDisplayValue(0)
    
    startTimeRef.current = performance.now()
    const startValue = 0
    
    // Adjust duration based on value to ensure each number is visible
    const adjustedDuration = Math.max(duration, value * 50)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - (startTimeRef.current || 0)
      const progress = Math.min(elapsed / adjustedDuration, 1)
      
      // Linear easing for smoother counting through all numbers
      const currentValue = startValue + (value - startValue) * progress
      setDisplayValue(currentValue)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    // Small delay to ensure the reset is visible
    setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate)
    }, 50)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [value, duration])

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
