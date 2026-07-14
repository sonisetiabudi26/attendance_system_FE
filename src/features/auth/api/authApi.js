import { mockRequest, ApiError } from "@/shared/api/client"
import { db, ensureSeeded } from "@/shared/api/mockDb"

ensureSeeded()

function sanitize(user) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

export const authApi = {
  login({ email, password }) {
    return mockRequest(() => {
      const user = db.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!user || user.password !== password) {
        throw new ApiError('Email atau password salah.', 401)
      }
      if (user.status === 'INACTIVE') {
        throw new ApiError('Akun ini telah dinonaktifkan. Hubungi HRD.', 403)
      }
      const session = { userId: user.id, token: `mock-token-${user.id}-${Date.now()}` }
      db.saveSession(session)
      return { user: sanitize(user), token: session.token }
    }, { delay: 700 })
  },

  logout() {
    return mockRequest(() => {
      db.clearSession()
      return { success: true }
    }, { delay: 250 })
  },

  getCurrentUser() {
    return mockRequest(() => {
      const session = db.getSession()
      if (!session) throw new ApiError('Sesi tidak ditemukan.', 401)
      const user = db.getUsers().find((u) => u.id === session.userId)
      if (!user) throw new ApiError('Pengguna tidak ditemukan.', 404)
      return sanitize(user)
    }, { delay: 300 })
  },

  updateProfile(userId, updates) {
    return mockRequest(() => {
      const users = db.getUsers()
      const idx = users.findIndex((u) => u.id === userId)
      if (idx === -1) throw new ApiError('Pengguna tidak ditemukan.', 404)
      users[idx] = { ...users[idx], ...updates }
      db.saveUsers(users)
      return sanitize(users[idx])
    }, { delay: 500 })
  },
}
