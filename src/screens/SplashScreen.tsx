import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { loadUser } from '@/services/records'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(loadUser() ? '/home' : '/signup', { replace: true })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-yellow-400">
      <div className="flex size-24 items-center justify-center rounded-full bg-zinc-900 text-4xl font-black text-yellow-400">
        이
      </div>
      <h1 className="mt-6 text-3xl font-black text-zinc-900">채킷</h1>
      <p className="mt-1 text-sm font-semibold tracking-widest text-zinc-800">CHECKIT</p>
    </main>
  )
}
