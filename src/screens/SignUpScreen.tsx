import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iconClear from '@/assets/icon-clear.svg'
import DropdownField from '@/components/DropdownField'
import Logo from '@/components/Logo'
import { saveUser } from '@/services/records'

const SCHOOLS = ['서울중학교', '한국중학교', '미래고등학교', '기타']
const GRADES = ['1학년', '2학년', '3학년']

const fieldClass = 'relative flex flex-col gap-1 rounded-xl bg-gray-200 px-5 py-4'
const labelClass = 'text-xs font-medium text-gray-700'
const controlClass = 'bg-transparent text-base outline-none placeholder:text-gray-600'

function ClearButton({ show, onClear, label }: { show: boolean; onClear: () => void; label: string }) {
  if (!show) return null
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={label}
      className="absolute top-1/2 right-4 -translate-y-1/2"
    >
      <img src={iconClear} alt="" className="size-5" />
    </button>
  )
}

export default function SignUpScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [studentId, setStudentId] = useState('')

  const canSubmit =
    [name.trim(), school, grade].every((v) => v !== '') && /^\d+$/.test(studentId.trim())

  const submit = () => {
    // 로그인 API 전 임시: 서버 학생 ID를 직접 입력받아 저장 (API 헤더에 사용)
    saveUser({ name: name.trim(), school, grade, studentId: studentId.trim() })
    navigate('/home', { replace: true })
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-6 pt-14 pb-8">
      {/* 디자인 엘립스: 좌상단, 문제 유형 선택 화면과 동일 스펙 */}
      <div className="pointer-events-none absolute -top-[88px] -left-[115px] h-[426px] w-[459px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.9)_0%,rgba(255,255,255,0)_100%)] opacity-20" />
      <Logo />
      <h1 className="mt-8 text-2xl font-bold">내 정보 입력</h1>

      <div className="mt-8 flex flex-col gap-4">
        <label className={fieldClass}>
          <span className={labelClass}>이름</span>
          <input
            className={controlClass}
            value={name}
            placeholder="이름 입력"
            onChange={(e) => setName(e.target.value)}
          />
          <ClearButton show={name !== ''} onClear={() => setName('')} label="이름 지우기" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <DropdownField
            label="학교"
            placeholder="학교 선택"
            value={school}
            options={SCHOOLS}
            onChange={setSchool}
          />
          <DropdownField
            label="학년"
            placeholder="학년 선택"
            value={grade}
            options={GRADES}
            onChange={setGrade}
          />
        </div>

        <label className={fieldClass}>
          <span className={labelClass}>학생 ID</span>
          <input
            className={controlClass}
            inputMode="numeric"
            value={studentId}
            placeholder="학생 ID 입력 (예: 1)"
            onChange={(e) => setStudentId(e.target.value)}
          />
          <ClearButton
            show={studentId !== ''}
            onClear={() => setStudentId('')}
            label="학생 ID 지우기"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="mt-auto h-[60px] rounded-[10px] bg-primary-300 text-xl font-bold text-white disabled:bg-gray-400 disabled:text-gray-600"
      >
        확인
      </button>
    </main>
  )
}
