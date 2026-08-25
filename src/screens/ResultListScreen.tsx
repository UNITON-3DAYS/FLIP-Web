import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import iconBack from '@/assets/icon-back.svg'
import iconCalendar from '@/assets/icon-calendar.svg'
import Calendar from '@/components/Calendar'
import { useAsync } from '@/hooks/useAsync'
import { getGradings } from '@/services/api'

export default function ResultListScreen() {
  const navigate = useNavigate()
  // 선택한 날짜의 하루치만 조회 (기본: 오늘). 날짜를 바꾸면 재조회한다.
  const [date, setDate] = useState(new Date().toLocaleDateString('sv-SE'))
  const { data: records, loading, error } = useAsync(() => getGradings(date), [date])
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-200 px-5 pt-12 pb-8">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute left-0"
          aria-label="뒤로"
        >
          <img src={iconBack} alt="" className="h-4" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">채점 내역</h1>
      </div>

      {/* 날짜 필터 pill: 탭하면 커스텀 달력 (OS별 편차 없이 동일한 UI) */}
      <div className="relative mt-10 self-start">
        <button
          type="button"
          onClick={() => setPickerOpen((open) => !open)}
          aria-label="날짜 선택"
          className="inline-flex h-[29px] items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700"
        >
          <img src={iconCalendar} alt="" className="h-3.5" />
          {date.replaceAll('-', '.')}
        </button>
        {pickerOpen && (
          <>
            <button
              type="button"
              aria-label="달력 닫기"
              onClick={() => setPickerOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute top-full left-0 z-20 mt-2 w-[350px] max-w-[85vw]">
              <Calendar
                value={date}
                onSelect={(selected) => {
                  setDate(selected)
                  setPickerOpen(false)
                }}
              />
            </div>
          </>
        )}
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
          이 날에는 채점 내역이 없어요.
          <br />
          날짜를 바꾸거나 첫 채점을 시작해보세요!
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {records.map((record) => (
            <li key={record.id}>
              <Link
                to={`/results/${record.id}`}
                className="flex items-center justify-between rounded-[10px] bg-white px-5 py-4"
              >
                <div>
                  <p className="text-lg font-bold text-gray-800">{record.title}</p>
                  {record.range && <p className="font-bold text-gray-800">{record.range}</p>}
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
