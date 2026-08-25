import { useParams } from 'react-router-dom'

import Logo from '@/components/Logo'
import ScoreTrendChart from '@/components/ScoreTrendChart'
// BE 미구현: 대시보드와 같은 목 데이터 사용. 리포트 조회 API가 생기면 교체.
import { GRADINGS, studentById } from '@/desk/mock'

// 학부모 공유용 읽기 전용 리포트 — 로그인 없이 링크로 열람
export default function ParentReportScreen() {
  const { studentId } = useParams()
  const student = studentById(studentId)
  const gradings = GRADINGS.filter((grading) => grading.studentId === studentId).sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  if (!student || gradings.length === 0) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <Logo />
        <p className="mt-6 text-sm text-gray-600">리포트를 찾을 수 없어요.</p>
      </main>
    )
  }

  const average = Math.round(gradings.reduce((sum, g) => sum + g.score, 0) / gradings.length)
  const wrongTotal = gradings.reduce((sum, g) => sum + g.wrongAnswers.length, 0)
  const period = `${gradings[gradings.length - 1].date.replaceAll('-', '.')} ~ ${gradings[0].date.replaceAll('-', '.')}`

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-100 px-5 pt-12 pb-10">
      <Logo className="text-2xl" />
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">{student.name} 학습 리포트</h1>
      <p className="mt-1 text-sm font-medium text-gray-700">
        {student.school} · {student.grade} · {period}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-[10px] bg-white p-4 text-center">
          <p className="text-xs font-medium text-gray-700">채점 횟수</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{gradings.length}회</p>
        </div>
        <div className="rounded-[10px] bg-white p-4 text-center">
          <p className="text-xs font-medium text-gray-700">평균 점수</p>
          <p className="mt-1 text-2xl font-semibold text-primary-300">{average}점</p>
        </div>
        <div className="rounded-[10px] bg-white p-4 text-center">
          <p className="text-xs font-medium text-gray-700">오답 수</p>
          <p className="mt-1 text-2xl font-semibold text-secondary">{wrongTotal}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] bg-white p-5">
        <h2 className="text-base font-semibold text-gray-1000">점수 추이</h2>
        <div className="mt-2">
          <ScoreTrendChart points={gradings.map((g) => ({ date: g.date, score: g.score }))} />
        </div>
      </div>

      <h2 className="mt-6 mb-3 text-base font-semibold text-gray-1000">최근 채점</h2>
      <ul className="flex flex-col gap-3">
        {gradings.map((grading) => (
          <li
            key={grading.id}
            className="flex items-center justify-between rounded-[10px] bg-white px-5 py-4"
          >
            <div>
              <p className="font-semibold text-gray-900">{grading.title}</p>
              <p className="mt-1 text-xs font-medium text-gray-700">
                {grading.date.replaceAll('-', '.')} · {grading.examType} · 오답{' '}
                {grading.wrongAnswers.length}개
              </p>
            </div>
            <span className="text-lg font-semibold text-primary-300">{grading.score}점</span>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-xs text-gray-600">
        본 리포트는 채킷(Checkit)이 채점 데이터를 바탕으로 자동 생성했습니다.
      </p>
    </main>
  )
}
