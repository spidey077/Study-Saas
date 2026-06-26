export type Difficulty = 'easy' | 'medium' | 'hard'

export interface User {
  id: string
  clerk_id: string
  email: string
  name: string | null
  reminder_enabled: boolean
  reminder_time: string
  summary_enabled: boolean
  created_at: string
}

export interface Subject {
  id: string
  user_id: string
  name: string
  exam_date: string
  total_topics: number
  difficulty: Difficulty
  color: string
  created_at: string
}

export interface StudyPlan {
  id: string
  user_id: string
  subject_id: string
  plan_date: string
  topic: string
  description: string | null
  estimated_hours: number
  is_completed: boolean
  completed_at: string | null
  created_at: string
  subject?: Subject
}

export interface DashboardStats {
  totalSubjects: number
  totalTopics: number
  completedTopics: number
  completionPercentage: number
  todayTasks: StudyPlan[]
  upcomingExams: Subject[]
}

export interface GeneratePlanRequest {
  subjectId: string
  subjectName: string
  examDate: string
  totalTopics: number
  difficulty: Difficulty
  hoursPerDay: number
}
