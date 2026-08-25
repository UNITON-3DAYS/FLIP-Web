import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ScoreDonut from '@/components/ScoreDonut'
import { getDeskGradings } from '@/desk/api'
import { loadComment, saveComment } from '@/desk/mock'
import { useAsync } from '@/hooks/useAsync'

function GradingResultPage() {
  const { recordId } = useParams()
  const { data: gradings, loading, error } = useAsync(getDeskGradings, [])
  const grading = gradings?.find((item) => item.id === recordId)
  const [comment, setComment] = useState(() => loadComment(recordId ?? ''))
  const [saved, setSaved] = useState(false)

  const submitComment = () => {
    saveComment(recordId ?? '', comment.trim())
    setComment(comment.trim())
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return <section className="text-sm text-gray-600">불러오는 중...</section>
  }

  if (error || !grading) {
    return (
      <section className="text-sm text-gray-600">
        {error ?? '채점 결과를 찾을 수 없어요.'}{' '}
        <Link to="/grading" className="font-bold text-primary-400">
          목록으로
        </Link>
      </section>
    )
  }

  return (
    <section>
      <Link
        to="/grading"
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
        채점 내역
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div className="rounded-[10px] bg-white p-6">
          <p className="text-sm text-gray-600">{grading.date.replaceAll('-', '.')}</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">{grading.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {grading.studentName} · {grading.studentGrade} · {grading.examType}
            {grading.bookName ? ` · ${grading.bookName}` : ''}
            {grading.range ? ` · ${grading.range}` : ''}
          </p>
          <div className="mt-6">
            <ScoreDonut
              score={grading.score}
              correctCount={grading.correctCount}
              totalCount={grading.totalCount}
              fractionOnly={grading.examType === '외부 교재'}
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            오답 <span className="text-secondary">{grading.wrongAnswers.length}</span>
          </h2>
          <div className="overflow-hidden rounded-[10px] bg-white">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-200 text-gray-800">
                  <th className="py-3 font-bold">페이지</th>
                  <th className="py-3 font-bold">문제 번호</th>
                </tr>
              </thead>
              <tbody>
                {grading.wrongAnswers.map((wrong, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-0">
                    <td className="py-4 font-bold text-gray-800">{wrong.page}p</td>
                    <td className="py-4">
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#FFDCE7] font-bold text-secondary">
                        {wrong.number}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[10px] bg-white p-6">
        <h2 className="text-sm font-bold text-gray-800">선생님 코멘트</h2>
        <p className="mt-1 text-xs text-gray-600">학부모 리포트에 함께 표시됩니다.</p>
        <textarea
          rows={3}
          maxLength={200}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="예: 연산 실수가 눈에 띄게 줄었어요. 도형 단원을 한 번 더 복습하면 좋겠습니다."
          className="mt-3 w-full resize-none rounded-[10px] border border-gray-300 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-primary-300"
        />
        <div className="mt-2 flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-gray-600">저장됐어요</span>}
          <button
            type="button"
            onClick={submitComment}
            className="rounded-full bg-primary-300 px-4 py-2 text-sm font-bold text-white"
          >
            코멘트 저장
          </button>
        </div>
      </div>
    </section>
  )
}

export default GradingResultPage
