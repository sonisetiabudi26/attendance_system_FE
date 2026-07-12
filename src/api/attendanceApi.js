import { mockRequest, ApiError } from './client'
import { db, ensureSeeded } from './mockDb'
import { toISODate, isWithinRange } from '../utils/dateUtils'
import { WORK_START_HOUR, WORK_START_MINUTE, NOTIFICATION_TYPE } from '../utils/constants'
import { mockBroker } from '../services/mockBroker'

ensureSeeded()

function computeStatus(timestamp) {
  const d = new Date(timestamp)
  const minutes = d.getHours() * 60 + d.getMinutes()
  const cutoff = WORK_START_HOUR * 60 + WORK_START_MINUTE
  return minutes > cutoff ? 'LATE' : 'ON_TIME'
}

function getUserBrief(userId) {
  const user = db.getUsers().find((u) => u.id === userId)
  return user ? { id: user.id, name: user.name, department: user.department } : { id: userId, name: 'Unknown', department: '-' }
}

export const attendanceApi = {
  /** Ambil record absen milik user pada tanggal hari ini */
  getToday(userId) {
    return mockRequest(() => {
      const todayStr = toISODate(new Date())
      const records = db.getAttendance()
      return records.find((r) => r.userId === userId && r.date === todayStr) || null
    }, { delay: 350 })
  },

  checkIn({ userId, coords, address, distanceMeters, withinRadius }) {
    return mockRequest(() => {
      const records = db.getAttendance()
      const todayStr = toISODate(new Date())

      if (records.find((r) => r.userId === userId && r.date === todayStr)) {
        throw new ApiError('Anda sudah melakukan absen masuk hari ini.', 409)
      }

      const now = Date.now()
      const status = computeStatus(now)
      const record = {
        id: `att_${now}`,
        userId,
        date: todayStr,
        checkIn: { time: now, coords, address, distanceMeters, withinRadius },
        checkOut: null,
        status,
      }
      db.saveAttendance([record, ...records])

      const brief = getUserBrief(userId)
      mockBroker.publish('attendance.checkin', 'CHECK_IN', { ...brief, status, withinRadius, distanceMeters })
      if (status === 'LATE') {
        mockBroker.publish('attendance.late', NOTIFICATION_TYPE.LATE_CHECK_IN, { ...brief, time: now })
      }
      if (!withinRadius) {
        mockBroker.publish('attendance.out_of_radius', NOTIFICATION_TYPE.OUT_OF_RADIUS, {
          ...brief,
          distanceMeters,
        })
      }

      return record
    }, { delay: 900 })
  },

  checkOut({ userId, coords, address, distanceMeters, withinRadius }) {
    return mockRequest(() => {
      const records = db.getAttendance()
      const todayStr = toISODate(new Date())
      const idx = records.findIndex((r) => r.userId === userId && r.date === todayStr)

      if (idx === -1) {
        throw new ApiError('Anda belum melakukan absen masuk hari ini.', 409)
      }
      if (records[idx].checkOut) {
        throw new ApiError('Anda sudah melakukan absen pulang hari ini.', 409)
      }

      const now = Date.now()
      records[idx] = {
        ...records[idx],
        checkOut: { time: now, coords, address, distanceMeters, withinRadius },
      }
      db.saveAttendance(records)

      const brief = getUserBrief(userId)
      mockBroker.publish('attendance.checkout', NOTIFICATION_TYPE.CHECK_OUT, { ...brief, time: now })

      return records[idx]
    }, { delay: 900 })
  },

  /** Riwayat absen milik satu user (halaman History karyawan) */
  getHistory(userId, { startDate, endDate, status } = {}) {
    return mockRequest(() => {
      let records = db.getAttendance().filter((r) => r.userId === userId)

      if (startDate || endDate) {
        records = records.filter((r) => isWithinRange(r.date, startDate, endDate))
      }
      if (status && status !== 'ALL') {
        records = records.filter((r) => r.status === status)
      }

      return records.sort((a, b) => new Date(b.date) - new Date(a.date))
    }, { delay: 550 })
  },

  /** Riwayat absen seluruh karyawan (khusus HRD), dengan info nama/departemen */
  getAllHistory({ startDate, endDate, status, employeeId, department } = {}) {
    return mockRequest(() => {
      const users = db.getUsers()
      const userMap = new Map(users.map((u) => [u.id, u]))

      let records = db.getAttendance()

      if (startDate || endDate) {
        records = records.filter((r) => isWithinRange(r.date, startDate, endDate))
      }
      if (status && status !== 'ALL') {
        records = records.filter((r) => r.status === status)
      }
      if (employeeId && employeeId !== 'ALL') {
        records = records.filter((r) => r.userId === employeeId)
      }
      if (department && department !== 'ALL') {
        records = records.filter((r) => userMap.get(r.userId)?.department === department)
      }

      return records
        .map((r) => ({
          ...r,
          employeeName: userMap.get(r.userId)?.name || 'Tidak diketahui',
          employeeDepartment: userMap.get(r.userId)?.department || '-',
          employeeAvatarColor: userMap.get(r.userId)?.avatarColor || '#64748B',
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    }, { delay: 650 })
  },
}
