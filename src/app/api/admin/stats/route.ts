import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUsers, isAdminUser } from '@/lib/admin'

// GET — fetch platform statistics (admin only)
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!(await isAdminUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const adminUsers = await getAdminUsers()
    const [usersCount, subjectsCount, plansCount] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subjects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('study_plans').select('*', { count: 'exact', head: true }),
    ])

    // Calculate active users from recent subjects or study plans
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [recentPlansResult, recentSubjectsResult] = await Promise.all([
      supabaseAdmin
        .from('study_plans')
        .select('user_id')
        .gte('plan_date', thirtyDaysAgo.toISOString()),
      supabaseAdmin
        .from('subjects')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString()),
    ])

    if (recentPlansResult.error) {
      throw recentPlansResult.error
    }

    if (recentSubjectsResult.error) {
      throw recentSubjectsResult.error
    }

    const activeUsersCount = new Set([
      ...(recentPlansResult.data || []).map((item) => item.user_id),
      ...(recentSubjectsResult.data || []).map((item) => item.user_id),
    ]).size

    const stats = {
      totalUsers: adminUsers.length || usersCount.count || 0,
      totalSubjects: subjectsCount.count || 0,
      totalPlans: plansCount.count || 0,
      activeUsers: activeUsersCount,
    }

    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
