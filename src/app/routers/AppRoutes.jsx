import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/app/routers/ProtectedRoute";
import RoleRoute from "@/app/routers/RoleRoute";

import AuthLayout from "@/shared/components/layout/AuthLayout";
import MainLayout from "@/shared/components/layout/MainLayout";
import Spinner from "@/shared/components/common/Spinner";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import Login from "@/features/auth/pages/Login";
import Absen from "@/features/attendance/pages/Absen";
import History from "@/features/attendance/pages/History";
import Profile from "@/features/employee/pages/Profile";
import EmployeeList from "@/features/employee/pages/EmployeeList";
import AllHistory from "@/features/attendance/pages/AllHistory";

import LogStream from "@/pages/LogStream";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";

import { ROLES } from "@/utils/constants";

export default function AppRoutes() {
  const {
    data: user,
    isLoading,
  } = useCurrentUser();

  if (isLoading) {
    return <Spinner fullscreen label="Memuat aplikasi..." />;
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestOnly user={user}>
              <Login />
            </GuestOnly>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/absen" element={<Absen />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forbidden" element={<Forbidden />} />

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

      <Route
        path="/"
        element={<Navigate to="/absen" replace />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

function GuestOnly({ user, children }) {
  if (user) {
    return <Navigate to="/absen" replace />;
  }

  return children;
}