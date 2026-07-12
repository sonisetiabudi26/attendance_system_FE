import { Link } from 'react-router-dom'

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-mono text-sm text-muted">403</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Akses ditolak</h1>
      <p className="max-w-xs text-sm text-muted">
        Halaman ini hanya dapat diakses oleh akun dengan role HRD.
      </p>
      <Link to="/absen" className="btn-primary mt-2">Kembali ke Absen</Link>
    </div>
  )
}
