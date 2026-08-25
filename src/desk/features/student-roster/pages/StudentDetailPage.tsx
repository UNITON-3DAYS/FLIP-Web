import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ScoreTrendChart from '@/components/ScoreTrendChart'
import ViewChip from '@/components/ViewChip'
import { getDeskGradings, getDeskStudent } from '@/desk/api'
import { useAsync } from '@/hooks/useAsync'

function StudentDetailPage() {
  const { studentId } = useParams()
  const { data, loading, error } = useAsync(
    () => Promise.all([getDeskStudent(studentId ?? ''), getDeskGradings()]),
    [studentId],
  )
  const student = data?.[0]
  // 관리자 목록에 studentId가 없어 이름으로 매칭한다 (동명이인 미고려 — BE 필드 추가 시 교체)
  const gradings = (data?.[1] ?? []).filter((grading) => grading.studentName === student?.name)
  // 점수 추이는 시험지 채점만, 시간순 최근 5회 (팀 결정)
  const examGradings = gradings
    .filter((grading) => grading.examType === '시험지')
    .sort((a, b) => a.date.localeCompare(b.date) || Number(a.id) - Number(b.id))
    .slice(-5)
  const [copied, setCopied] = useState(false)

  const shareReport = async () => {
    const url = `${window.location.origin}/report/${studentId}`
    if (navigator.share) {
      await navigator.share({ title: '채킷 학습 리포트', url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <section className="text-sm text-gray-600">불러오는 중...</section>
  }

  if (error || !student) {
    return (
      <section className="text-sm text-gray-600">
        {error ?? '학생을 찾을 수 없어요.'}{' '}
        <Link to="/students" className="font-bold text-primary-400">
          목록으로
        </Link>
      </section>
    )
  }

  const average =
    gradings.length === 0
      ? null
      : Math.round(gradings.reduce((sum, g) => sum + g.score, 0) / gradings.length)

  return (
    <section>
      <div className="flex items-center justify-between">
        <Link
          to="/students"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600"
        >
          <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 3.5 5.5 8l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          학생 정보 관리
        </Link>
        <button
          type="button"
          onClick={() => void shareReport()}
          className="rounded-full bg-primary-300 px-4 py-2 text-sm font-bold text-white"
        >
          {copied ? '링크 복사됨' : '학부모 리포트 공유'}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-[10px] bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-400">
              {student.name[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{student.name}</p>
              <p className="text-sm text-gray-600">
                {[student.school, student.grade].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          {average !== null && (
            <div className="mt-6 rounded-[10px] bg-gray-100 p-4">
              <p className="text-xs text-gray-600">평균 점수</p>
              <p className="mt-1 text-2xl font-black text-primary-300">{average}점</p>
            </div>
          )}
        </div>

        <div className="col-span-2 rounded-[10px] bg-white p-6">
          <h2 className="text-sm font-bold text-gray-800">점수 추이</h2>
          {examGradings.length === 0 ? (
            <p className="mt-6 text-sm text-gray-600">아직 시험지 채점 기록이 없어요.</p>
          ) : (
            <div className="mt-2">
              <ScoreTrendChart
                points={examGradings.map((g) => ({ label: g.title, score: g.score }))}
              />
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-6 mb-3 text-sm font-bold text-gray-800">채점 기록</h2>
      {gradings.length === 0 ? (
        <p className="rounded-[10px] bg-white p-6 text-sm text-gray-600">
          아직 채점 기록이 없어요.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[10px] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="px-6 py-3 font-medium">날짜</th>
                <th className="px-6 py-3 font-medium">문제지 유형</th>
                <th className="px-6 py-3 font-medium">타이틀</th>
                <th className="px-6 py-3 font-medium">점수</th>
                <th className="px-6 py-3 text-right font-medium">상세</th>
              </tr>
            </thead>
            <tbody>
              {gradings.map((grading) => (
                <tr key={grading.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-700">{grading.date.replaceAll('-', '.')}</td>
                  <td className="px-6 py-4 text-gray-700">{grading.examType}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{grading.title}</td>
                  <td className="px-6 py-4 font-bold text-primary-400">
                    {grading.examType === '외부 교재'
                      ? `${grading.correctCount}/${grading.totalCount}`
                      : `${grading.score}점`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ViewChip to={`/grading/${grading.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default StudentDetailPage
