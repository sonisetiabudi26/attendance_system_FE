import { formatDistance } from "@/utils/geoUtils"
import { WFH_RADIUS_METERS } from "@/utils/constants"

export default function LocationStatus({ geoStatus, coords, distanceMeters, withinRadius, error, homeLabel }) {
  if (geoStatus === 'idle') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-line bg-paper px-3.5 py-3 text-sm text-muted">
        <PinIcon className="h-4 w-4 shrink-0" />
        Lokasi belum diambil. Tekan tombol di bawah untuk memulai absen.
      </div>
    )
  }

  if (geoStatus === 'locating') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3.5 py-3 text-sm text-ink">
        <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
        Mengambil titik lokasi perangkat...
      </div>
    )
  }

  if (geoStatus === 'error' || geoStatus === 'unsupported') {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-red-50 px-3.5 py-3 text-sm text-danger">
        <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
        <span>{error?.message || 'Gagal mengambil lokasi.'}</span>
      </div>
    )
  }

  // success
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${
        withinRadius ? 'border-success/30 bg-emerald-50 text-emerald-900' : 'border-warning/30 bg-amber-50 text-amber-900'
      }`}
    >
      <PinIcon className={`h-4 w-4 shrink-0 mt-0.5 ${withinRadius ? 'text-success' : 'text-warning'}`} />
      <div>
        <p className="font-medium">
          {withinRadius ? 'Lokasi tervalidasi dalam radius WFH' : 'Di luar radius lokasi WFH terdaftar'}
        </p>
        <p className="mt-0.5 text-xs opacity-80">
          Jarak {formatDistance(distanceMeters)} dari "{homeLabel}" · toleransi {WFH_RADIUS_METERS} m
        </p>
        {coords && (
          <p className="mt-1 font-mono text-[11px] opacity-70">
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} (±{Math.round(coords.accuracy)}m)
          </p>
        )}
      </div>
    </div>
  )
}

function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

function AlertIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
    </svg>
  )
}
