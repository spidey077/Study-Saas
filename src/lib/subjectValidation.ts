import { ExamType } from '@/types'

const PAKISTANI_EXAM_SUBJECTS = [
  // NTS subjects
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Islamic Studies', 'Pakistan Studies',
  'General Knowledge', 'Current Affairs', 'Analytical Reasoning',
  // NET subjects
  'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Intelligence',
  // FAST subjects
  'Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Intelligence',
  // ECAT subjects
  'Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science',
  // Common Pakistani subjects
  'Calculus', 'Algebra', 'Trigonometry', 'Mechanics', 'Thermodynamics', 'Organic Chemistry',
  'Inorganic Chemistry', 'Electromagnetism', 'Optics', 'Programming', 'Data Structures',
  'Algorithms', 'Databases', 'Operating Systems', 'Computer Networks',
].map(s => s.toLowerCase())

const INTERNATIONAL_EXAM_SUBJECTS = [
  // SAT subjects
  'Math', 'Reading', 'Writing', 'Literature', 'US History', 'World History',
  'Biology', 'Chemistry', 'Physics', 'Math Level 1', 'Math Level 2',
  // GRE subjects
  'Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing',
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology',
  // IELTS subjects
  'Reading', 'Writing', 'Listening', 'Speaking', 'Academic English',
  'General English', 'Vocabulary', 'Grammar',
  // GMAT subjects
  'Quantitative', 'Verbal', 'Integrated Reasoning', 'Analytical Writing Assessment',
  'Data Sufficiency', 'Critical Reasoning', 'Sentence Correction',
  // Common international subjects
  'Algebra', 'Geometry', 'Statistics', 'Calculus', 'Probability',
  'Essay Writing', 'Reading Comprehension', 'Critical Thinking',
].map(s => s.toLowerCase())

export function isValidSubjectForExamType(subjectName: string, examType: ExamType): boolean {
  const normalizedSubject = subjectName.toLowerCase().trim()
  
  if (examType === 'pakistani') {
    return PAKISTANI_EXAM_SUBJECTS.some(
      valid => normalizedSubject.includes(valid) || valid.includes(normalizedSubject)
    )
  }
  
  if (examType === 'international') {
    return INTERNATIONAL_EXAM_SUBJECTS.some(
      valid => normalizedSubject.includes(valid) || valid.includes(normalizedSubject)
    )
  }
  
  return false
}

export function getSubjectSuggestions(examType: ExamType): string[] {
  if (examType === 'pakistani') {
    return [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science',
      'Calculus', 'Algebra', 'Mechanics', 'Organic Chemistry', 'Programming'
    ]
  }
  
  if (examType === 'international') {
    return [
      'Math', 'Reading', 'Writing', 'Verbal Reasoning', 'Quantitative Reasoning',
      'Analytical Writing', 'Critical Reasoning', 'Reading Comprehension'
    ]
  }
  
  return []
}
