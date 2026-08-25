import { Link } from 'react-router-dom'

import gradingIllust from '@/assets/illust-grading.svg'
import historyIllust from '@/assets/illust-history.svg'
import Logo from '@/components/Logo'

export default function HomeScreen() {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-gray-200 px-6 pt-14 pb-8">
      {/* Figma: ellipse cx114.5 cy125 rx229.5 ry213, #99ECE7 radial, opacity 0.2 */}
      <div className="pointer-events-none absolute -top-[88px] -left-[115px] h-[426px] w-[459px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.9)_0%,rgba(255,255,255,0)_100%)] opacity-20" />

      <Logo />

      {/* 배너 자리 (디자인 미정 영역) */}
      <div className="relative mt-9 h-[175px] rounded-[10px] bg-[#D9D9D9]" />

      <div className="relative mt-[50px] grid grid-cols-2 gap-[13px]">
        <Link to="/grading/setup" className="overflow-hidden rounded-[10px] bg-white">
          <div className="px-4 pt-5">
            <p className="text-lg font-bold text-gray-900">채점하기</p>
            <p className="mt-1 text-sm font-medium text-gray-700">카메라로 채점하기</p>
          </div>
          <img src={gradingIllust} alt="" className="mt-1 w-full" />
        </Link>
        <Link to="/results" className="overflow-hidden rounded-[10px] bg-white">
          <div className="px-4 pt-5">
            <p className="text-lg font-bold text-gray-900">채점내역</p>
            <p className="mt-1 text-sm font-medium text-gray-700">채점한 내역 모음</p>
          </div>
          <img src={historyIllust} alt="" className="mt-1 w-full" />
        </Link>
      </div>
    </main>
  )
}
