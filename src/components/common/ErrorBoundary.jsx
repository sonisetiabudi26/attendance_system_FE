import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Di aplikasi nyata, kirim ke layanan monitoring (Sentry, dsb).
    console.error('ErrorBoundary menangkap error:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-ink">Terjadi kesalahan tak terduga</h1>
          <p className="max-w-sm text-sm text-muted">
            Aplikasi mengalami error saat menampilkan halaman ini. Silakan muat ulang halaman.
          </p>
          {this.state.error?.message && (
            <p className="max-w-sm rounded-lg bg-white px-3 py-2 font-mono text-xs text-danger border border-line">
              {this.state.error.message}
            </p>
          )}
          <button onClick={this.handleReload} className="btn-primary mt-2">
            Muat Ulang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
