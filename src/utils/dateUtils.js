export function toISODate(date) {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export function formatDate(isoDateOrTimestamp, opts = {}) {
  const d = new Date(isoDateOrTimestamp)
  return d.toLocaleDateString('id-ID', {
    weekday: opts.short ? undefined : 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDateTimeShort(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function isWithinRange(dateStr, startStr, endStr) {
  if (!startStr && !endStr) return true
  const date = new Date(dateStr)
  if (startStr && date < new Date(startStr)) return false
  if (endStr && date > new Date(endStr + 'T23:59:59')) return false
  return true
}

export function startOfMonthISO() {
  const d = new Date()
  return toISODate(new Date(d.getFullYear(), d.getMonth(), 1))
}

export function todayISO() {
  return toISODate(new Date())
}
