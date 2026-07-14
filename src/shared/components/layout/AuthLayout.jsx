import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FFB627, transparent 70%)' }}
        />
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-base font-bold text-ink">
            W
          </div>
          <span className="font-display text-base font-semibold text-white">Presensi WFH</span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-display text-3xl font-semibold leading-tight text-white">
            Absen dari rumah, tervalidasi lokasi, tercatat rapi.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Setiap absen masuk dan pulang direkam bersama titik lokasi perangkat Anda,
            dicocokkan dengan radius lokasi WFH yang terdaftar — transparan untuk Anda dan tim HR.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs font-mono text-white/40">
          <span>GEO-VALIDATED</span>
          <span>·</span>
          <span>REAL-TIME</span>
          <span>·</span>
          <span>v1.0</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-6 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
