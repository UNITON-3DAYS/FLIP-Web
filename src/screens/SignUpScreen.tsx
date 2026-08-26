import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iconClear from '@/assets/icon-clear.svg'
import Logo from '@/components/Logo'
import { getStudentProfile } from '@/services/api'
import { saveUser } from '@/services/records'

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
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 로그인 API 전 임시: 비밀번호 자리에 서버 학생 ID(숫자)를 입력받는다
  const canSubmit = name.trim() !== '' && /^\d+$/.test(password.trim()) && !submitting

  // 프로필 조회(파싱)까지 끝난 뒤 홈으로 — 홈 칩이 즉시 뜨고, 없는 학생이면 여기서 걸러진다
  const submit = async () => {
    setSubmitting(true)
    setError(null)
    saveUser({ name: name.trim(), studentId: password.trim() })
    try {
      await getStudentProfile()
      navigate('/home', { replace: true })
    } catch {
      setError('학생 정보를 찾을 수 없어요. 비밀번호를 확인해주세요.')
      setSubmitting(false)
    }
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

        <label className={fieldClass}>
          <span className={labelClass}>비밀번호</span>
          <input
            className={controlClass}
            type="password"
            inputMode="numeric"
            value={password}
            placeholder="비밀번호 입력"
            onChange={(e) => setPassword(e.target.value)}
          />
          <ClearButton
            show={password !== ''}
            onClear={() => setPassword('')}
            label="비밀번호 지우기"
          />
        </label>
      </div>

      {error && <p className="mt-6 text-center text-sm text-secondary">{error}</p>}
      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => void submit()}
        className="mt-auto h-[60px] rounded-[10px] bg-primary-300 text-xl font-bold text-white disabled:bg-gray-400 disabled:text-gray-600"
      >
        {submitting ? '확인 중...' : '확인'}
      </button>
    </main>
  )
}
