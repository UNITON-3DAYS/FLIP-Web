import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from '../layout/AppShell'
import { StudentRosterPage, StudentDetailPage } from '../features/student-roster'
import { GradingLogPage, GradingResultPage } from '../features/grading-log'
import { AnswerSheetPage, AnswerInputPage } from '../features/answer-sheet'

const router = createBrowserRouter([
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
