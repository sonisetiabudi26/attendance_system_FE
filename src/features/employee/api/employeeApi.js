import { mockRequest, ApiError } from "@/shared/api/client"
import { db, ensureSeeded } from "@/shared/api/mockDb"
import { mockBroker } from "@/services/mockBroker"
import { ROLES, NOTIFICATION_TYPE } from "@/utils/constants"

ensureSeeded()

function sanitize(user) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const employeeApi = {
  list() {
    return mockRequest(() => {
      return db
        .getUsers()
        .map(sanitize)
        .sort((a, b) => a.name.localeCompare(b.name))
    }, { delay: 450 })
  },

  create(payload) {
    return mockRequest(() => {
      const users = db.getUsers()

      if (!payload.name?.trim()) throw new ApiError('Nama wajib diisi.', 422)
      if (!isValidEmail(payload.email || '')) throw new ApiError('Format email tidak valid.', 422)
      if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new ApiError('Email sudah terdaftar.', 409)
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password || 'password123',
        role: payload.role || ROLES.EMPLOYEE,
        position: payload.position || '-',
        department: payload.department || '-',
        phone: payload.phone || '-',
        avatarColor: payload.avatarColor || randomColor(),
        homeLocation: payload.homeLocation || { lat: -6.2, lng: 106.8, label: 'Belum diatur' },
        joinedAt: payload.joinedAt || new Date().toISOString().slice(0, 10),
        status: 'ACTIVE',
      }

      db.saveUsers([...users, newUser])

      mockBroker.publish('employee.created', NOTIFICATION_TYPE.NEW_EMPLOYEE, {
        userId: newUser.id,
        name: newUser.name,
        position: newUser.position,
      })

      return sanitize(newUser)
    }, { delay: 700 })
  },

  update(userId, updates) {
    return mockRequest(() => {
      const users = db.getUsers()
      const idx = users.findIndex((u) => u.id === userId)
      if (idx === -1) throw new ApiError('Karyawan tidak ditemukan.', 404)

      if (updates.email && !isValidEmail(updates.email)) {
        throw new ApiError('Format email tidak valid.', 422)
      }
      if (
        updates.email &&
        users.some((u) => u.id !== userId && u.email.toLowerCase() === updates.email.toLowerCase())
      ) {
        throw new ApiError('Email sudah digunakan karyawan lain.', 409)
      }

      users[idx] = { ...users[idx], ...updates }
      db.saveUsers(users)
      return sanitize(users[idx])
    }, { delay: 600 })
  },

  remove(userId) {
    return mockRequest(() => {
      const users = db.getUsers()
      const target = users.find((u) => u.id === userId)
      if (!target) throw new ApiError('Karyawan tidak ditemukan.', 404)
      if (target.role === ROLES.HRD) {
        throw new ApiError('Akun HRD tidak dapat dihapus melalui halaman ini.', 403)
      }
      db.saveUsers(users.filter((u) => u.id !== userId))
      return { success: true }
    }, { delay: 550 })
  },

  toggleStatus(userId) {
    return mockRequest(() => {
      const users = db.getUsers()
      const idx = users.findIndex((u) => u.id === userId)
      if (idx === -1) throw new ApiError('Karyawan tidak ditemukan.', 404)
      users[idx] = { ...users[idx], status: users[idx].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
      db.saveUsers(users)
      return sanitize(users[idx])
    }, { delay: 400 })
  },
}

function randomColor() {
  const palette = ['#FFB627', '#10B981', '#6366F1', '#EC4899', '#0EA5E9', '#F97316']
  return palette[Math.floor(Math.random() * palette.length)]
}
