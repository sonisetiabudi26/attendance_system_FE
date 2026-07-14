import { useAuth } from "@/shared/hooks/useAuth"
import { ROLES } from "@/utils/constants"

export function useRole() {
  const { user } = useAuth()
  return {
    role: user?.role,
    isHrd: user?.role === ROLES.HRD,
    isEmployee: user?.role === ROLES.EMPLOYEE,
  }
}
