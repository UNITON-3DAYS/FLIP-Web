import { Link, useNavigate } from 'react-router-dom'

import { loadRecords } from '@/services/records'

export default function ResultListScreen() {
  const navigate = useNavigate()
  const records = loadRecords() // 최신순 저장이 보장됨

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-12 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="self-start text-xl text-gray-700"
        aria-label="뒤로"
      >
        &lt;
      </button>
      <h1 className="mt-4 text-2xl font-bold">채점 내역</h1>

      {records.length === 0 ? (
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
                className="flex items-center justify-between rounded-xl bg-gray-200 px-5 py-4"
              >
                <div>
                  <p className="font-bold">{record.title}</p>
                  <p className="mt-1 text-xs text-gray-700">
                    {record.range} · {record.date.replaceAll('-', '.')}
                  </p>
                </div>
                <span className="text-lg font-black text-gray-1000">{record.score}점</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
