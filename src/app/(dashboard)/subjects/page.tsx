'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'
import SubjectForm from '@/components/subjects/SubjectForm'
import SubjectCard from '@/components/subjects/SubjectCard'
import Card from '@/components/ui/Card'
import { Subject, StudyPlan } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [subRes, planRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/progress'),
      ])
      const [subs, ps] = await Promise.all([subRes.json(), planRes.json()])
      setSubjects(Array.isArray(subs) ? subs : [])
      setPlans(Array.isArray(ps) ? ps : [])
    } catch {
      toast.error('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function getCompletedTopics(subjectId: string) {
    return plans.filter((p) => p.subject_id === subjectId && p.is_completed).length
  }

  function handleSubjectAdded(subject: Subject) {
    setSubjects((prev) => [...prev, subject])
    setShowForm(false)
  }

  function handleSubjectDeleted(id: string) {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setPlans((prev) => prev.filter((p) => p.subject_id !== id))
  }

  function handlePlanGenerated() {
    router.push('/study-plan')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Loading subjects...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Subjects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base sm:text-lg leading-8">Manage your subjects and generate AI study plans</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-3">
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      </div>

      {showForm && (
        <Card className="animate-slide-up border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Add New Subject</h2>
          <SubjectForm
            onSuccess={handleSubjectAdded}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {subjects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up stagger-1">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              completedTopics={getCompletedTopics(subject.id)}
              onDelete={handleSubjectDeleted}
              onPlanGenerated={handlePlanGenerated}
            />
          ))}
        </div>
      ) : (
        <Card className="animate-slide-up border border-dashed border-slate-200/80 bg-slate-50/70 py-16 text-center dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No subjects yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto text-base sm:text-lg leading-8">
            Add a subject to get started. AI will build your personalized study plan.
          </p>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="w-4 h-4" />
            Add Your First Subject
          </Button>
        </Card>
      )}
    </div>
  )
}
