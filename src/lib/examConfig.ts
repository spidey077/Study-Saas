import { SpecificExam, ExamType } from '@/types'

export interface ExamConfig {
  id: SpecificExam
  name: string
  type: ExamType
  subjects: string[]
  category: string
}

export const EXAM_CONFIGS: ExamConfig[] = [
  // Pakistani Exams
  {
    id: 'nust_net_engineering',
    name: 'NUST NET (Engineering)',
    type: 'pakistani',
    category: 'Engineering',
    subjects: ['Mathematics', 'Physics', 'English']
  },
  {
    id: 'nust_net_cs',
    name: 'NUST NET (CS/IT)',
    type: 'pakistani',
    category: 'Computer Science',
    subjects: ['Mathematics', 'Physics', 'English', 'Intelligence', 'Reasoning']
  },
  {
    id: 'fast_nu',
    name: 'FAST NU Entry Test',
    type: 'pakistani',
    category: 'Engineering',
    subjects: ['Mathematics', 'English', 'IQ', 'Logical Reasoning']
  },
  {
    id: 'nts_nat_arts',
    name: 'NTS NAT-I (Arts/Humanities)',
    type: 'pakistani',
    category: 'Arts',
    subjects: ['English', 'Mathematics', 'Analytical Reasoning', 'Urdu', 'Islamiat', 'Pakistan Studies']
  },
  {
    id: 'nts_nat_science',
    name: 'NTS NAT-I (Science)',
    type: 'pakistani',
    category: 'Science',
    subjects: ['English', 'Mathematics', 'Analytical Reasoning', 'Physics', 'Chemistry', 'Biology']
  },
  {
    id: 'nts_nat_engineering',
    name: 'NTS NAT-IE (Engineering)',
    type: 'pakistani',
    category: 'Engineering',
    subjects: ['English', 'Mathematics', 'Physics', 'Analytical Reasoning']
  },
  {
    id: 'nts_gat_general',
    name: 'NTS GAT General (Masters)',
    type: 'pakistani',
    category: 'Masters',
    subjects: ['English', 'Quantitative', 'Analytical Reasoning']
  },
  {
    id: 'mdcat',
    name: 'MDCAT',
    type: 'pakistani',
    category: 'Medical',
    subjects: ['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning']
  },
  {
    id: 'ecat',
    name: 'ECAT',
    type: 'pakistani',
    category: 'Engineering',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
  },
  {
    id: 'uet_ecat',
    name: 'UET ECAT',
    type: 'pakistani',
    category: 'Engineering',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
  },
  // International Exams
  {
    id: 'ielts_academic',
    name: 'IELTS (Academic)',
    type: 'international',
    category: 'English',
    subjects: ['Listening', 'Reading', 'Writing', 'Speaking']
  },
  {
    id: 'ielts_general',
    name: 'IELTS (General Training)',
    type: 'international',
    category: 'English',
    subjects: ['Listening', 'Reading', 'Writing', 'Speaking']
  },
  {
    id: 'sat',
    name: 'SAT',
    type: 'international',
    category: 'College Admission',
    subjects: ['Math', 'Reading', 'Writing']
  },
  {
    id: 'digital_sat',
    name: 'Digital SAT',
    type: 'international',
    category: 'College Admission',
    subjects: ['Math', 'Reading', 'Writing']
  },
  {
    id: 'gre',
    name: 'GRE',
    type: 'international',
    category: 'Graduate Admission',
    subjects: ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing']
  },
  {
    id: 'gmat',
    name: 'GMAT',
    type: 'international',
    category: 'Business School',
    subjects: ['Quantitative', 'Verbal', 'Integrated Reasoning', 'Analytical Writing']
  }
]

export function getExamConfig(examId: SpecificExam): ExamConfig | undefined {
  return EXAM_CONFIGS.find(config => config.id === examId)
}

export function getExamsByType(type: ExamType): ExamConfig[] {
  return EXAM_CONFIGS.filter(config => config.type === type)
}

function normalizeSubjectName(subjectName: string): string {
  return subjectName.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function isValidSubjectForExamType(subjectName: string, examType: ExamType): boolean {
  const normalizedSubject = normalizeSubjectName(subjectName)
  const validSubjects = EXAM_CONFIGS
    .filter(config => config.type === examType)
    .flatMap(config => config.subjects)

  return validSubjects.some(validSubject => {
    const normalizedValid = normalizeSubjectName(validSubject)
    return normalizedSubject.includes(normalizedValid) ||
      normalizedValid.includes(normalizedSubject) ||
      normalizedSubject === normalizedValid
  })
}

export function isValidSubjectForExam(subjectName: string, examId: SpecificExam): boolean {
  const config = getExamConfig(examId)
  if (!config) return false

  const normalizedSubject = normalizeSubjectName(subjectName)

  return config.subjects.some(validSubject => {
    const normalizedValid = normalizeSubjectName(validSubject)
    return normalizedSubject.includes(normalizedValid) ||
      normalizedValid.includes(normalizedSubject) ||
      normalizedSubject === normalizedValid
  })
}

export function getSubjectsForExam(examId: SpecificExam): string[] {
  const config = getExamConfig(examId)
  return config?.subjects || []
}
