import { GRADINGS, STUDENTS, studentById } from '@/desk/mock'
import { HAS_SERVER, request, toIsoDate } from '@/services/api'
import type { ExamType, WrongAnswer } from '@/types'

// 대시보드용 서버 API (admin/students) — 서버가 없으면 desk/mock 폴백.

export interface DeskStudentView {
  id: string
  name: string
  school: string // 서버 학생 응답에는 학교 정보가 없어 빈 문자열일 수 있다
  grade: string
}

export interface DeskGradingView {
  id: string
  studentName: string
  studentGrade: string
  date: string
  examType: ExamType
  title: string
  bookName?: string
  range?: string
  score: number
  correctCount: number
  totalCount: number
  wrongAnswers: WrongAnswer[]
}

const EXAM_TYPE_BY_SOURCE: Record<string, ExamType> = {
  INHOUSE: '시험지',
  EXTERNAL: '외부 교재',
}

const mockGradings = (): DeskGradingView[] =>
  GRADINGS.map(({ studentId, ...grading }) => {
    const student = studentById(studentId)
    return { ...grading, studentName: student?.name ?? '', studentGrade: student?.grade ?? '' }
  })

export async function getDeskStudents(): Promise<DeskStudentView[]> {
  if (!HAS_SERVER) return STUDENTS.map((student) => ({ ...student }))
  const body = await request<{
    students: { studentId: number; grade: number; name: string; schoolName?: string }[]
  }>('/students')
  return body.students.map((student) => ({
    id: String(student.studentId),
    name: student.name,
    school: student.schoolName ?? '',
    grade: `${student.grade}학년`,
  }))
}

export async function getDeskStudent(id: string): Promise<DeskStudentView | null> {
  if (!HAS_SERVER) {
    const student = studentById(id)
    return student ? { ...student } : null
  }
  const body = await request<{
    studentId: number
    grade: number
    name: string
    schoolName: string
  }>(`/students/${id}`)
  return {
    id: String(body.studentId),
    name: body.name,
    school: body.schoolName,
    grade: `${body.grade}학년`,
  }
}

export async function createDeskStudent(input: {
  name: string
  grade: string // '1학년' 형태
  password: string
  schoolId: number
}): Promise<void> {
  if (!HAS_SERVER) return // 목 모드: 호출부가 화면 상태로만 반영
  await request('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      grade: Number.parseInt(input.grade, 10),
      password: input.password,
      schoolId: input.schoolId,
    }),
  })
}

export async function deleteDeskStudent(id: string): Promise<void> {
  if (!HAS_SERVER) return
  await request(`/students/${id}`, { method: 'DELETE' })
}

interface AdminGradingSummary {
  gradingRecordId: number
  createdAt: string
  studentName: string
  grade: number
  worksheetSource: string
  worksheetTitle: string
}

interface AdminGradingDetail {
  score: number
  correctCount: number
  totalCount: number
  wrongAnswers: { page: string; questionNumber: string; studentAnswer: string }[]
}

// ponytail: 관리자 목록 응답에 점수·오답이 없어 상세를 N+1 병렬 조회한다 — 해커톤 데이터 규모 전제, 목록 API에 점수가 실리면 제거
export async function getDeskGradings(): Promise<DeskGradingView[]> {
  if (!HAS_SERVER) return mockGradings()
  const { gradingRecords } = await request<{ gradingRecords: AdminGradingSummary[] }>(
    '/admin/grading-records',
  )
  const details = await Promise.all(
    gradingRecords.map((item) =>
      request<AdminGradingDetail>(`/admin/grading-records/${item.gradingRecordId}`),
    ),
  )
  return gradingRecords.map((item, index) => ({
    id: String(item.gradingRecordId),
    studentName: item.studentName,
    studentGrade: `${item.grade}학년`,
    date: toIsoDate(item.createdAt),
    examType: EXAM_TYPE_BY_SOURCE[item.worksheetSource] ?? '시험지',
    title: item.worksheetTitle,
    score: details[index].score,
    correctCount: details[index].correctCount,
    totalCount: details[index].totalCount,
    wrongAnswers: details[index].wrongAnswers.map((wrong) => ({
      page: wrong.page,
      number: wrong.questionNumber,
    })),
  }))
}
