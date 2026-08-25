import { Link } from 'react-router-dom'

import Logo from '@/components/Logo'

export default function HomeScreen() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white px-6 pt-14 pb-8">
      <Logo />

      {/* 배너 자리 (디자인 미정 영역) */}
      <div className="mt-6 h-36 rounded-[10px] bg-gray-400" />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link to="/grading/setup" className="flex flex-col rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-bold">채점하기</p>
          <p className="mt-0.5 text-xs text-gray-600">카메라로 채점하기</p>
          <span className="mt-4 mb-2 self-center text-5xl">📝</span>
        </Link>
        <Link to="/results" className="flex flex-col rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-bold">채점내역</p>
          <p className="mt-0.5 text-xs text-gray-600">채점한 내역 모음</p>
          <span className="mt-4 mb-2 self-center text-5xl">🗂️</span>
        </Link>
      </div>
    </main>
  )
}
