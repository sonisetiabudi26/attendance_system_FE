import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner.jsx'

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Spinner fullscreen label="Memeriksa sesi..." />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
