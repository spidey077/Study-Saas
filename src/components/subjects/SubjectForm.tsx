'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Difficulty, Subject } from '@/types'

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
      <Input
        id="name"
        name="name"
        label="Subject Name *"
        placeholder="e.g. Mathematics, Physics..."
        value={form.name}
        onChange={handleChange}
        required
      />

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
