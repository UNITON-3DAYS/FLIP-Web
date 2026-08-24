export type ExamType = '시험지' | '외부 교재'

export interface User {
  name: string
  grade: string
}

export interface GradingSetup {
  examType: ExamType
  title: string
  bookName?: string
}

export interface WrongAnswer {
  page: number
  number: number
}

export interface GradingRecord {
  id: string
  examType: ExamType
  title: string
  bookName?: string
  range: string
  date: string
  score: number
  correctCount: number
  totalCount: number
  wrongAnswers: WrongAnswer[]
}
