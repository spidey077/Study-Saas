import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-950 dark:text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
