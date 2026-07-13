import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_28%),linear-gradient(180deg,_#fafafa_0%,_#ffffff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_24%),linear-gradient(180deg,_#0a0a0a_0%,_#111111_100%)] dark:text-slate-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
