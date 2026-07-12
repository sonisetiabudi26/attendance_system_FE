import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleRoute from './RoleRoute.jsx'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import MainLayout from '../components/layout/MainLayout.jsx'
import Login from '../pages/Login.jsx'
import Absen from '../pages/Absen.jsx'
import Profile from '../pages/Profile.jsx'
import History from '../pages/History.jsx'
import EmployeeList from '../pages/EmployeeList.jsx'
import AllHistory from '../pages/AllHistory.jsx'
import LogStream from '../pages/LogStream.jsx'
import Forbidden from '../pages/Forbidden.jsx'
import NotFound from '../pages/NotFound.jsx'
import Spinner from '../components/common/Spinner.jsx'
import { ROLES } from '../utils/constants'

export default function AppRoutes() {
  const { isLoading } = useAuth()

  if (isLoading) return <Spinner fullscreen label="Memuat aplikasi..." />

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Semua role */}
        <Route path="/absen" element={<Absen />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Khusus HRD */}
        <Route
          path="/employees"
          element={
            <RoleRoute allow={[ROLES.HRD]}>
              <EmployeeList />
            </RoleRoute>
          }
        />
        <Route
          path="/all-history"
          element={
            <RoleRoute allow={[ROLES.HRD]}>
              <AllHistory />
            </RoleRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <RoleRoute allow={[ROLES.HRD]}>
              <LogStream />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/absen" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function GuestOnly({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/absen" replace />
  return children
}
