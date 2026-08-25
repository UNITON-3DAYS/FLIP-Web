import waitAnimation from '@/assets/grading-wait.svg'
import magnifier from '@/assets/illust-magnifier.svg'

// 채점 대기 화면 — 카드 흐름은 디자이너 애니메이션 SVG(돋보기 제거판),
// 돋보기는 원본 벡터 + 스캔 모션 유지 (사용자 확정)
export default function GradingWaiting() {
  return (
    <div role="status" className="absolute inset-0 z-30 bg-white">
      <img src={waitAnimation} alt="채점 중입니다" className="size-full object-cover" />
      <img
        src={magnifier}
        alt=""
        className="animate-scan absolute top-[33.6%] left-[70%] w-[78px]"
      />
    </div>
  )
}
