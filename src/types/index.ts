export type Difficulty = 'easy' | 'medium' | 'hard'
export type Language = 'english' | 'urdu'
export type ExamType = 'pakistani' | 'international'
export type SubscriptionTier = 'free' | 'tier1' | 'tier2'
export type UserRole = 'user' | 'admin'

export type SpecificExam = 
  // Pakistani Exams
  | 'nust_net_engineering'
  | 'nust_net_cs'
  | 'fast_nu'
  | 'nts_nat_arts'
  | 'nts_nat_science'
  | 'nts_nat_engineering'
  | 'nts_gat_general'
  | 'mdcat'
  | 'ecat'
  | 'uet_ecat'
  // International Exams
  | 'ielts_academic'
  | 'ielts_general'
  | 'sat'
  | 'digital_sat'
  | 'gre'
  | 'gmat'

export interface User {
  id: string
  clerk_id: string
  email: string
  name: string | null
  reminder_enabled: boolean
  reminder_time: string
  summary_enabled: boolean
  language: Language
  subscription_tier: SubscriptionTier
  role: UserRole
  created_at: string
}

export interface Subject {
  id: string
  user_id: string
  name: string
  exam_date: string
  total_topics: number
  difficulty: Difficulty
  exam_type: ExamType
  specific_exam?: SpecificExam
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
