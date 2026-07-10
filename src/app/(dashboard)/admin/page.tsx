'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Users, BookOpen, TrendingUp, Shield, Search } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import { User as UserType } from '@/types'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserType[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalPlans: 0,
    activeUsers: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  async function fetchAdminData() {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
      ])

      if (usersRes.status === 401 || usersRes.status === 403 || statsRes.status === 401 || statsRes.status === 403) {
        toast.error('Access denied. Only the approved admin account can view this page.')
        router.replace('/dashboard')
        return
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(Array.isArray(usersData) ? usersData : [])
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  async function toggleUserRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!res.ok) throw new Error('Failed to update role')
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as 'user' | 'admin' } : u))
      toast.success(`User role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update user role')
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage users and view platform statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-slate-200/60 dark:border-slate-700">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-slate-200/60 dark:border-slate-700">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Subjects</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalSubjects}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-slate-200/60 dark:border-slate-700">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Study Plans</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPlans}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-slate-200/60 dark:border-slate-700">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/20">
                <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-2 border-slate-200/60 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-sm font-semibold text-slate-900 dark:text-white">User</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-900 dark:text-white">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-900 dark:text-white">Plan</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-900 dark:text-white">Joined</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.[0] || user.email[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{user.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{user.subscription_tier}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleUserRole(user.id, user.role)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
