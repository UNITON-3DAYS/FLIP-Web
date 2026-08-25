import { Link } from 'react-router-dom'

import gradingIllustRaw from '@/assets/illust-grading.svg?raw'
import historyIllustRaw from '@/assets/illust-history.svg?raw'
import InlineSvg from '@/components/InlineSvg'
import Logo from '@/components/Logo'

export default function HomeScreen() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-200 px-6 pt-[calc(env(safe-area-inset-top)+56px)] pb-8">
      <Logo />

      {/* 배너 자리 (콘텐츠 미정 영역) */}
      <div className="mt-[11px] h-[175px] rounded-[10px] bg-primary-200" />

      <div className="mt-[30px] grid grid-cols-2 gap-[13px]">
        <Link
          to="/grading/setup"
          className="overflow-hidden rounded-[10px] border border-gray-300 bg-white"
        >
          <div className="px-4 pt-5">
            <p className="text-lg font-bold text-gray-900">채점하기</p>
            <p className="mt-1 text-sm font-medium text-gray-700">카메라로 채점하기</p>
          </div>
          <InlineSvg raw={gradingIllustRaw} className="mt-1 aspect-[164/149] w-full" />
        </Link>
        <Link
          to="/results"
          className="overflow-hidden rounded-[10px] border border-gray-300 bg-white"
        >
          <div className="px-4 pt-5">
            <p className="text-lg font-bold text-gray-900">채점 내역</p>
            <p className="mt-1 text-sm font-medium text-gray-700">채점한 내역 모음</p>
          </div>
          <InlineSvg raw={historyIllustRaw} className="mt-1 aspect-[164/149] w-full" />
        </Link>
      </div>
    </main>
  )
}
