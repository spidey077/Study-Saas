'use client'

import { useEffect, useRef, useState, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ScrollRevealProps = HTMLAttributes<HTMLDivElement>

export default function ScrollReveal({ className, children, ...props }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'scroll-reveal opacity-0 translate-y-6 transition-all duration-700 ease-out will-change-transform',
        visible && 'is-visible opacity-100 translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
