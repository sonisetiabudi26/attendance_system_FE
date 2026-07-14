import AppRoutes from '@/app/routers/AppRoutes.jsx'
import { NotificationProvider } from '@/context/NotificationContext.jsx'
import { useAuth } from '@/shared/hooks/use-auth'
import ToastViewport from '@/shared/components/common/ToastViewport.jsx'

export default function App() {
  const { user } = useAuth()

  return (
    <NotificationProvider user={user}>
      <AppRoutes />
      <ToastViewport />
    </NotificationProvider>
  )
}
