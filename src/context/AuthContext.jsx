import { createContext, useCallback, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'
import { db } from '../api/mockDb'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = db.getSession()
    if (!session) {
      setIsLoading(false)
      return
    }
    authApi
      .getCurrentUser()
      .then(setUser)
      .catch(() => db.clearSession())
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser } = await authApi.login(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
