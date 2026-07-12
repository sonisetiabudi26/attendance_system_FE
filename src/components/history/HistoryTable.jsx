import Badge from '../common/Badge.jsx'
import { formatDateTimeShort, formatTime } from '../../utils/dateUtils'

function StatusBadge({ status }) {
  return status === 'ON_TIME' ? (
    <Badge tone="success" dot>Tepat Waktu</Badge>
  ) : (
    <Badge tone="warning" dot>Terlambat</Badge>
  )
}

function LocationBadge({ withinRadius }) {
  if (withinRadius === undefined) return <span className="text-muted">—</span>
  return withinRadius ? (
    <Badge tone="success">Dalam Radius</Badge>
  ) : (
    <Badge tone="danger">Luar Radius</Badge>
  )
}

export default function HistoryTable({ records, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-line/40" />
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="font-display text-sm font-semibold text-ink">Belum ada riwayat pada rentang ini</p>
        <p className="text-sm text-muted">Coba ubah filter tanggal atau status.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="py-3 pr-4">Tanggal</th>
              <th className="py-3 pr-4">Masuk</th>
              <th className="py-3 pr-4">Pulang</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-line/70 last:border-0">
                <td className="py-3.5 pr-4 font-medium text-ink">{formatDateTimeShort(r.date)}</td>
                <td className="py-3.5 pr-4 font-mono text-ink">{r.checkIn ? formatTime(r.checkIn.time) : '—'}</td>
                <td className="py-3.5 pr-4 font-mono text-ink">{r.checkOut ? formatTime(r.checkOut.time) : '—'}</td>
                <td className="py-3.5 pr-4"><StatusBadge status={r.status} /></td>
                <td className="py-3.5 pr-4"><LocationBadge withinRadius={r.checkIn?.withinRadius} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {records.map((r) => (
          <div key={r.id} className="rounded-xl border border-line p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink">{formatDateTimeShort(r.date)}</p>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-muted">Masuk</p>
                <p className="font-mono text-ink">{r.checkIn ? formatTime(r.checkIn.time) : '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Pulang</p>
                <p className="font-mono text-ink">{r.checkOut ? formatTime(r.checkOut.time) : '—'}</p>
              </div>
            </div>
            <div className="mt-3">
              <LocationBadge withinRadius={r.checkIn?.withinRadius} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
