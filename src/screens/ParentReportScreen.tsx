import { useParams } from 'react-router-dom'

import Logo from '@/components/Logo'
import ScoreTrendChart from '@/components/ScoreTrendChart'
import { getDeskGradings, getDeskStudent } from '@/desk/api'
// 코멘트는 BE 미구현이라 localStorage 목 — API가 생기면 교체
import { loadComment } from '@/desk/mock'
import { useAsync } from '@/hooks/useAsync'

// 학부모 공유용 읽기 전용 리포트 — 로그인 없이 링크로 열람
export default function ParentReportScreen() {
  const { studentId } = useParams()
  const { data, loading, error } = useAsync(
    () => Promise.all([getDeskStudent(studentId ?? ''), getDeskGradings()]),
    [studentId],
  )
  const student = data?.[0]
  // 관리자 목록에 studentId가 없어 이름으로 매칭한다 (동명이인 미고려 — BE 필드 추가 시 교체)
  const gradings = (data?.[1] ?? [])
    .filter((grading) => grading.studentName === student?.name)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <Logo />
        <p className="mt-6 text-sm text-gray-600">리포트를 불러오는 중...</p>
      </main>
    )
  }

  if (error || !student || gradings.length === 0) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <Logo />
        <p className="mt-6 text-sm text-gray-600">{error ?? '리포트를 찾을 수 없어요.'}</p>
      </main>
    )
  }

  const average = Math.round(gradings.reduce((sum, g) => sum + g.score, 0) / gradings.length)
  // 평균 오답: 소수 1자리 (정수로 떨어지면 그대로)
  const wrongAverage =
    Math.round((gradings.reduce((sum, g) => sum + g.wrongAnswers.length, 0) / gradings.length) * 10) /
    10
  // 점수 추이는 시험지 채점만, 시간순 최근 5회 (팀 결정)
  const examGradings = gradings
    .filter((grading) => grading.examType === '시험지')
    .sort((a, b) => a.date.localeCompare(b.date) || Number(a.id) - Number(b.id))
    .slice(-5)
  const period = `${gradings[gradings.length - 1].date.replaceAll('-', '.')} ~ ${gradings[0].date.replaceAll('-', '.')}`

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-100 px-5 pt-12 pb-10">
      <Logo className="text-2xl" />
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">{student.name} 학습 리포트</h1>
      <p className="mt-1 text-sm font-medium text-gray-700">
        {[student.school, student.grade, period].filter(Boolean).join(' · ')}
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
          <p className="text-xs font-medium text-gray-700">평균 오답 수</p>
          <p className="mt-1 text-2xl font-semibold text-secondary">{wrongAverage}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] bg-white p-5">
        <h2 className="text-base font-semibold text-gray-1000">점수 추이</h2>
        {examGradings.length === 0 ? (
          <p className="mt-4 text-sm font-medium text-gray-700">아직 시험지 채점 기록이 없어요.</p>
        ) : (
          <div className="mt-2">
            <ScoreTrendChart
              points={examGradings.map((g) => ({ label: g.title, score: g.score }))}
            />
          </div>
        )}
      </div>

      <h2 className="mt-6 mb-3 text-base font-semibold text-gray-1000">최근 채점</h2>
      <ul className="flex flex-col gap-3">
        {gradings.slice(0, 10).map((grading) => {
          const comment = loadComment(grading.id)
          return (
            <li key={grading.id} className="rounded-[10px] bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{grading.title}</p>
                  <p className="mt-1 text-xs font-medium text-gray-700">
                    {grading.date.replaceAll('-', '.')} · {grading.examType} · 오답{' '}
                    {grading.wrongAnswers.length}개
                  </p>
                </div>
                <span className="text-lg font-semibold text-primary-300">
                  {grading.examType === '외부 교재'
                    ? `${grading.correctCount}/${grading.totalCount}`
                    : `${grading.score}점`}
                </span>
              </div>
              {comment !== '' && (
                <div className="mt-3 rounded-[10px] bg-primary-50 p-3">
                  <p className="text-xs font-semibold text-primary-400">선생님 코멘트</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{comment}</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-10 text-center text-xs text-gray-600">
        본 리포트는 채킷(Checkit)이 채점 데이터를 바탕으로 자동 생성했습니다.
      </p>
    </main>
  )
}
