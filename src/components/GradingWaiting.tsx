import magnifier from '@/assets/illust-magnifier.svg'

// 채점 대기 화면 (대기.svg 디자인 — 원본이 깨진 애니메이션 덤프라 코드로 재구성, 돋보기는 원본 벡터)
export default function GradingWaiting() {
  return (
    <div
      role="status"
      className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* Figma: ellipse translate(-52,120) 497×462, 민트 radial 0.6 */}
      <div className="pointer-events-none absolute top-[120px] -left-[52px] h-[462px] w-[497px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(153,236,231,0.6)_0%,rgba(255,255,255,0)_100%)]" />

      <div className="relative">
        {/* 반짝이 */}
        <span className="absolute -top-4 -left-5 size-3 rotate-45 animate-pulse bg-primary-300" />
        <span className="absolute -top-6 -right-4 size-5 rotate-45 animate-pulse bg-primary-300 [animation-delay:400ms]" />
        <span className="absolute top-3 -left-7 h-2 w-3 -rotate-12 bg-secondary" />

        {/* 채점지 카드 스켈레톤: 돋보기 아래로 지나가는 루프 */}
        <div className="animate-file-pass flex w-60 items-center gap-3 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(42,48,56,0.1)]">
          <div className="size-11 shrink-0 rounded-lg bg-[#D9E0E6]" />
          <div className="flex-1">
            <div className="h-3 w-28 rounded-full bg-gray-200" />
            <div className="mt-2.5 h-3 w-36 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* 돋보기(원본 벡터): 카드 우상단 고정 */}
        <img src={magnifier} alt="" className="absolute -top-12 -right-14 w-[88px]" />
      </div>

      <p className="relative mt-16 text-2xl font-bold text-gray-900">채점 중입니다...</p>
    </div>
  )
}
