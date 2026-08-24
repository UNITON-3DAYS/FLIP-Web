import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { saveUser } from '@/services/records'

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-yellow-400'

export default function SignUpScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [password, setPassword] = useState('')

  const canSubmit = name.trim() !== '' && grade.trim() !== '' && password.trim() !== ''

  const submit = () => {
    saveUser({ name: name.trim(), grade: grade.trim() }) // 프로토: 비밀번호는 저장하지 않음
    navigate('/home', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-16 pb-8">
      <h1 className="text-2xl font-bold">회원 정보 입력</h1>

      <div className="mt-10 flex flex-col gap-6">
        <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-700">
          이름
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-700">
          학년
          <input
            className={inputClass}
            value={grade}
            placeholder="예) 중2"
            onChange={(e) => setGrade(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-700">
          비밀번호
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="mt-auto rounded-xl bg-yellow-400 py-4 text-base font-bold text-zinc-900 disabled:bg-zinc-200 disabled:text-zinc-400"
      >
        시작하기
      </button>
    </main>
  )
}
