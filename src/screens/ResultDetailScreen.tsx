import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAsync } from '@/hooks/useAsync'
import { getGrading } from '@/services/api'

export default function ResultDetailScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  // 채점 직후 진입이면 히스토리에 내역 화면이 없으므로 replace로 이동해 핑퐁을 막는다
  const fromGrading = (location.state as { from?: string } | null)?.from === 'grading'
  const { data: record, loading, error } = useAsync(() => getGrading(id ?? ''), [id])

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-gray-100 px-6 text-center">
        <p className="text-sm text-gray-600">불러오는 중...</p>
      </main>
    )
  }

  if (error || !record) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-gray-100 px-6 text-center">
        <p className="text-sm text-gray-600">{error ?? '채점 결과를 찾을 수 없어요.'}</p>
        <Link to="/results" className="mt-4 font-bold text-primary-300">
          채점 내역으로
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-100 px-6 pt-12 pb-8">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => (fromGrading ? navigate('/results', { replace: true }) : navigate(-1))}
          className="absolute left-0 text-xl text-gray-700"
          aria-label="뒤로"
        >
          &lt;
        </button>
        <h1 className="text-lg font-bold">채점 결과</h1>
      </div>

      <div className="mt-6 rounded-[10px] bg-white p-5 shadow-sm">
        <p className="text-lg font-bold">{record.title}</p>
        <p className="mt-1 text-xs text-gray-600">
          {record.examType}
          {record.bookName ? ` · ${record.bookName}` : ''} · {record.range} ·{' '}
          {record.date.replaceAll('-', '.')}
        </p>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-5xl font-black text-primary-300">{record.score}점</span>
          <span className="pb-1 text-lg font-bold text-gray-700">
            {record.correctCount}/{record.totalCount}
          </span>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-bold text-gray-800">오답</h2>
      {record.wrongAnswers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">오답이 없어요. 완벽해요!</p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-[10px] bg-white shadow-sm">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="border-b border-gray-300 font-bold text-gray-700">
                <th className="py-3">페이지</th>
                <th className="py-3">번호</th>
              </tr>
            </thead>
            <tbody>
              {record.wrongAnswers.map((wrong, index) => (
                <tr key={index} className="border-b border-gray-300 last:border-0">
                  <td className="py-3">{wrong.page}p</td>
                  <td className="py-3 font-bold text-secondary">{wrong.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
