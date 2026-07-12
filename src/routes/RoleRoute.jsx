import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute.jsx'

/** Membungkus ProtectedRoute + memastikan role user termasuk dalam `allow` */
export default function RoleRoute({ allow = [], children }) {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      {user && !allow.includes(user.role) ? <Navigate to="/forbidden" replace /> : children}
    </ProtectedRoute>
  )
}
