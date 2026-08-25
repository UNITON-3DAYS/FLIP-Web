import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ScoreDonut from '@/components/ScoreDonut'
import { useAsync } from '@/hooks/useAsync'
import { getGrading } from '@/services/api'

const formatKoreanDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

export default function ResultDetailScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  // 채점 직후 진입이면 히스토리에 내역 화면이 없으므로 replace로 이동해 핑퐁을 막는다
  const fromGrading = (location.state as { from?: string } | null)?.from === 'grading'
  const { data: record, loading, error } = useAsync(() => getGrading(id ?? ''), [id])

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-sm text-gray-600">불러오는 중...</p>
      </main>
    )
  }

  if (error || !record) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-sm text-gray-600">{error ?? '채점 결과를 찾을 수 없어요.'}</p>
        <Link to="/results" className="mt-4 font-bold text-primary-300">
          채점 내역으로
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-12 pb-8">
      <button
        type="button"
        onClick={() => (fromGrading ? navigate('/results', { replace: true }) : navigate(-1))}
        className="self-start text-xl text-gray-800"
        aria-label="뒤로"
      >
        &lt;
      </button>

      <p className="mt-8 text-lg text-gray-600">{formatKoreanDate(record.date)}</p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900">{record.title}</h1>

      <div className="mt-6">
        <ScoreDonut
          score={record.score}
          correctCount={record.correctCount}
          totalCount={record.totalCount}
        />
      </div>

      <h2 className="mt-8 text-lg font-bold text-gray-900">
        오답 <span className="text-secondary">{record.wrongAnswers.length}</span>
      </h2>
      {record.wrongAnswers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">오답이 없어요. 완벽해요!</p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-300 bg-white">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-gray-800">
                <th className="py-4 font-bold">페이지</th>
                <th className="py-4 font-bold">문제 번호</th>
              </tr>
            </thead>
            <tbody>
              {record.wrongAnswers.map((wrong, index) => (
                <tr key={index} className="border-b border-gray-300 last:border-0">
                  <td className="py-5 font-bold text-gray-800">{wrong.page}p</td>
                  <td className="py-5">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#FFDCE7] font-bold text-secondary">
                      {wrong.number}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
