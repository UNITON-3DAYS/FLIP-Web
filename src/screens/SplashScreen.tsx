import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loadUser } from '@/services/records'

// Figma 스플래시 CSS(design.md)를 그대로 옮김 — 좌표는 390×844 프레임 기준
const ellipseClass =
  'pointer-events-none absolute h-[428px] w-[459px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.54)_0%,rgba(255,255,255,0)_100%)]'
// 4각 별 (Vector 2)
const starClip = 'polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(loadUser() ? '/home' : '/signup', { replace: true })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[390px] overflow-hidden bg-white">
      <div className={`${ellipseClass} top-[218px] -left-[90px]`} />
      <div className={`${ellipseClass} top-[171px] left-[39px]`} />

      {/* 로고 그룹: Figma y=372~486 영역을 화면 중앙에 배치 */}
      <div className="absolute top-[calc(50%-57px)] left-0 h-[114px] w-full">
        {/* Vector 2: 반짝이 별 */}
        <div
          className="absolute top-0 left-[61px] h-[42px] w-[34px] bg-primary-300"
          style={{ clipPath: starClip }}
        />
        {/* Rectangle 45/46: 별 부스러기 */}
        <div className="absolute top-[50px] left-[57px] h-[14px] w-[9px] rotate-[-52.21deg] bg-primary-300" />
        <div className="absolute top-[68px] left-[58px] h-[11px] w-[9px] rotate-[-78.61deg] bg-primary-300" />

        {/* Checkit 로고타입: Paperlogy 900 50px, 흰 5px 외곽선, -4.53° */}
        <span className="absolute top-[20px] left-[88px] inline-block rotate-[-4.53deg]">
          <span
            aria-hidden
            className="absolute inset-0 font-logo text-[50px] leading-[59px] font-black text-white [-webkit-text-stroke:10px_#fff]"
          >
            Checkit
          </span>
          <span className="relative font-logo text-[50px] leading-[59px] font-black text-primary-300">
            Checkit
          </span>
        </span>

        {/* 돋보기 (Group 5) */}
        <div className="absolute top-[60px] left-[263px] h-[54px] w-[41px]">
          <div className="absolute top-0 left-0 size-[37px] rounded-full bg-primary-300/50" />
          <div className="absolute top-0 left-0 size-[37px] rounded-full border-[6px] border-primary-300" />
          <div className="absolute top-[16px] left-[5px] h-[4px] w-[17px] rotate-[50.19deg] rounded-full bg-white" />
          <div className="absolute top-[37px] left-[26px] h-[10px] w-[22px] rotate-[49.3deg] rounded-sm bg-primary-300" />
        </div>
      </div>
    </main>
  )
}
