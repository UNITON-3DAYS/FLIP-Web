import { Link } from 'react-router-dom'

import { loadUser } from '@/services/records'

export default function HomeScreen() {
  const user = loadUser()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-16">
      <div className="flex size-12 items-center justify-center rounded-full bg-yellow-400 text-xl font-black">
        이
      </div>
      <h1 className="mt-6 text-2xl font-bold">
        {user ? `${user.name}님,` : '안녕하세요,'}
        <br />
        오늘도 채점은 채킷이 할게요
      </h1>

      <div className="mt-12 flex flex-col gap-4">
        <Link
          to="/grading/setup"
          className="rounded-2xl bg-yellow-400 px-6 py-8 text-center text-lg font-bold text-zinc-900"
        >
          채점하기
        </Link>
        <Link
          to="/results"
          className="rounded-2xl bg-zinc-100 px-6 py-8 text-center text-lg font-bold text-zinc-700"
        >
          채점 내역
        </Link>
      </div>
    </main>
  )
}
