import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import splashRaw from '@/assets/splash.svg?raw'
import InlineSvg from '@/components/InlineSvg'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      // 테스트 단계: 세션 유지 없이 항상 로그인부터 (복원 시 loadUser() ? '/home' : '/signup')
      navigate('/signup', { replace: true })
    }, 2000) // 스플래시 애니메이션 1루프(2s)에 맞춤
    return () => window.clearTimeout(timer)
  }, [navigate])

  // Figma 스플래시 SVG 원본 (상태바만 제거) 풀블리드
  return (
    <main className="mx-auto h-dvh w-full max-w-md bg-white">
      <InlineSvg raw={splashRaw} label="Checkit" className="size-full" />
    </main>
  )
}
