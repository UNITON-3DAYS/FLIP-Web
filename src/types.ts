export type ExamType = '시험지' | '외부 교재'

export interface User {
  name: string
  school: string
  grade: string
  studentId: string // 서버 학생 ID (로그인 API 전 임시: 가입 화면에서 직접 입력)
}

export interface GradingSetup {
  examType: ExamType
  title: string
  bookName?: string
}

export interface WrongAnswer {
  page?: number // 실서버 상세 응답에는 페이지 정보가 없음
  number: number
}

// 목록 조회 응답에는 점수·오답 정보가 없어 카드 표시용 요약만 둔다
export interface GradingSummary {
  id: string
  title: string
  range?: string
  date: string
}

export interface GradingRecord extends GradingSummary {
  examType?: ExamType
  bookName?: string
  score: number
  correctCount: number
  totalCount: number
  wrongAnswers: WrongAnswer[]
}
