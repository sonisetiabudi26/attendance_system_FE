import AppRoutes from './routes/AppRoutes.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { useAuth } from './hooks/useAuth'
import ToastViewport from './components/common/ToastViewport.jsx'

export default function App() {
  const { user } = useAuth()

  return (
    <NotificationProvider user={user}>
      <AppRoutes />
      <ToastViewport />
    </NotificationProvider>
  )
}
