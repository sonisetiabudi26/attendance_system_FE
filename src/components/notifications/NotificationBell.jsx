import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

function timeAgo(timestamp) {
  const diffSec = Math.max(1, Math.floor((Date.now() - timestamp) / 1000))
  if (diffSec < 60) return `${diffSec}d lalu`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m lalu`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}j lalu`
  return `${Math.floor(diffHour / 24)}h lalu`
}

const TYPE_TONE = {
  LATE_CHECK_IN: 'bg-amber-50 text-warning',
  OUT_OF_RADIUS: 'bg-red-50 text-danger',
  NEW_EMPLOYEE: 'bg-ink/5 text-ink',
  CHECK_OUT: 'bg-emerald-50 text-success',
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-ink hover:bg-paper"
        aria-label="Notifikasi"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-card sm:w-96">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-sm font-semibold text-ink">Notifikasi</p>
              {notifications.length > 0 && (
                <button onClick={markAllRead} className="text-xs font-semibold text-ink/60 hover:text-ink">
                  Tandai semua dibaca
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">Belum ada notifikasi.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    className={`flex w-full items-start gap-3 border-b border-line/70 px-4 py-3 text-left last:border-0 hover:bg-paper ${
                      !n.read ? 'bg-ink/[0.02]' : ''
                    }`}
                  >
                    <span className={`mt-0.5 rounded-full px-1.5 py-1 ${TYPE_TONE[n.type] || 'bg-slate-100 text-muted'}`}>
                      <BellIcon className="h-3 w-3" />
                    </span>
                    <span className="flex-1">
                      <span className={`block text-sm ${!n.read ? 'font-semibold text-ink' : 'text-ink/80'}`}>{n.text}</span>
                      <span className="mt-0.5 block text-xs text-muted">{timeAgo(n.timestamp)}</span>
                    </span>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8Z" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  )
}
