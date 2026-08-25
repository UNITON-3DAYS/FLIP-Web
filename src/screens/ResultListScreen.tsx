import { Link, useNavigate } from 'react-router-dom'

import { useAsync } from '@/hooks/useAsync'
import { getGradings } from '@/services/api'

export default function ResultListScreen() {
  const navigate = useNavigate()
  const { data: records, loading, error } = useAsync(getGradings, [])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-12 pb-8">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute left-0 text-xl text-gray-700"
          aria-label="뒤로"
        >
          &lt;
        </button>
        <h1 className="text-lg font-bold">채점 내역</h1>
      </div>

      {loading ? (
        <p className="mt-20 text-center text-sm text-gray-600">불러오는 중...</p>
      ) : error ? (
        <p className="mt-20 text-center text-sm text-gray-600">
          내역을 불러오지 못했어요.
          <br />
          {error}
        </p>
      ) : !records || records.length === 0 ? (
        <p className="mt-20 text-center text-sm text-gray-600">
          아직 채점 내역이 없어요.
          <br />첫 채점을 시작해보세요!
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {records.map((record) => (
            <li key={record.id}>
              <Link
                to={`/results/${record.id}`}
                className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <div>
                  <p className="text-lg font-bold">{record.title}</p>
                  <p className="mt-0.5 text-sm text-gray-800">{record.range}</p>
                  <p className="mt-1 text-xs text-gray-600">{record.date.replaceAll('-', '.')}</p>
                </div>
                <span className="text-lg text-gray-500">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
