const STYLES = {
  success: 'bg-emerald-50 text-success',
  danger: 'bg-red-50 text-danger',
  warning: 'bg-amber-50 text-warning',
  neutral: 'bg-slate-100 text-muted',
  ink: 'bg-ink/5 text-ink',
}

export default function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return (
    <span className={`badge ${STYLES[tone]} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
