import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_36%),linear-gradient(180deg,_#fafafa_0%,_#ffffff_100%)] px-4 py-12 dark:bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_36%),linear-gradient(180deg,_#0a0a0a_0%,_#111111_100%)]">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <SignIn />
      </div>
    </div>
  )
}
