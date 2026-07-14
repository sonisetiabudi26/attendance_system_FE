import { useToastList } from "@/shared/hooks/useToast"

const TONE_STYLES = {
  success: 'border-success/30 bg-emerald-50 text-emerald-900',
  error: 'border-danger/30 bg-red-50 text-red-900',
  info: 'border-ink/15 bg-white text-ink',
}

export default function ToastViewport() {
  const { toasts, dismiss } = useToastList()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-card ${TONE_STYLES[t.tone] || TONE_STYLES.info}`}
        >
          <p className="text-sm font-medium leading-snug">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded p-0.5 text-current opacity-60 hover:opacity-100"
            aria-label="Tutup notifikasi"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
