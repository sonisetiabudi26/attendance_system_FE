import { useEffect, useRef } from 'react'
import Badge from '../common/Badge.jsx'
import { formatTime } from '../../utils/dateUtils'

const TYPE_META = {
  CHECK_IN: { label: 'CHECK_IN', tone: 'success' },
  CHECK_OUT: { label: 'CHECK_OUT', tone: 'ink' },
  LATE_CHECK_IN: { label: 'LATE', tone: 'warning' },
  OUT_OF_RADIUS: { label: 'OUT_OF_RADIUS', tone: 'danger' },
  NEW_EMPLOYEE: { label: 'NEW_EMPLOYEE', tone: 'ink' },
  HEARTBEAT: { label: 'HEARTBEAT', tone: 'neutral' },
}

function describePayload(type, payload) {
  switch (type) {
    case 'CHECK_IN':
      return `${payload.name} melakukan check-in${payload.department ? ` · ${payload.department}` : ''}`
    case 'CHECK_OUT':
      return `${payload.name} melakukan check-out`
    case 'LATE_CHECK_IN':
      return `${payload.name} tercatat terlambat`
    case 'OUT_OF_RADIUS':
      return `${payload.name} berada di luar radius WFH`
    case 'NEW_EMPLOYEE':
      return `Karyawan baru terdaftar: ${payload.name}`
    case 'HEARTBEAT':
      return `heartbeat ok — queue "${payload.queue}"`
    default:
      return JSON.stringify(payload)
  }
}

export default function LogStreamViewer({ messages, connectionState, isPaused }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!isPaused) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isPaused])

  return (
    <div className="rounded-xl border border-line bg-ink">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              connectionState === 'connected'
                ? 'bg-emerald-400'
                : connectionState === 'connecting'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-red-400'
            }`}
          />
          <span className="font-mono text-xs text-white/70">
            {connectionState === 'connected' ? 'CONNECTED' : connectionState === 'connecting' ? 'CONNECTING…' : 'DISCONNECTED'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-white/40">exchange: wfh.exchange · queue: attendance.events</span>
      </div>

      <div className="max-h-[26rem] overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {messages.length === 0 ? (
          <p className="px-2 py-8 text-center text-white/40">Menunggu pesan masuk dari queue...</p>
        ) : (
          messages.map((m) => {
            const meta = TYPE_META[m.type] || { label: m.type, tone: 'neutral' }
            return (
              <div key={m.id} className="flex items-start gap-2.5 border-b border-white/5 py-1.5 last:border-0">
                <span className="shrink-0 text-white/30">{formatTime(m.timestamp)}</span>
                <Badge tone={meta.tone} className="shrink-0">{meta.label}</Badge>
                <span className="text-white/80">{describePayload(m.type, m.payload)}</span>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
