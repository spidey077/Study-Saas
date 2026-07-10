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

    // Calculate active users (users with study plans in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: activeUsers, error: activeUsersError } = await supabaseAdmin
      .from('study_plans')
      .select('user_id')
      .gte('plan_date', thirtyDaysAgo.toISOString())

    if (activeUsersError) {
      throw activeUsersError
    }

    const activeUsersCount = new Set((activeUsers || []).map((item) => item.user_id)).size

    const stats = {
      totalUsers: usersCount.count || adminUsers.length || 0,
      totalSubjects: subjectsCount.count || 0,
      totalPlans: plansCount.count || 0,
      activeUsers: activeUsersCount,
    }

    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
