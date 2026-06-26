'use client'

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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subjects</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your subjects and generate AI study plans</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50 animate-slide-up">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Add New Subject</h2>
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
        <Card className="text-center py-16 border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white animate-slide-up">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-600 mb-6 shadow-lg">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No subjects yet</h3>
          <p className="text-slate-600 mb-8 max-w-sm mx-auto text-lg">
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
