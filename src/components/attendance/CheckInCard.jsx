import { useEffect, useState } from 'react'

export default function CheckInCard({ mode, onStamp, isLoading, disabled }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const isCheckOut = mode === 'CHECK_OUT'
  const label = isCheckOut ? 'Absen Pulang' : 'Absen Masuk'

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <p className="font-mono text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <p className="mt-1 text-sm text-muted">
          {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <button
        onClick={onStamp}
        disabled={disabled || isLoading}
        className="group relative flex h-40 w-40 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60 sm:h-48 sm:w-48"
        aria-label={label}
      >
        {!disabled && (
          <span className="absolute inset-0 rounded-full bg-accent/50 animate-pulseRing" />
        )}
        <span
          className={`relative flex h-full w-full items-center justify-center rounded-full border-4 border-ink/10 text-center shadow-stamp transition-transform active:animate-stampDown ${
            isCheckOut ? 'bg-ink text-white' : 'bg-accent text-ink'
          }`}
        >
          {isLoading ? (
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-current border-t-transparent" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 px-4">
              <StampGlyph className="h-8 w-8" />
              <span className="font-display text-sm font-bold uppercase tracking-wide">{label}</span>
            </span>
          )}
        </span>
      </button>

      <p className="max-w-xs text-center text-xs text-muted">
        Tekan tombol untuk mengambil lokasi perangkat dan mencatat waktu {isCheckOut ? 'pulang' : 'masuk'} kerja Anda.
      </p>
    </div>
  )
}

function StampGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}
