import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from '../layout/AppShell'
import { StudentRosterPage, StudentDetailPage } from '../features/student-roster'
import { GradingLogPage, GradingResultPage } from '../features/grading-log'
import { AnswerSheetPage, AnswerInputPage } from '../features/answer-sheet'
import ParentReportScreen from '../../screens/ParentReportScreen'

const router = createBrowserRouter([
  // 학부모 공유 리포트: 셸(사이드바) 없이 단독 렌더
  { path: '/report/:studentId', element: <ParentReportScreen /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/students" replace /> },
      { path: 'students', element: <StudentRosterPage /> },
      { path: 'students/:studentId', element: <StudentDetailPage /> },
      { path: 'grading', element: <GradingLogPage /> },
      { path: 'grading/:recordId', element: <GradingResultPage /> },
      { path: 'answer-sheets', element: <AnswerSheetPage /> },
      { path: 'answer-sheets/input', element: <AnswerInputPage /> },
    ],
  },
])

export default router
