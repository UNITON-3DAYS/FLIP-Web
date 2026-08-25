import { findRecord, gradeAndSave, loadRecords } from '@/services/records'
import type { ExamType, GradingRecord, GradingSetup } from '@/types'

// docs/api-spec.md v0.2 구조. VITE_API_BASE_URL이 없으면 목(localStorage)으로 동작한다.
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined

const EXAM_TYPE_TO_API: Record<ExamType, string> = { 시험지: 'EXAM', '외부 교재': 'BOOK' }

// 목 모드용 세션 보관 (메모리)
const mockSessions = new Map<string, { setup: GradingSetup; pages: Set<number> }>()

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(body?.error?.message ?? `요청 실패 (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function createSession(setup: GradingSetup): Promise<string> {
  if (!BASE) {
    const id = crypto.randomUUID()
    mockSessions.set(id, { setup, pages: new Set() })
    return id
  }
  const body = await request<{ id: string }>('/api/grading-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examType: EXAM_TYPE_TO_API[setup.examType],
      title: setup.title,
      bookName: setup.bookName ?? null,
    }),
  })
  return body.id
}

export async function uploadPage(sessionId: string, seq: number, image: Blob): Promise<void> {
  if (!BASE) {
    mockSessions.get(sessionId)?.pages.add(seq)
    return
  }
  const form = new FormData()
  form.append('image', image, `page-${seq}.jpg`)
  form.append('seq', String(seq))
  await request(`/api/grading-sessions/${sessionId}/pages`, { method: 'POST', body: form })
}

export async function completeSession(sessionId: string): Promise<GradingRecord> {
  if (!BASE) {
    const session = mockSessions.get(sessionId)
    if (!session) throw new Error('세션을 찾을 수 없어요.')
    mockSessions.delete(sessionId)
    return gradeAndSave(session.setup, session.pages.size)
  }
  return request<GradingRecord>(`/api/grading-sessions/${sessionId}/complete`, { method: 'POST' })
}

export async function getGradings(): Promise<GradingRecord[]> {
  if (!BASE) return loadRecords()
  const body = await request<{ items: GradingRecord[] }>('/api/gradings')
  return body.items
}

export async function getGrading(id: string): Promise<GradingRecord> {
  if (!BASE) {
    const record = findRecord(id)
    if (!record) throw new Error('채점 결과를 찾을 수 없어요.')
    return record
  }
  return request<GradingRecord>(`/api/gradings/${id}`)
}
