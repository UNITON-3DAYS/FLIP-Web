import { Link } from 'react-router-dom'

import heroCharacter from '@/assets/hero-character.png'
import heroConfettiRaw from '@/assets/hero-confetti.svg?raw'
import heroShadowRaw from '@/assets/hero-shadow.svg?raw'
import gradingIllustRaw from '@/assets/illust-grading.svg?raw'
import historyIllustRaw from '@/assets/illust-history.svg?raw'
import InlineSvg from '@/components/InlineSvg'
import Logo from '@/components/Logo'
import { useAsync } from '@/hooks/useAsync'
import { getStudentProfile } from '@/services/api'

// 서버 프로필(schoolName + grade)을 디자인 칩 형식("중1", "고3")으로 축약
const gradeChip = (schoolName: string, grade: number) => {
  const school = schoolName.includes('고등학교')
    ? '고'
    : schoolName.includes('중학교')
      ? '중'
      : schoolName.includes('초등학교')
        ? '초'
        : null
  return school ? `${school}${grade}` : `${grade}학년`
}

export default function HomeScreen() {
  const { data: profile } = useAsync(getStudentProfile, [])

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-gray-200 px-6 pt-[calc(env(safe-area-inset-top)+31px)] pb-8">
      {/* 배경 방사형 그라디언트 (디자인 y158, h344 — 상태바 47 제외) */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+111px)] h-[344px] bg-[radial-gradient(187.24%_46.8%_at_50%_50%,rgba(218,255,252,0.8)_0%,rgba(255,255,255,0)_100%)]" />

      <Logo />

      {/* 히어로: 학년 칩 + 슬로건 + 캐릭터 (선택상세코드.md 절대좌표, 원점 = 로고 아래 y66) */}
      <div className="relative -mx-6 h-[221px]">
        <div className="absolute top-[44px] left-[30px] flex w-[164px] flex-col items-start gap-[9px]">
          {profile && (
            <span className="inline-flex h-[30px] items-center rounded-full border border-primary-300 px-3 text-sm leading-[28px] font-bold text-primary-300">
              {gradeChip(profile.schoolName, profile.grade)} - {profile.name}
            </span>
          )}
          <p className="text-[22px] leading-[30px] font-bold break-keep text-gray-800">
            채점은 이제 채킷에게 맡기세요!
          </p>
        </div>

        {/* 그림자 → 캐릭터 → 색종이 순서 (디자인 z 순서, 벡터는 선택.svg에서 그대로 추출) */}
        <InlineSvg raw={heroShadowRaw} className="absolute inset-0" />
        <img src={heroCharacter} alt="" className="absolute top-[29px] left-[197px] size-[170px]" />
        <InlineSvg raw={heroConfettiRaw} className="absolute inset-0" />
      </div>

      <div className="relative grid grid-cols-[169fr_164fr] gap-2">
        <Link
          to="/grading/setup"
          className="relative h-[215px] overflow-hidden rounded-[10px] border border-gray-300 bg-white px-[18px] pt-[22px]"
        >
          <p className="text-lg leading-[21px] font-bold text-gray-900">채점하기</p>
          <p className="mt-1 text-sm leading-[17px] font-medium text-gray-700">카메라로 채점하기</p>
          <InlineSvg
            raw={gradingIllustRaw}
            className="absolute inset-x-0 top-[66px] aspect-[164/149] w-full"
          />
        </Link>
        <Link
          to="/results"
          className="relative h-[215px] overflow-hidden rounded-[10px] border border-gray-300 bg-white px-[18px] pt-[22px]"
        >
          <p className="text-lg leading-[21px] font-bold text-gray-900">채점 내역</p>
          <p className="mt-1 text-sm leading-[17px] font-medium text-gray-700">채점한 내역 모음</p>
          <InlineSvg
            raw={historyIllustRaw}
            className="absolute inset-x-0 top-[66px] aspect-[164/149] w-full"
          />
        </Link>
      </div>
    </main>
  )
}
