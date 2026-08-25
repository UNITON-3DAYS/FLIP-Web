import { useState } from 'react'

import Calendar from '@/components/Calendar'
import ViewChip from '@/components/ViewChip'
import { GRADINGS, studentById } from '@/desk/mock'

function GradingLogPage() {
  const [query, setQuery] = useState('')
  const [date, setDate] = useState<string | null>(null) // null = 전체 기간
  const [pickerOpen, setPickerOpen] = useState(false)

  const rows = GRADINGS.map((grading) => ({
    ...grading,
    student: studentById(grading.studentId),
  })).filter(
    (row) =>
      (!date || row.date === date) &&
      (row.title.includes(query.trim()) || (row.student?.name ?? '').includes(query.trim())),
  )

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">채점 내역</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              aria-label="날짜 선택"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700"
            >
              {date ? date.replaceAll('-', '.') : '전체 기간'}
              {date && (
                <span
                  role="button"
                  aria-label="날짜 필터 해제"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDate(null)
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </span>
              )}
            </button>
            {pickerOpen && (
              <>
                <button
                  type="button"
                  aria-label="달력 닫기"
                  onClick={() => setPickerOpen(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute top-full right-0 z-20 mt-2 w-[330px]">
                  <Calendar
                    value={date ?? new Date().toLocaleDateString('sv-SE')}
                    onSelect={(selected) => {
                      setDate(selected)
                      setPickerOpen(false)
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·타이틀 검색"
            className="h-9 w-56 rounded-full border border-gray-300 bg-white px-4 text-sm outline-none placeholder:text-gray-600 focus:border-primary-300"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-6 py-3 font-medium">날짜</th>
              <th className="px-6 py-3 font-medium">이름</th>
              <th className="px-6 py-3 font-medium">학년</th>
              <th className="px-6 py-3 font-medium">문제지 유형</th>
              <th className="px-6 py-3 font-medium">타이틀</th>
              <th className="px-6 py-3 text-right font-medium">상세 채점 결과</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-600">
                  검색 결과가 없어요.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-gray-700">{row.date.replaceAll('-', '.')}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{row.student?.name}</td>
                  <td className="px-6 py-4 text-gray-700">{row.student?.grade}</td>
                  <td className="px-6 py-4 text-gray-700">{row.examType}</td>
                  <td className="px-6 py-4 text-gray-700">{row.title}</td>
                  <td className="px-6 py-4 text-right">
                    <ViewChip to={`/grading/${row.id}`} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default GradingLogPage
