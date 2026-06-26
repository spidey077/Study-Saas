import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDailyReminder, sendWeeklySummary, sendProgressSummary } from '@/lib/resend'
import { format, addDays, isMonday, subDays } from 'date-fns'

// This route is called daily by Vercel Cron
// Protect it with a secret header
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const todayKey = format(today, 'yyyy-MM-dd')
  const isWeeklySummaryDay = isMonday(today)

  const { data: users, error: usersError } = await supabaseAdmin
    .from('users')
    .select('*')
    .in('reminder_enabled', [true, false])

  if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 })

  let sentCount = 0

  for (const user of users || []) {
    try {
      if (isWeeklySummaryDay) {
        const weekStart = format(subDays(today, 7), 'yyyy-MM-dd')
        const weekEnd = format(subDays(today, 1), 'yyyy-MM-dd')
        const upcomingEnd = format(addDays(today, 7), 'yyyy-MM-dd')

        const { data: completedTasks } = await supabaseAdmin
          .from('study_plans')
          .select('topic, estimated_hours, plan_date, subject:subjects(name)')
          .eq('user_id', user.clerk_id)
          .gte('plan_date', weekStart)
          .lte('plan_date', weekEnd)
          .eq('is_completed', true)

        const { data: upcomingTasks } = await supabaseAdmin
          .from('study_plans')
          .select('topic, estimated_hours, plan_date, subject:subjects(name)')
          .eq('user_id', user.clerk_id)
          .gte('plan_date', todayKey)
          .lte('plan_date', upcomingEnd)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completedList = (completedTasks || []).map((t: any) => ({
          topic: t.topic,
          subject: t.subject?.[0]?.name || 'Unknown',
          hours: t.estimated_hours,
          plan_date: t.plan_date,
        }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const upcomingList = (upcomingTasks || []).map((t: any) => ({
          topic: t.topic,
          subject: t.subject?.[0]?.name || 'Unknown',
          hours: t.estimated_hours,
          plan_date: t.plan_date,
        }))

        await sendWeeklySummary(
          user.email,
          user.name || 'Student',
          completedList,
          upcomingList,
          `${weekStart} → ${weekEnd}`
        )
        sentCount++
      } else {
        const { data: tasks } = await supabaseAdmin
          .from('study_plans')
          .select('*, subject:subjects(name)')
          .eq('user_id', user.clerk_id)
          .eq('plan_date', todayKey)
          .eq('is_completed', false)

        const { data: completedTasks } = await supabaseAdmin
          .from('study_plans')
          .select('topic, estimated_hours, plan_date, subject:subjects(name)')
          .eq('user_id', user.clerk_id)
          .lte('plan_date', todayKey)
          .eq('is_completed', true)

        const { data: upcomingTasks } = await supabaseAdmin
          .from('study_plans')
          .select('topic, estimated_hours, plan_date, subject:subjects(name)')
          .eq('user_id', user.clerk_id)
          .gte('plan_date', todayKey)

        const shouldSendProgressSummary = user.summary_enabled === true

        if (shouldSendProgressSummary) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const completedList = (completedTasks || []).map((t: any) => ({
            topic: t.topic,
            subject: t.subject?.[0]?.name || 'Unknown',
            hours: t.estimated_hours,
            plan_date: t.plan_date,
          }))

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const upcomingList = (upcomingTasks || []).map((t: any) => ({
            topic: t.topic,
            subject: t.subject?.[0]?.name || 'Unknown',
            hours: t.estimated_hours,
            plan_date: t.plan_date,
          }))

          await sendProgressSummary(
            user.email,
            user.name || 'Student',
            completedList,
            upcomingList,
            `Up to ${todayKey}`
          )
          sentCount++
        }

        if (!tasks || tasks.length === 0) continue

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const taskList = tasks.map((t: any) => ({
          topic: t.topic,
          subject: t.subject?.[0]?.name || 'Unknown',
          hours: t.estimated_hours,
        }))

        await sendDailyReminder(user.email, user.name || 'Student', taskList)
        sentCount++
      }
    } catch (err) {
      console.error(`Failed to send email to ${user.email}:`, err)
    }
  }

  return NextResponse.json({ success: true, emailsSent: sentCount, weeklySummary: isWeeklySummaryDay })
}
