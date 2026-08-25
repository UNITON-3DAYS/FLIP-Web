import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iconBookActive from '@/assets/icon-book-active.svg'
import iconBook from '@/assets/icon-book.svg'
import iconExamActive from '@/assets/icon-exam-active.svg'
import iconExam from '@/assets/icon-exam.svg'
import DropdownField from '@/components/DropdownField'
import Logo from '@/components/Logo'
import type { ExamType, GradingSetup } from '@/types'

const EXAM_TYPES: { type: ExamType; icon: string; activeIcon: string }[] = [
  { type: '시험지', icon: iconExam, activeIcon: iconExamActive },
  { type: '외부 교재', icon: iconBook, activeIcon: iconBookActive },
]
// 디자인: 타이틀은 목록에서 선택 (자유 입력 없음)
const TITLES = ['쎈 2-1', '개념원리 2-1', 'RPM 2-1', '일품 2-1', '중간 대비 모의']

export default function GradingSetupScreen() {
  const navigate = useNavigate()
  // 디자인(문제유형입력1): 초기에는 아무 유형도 선택되지 않은 상태
  const [examType, setExamType] = useState<ExamType | null>(null)
  const [title, setTitle] = useState('')

  const canSubmit = examType !== null && title !== ''

  const submit = () => {
    if (examType === null) return
    const setup: GradingSetup = { examType, title }
    // replace: 채점 완료 후 뒤로가기 시 설정 화면으로 재진입하지 않게 스택에서 제거
    navigate('/grading/camera', { state: setup, replace: true })
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-6 pt-[calc(env(safe-area-inset-top)+56px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div className="pointer-events-none absolute -top-[88px] -left-[115px] h-[426px] w-[459px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.9)_0%,rgba(255,255,255,0)_100%)] opacity-20" />

      <Logo />
      <h1 className="relative mt-[32px] text-2xl font-bold text-gray-800">문제 유형 선택</h1>

      <div className="relative mt-[26px] -mx-1 grid grid-cols-2 gap-[14px]">
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

      <div className="relative -mx-1 mt-[26px]">
        <DropdownField
          label="타이틀"
          placeholder="타이틀 선택"
          value={title}
          options={TITLES}
          onChange={setTitle}
        />
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
