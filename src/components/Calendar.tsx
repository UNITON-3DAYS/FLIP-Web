import { useState } from 'react'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const toDateString = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

interface CalendarProps {
  value: string // YYYY-MM-DD
  onSelect: (date: string) => void
}

// 날짜 피커 디자인(iOS 달력 참조 + 민트 포인트)의 커스텀 구현 — OS별 편차 없이 동일하게 보이도록
export default function Calendar({ value, onSelect }: CalendarProps) {
  const selected = new Date(`${value}T00:00:00`)
  const [viewYear, setViewYear] = useState(selected.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected.getMonth())

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const moveMonth = (delta: number) => {
    const moved = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(moved.getFullYear())
    setViewMonth(moved.getMonth())
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between px-1">
        <p className="font-bold text-gray-900">
          {viewYear}년 {viewMonth + 1}월
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            aria-label="이전 달"
            className="text-lg font-bold text-primary-300"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            aria-label="다음 달"
            className="text-lg font-bold text-primary-300"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-xs text-gray-600">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {cells.map((day, index) =>
          day === null ? (
            <span key={`empty-${index}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(toDateString(viewYear, viewMonth, day))}
              className={`mx-auto flex size-9 items-center justify-center rounded-full text-sm ${
                value === toDateString(viewYear, viewMonth, day)
                  ? 'bg-[#D4F7F4] font-bold text-primary-400'
                  : 'text-gray-900'
              }`}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
