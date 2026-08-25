import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@/components/Logo'
import { loadUser } from '@/services/records'

const glowClass =
  'pointer-events-none absolute size-[430px] rounded-full bg-[radial-gradient(circle,rgba(153,236,231,0.54)_0%,rgba(255,255,255,0)_100%)]'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(loadUser() ? '/home' : '/signup', { replace: true })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center overflow-hidden bg-white">
      <div className={`${glowClass} top-[171px] -left-[90px]`} />
      <div className={`${glowClass} top-[218px] left-[39px]`} />
      <p className="relative">
        <span className="mr-2 align-super text-xl text-primary-300">✦</span>
        <Logo className="text-[50px]" />
      </p>
    </main>
  )
}
