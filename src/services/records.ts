import type { GradingRecord, GradingSetup, User } from '@/types'

// ponytail: 백엔드 미정이라 localStorage + 목 채점. API 붙으면 이 파일만 교체.
const RECORDS_KEY = 'checkit_records'
const USER_KEY = 'checkit_user'

// 데모 시 '오늘' 목록이 비어 보이지 않게 시드 날짜는 실행일 기준 상대값으로 만든다
const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toLocaleDateString('sv-SE')
}

const SEED: GradingRecord[] = [
  {
    id: 'seed-1',
    examType: '외부 교재',
    title: '쎈 2-1 오답 점검',
    bookName: '쎈 2-1',
    range: 'p.12 ~ p.18',
    date: daysAgo(0),
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
    id: 'seed-2',
    examType: '시험지',
    title: '1학기 중간 대비 모의',
    range: 'p.1 ~ p.4',
    date: daysAgo(4),
    score: 90,
    correctCount: 18,
    totalCount: 20,
    wrongAnswers: [
      { page: 2, number: 9 },
      { page: 3, number: 15 },
    ],
  },
]

export function loadRecords(): GradingRecord[] {
  const raw = localStorage.getItem(RECORDS_KEY)
  if (!raw) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(SEED))
    return SEED
  }
  return JSON.parse(raw) as GradingRecord[]
}

export function findRecord(id: string): GradingRecord | undefined {
  return loadRecords().find((record) => record.id === id)
}

// 목 채점: 촬영한 페이지 수를 기반으로 그럴듯한 결과를 생성한다
export function gradeAndSave(setup: GradingSetup, pageCount: number): GradingRecord {
  const totalCount = pageCount * 5
  const wrongCount = Math.min(totalCount, Math.floor(Math.random() * (pageCount + 2)) + 1)
  const wrongAnswers = Array.from({ length: wrongCount }, () => ({
    page: Math.floor(Math.random() * pageCount) + 1,
    number: Math.floor(Math.random() * 20) + 1,
  })).sort((a, b) => a.page - b.page || a.number - b.number)

  const correctCount = totalCount - wrongCount
  const record: GradingRecord = {
    id: crypto.randomUUID(),
    examType: setup.examType,
    title: setup.title,
    bookName: setup.bookName,
    range: `p.1 ~ p.${pageCount}`, // 실제로는 촬영 이미지에서 자동 추출
    date: new Date().toLocaleDateString('sv-SE'), // 로컬(KST) 기준 YYYY-MM-DD
    score: Math.round((correctCount / totalCount) * 100),
    correctCount,
    totalCount,
    wrongAnswers,
  }
  localStorage.setItem(RECORDS_KEY, JSON.stringify([record, ...loadRecords()]))
  return record
}

export function loadUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
