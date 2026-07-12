const STORAGE_KEY = 'study_saas_quiz_scores'

function readAll(): Record<string, number[]> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, number[]>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getQuizScores(subjectId: string): number[] {
  return readAll()[subjectId] ?? []
}

export function addQuizScore(subjectId: string, score: number): number[] {
  const all = readAll()
  const scores = [...(all[subjectId] ?? []), score]
  all[subjectId] = scores
  writeAll(all)
  return scores
}

export function removeQuizScores(subjectId: string): void {
  const all = readAll()
  if (!(subjectId in all)) return
  delete all[subjectId]
  writeAll(all)
}
