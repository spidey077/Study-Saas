# 📚 StudyFlow — AI Study Planner SaaS

StudyFlow is a personalized, AI-powered Study Planner SaaS application built on Next.js 14 (App Router). Students input their subjects and upcoming exam dates, and our integrated AI generates an optimized, day-by-day study calendar. The platform automates progressive revision intervals, keeps real-time metrics on completion data, and issues daily morning digest notifications to students via email.

[![Framework](https://img.shields.io/badge/Framework-Next.js%2014-indigo?style=flat-square)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-green?style=flat-square)](https://supabase.com/)
[![Auth](https://img.shields.io/badge/Auth-Clerk-blue?style=flat-square)](https://clerk.com/)
[![AI-Engine](https://img.shields.io/badge/AI-OpenAI%20GPT--4o--mini-orange?style=flat-square)](https://openai.com/)
[![Email-Infrastructure](https://img.shields.io/badge/Email-Resend-black?style=flat-square)](https://resend.com)

---

## 🚀 Key Features (Beyond Basic CRUD)

*   **Context-Aware AI Generation:** Leverages OpenAI’s `gpt-4o-mini` model to balance student course loads. It intelligently spaces specific, actionable tasks over available calendar days and automatically creates final revision modules right before exams.
*   **Automated Background Cron Systems:** Uses secure Vercel Cron routes running daily at 8:00 AM UTC to check for incomplete tasks and dispatch a clean morning digest to students using the Resend email engine.
*   **Unified Progress Dashboard:** Uses Recharts to aggregate real-time workspace mutations into scannable analytics dashboards, rendering 7-day completion velocities and 14-day study hour charts instantly.
*   **Granular Security Controls:** Protects the cloud tier with Supabase Row Level Security (RLS) tracking, ensuring multi-tenant isolation out-of-the-box.

---

## 🛠️ Tech Stack & Core Dependencies

| Purpose | Tool / Service | Package Version |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | `next@14` |
| **Language** | TypeScript | `typescript` |
| **Authentication** | Clerk Auth | `@clerk/nextjs` |
| **Database & Storage** | Supabase Backend Node Core | `@supabase/supabase-js` |
| **AI Text Engine** | OpenAI Node SDK | `openai` |
| **Email Delivery** | Resend | `resend` |
| **Styling Pipeline** | Tailwind CSS Tooling | `tailwindcss` |
| **Data Vis Components** | Recharts Graph Suite | `recharts` |
| **Date Structuring** | Date-Fns Utility Toolkit | `date-fns` |
| **Component Assets** | Lucide React | `lucide-react` |
| **System Toasts** | Sonner Notifications | `sonner` |

---

## 🛠️ How to run 

# Clone the repository
git clone [https://github.com/spidey077/study-flow.git](https://github.com/spidey077/study-flow.git)

# Installation Command
npx create-next-app@14 study-flow --typescript --tailwind --app --src-dir
cd study-flow
npm install @clerk/nextjs @supabase/supabase-js openai resend recharts date-fns lucide-react sonner

# Run locally
npm run dev
