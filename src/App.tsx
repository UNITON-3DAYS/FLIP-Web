import { lazy, Suspense } from 'react'

// 데스크톱(선생님)과 모바일(학생 PWA)을 진입 시 한 번 판별해 분리 로드한다.
// lazy라 각 기기는 자기 쪽 번들만 받는다. 리사이즈 추적은 하지 않음 (필요해지면 추가).
const DesktopApp = lazy(() => import('@/desk/DesktopApp'))
const MobileApp = lazy(() => import('@/MobileApp'))

const isDesktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches

function App() {
  return <Suspense fallback={null}>{isDesktop ? <DesktopApp /> : <MobileApp />}</Suspense>
}

export default App
