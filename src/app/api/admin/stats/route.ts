import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET — fetch platform statistics (admin only)
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if user is admin
  const { data: currentUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('clerk_id', userId)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const [usersCount, subjectsCount, plansCount] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subjects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('study_plans').select('*', { count: 'exact', head: true }),
    ])

    // Calculate active users (users with study plans in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { count: activeUsersCount } = await supabaseAdmin
      .from('study_plans')
      .select('user_id', { count: 'exact', head: true })
      .gte('plan_date', thirtyDaysAgo.toISOString())

    const stats = {
      totalUsers: usersCount.count || 0,
      totalSubjects: subjectsCount.count || 0,
      totalPlans: plansCount.count || 0,
      activeUsers: activeUsersCount || 0,
    }

    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
