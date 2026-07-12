import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { attendanceApi } from '../api/attendanceApi'
import { startOfMonthISO, todayISO } from '../utils/dateUtils'
import Card from '../components/common/Card.jsx'
import Alert from '../components/common/Alert.jsx'
import DateFilter from '../components/history/DateFilter.jsx'
import HistoryTable from '../components/history/HistoryTable.jsx'

const DEFAULT_FILTERS = {
  startDate: startOfMonthISO(),
  endDate: todayISO(),
  status: 'ALL',
}

export default function History() {
  const { user } = useAuth()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const load = () => {
    setIsLoading(true)
    setLoadError('')
    attendanceApi
      .getHistory(user.id, filters)
      .then(setRecords)
      .catch((err) => setLoadError(err.message || 'Gagal memuat riwayat absen.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [user.id, filters])

  const onTimeCount = records.filter((r) => r.status === 'ON_TIME').length
  const lateCount = records.filter((r) => r.status === 'LATE').length

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Riwayat Absen</h1>
        <p className="mt-1 text-sm text-muted">Lihat dan filter riwayat kehadiran WFH Anda.</p>
      </div>

      

      <Card>
        <DateFilter filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
      </Card>

      <Card>
        {loadError ? <Alert onRetry={load}>{loadError}</Alert> : <HistoryTable records={records} isLoading={isLoading} />}
      </Card>
    </div>
  )
}

function SummaryStat({ label, value, tone = 'text-ink', className = '' }) {
  return (
    <div className={`card p-4 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  )
}
