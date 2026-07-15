/**
 * Shared motion configuration tokens
 * Centralized easing, duration, and spring configs for consistent animations across the app
 */

export const motion = {
  // Duration tokens (in seconds)
  duration: {
    fast: 0.15,
    base: 0.3,
    slow: 0.6,
  },

  // Spring configurations
  spring: {
    soft: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
    snappy: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
    bouncy: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 20,
    },
  },

  // Easing functions for non-spring animations
  easing: {
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
  },

  // Stagger timings (in seconds)
  stagger: {
    fast: 0.04,
    base: 0.08,
    slow: 0.12,
  },

  // Common animation variants
  variants: {
    // Fade in with slide up
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },

    // Fade in with scale
    fadeInScale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },

    // Fade only (for reduced motion)
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get motion config with reduced motion fallback
 */
export function getMotionConfig<T extends Record<string, any>>(
  normalConfig: T,
  reducedConfig: T
): T {
  return prefersReducedMotion() ? reducedConfig : normalConfig
}
