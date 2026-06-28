'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Difficulty, Subject, ExamType, SpecificExam } from '@/types'
import { isValidSubjectForExam, getSubjectsForExam, getExamsByType } from '@/lib/examConfig'

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
]

interface SubjectFormProps {
  onSuccess: (subject: Subject) => void
  onCancel: () => void
}

export default function SubjectForm({ onSuccess, onCancel }: SubjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [form, setForm] = useState({
    name: '',
    exam_date: '',
    total_topics: 10,
    difficulty: 'medium' as Difficulty,
    exam_type: 'pakistani' as ExamType,
    specific_exam: '' as SpecificExam | '',
    hours_per_day: 2,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.exam_date) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate subject name against specific exam
    if (form.specific_exam && !isValidSubjectForExam(form.name, form.specific_exam)) {
      const validSubjects = getSubjectsForExam(form.specific_exam)
      toast.error(
        `"${form.name}" is not a valid subject for this exam. Valid subjects: ${validSubjects.join(', ')}`
      )
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          exam_date: form.exam_date,
          total_topics: form.total_topics,
          difficulty: form.difficulty,
          exam_type: form.exam_type,
          specific_exam: form.specific_exam || null,
          color: selectedColor,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save subject')
      }
      const subject = await res.json()
      toast.success(`"${subject.name}" added successfully!`)
      onSuccess(subject)
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Minimum date is tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {form.specific_exam ? (
        <>
          <Select
            id="name"
            name="name"
            label="Subject Name *"
            value={form.name}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject...</option>
            {getSubjectsForExam(form.specific_exam).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Valid subjects for this exam: {getSubjectsForExam(form.specific_exam).join(', ')}
          </p>
        </>
      ) : (
        <Input
          id="name"
          name="name"
          label="Subject Name *"
          placeholder={form.exam_type === 'pakistani' ? 'e.g. Mathematics, Physics, Chemistry...' : 'e.g. Math, Reading, Writing...'}
          value={form.name}
          onChange={handleChange}
          required
        />
      )}
      {!form.specific_exam && form.exam_type && (
        <p className="text-xs text-slate-500">
          Select a specific exam to choose only the approved subjects for that test.
        </p>
      )}

      <Input
        id="exam_date"
        name="exam_date"
        type="date"
        label="Exam Date *"
        value={form.exam_date}
        onChange={handleChange}
        min={minDateStr}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="total_topics"
          name="total_topics"
          type="number"
          label="Number of Topics"
          value={form.total_topics}
          onChange={handleChange}
          min={1}
          max={50}
        />
        <Input
          id="hours_per_day"
          name="hours_per_day"
          type="number"
          label="Hours Per Day"
          value={form.hours_per_day}
          onChange={handleChange}
          min={0.5}
          max={8}
          step={0.5}
        />
      </div>

      <Select
        id="difficulty"
        name="difficulty"
        label="Difficulty"
        value={form.difficulty}
        onChange={handleChange}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </Select>

      <Select
        id="exam_type"
        name="exam_type"
        label="Exam Type"
        value={form.exam_type}
        onChange={(e) => {
          handleChange(e)
          setForm(prev => ({ ...prev, specific_exam: '', name: '' }))
        }}
      >
        <option value="pakistani">🇵🇰 Pakistani Exams</option>
        <option value="international">🌍 International Exams</option>
      </Select>

      {form.exam_type && (
        <Select
          id="specific_exam"
          name="specific_exam"
          label="Specific Exam"
          value={form.specific_exam}
          onChange={(e) => {
            const nextExam = e.target.value as SpecificExam | ''
            setForm(prev => ({ ...prev, specific_exam: nextExam, name: '' }))
          }}
        >
          <option value="">Select your exam...</option>
          {getExamsByType(form.exam_type).map(exam => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </Select>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: color,
                outline: selectedColor === color ? `3px solid ${color}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading} className="flex-1">
          Save Subject
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
