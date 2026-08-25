import { BrowserRouter, Route, Routes } from 'react-router-dom'

import CameraScreen from '@/screens/CameraScreen'
import GradingSetupScreen from '@/screens/GradingSetupScreen'
import HomeScreen from '@/screens/HomeScreen'
import ResultDetailScreen from '@/screens/ResultDetailScreen'
import ResultListScreen from '@/screens/ResultListScreen'
import SignUpScreen from '@/screens/SignUpScreen'
import SplashScreen from '@/screens/SplashScreen'

export default function MobileApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/grading/setup" element={<GradingSetupScreen />} />
        <Route path="/grading/camera" element={<CameraScreen />} />
        <Route path="/results" element={<ResultListScreen />} />
        <Route path="/results/:id" element={<ResultDetailScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
