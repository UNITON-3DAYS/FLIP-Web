import { findRecord, gradeAndSave, loadRecords } from '@/services/records'
import type { ExamType, GradingRecord, GradingSetup } from '@/types'

// docs/api-spec.md v0.1 구조. VITE_API_BASE_URL이 없으면 목(localStorage)으로 동작한다.
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined

const EXAM_TYPE_TO_API: Record<ExamType, string> = { 시험지: 'EXAM', '외부 교재': 'BOOK' }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(body?.error?.message ?? `요청 실패 (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function submitGrading(setup: GradingSetup, images: Blob[]): Promise<GradingRecord> {
  if (!BASE) return gradeAndSave(setup, images.length)

  const form = new FormData()
  images.forEach((image, i) => form.append('images', image, `page-${i + 1}.jpg`))
  form.append('examType', EXAM_TYPE_TO_API[setup.examType])
  form.append('title', setup.title)
  if (setup.bookName) form.append('bookName', setup.bookName)
  return request<GradingRecord>('/api/gradings', { method: 'POST', body: form })
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
