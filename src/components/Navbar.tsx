'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, BarChart2, Calendar, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/study-plan', label: 'Study Plan', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-[#f5e3a2] px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f7d46a] rounded-2xl flex items-center justify-center border border-[#f5db7d] shadow-sm">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-950">StudyFlow</p>
            <p className="text-xs text-slate-500">AI-powered study planning</p>
          </div>
        </Link>

        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center justify-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#fff2a8] text-slate-950 ring-1 ring-[#f7d46a]/50'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-[#fff6bb]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}
