import { findRecord, gradeAndSave, loadRecords, loadUser } from '@/services/records'
import type {
  ExamType,
  GradingRecord,
  GradingSetup,
  GradingSummary,
  School,
  Worksheet,
} from '@/types'

// Notion API 명세서 기준 (Base URL 예: https://34.50.17.22.nip.io/api)
// VITE_API_BASE_URL이 없으면 목(localStorage)으로 동작한다.
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined
// ponytail: 학생 로그인 API 전 임시 — 가입 화면에서 입력한 학생 ID 사용, 없으면 env → '1'
const studentIdHeader = () =>
  loadUser()?.studentId ?? (import.meta.env.VITE_STUDENT_ID as string | undefined) ?? '1'

export const SOURCE_BY_EXAM_TYPE: Record<ExamType, Worksheet['source']> = {
  시험지: 'INHOUSE',
  '외부 교재': 'EXTERNAL',
}

// 목 모드용 문제지 목록 (서버 시드와 무관, 데모용)
const MOCK_WORKSHEETS: Worksheet[] = [
  { worksheetId: 1, source: 'INHOUSE', title: '중간 대비 모의' },
  { worksheetId: 2, source: 'INHOUSE', title: '쪽지시험 3회' },
  { worksheetId: 3, source: 'EXTERNAL', title: '쎈 2-1' },
  { worksheetId: 4, source: 'EXTERNAL', title: '개념원리 2-1' },
  { worksheetId: 5, source: 'EXTERNAL', title: 'RPM 2-1' },
  { worksheetId: 6, source: 'EXTERNAL', title: '일품 2-1' },
]

export async function getWorksheets(): Promise<Worksheet[]> {
  if (!BASE) return MOCK_WORKSHEETS
  const body = await request<{ worksheets: Worksheet[] }>('/worksheets')
  return body.worksheets
}

// 목 모드용 학교 목록
const MOCK_SCHOOLS: School[] = [
  { schoolId: 1, name: '서울중학교' },
  { schoolId: 2, name: '한국중학교' },
  { schoolId: 3, name: '미래고등학교' },
  { schoolId: 4, name: '기타' },
]

export async function getSchools(): Promise<School[]> {
  if (!BASE) return MOCK_SCHOOLS
  const body = await request<{ schools: School[] }>('/schools')
  return body.schools
}

const POLL_INTERVAL_MS = 2500
const POLL_TIMEOUT_MS = 30_000 // 마지막 장 기준 채점 ~10초 + 여유 (팀 결정 2026-08-25)

// 목 모드용 세션 보관 (메모리)
const mockSessions = new Map<string, { setup: GradingSetup; pages: Set<number> }>()

// 세션별 마지막(최대 seq) 업로드의 gradingImageId — 명세상 세션 종료 PATCH body에 필요
const lastImageBySession = new Map<string, { seq: number; gradingImageId: number }>()

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { studentId: studentIdHeader(), ...init?.headers },
  })
  if (!res.ok) throw new Error(`요청 실패 (${res.status})`)
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export async function createSession(setup: GradingSetup): Promise<string> {
  if (!BASE) {
    const id = crypto.randomUUID()
    mockSessions.set(id, { setup, pages: new Set() })
    return id
  }
  const body = await request<{ gradingRecordId: number }>('/grading-records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      worksheetSource: SOURCE_BY_EXAM_TYPE[setup.examType],
      worksheetTitle: setup.title,
    }),
  })
  return String(body.gradingRecordId)
}

export async function uploadPage(sessionId: string, seq: number, image: Blob): Promise<void> {
  if (!BASE) {
    mockSessions.get(sessionId)?.pages.add(seq)
    return
  }
  // 2단계: 스토리지에 파일 업로드 → 발급된 URL을 세션에 등록
  const form = new FormData()
  form.append('file', image, `page-${seq}.jpg`)
  const { fileUrl } = await request<{ fileUrl: string }>('/storage/upload', {
    method: 'POST',
    body: form,
  })
  const { gradingImageId } = await request<{ gradingImageId: number }>(
    `/grading-records/${sessionId}/images`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: fileUrl }),
    },
  )
  // 업로드는 병렬이라 완료 순서가 아니라 촬영 순서(seq) 기준으로 마지막 장을 기억한다
  const prev = lastImageBySession.get(sessionId)
  if (!prev || seq > prev.seq) lastImageBySession.set(sessionId, { seq, gradingImageId })
}

// 촬영 종료: 세션 종료(PATCH) 후 채점이 끝날 때까지 상세 조회를 폴링한다.
export async function completeSession(sessionId: string): Promise<GradingRecord> {
  if (!BASE) {
    const session = mockSessions.get(sessionId)
    if (!session) throw new Error('세션을 찾을 수 없어요.')
    mockSessions.delete(sessionId)
    return gradeAndSave(session.setup, session.pages.size)
  }
  // 명세: body에 마지막 업로드의 gradingImageId를 실어야 한다
  const lastImage = lastImageBySession.get(sessionId)
  await request(`/grading-records/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gradingImageId: lastImage?.gradingImageId }),
  })
  lastImageBySession.delete(sessionId)
  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    try {
      // status: IN_PROGRESS(촬영 중) / GRADING(채점 처리 중) / COMPLETED(완료)
      const { status } = await request<{ status: string }>(
        `/grading-records/${sessionId}/status`,
      )
      if (status === 'COMPLETED') return getGrading(sessionId)
    } catch {
      // 일시적 오류는 무시하고 재시도
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw new Error('채점이 오래 걸리고 있어요. 잠시 후 채점 내역에서 확인해주세요.')
}

interface GradingListResponse {
  gradingRecords: {
    gradingRecordId: number
    worksheetTitle: string
    pageStart?: number // 계약(노션) 필드 — BE 반영 대기
    pageEnd?: number
    createdAt?: string // 현 서버가 대신 주는 필드
  }[]
}

// 계약(노션): year/month/day 쿼리로 하루치 조회 + pageStart/End 제공.
// 현 서버는 쿼리 미지원·createdAt만 주므로, BE가 계약에 맞출 때까지 클라이언트 필터로 보완한다.
export async function getGradings(date: string): Promise<GradingSummary[]> {
  if (!BASE) return loadRecords().filter((record) => record.date === date)
  const [year, month, day] = date.split('-').map(Number)
  const body = await request<GradingListResponse>(
    `/grading-records?year=${year}&month=${month}&day=${day}`,
  )
  return body.gradingRecords
    .map((item) => ({
      id: String(item.gradingRecordId),
      title: item.worksheetTitle,
      range:
        item.pageStart != null && item.pageEnd != null
          ? `p.${item.pageStart} ~ p.${item.pageEnd}`
          : undefined,
      date: item.createdAt ? toIsoDate(item.createdAt) : date,
    }))
    .filter((item) => item.date === date)
}

// createdAt이 ISO("2026-08-24…")든 명세 예시의 한국어("2026년 8월 24일")든 YYYY-MM-DD로 정규화
function toIsoDate(value: string): string {
  const korean = value.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (korean) {
    const [, year, month, day] = korean
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return value.slice(0, 10)
}

interface GradingDetailResponse {
  worksheetTitle: string
  createdAt: string
  correctCount: number
  totalCount: number
  score: number
  wrongAnswers: { questionNumber: string; studentAnswer: string }[]
}

export async function getGrading(id: string): Promise<GradingRecord> {
  if (!BASE) {
    const record = findRecord(id)
    if (!record) throw new Error('채점 결과를 찾을 수 없어요.')
    return record
  }
  const detail = await request<GradingDetailResponse>(`/grading-records/${id}`)
  return {
    id,
    title: detail.worksheetTitle,
    date: toIsoDate(detail.createdAt),
    score: detail.score,
    correctCount: detail.correctCount,
    totalCount: detail.totalCount,
    wrongAnswers: detail.wrongAnswers.map((wrong) => ({ number: wrong.questionNumber })),
  }
}
