import { Link, useNavigate, useParams } from 'react-router-dom'

import { findRecord } from '@/services/records'

export default function ResultDetailScreen() {
  const navigate = useNavigate()
  const { id } = useParams()
  const record = id ? findRecord(id) : undefined

  if (!record) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-sm text-gray-600">채점 결과를 찾을 수 없어요.</p>
        <Link to="/results" className="mt-4 font-bold text-gray-1000">
          채점 내역으로
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-12 pb-8">
      <button
        type="button"
        onClick={() => navigate('/results')}
        className="self-start text-xl text-gray-700"
        aria-label="뒤로"
      >
        &lt;
      </button>

      <h1 className="mt-4 text-2xl font-bold">{record.title}</h1>
      <p className="mt-1 text-xs text-gray-700">
        {record.examType}
        {record.bookName ? ` · ${record.bookName}` : ''} · {record.range} ·{' '}
        {record.date.replaceAll('-', '.')}
      </p>

      <div className="mt-8 flex items-end gap-3">
        <span className="text-5xl font-black text-gray-1000">{record.score}점</span>
        <span className="pb-1 text-lg font-bold text-gray-700">
          {record.correctCount}/{record.totalCount}
        </span>
      </div>

      <h2 className="mt-10 text-sm font-bold text-gray-800">오답</h2>
      {record.wrongAnswers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">오답이 없어요. 완벽해요!</p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-xl bg-gray-200">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="border-b border-gray-400 font-bold text-gray-700">
                <th className="py-3">페이지</th>
                <th className="py-3">번호</th>
              </tr>
            </thead>
            <tbody>
              {record.wrongAnswers.map((wrong, index) => (
                <tr key={index} className="border-b border-gray-400 last:border-0">
                  <td className="py-3">{wrong.page}p</td>
                  <td className="py-3 font-bold">{wrong.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
