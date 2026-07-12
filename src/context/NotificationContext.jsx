import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { mockBroker } from '../services/mockBroker'
import { db } from '../api/mockDb'
import { NOTIFICATION_TYPE, ROLES } from '../utils/constants'

export const NotificationContext = createContext(null)

const MESSAGE_TEMPLATES = {
  [NOTIFICATION_TYPE.LATE_CHECK_IN]: (p) => `${p.name} absen masuk terlambat.`,
  [NOTIFICATION_TYPE.OUT_OF_RADIUS]: (p) => `${p.name} absen di luar radius lokasi WFH.`,
  [NOTIFICATION_TYPE.NEW_EMPLOYEE]: (p) => `Karyawan baru "${p.name}" ditambahkan ke sistem.`,
  [NOTIFICATION_TYPE.CHECK_OUT]: (p) => `${p.name} telah absen pulang.`,
}

export function NotificationProvider({ children, user }) {
  const [notifications, setNotifications] = useState([])
  const isHrd = user?.role === ROLES.HRD
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!isHrd) {
      setNotifications([])
      loadedRef.current = false
      return
    }
    if (!loadedRef.current) {
      setNotifications(db.getNotifications())
      loadedRef.current = true
    }
  }, [isHrd])

  useEffect(() => {
    if (!isHrd) return undefined

    mockBroker.connect()

    const unsubscribe = mockBroker.subscribe((message) => {
      if (message.__system) return
      // Hanya jenis pesan tertentu yang relevan sebagai notifikasi HRD
      const template = MESSAGE_TEMPLATES[message.type]
      if (!template) return

      const notif = {
        id: message.id,
        type: message.type,
        text: template(message.payload),
        timestamp: message.timestamp,
        read: false,
      }

      setNotifications((prev) => {
        const next = [notif, ...prev].slice(0, 50)
        db.saveNotifications(next)
        return next
      })
    })

    return unsubscribe
  }, [isHrd])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }))
      db.saveNotifications(next)
      return next
    })
  }, [])

  const markOneRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      db.saveNotifications(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    db.saveNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, markOneRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
