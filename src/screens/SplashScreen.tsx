import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import splash from '@/assets/splash.svg'
import { loadUser } from '@/services/records'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(loadUser() ? '/home' : '/signup', { replace: true })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [navigate])

  // Figma 스플래시 SVG 원본 (상태바만 제거) 풀블리드
  return (
    <main className="mx-auto h-dvh w-full max-w-md bg-white">
      <img src={splash} alt="Checkit" className="size-full object-cover" />
    </main>
  )
}
