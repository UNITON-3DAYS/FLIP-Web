import type { ExamType, WrongAnswer } from '@/types'

// 디자이너 컨펌용 목 데이터 — 백엔드 연동 시 services 레이어로 교체
export interface DeskStudent {
  id: string
  name: string
  school: string
  grade: string
}

export interface DeskGrading {
  id: string
  studentId: string
  date: string
  examType: ExamType
  bookName?: string
  title: string
  range: string
  score: number
  correctCount: number
  totalCount: number
  wrongAnswers: WrongAnswer[]
}

export interface DeskAnswerSheet {
  id: string
  examType: ExamType
  title: string
  filled: boolean
}

export const STUDENTS: DeskStudent[] = [
  { id: 's1', name: '김민준', school: '한빛중학교', grade: '중2' },
  { id: 's2', name: '이서연', school: '미림중학교', grade: '중2' },
  { id: 's3', name: '박지호', school: '한빛중학교', grade: '중3' },
  { id: 's4', name: '최수아', school: '동산중학교', grade: '중1' },
]

export const GRADINGS: DeskGrading[] = [
  {
    id: 'g1',
    studentId: 's1',
    date: '2026-08-25',
    examType: '외부 교재',
    bookName: '쎈 2-1',
    title: '오답 점검 1회차',
    range: 'p.12 ~ p.18',
    score: 82,
    correctCount: 16,
    totalCount: 20,
    wrongAnswers: [
      { page: 1, number: 3 },
      { page: 2, number: 7 },
      { page: 3, number: 12 },
      { page: 4, number: 18 },
    ],
  },
  {
    id: 'g2',
    studentId: 's2',
    date: '2026-08-25',
    examType: '시험지',
    title: '1학기 중간 대비 모의',
    range: 'p.1 ~ p.4',
    score: 90,
    correctCount: 18,
    totalCount: 20,
    wrongAnswers: [
      { page: 2, number: 9 },
      { page: 3, number: 15 },
    ],
  },
  {
    id: 'g3',
    studentId: 's3',
    date: '2026-08-24',
    examType: '외부 교재',
    bookName: 'RPM 2-1',
    title: '단원 평가 대비',
    range: 'p.30 ~ p.35',
    score: 75,
    correctCount: 15,
    totalCount: 20,
    wrongAnswers: [
      { page: 1, number: 2 },
      { page: 2, number: 8 },
      { page: 3, number: 11 },
      { page: 4, number: 17 },
      { page: 5, number: 20 },
    ],
  },
  {
    id: 'g4',
    studentId: 's1',
    date: '2026-08-23',
    examType: '시험지',
    title: '쪽지시험 3회',
    range: 'p.1 ~ p.2',
    score: 60,
    correctCount: 6,
    totalCount: 10,
    wrongAnswers: [
      { page: 1, number: 2 },
      { page: 1, number: 5 },
      { page: 2, number: 8 },
      { page: 2, number: 9 },
    ],
  },
  {
    id: 'g5',
    studentId: 's4',
    date: '2026-08-22',
    examType: '외부 교재',
    bookName: '개념원리 2-1',
    title: '방학 숙제 검사',
    range: 'p.50 ~ p.55',
    score: 95,
    correctCount: 19,
    totalCount: 20,
    wrongAnswers: [{ page: 3, number: 14 }],
  },
  // s1 점수 추이 그래프 확인용 과거 기록
  {
    id: 'g6',
    studentId: 's1',
    date: '2026-08-20',
    examType: '시험지',
    title: '쪽지시험 2회',
    range: 'p.1 ~ p.2',
    score: 75,
    correctCount: 7,
    totalCount: 10,
    wrongAnswers: [
      { page: 1, number: 3 },
      { page: 2, number: 6 },
    ],
  },
  {
    id: 'g7',
    studentId: 's1',
    date: '2026-08-18',
    examType: '시험지',
    title: '쪽지시험 1회',
    range: 'p.1 ~ p.2',
    score: 70,
    correctCount: 7,
    totalCount: 10,
    wrongAnswers: [
      { page: 1, number: 4 },
      { page: 2, number: 7 },
      { page: 2, number: 10 },
    ],
  },
]

export const ANSWER_SHEETS: DeskAnswerSheet[] = [
  { id: 'a1', examType: '시험지', title: '1학기 중간 대비 모의', filled: true },
  { id: 'a2', examType: '외부 교재', title: '쎈 2-1 (12~18p)', filled: true },
  { id: 'a3', examType: '시험지', title: '쪽지시험 4회', filled: false },
]

export const studentById = (id?: string) => STUDENTS.find((student) => student.id === id)
