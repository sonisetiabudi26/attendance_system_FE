import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Halaman tidak ditemukan</h1>
      <p className="text-sm text-muted">Halaman yang Anda cari tidak tersedia.</p>
      <Link to="/absen" className="btn-primary mt-2">Kembali ke Absen</Link>
    </div>
  )
}
