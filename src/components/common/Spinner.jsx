export default function Spinner({ label = 'Memuat...', fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-3 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )

  if (fullscreen) {
    return <div className="flex min-h-screen items-center justify-center bg-paper">{content}</div>
  }
  return <div className="flex items-center justify-center py-12">{content}</div>
}
