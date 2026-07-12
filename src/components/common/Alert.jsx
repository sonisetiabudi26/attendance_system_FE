const TONE_STYLES = {
  error: 'border-danger/30 bg-red-50 text-danger',
  warning: 'border-warning/30 bg-amber-50 text-amber-900',
  success: 'border-success/30 bg-emerald-50 text-emerald-900',
  info: 'border-line bg-paper text-ink',
}

export default function Alert({ tone = 'error', title, children, onRetry, className = '' }) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${TONE_STYLES[tone]} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && <p className="font-semibold">{title}</p>}
          {children && <p className={title ? 'mt-0.5 opacity-90' : ''}>{children}</p>}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 rounded-md border border-current/30 px-2.5 py-1 text-xs font-semibold hover:bg-white/50"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  )
}
