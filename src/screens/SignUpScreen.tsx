import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@/components/Logo'
import { saveUser } from '@/services/records'

const SCHOOLS = ['서울중학교', '한국중학교', '미래고등학교', '기타']
const GRADES = ['중1', '중2', '중3', '고1', '고2', '고3']

const fieldClass = 'flex flex-col gap-1 rounded-[10px] bg-gray-100 px-4 py-3'
const labelClass = 'text-xs font-medium text-gray-700'
const controlClass = 'bg-transparent text-base outline-none placeholder:text-gray-600'

export default function SignUpScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [password, setPassword] = useState('')

  const canSubmit = [name.trim(), school, grade, password.trim()].every((v) => v !== '')

  const submit = () => {
    saveUser({ name: name.trim(), school, grade }) // 프로토: 비밀번호는 저장하지 않음
    navigate('/home', { replace: true })
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-6 pt-14 pb-8">
      <div className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-[radial-gradient(circle,rgba(153,236,231,0.54)_0%,rgba(255,255,255,0)_100%)]" />
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
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={fieldClass}>
            <span className={labelClass}>학교</span>
            <select
              className={controlClass}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            >
              <option value="" disabled>
                학교 선택
              </option>
              {SCHOOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>학년</span>
            <select
              className={controlClass}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="" disabled>
                학년 선택
              </option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={fieldClass}>
          <span className={labelClass}>비밀번호</span>
          <input
            className={controlClass}
            type="password"
            value={password}
            placeholder="비밀번호 입력"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="mt-auto rounded-xl bg-primary-300 py-4 text-lg font-bold text-white disabled:bg-gray-400 disabled:text-gray-600"
      >
        확인
      </button>
    </main>
  )
}
