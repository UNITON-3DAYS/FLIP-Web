import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { gradeAndSave } from '@/services/records'
import type { GradingSetup } from '@/types'

const INTERVALS = [3, 5, 7]

export default function CameraScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const setup = (location.state ?? { examType: '시험지', title: '무제' }) as GradingSetup

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const [cameraError, setCameraError] = useState(false)
  const [intervalSec, setIntervalSec] = useState(5)
  const [running, setRunning] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [shots, setShots] = useState<string[]>([])
  const [flash, setFlash] = useState(false)

  // 카메라 스트림 연결/해제
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() => setCameraError(true))
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      wakeLockRef.current?.release().catch(() => {})
    }
  }, [])

  const capture = useCallback(() => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    setShots((prev) => [...prev, canvas.toDataURL('image/jpeg', 0.7)])

    // 버저: 비프음 + 진동(Android) + 화면 플래시(iOS 보완)
    const ctx = audioCtxRef.current
    if (ctx) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    }
    navigator.vibrate?.(200)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 250)
  }, [])

  // 1초마다 카운트다운, 0이 되면 캡처 후 리셋 (intervalSec은 촬영 중 변경 불가)
  useEffect(() => {
    if (!running) return
    let remaining = intervalSec
    const id = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        capture()
        remaining = intervalSec
      }
      setCountdown(remaining)
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, intervalSec, capture])

  const start = () => {
    // 사용자 제스처 시점에 AudioContext unlock + 화면 꺼짐 방지
    audioCtxRef.current ??= new AudioContext()
    void audioCtxRef.current.resume()
    navigator.wakeLock
      ?.request('screen')
      .then((lock) => {
        wakeLockRef.current = lock
      })
      .catch(() => {})
    setCountdown(intervalSec)
    setRunning(true)
  }

  const finish = () => {
    setRunning(false)
    const record = gradeAndSave(setup, shots.length)
    navigate(`/results/${record.id}`, { replace: true })
  }

  if (cameraError) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-gray-1000 px-6 text-center text-white">
        <p className="text-lg font-bold">카메라를 열 수 없어요</p>
        <p className="mt-2 text-sm text-gray-600">
          브라우저 설정에서 카메라 권한을 허용한 뒤 다시 시도해주세요.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-8 rounded-xl bg-white px-8 py-3 font-bold text-gray-1000"
        >
          돌아가기
        </button>
      </main>
    )
  }

  return (
    // h-dvh 고정: min-h면 video의 h-full(퍼센트 높이)이 무시된다
    <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col bg-gray-1000">
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="size-full object-cover" />
        {/* 촬영 가이드 프레임 */}
        <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-white/60" />
        {flash && <div className="pointer-events-none absolute inset-0 bg-white/70" />}

        {running && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-5 py-2 text-center text-white">
            <span className="text-2xl font-black text-white">{countdown}</span>
            <span className="ml-2 text-sm">초 후 촬영 · {shots.length}장 완료</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 px-6 py-6">
        {!running && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-600">촬영 간격</span>
            {INTERVALS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setIntervalSec(sec)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  intervalSec === sec ? 'bg-white text-gray-1000' : 'bg-gray-800 text-gray-500'
                }`}
              >
                {sec}초
              </button>
            ))}
          </div>
        )}

        {running ? (
          <button
            type="button"
            disabled={shots.length === 0}
            onClick={finish}
            className="rounded-xl bg-white py-4 text-base font-bold text-gray-1000 disabled:bg-gray-800 disabled:text-gray-600"
          >
            촬영 종료 · 채점하기
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-white py-4 text-base font-bold text-gray-1000"
          >
            촬영 시작
          </button>
        )}
        <p className="text-center text-xs text-gray-700">
          버저가 울릴 때마다 자동 촬영됩니다. 소리에 맞춰 페이지를 넘겨주세요.
        </p>
      </div>
    </main>
  )
}
