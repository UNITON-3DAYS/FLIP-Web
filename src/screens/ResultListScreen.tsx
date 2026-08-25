import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAsync } from '@/hooks/useAsync'
import { getGradings } from '@/services/api'

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="2.5" width="12" height="10.5" rx="2" stroke="#B0B3BA" strokeWidth="1.4" />
      <path d="M1 5.5H13" stroke="#B0B3BA" strokeWidth="1.4" />
      <path d="M4.5 1V3.5M9.5 1V3.5" stroke="#B0B3BA" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function ResultListScreen() {
  const navigate = useNavigate()
  const { data: records, loading, error } = useAsync(getGradings, [])
  const [endDate, setEndDate] = useState(new Date().toLocaleDateString('sv-SE'))

  // 와이어프레임 스펙: 선택일 기준 최근 일주일 범위 필터 (기본: 오늘)
  const end = new Date(`${endDate}T00:00:00`)
  const start = new Date(end)
  start.setDate(end.getDate() - 6)
  const startDate = start.toLocaleDateString('sv-SE')
  const filtered = records?.filter((r) => r.date >= startDate && r.date <= endDate) ?? null

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-200 px-5 pt-12 pb-8">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute left-0 text-xl text-gray-700"
          aria-label="뒤로"
        >
          &lt;
        </button>
        <h1 className="text-lg font-bold text-gray-800">채점 내역</h1>
      </div>

      {/* 날짜 필터 pill: 탭하면 OS 네이티브 날짜 피커 */}
      <label className="relative mt-10 inline-flex h-[29px] w-fit items-center gap-1.5 self-start rounded-full border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700">
        <CalendarIcon />
        {endDate.replaceAll('-', '.')}
        <input
          type="date"
          value={endDate}
          onChange={(e) => e.target.value && setEndDate(e.target.value)}
          className="absolute inset-0 opacity-0"
          aria-label="날짜 선택"
        />
      </label>

      {loading ? (
        <p className="mt-20 text-center text-sm text-gray-600">불러오는 중...</p>
      ) : error ? (
        <p className="mt-20 text-center text-sm text-gray-600">
          내역을 불러오지 못했어요.
          <br />
          {error}
        </p>
      ) : !filtered || filtered.length === 0 ? (
        <p className="mt-20 text-center text-sm text-gray-600">
          이 기간에는 채점 내역이 없어요.
          <br />
          날짜를 바꾸거나 첫 채점을 시작해보세요!
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {filtered.map((record) => (
            <li key={record.id}>
              <Link
                to={`/results/${record.id}`}
                className="flex items-center justify-between rounded-[10px] bg-white px-5 py-4"
              >
                <div>
                  <p className="text-lg font-bold text-gray-800">{record.title}</p>
                  <p className="font-bold text-gray-800">{record.range}</p>
                  <p className="mt-2 text-xs text-gray-600">{record.date.replaceAll('-', '.')}</p>
                </div>
                <span className="text-xl text-gray-800">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
