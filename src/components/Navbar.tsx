'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { BookOpen, BarChart2, Calendar, LayoutDashboard, Moon, Sun, Settings, Menu, X, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'
import { ADMIN_EMAIL } from '@/lib/admin-constants'

// Drop in the clean SVG Logo Mark
function StudyFlowLogoMark({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-transform duration-300 hover:scale-105", className)}
    >
      <defs>
        <linearGradient id="studyFlowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" /> {/* Modern Tech Blue */}
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" /> {/* Growth/Success Emerald Green */}
        </linearGradient>
        <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Outer Path to Success Ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="url(#studyFlowGradient)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="175 65"
        transform="rotate(-45 50 50)"
        opacity="0.9"
      />

      {/* Dynamic S-Curve Streamline */}
      <path
        d="M35 70 C 40 55, 45 45, 65 30 C 50 45, 40 55, 35 70 Z"
        fill="url(#studyFlowGradient)"
        filter="url(#logoShadow)"
      />
      <path
        d="M45 65 C 52 50, 58 40, 75 25 C 62 38, 52 52, 45 65 Z"
        fill="url(#studyFlowGradient)"
      />

      {/* Aim-high Target Indicator */}
      <circle cx="75" cy="25" r="4.5" fill="#10B981" />
      <circle cx="75" cy="25" r="8" stroke="#10B981" strokeWidth="1.5" opacity="0.35" />
    </svg>
  )
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/study-plan', label: 'Study Plan', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUser()
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() === ADMIN_EMAIL

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 px-4 py-3 text-white backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">

        {/* Brand/Logo Section */}
        <Link href="/dashboard" className="flex items-center gap-3 group select-none">
          <StudyFlowLogoMark size={38} />
          <div>
            <p className="text-base font-bold tracking-tight text-white">
              Study<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Flow</span>
            </p>
            <p className="hidden text-[11px] font-medium tracking-wide text-slate-300 sm:block">
              AI-powered study planning
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative flex items-center justify-center gap-2 rounded-lg bg-slate-900/50 p-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-primary-600/20"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={cn('h-4 w-4', isActive ? 'text-primary-400' : 'text-slate-500')} />
                    <span className={cn(isActive ? 'text-white' : 'text-slate-300')}>{item.label}</span>
                  </span>
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150"
              >
                {pathname === '/admin' && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-primary-600/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Shield className={cn('h-4 w-4', pathname === '/admin' ? 'text-primary-400' : 'text-slate-500')} />
                  <span className={cn(pathname === '/admin' ? 'text-white' : 'text-slate-300')}>Admin</span>
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={toggleTheme}
            className="rounded-lg p-2 transition-colors hover:bg-slate-900"
            aria-label="Toggle theme"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-200" />
              ) : (
                <Sun className="h-5 w-5 text-slate-200" />
              )}
            </motion.div>
          </motion.button>
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity" />
            <UserButton afterSignOutUrl="/" />
          </motion.div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-slate-900 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-200" />
            ) : (
              <Menu className="h-5 w-5 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 py-4 dark:border-slate-700 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-primary-600/20 text-white'
                      : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150',
                  pathname === '/admin'
                    ? 'bg-primary-600/20 text-white'
                    : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                )}
              >
                <Shield className="w-5 h-5" />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
