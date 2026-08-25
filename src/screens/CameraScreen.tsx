import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import iconClose from '@/assets/icon-close.svg'
import GradingWaiting from '@/components/GradingWaiting'
import { completeSession, createSession, uploadPage } from '@/services/api'
import type { GradingSetup } from '@/types'

const INTERVAL_SEC = 3 // 촬영 주기 고정 (팀 결정 2026-08-25)

export default function CameraScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const setup = (location.state ?? { examType: '시험지', title: '무제' }) as GradingSetup

  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const seqRef = useRef(0)
  const uploadsRef = useRef<Promise<void>[]>([])
  const failedRef = useRef<{ seq: number; image: Blob }[]>([])

  const [cameraError, setCameraError] = useState(false)
  const [running, setRunning] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [shotCount, setShotCount] = useState(0)
  const [flash, setFlash] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [exitConfirm, setExitConfirm] = useState(false)
  const wasRunningRef = useRef(false)

  // 촬영분이 있으면 확인 모달을 띄우고, 그동안 자동 촬영은 멈춘다
  const requestExit = () => {
    if (!running && shotCount === 0) {
      navigate(-1)
      return
    }
    wasRunningRef.current = running
    setRunning(false)
    setExitConfirm(true)
  }

  const cancelExit = () => {
    setExitConfirm(false)
    if (wasRunningRef.current) {
      setCountdown(INTERVAL_SEC)
      setRunning(true)
    }
  }

  // 카메라 스트림 연결/해제
  useEffect(() => {
    navigator.mediaDevices
      // ideal이라 기기가 지원하는 최대치까지만 올라간다 (미지원 기기도 실패하지 않음)
      .getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 4096 }, height: { ideal: 2160 } },
      })
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

  // 촬영한 장은 즉시 업로드한다 (버저 간격 동안 회선이 놀지 않게). 실패분은 종료 시 일괄 재시도.
  const uploadShot = useCallback((seq: number, image: Blob) => {
    const task = (async () => {
      const sessionId = sessionIdRef.current
      if (!sessionId) return
      try {
        await uploadPage(sessionId, seq, image)
      } catch {
        failedRef.current.push({ seq, image })
      }
    })()
    uploadsRef.current.push(task)
  }, [])

  const capture = useCallback(() => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return

    // 프리뷰(object-cover)에서 가이드 브래킷이 가리키는 영역만 원본 해상도로 잘라 저장한다.
    // cover 배율·센터 크롭 오프셋을 역산해 화면 좌표 → 원본 프레임 좌표로 변환.
    const vw = video.videoWidth
    const vh = video.videoHeight
    let sx = 0
    let sy = 0
    let sw = vw
    let sh = vh
    const guide = frameRef.current
    if (guide) {
      const vr = video.getBoundingClientRect()
      const gr = guide.getBoundingClientRect()
      const scale = Math.max(vr.width / vw, vr.height / vh)
      const ox = (vw * scale - vr.width) / 2
      const oy = (vh * scale - vr.height) / 2
      sx = Math.max(0, (gr.x - vr.x + ox) / scale)
      sy = Math.max(0, (gr.y - vr.y + oy) / scale)
      sw = Math.min(vw - sx, gr.width / scale)
      sh = Math.min(vh - sy, gr.height / scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw)
    canvas.height = Math.round(sh)
    canvas.getContext('2d')?.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        seqRef.current += 1
        setShotCount(seqRef.current)
        uploadShot(seqRef.current, blob)
      },
      'image/jpeg',
      0.92,
    )

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
  }, [uploadShot])

  // 1초마다 카운트다운, 0이 되면 캡처 후 리셋
  useEffect(() => {
    if (!running) return
    let remaining = INTERVAL_SEC
    const id = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        capture()
        remaining = INTERVAL_SEC
      }
      setCountdown(remaining)
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, capture])

  const start = async () => {
    // 사용자 제스처 시점에 AudioContext unlock + 화면 꺼짐 방지
    audioCtxRef.current ??= new AudioContext()
    void audioCtxRef.current.resume()
    navigator.wakeLock
      ?.request('screen')
      .then((lock) => {
        wakeLockRef.current = lock
      })
      .catch(() => {})
    setSubmitError(null)
    try {
      // 에러 후 재시작하면 기존 세션을 이어간다
      sessionIdRef.current ??= await createSession(setup)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '채점 세션 생성에 실패했어요.')
      return
    }
    setCountdown(INTERVAL_SEC)
    setRunning(true)
  }

  const finish = async () => {
    const sessionId = sessionIdRef.current
    if (!sessionId) return
    setRunning(false)
    setSubmitting(true)
    setSubmitError(null)
    try {
      await Promise.all(uploadsRef.current)
      const failed = failedRef.current.splice(0)
      for (const shot of failed) {
        try {
          await uploadPage(sessionId, shot.seq, shot.image)
        } catch {
          failedRef.current.push(shot)
          throw new Error(`${shot.seq}번째 장 업로드에 실패했어요. 다시 시도해주세요.`)
        }
      }
      // BE 연동 전: 대기 화면을 최소 4초 노출 (팀 결정 2026-08-25, 실채점이 더 오래 걸리면 그만큼 표시)
      const [record] = await Promise.all([
        completeSession(sessionId),
        new Promise((resolve) => window.setTimeout(resolve, 4000)),
      ])
      navigate(`/results/${record.id}`, { replace: true, state: { from: 'grading' } })
    } catch (err) {
      setSubmitting(false)
      setSubmitError(err instanceof Error ? err.message : '채점 요청에 실패했어요.')
    }
  }

  if (cameraError) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-black px-6 text-center text-white">
        <p className="text-lg font-bold">카메라를 열 수 없어요</p>
        <p className="mt-2 text-sm text-gray-600">
          브라우저 설정에서 카메라 권한을 허용한 뒤 다시 시도해주세요.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-8 rounded-xl bg-primary-300 px-8 py-3 font-bold text-white"
        >
          돌아가기
        </button>
      </main>
    )
  }

  return (
    // h-dvh 고정: min-h면 video의 h-full(퍼센트 높이)이 무시된다
    <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col bg-black">
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="size-full object-cover" />
        {/* 촬영 가이드 브래킷 (카메라.svg 실측: 40×30, 두께 6, x35) — 이 영역만 잘라 저장된다 */}
        <div
          ref={frameRef}
          className="pointer-events-none absolute right-[35px] left-[35px] top-[calc(env(safe-area-inset-top)+65px)] bottom-[43px]"
        >
          <div className="absolute top-0 left-0 h-[30px] w-10 rounded-tl-lg border-t-[6px] border-l-[6px] border-primary-300" />
          <div className="absolute top-0 right-0 h-[30px] w-10 rounded-tr-lg border-t-[6px] border-r-[6px] border-primary-300" />
          <div className="absolute bottom-0 left-0 h-[30px] w-10 rounded-bl-lg border-b-[6px] border-l-[6px] border-primary-300" />
          <div className="absolute right-0 bottom-0 h-[30px] w-10 rounded-br-lg border-r-[6px] border-b-[6px] border-primary-300" />
        </div>
        <button
          type="button"
          onClick={requestExit}
          aria-label="닫기"
          className="absolute top-[calc(env(safe-area-inset-top)+20px)] right-[25px]"
        >
          <img src={iconClose} alt="" className="size-[15px]" />
        </button>
        {flash && <div className="pointer-events-none absolute inset-0 bg-white/70" />}
        {!running && !submitting && (
          <p className="pointer-events-none absolute bottom-2 left-1/2 w-full -translate-x-1/2 text-center text-xs text-white/70">
            버저가 울릴 때마다 자동 촬영됩니다. 소리에 맞춰 페이지를 넘겨주세요.
          </p>
        )}

        {running && (
          <div className="absolute top-[calc(env(safe-area-inset-top)+40px)] left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-5 py-2 text-center text-white">
            <span className="text-[15px] font-medium">
              <span className="font-bold text-primary-300">{countdown}초</span> 후 촬영 ·{' '}
              {shotCount}장 완료
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 px-6 pt-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        {submitError && <p className="text-center text-sm text-red-400">{submitError}</p>}
        {running || submitting ? (
          <button
            type="button"
            disabled={shotCount === 0 || submitting}
            onClick={() => void finish()}
            className="rounded-xl bg-primary-300 py-4 text-base font-bold text-white disabled:bg-gray-800 disabled:text-gray-600"
          >
            {submitting ? '채점 중...' : '촬영 종료 · 채점하기'}
          </button>
        ) : (
          // 디자인의 원형 셔터: 그라디언트 링 + 흰 코어
          <button
            type="button"
            onClick={() => void start()}
            aria-label="촬영 시작"
            className="size-20 self-center rounded-full bg-gradient-to-b from-primary-100 to-primary-300 p-[7px]"
          >
            <span className="block size-full rounded-full bg-white" />
          </button>
        )}
      </div>

      {submitting && <GradingWaiting />}

      {exitConfirm && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 px-10">
          <div className="w-full rounded-2xl bg-white p-6 text-center">
            <p className="text-lg font-bold text-gray-900">촬영을 그만둘까요?</p>
            {shotCount > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                지금까지 촬영한 {shotCount}장은 저장되지 않아요.
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl bg-gray-200 py-3 font-bold text-gray-700"
              >
                나가기
              </button>
              <button
                type="button"
                onClick={cancelExit}
                className="flex-1 rounded-xl bg-primary-300 py-3 font-bold text-white"
              >
                계속 촬영
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
