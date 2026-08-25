import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iconClear from '@/assets/icon-clear.svg'
import DropdownField from '@/components/DropdownField'
import Logo from '@/components/Logo'
import { useAsync } from '@/hooks/useAsync'
import { getSchools } from '@/services/api'
import { saveUser } from '@/services/records'

const GRADES = ['1학년', '2학년', '3학년']

const fieldClass = 'relative flex flex-col gap-1 rounded-xl bg-gray-200 px-5 py-[18px]'
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
  const [retry, setRetry] = useState(0)
  const { data: schools, loading: schoolsLoading, error: schoolsError } = useAsync(
    getSchools,
    [retry],
  )
  const schoolNames = (schools ?? []).map((item) => item.name)

  const canSubmit =
    [name.trim(), school, grade].every((v) => v !== '') && /^\d+$/.test(studentId.trim())

  const submit = () => {
    // 로그인 API 전 임시: 서버 학생 ID를 직접 입력받아 저장 (API 헤더에 사용)
    saveUser({ name: name.trim(), school, grade, studentId: studentId.trim() })
    navigate('/home', { replace: true })
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-6 pt-[calc(env(safe-area-inset-top)+56px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      {/* 디자인 엘립스: 좌상단, 문제 유형 선택 화면과 동일 스펙 */}
      <div className="pointer-events-none absolute -top-[88px] -left-[115px] h-[426px] w-[459px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.9)_0%,rgba(255,255,255,0)_100%)] opacity-20" />
      <Logo />
      <h1 className="mt-[22px] text-2xl font-bold text-gray-800">내 정보 입력</h1>

      <div className="mt-[54px] flex flex-col gap-[18px]">
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

        <div>
          <div className="grid grid-cols-2 gap-3">
            <DropdownField
              label="학교"
              placeholder={schoolsLoading ? '불러오는 중...' : '학교 선택'}
              value={school}
              options={schoolNames}
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
          {schoolsError ? (
            <p className="mt-2 px-1 text-sm text-gray-600">
              학교 목록을 불러오지 못했어요.{' '}
              <button
                type="button"
                onClick={() => setRetry((count) => count + 1)}
                className="font-semibold text-primary-300"
              >
                다시 시도
              </button>
            </p>
          ) : !schoolsLoading && schoolNames.length === 0 ? (
            <p className="mt-2 px-1 text-sm text-gray-600">선택할 수 있는 학교가 없어요.</p>
          ) : null}
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
