import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iconBookActive from '@/assets/icon-book-active.svg'
import iconBook from '@/assets/icon-book.svg'
import iconChevronDown from '@/assets/icon-chevron-down.svg'
import iconExamActive from '@/assets/icon-exam-active.svg'
import iconExam from '@/assets/icon-exam.svg'
import Logo from '@/components/Logo'
import type { ExamType, GradingSetup } from '@/types'

const EXAM_TYPES: { type: ExamType; icon: string; activeIcon: string }[] = [
  { type: '시험지', icon: iconExam, activeIcon: iconExamActive },
  { type: '외부 교재', icon: iconBook, activeIcon: iconBookActive },
]
const BOOKS = ['쎈 2-1', '개념원리 2-1', 'RPM 2-1', '일품 2-1']

const fieldClass = 'relative flex flex-col justify-center gap-1 rounded-xl bg-gray-200 px-5 py-4'
const labelClass = 'text-xs font-medium text-gray-700'
const controlClass = 'bg-transparent text-base outline-none placeholder:text-gray-600'

export default function GradingSetupScreen() {
  const navigate = useNavigate()
  const [examType, setExamType] = useState<ExamType>('시험지')
  const [title, setTitle] = useState('')
  const [bookName, setBookName] = useState('')

  const canSubmit = title.trim() !== '' && (examType === '시험지' || bookName !== '')

  const submit = () => {
    const setup: GradingSetup = {
      examType,
      title: title.trim(),
      bookName: examType === '외부 교재' ? bookName : undefined,
    }
    // replace: 채점 완료 후 뒤로가기 시 설정 화면으로 재진입하지 않게 스택에서 제거
    navigate('/grading/camera', { state: setup, replace: true })
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-6 pt-14 pb-6">
      <div className="pointer-events-none absolute -top-[88px] -left-[115px] h-[426px] w-[459px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.9)_0%,rgba(255,255,255,0)_100%)] opacity-20" />

      <Logo />
      <h1 className="relative mt-[52px] text-2xl font-bold">문제 유형 선택</h1>

      <div className="relative mt-12 grid grid-cols-2 gap-[14px]">
        {EXAM_TYPES.map(({ type, icon, activeIcon }) => {
          const active = examType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setExamType(type)}
              className={`flex h-[117px] flex-col items-center justify-center gap-3 rounded-xl border-[3px] ${
                active ? 'border-primary-300 bg-[#EDFFFD]' : 'border-transparent bg-gray-200'
              }`}
            >
              <img src={active ? activeIcon : icon} alt="" className="h-[35px]" />
              <span
                className={`text-sm ${active ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}
              >
                {type}
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative mt-7 flex flex-col gap-4">
        {examType === '외부 교재' && (
          <label className={fieldClass}>
            <span className={labelClass}>교재</span>
            <select
              className={`${controlClass} appearance-none ${bookName === '' ? 'text-gray-600' : ''}`}
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            >
              <option value="" disabled>
                교재 선택
              </option>
              {BOOKS.map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
            <img
              src={iconChevronDown}
              alt=""
              className="pointer-events-none absolute top-1/2 right-4 w-4 -translate-y-1/2"
            />
          </label>
        )}

        <label className={fieldClass}>
          <span className={labelClass}>타이틀</span>
          <input
            className={controlClass}
            value={title}
            placeholder="타이틀 입력"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="relative mt-auto h-[60px] rounded-[10px] bg-primary-300 text-xl font-bold text-white disabled:bg-gray-400 disabled:text-gray-600"
      >
        확인
      </button>
    </main>
  )
}
