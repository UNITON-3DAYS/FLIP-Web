import { RouterProvider } from 'react-router-dom'

import router from './routes/router'

export default function DesktopApp() {
  return <RouterProvider router={router} />
}
