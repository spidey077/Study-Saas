'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { BookOpen, BarChart2, Calendar, LayoutDashboard, Moon, Sun, Settings, Menu, X, Shield } from 'lucide-react'
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
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-sm dark:shadow-slate-900/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

        {/* Brand/Logo Section */}
        <Link href="/dashboard" className="flex items-center gap-3 group select-none">
          <StudyFlowLogoMark size={38} />
          <div>
            <p className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
              Study<span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Flow</span>
            </p>
            <p className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 hidden sm:block">
              AI-powered study planning
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center justify-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/10 dark:ring-blue-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400")} />
                  {item.label}
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === '/admin'
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/10 dark:ring-purple-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Shield className={cn('w-4 h-4', pathname === '/admin' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400')} />
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>
          <UserButton afterSignOutUrl="/" />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4">
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
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === '/admin'
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
