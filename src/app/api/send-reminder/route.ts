import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDailyReminder, sendProgressSummary } from '@/lib/resend'
import { format } from 'date-fns'

async function getOrCreateUserProfile(userId: string) {
  const { data: existingUser, error: existingError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  const clerkUser = await clerkClient.users.getUser(userId)
  if (!clerkUser) {
    throw new Error('Unable to resolve Clerk user')
  }

  const clerkEmail =
    clerkUser.emailAddresses?.[0]?.emailAddress ||
    ''
  const name = clerkUser.firstName || clerkUser.username || 'Student'

  if (!clerkEmail) {
    throw new Error('No valid email found for user')
  }

  if (existingUser && !existingError) {
    if (existingUser.email !== clerkEmail) {
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({ email: clerkEmail, name })
        .eq('clerk_id', userId)
        .select()
        .single()

      if (updateError) {
        throw new Error(updateError.message || 'Unable to update user email')
      }

      return updatedUser || existingUser
    }

    return existingUser
  }

  const { data: upsertedUser, error: upsertError } = await supabaseAdmin
    .from('users')
    .upsert(
      {
        clerk_id: userId,
        email: clerkEmail,
        name,
        reminder_enabled: true,
        reminder_time: '08:00',
      },
      { onConflict: 'clerk_id' }
    )
    .select()
    .single()

  if (upsertError || !upsertedUser) {
    throw new Error(upsertError?.message || 'Unable to create user profile')
  }

  return upsertedUser
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const body = await request.json()
  const type = body?.type || 'daily'

  let user
  try {
    user = await getOrCreateUserProfile(userId)
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'User profile not found' }, { status: 404 })
  }

  if (type === 'summary') {
    const { data: completedTasks } = await supabaseAdmin
      .from('study_plans')
      .select('topic, estimated_hours, plan_date, subject:subjects(name)')
      .eq('user_id', userId)
      .lte('plan_date', today)
      .eq('is_completed', true)

    const { data: upcomingTasks } = await supabaseAdmin
      .from('study_plans')
      .select('topic, estimated_hours, plan_date, subject:subjects(name)')
      .eq('user_id', userId)
      .gte('plan_date', today)

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

    try {
      await sendProgressSummary(
        user.email,
        user.name || 'Student',
        completedList,
        upcomingList,
        `Up to ${today}`
      )
      return NextResponse.json({ success: true, to: user.email, type: 'summary' })
    } catch (error: unknown) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
  }

  const { data: tasks } = await supabaseAdmin
    .from('study_plans')
    .select('*, subject:subjects(name)')
    .eq('user_id', userId)
    .eq('plan_date', today)
    .eq('is_completed', false)

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ message: 'No tasks for today' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const taskList = tasks.map((t: any) => ({
    topic: t.topic,
    subject: t.subject?.[0]?.name || 'Unknown',
    hours: t.estimated_hours,
  }))

  try {
    await sendDailyReminder(user.email, user.name || 'Student', taskList)
    return NextResponse.json({ success: true, to: user.email, type: 'daily' })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
