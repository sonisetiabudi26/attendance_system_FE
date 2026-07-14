import { useEffect, useMemo, useState } from 'react'
import { attendanceApi } from "@/features/attendance/api/attendanceApi"
import { employeeApi } from "@/features/employee/api/employeeApi"
import { startOfMonthISO, todayISO, formatDateTimeShort, formatTime } from "@/utils/dateUtils"
import { ROLES } from "@/utils/constants"
import Card from "@/shared/components/common/Card.jsx"
import Select from "@/shared/components/common/Select.jsx"
import Badge from "@/shared/components/common/Badge.jsx"
import Alert from "@/shared/components/common/Alert.jsx"

const DEFAULT_FILTERS = {
  startDate: startOfMonthISO(),
  endDate: todayISO(),
  status: 'ALL',
  employeeId: 'ALL'
}

export default function AllHistory() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    employeeApi.list().then((all) => setEmployees(all.filter((e) => e.role === ROLES.EMPLOYEE)))
  }, [])

  const load = () => {
    setIsLoading(true)
    setLoadError('')
    attendanceApi
      .getAllHistory(filters)
      .then(setRecords)
      .catch((err) => setLoadError(err.message || 'Gagal memuat riwayat absen.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [filters])

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))].sort(),
    [employees],
  )

  const onTimeCount = records.filter((r) => r.status === 'ON_TIME').length
  const lateCount = records.filter((r) => r.status === 'LATE').length
  const outOfRadiusCount = records.filter((r) => r.checkIn && !r.checkIn.withinRadius).length

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Riwayat Absen Seluruh Karyawan</h1>
        <p className="mt-1 text-sm text-muted">Pantau kehadiran WFH seluruh tim (tampilan hanya-baca).</p>
      </div>

      
      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label" htmlFor="ah-start">Dari Tanggal</label>
            <input
              id="ah-start"
              type="date"
              className="input"
              value={filters.startDate}
              max={filters.endDate}
              onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="label" htmlFor="ah-end">Sampai Tanggal</label>
            <input
              id="ah-end"
              type="date"
              className="input"
              value={filters.endDate}
              min={filters.startDate}
              onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            />
          </div>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="ALL">Semua Status</option>
            <option value="ON_TIME">Tepat Waktu</option>
            <option value="LATE">Terlambat</option>
          </Select>
          <Select
            label="Karyawan"
            value={filters.employeeId}
            onChange={(e) => setFilters((f) => ({ ...f, employeeId: e.target.value }))}
          >
            <option value="ALL">Semua Karyawan</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </Select>
         
        </div>
      </Card>

      <Card>
        {loadError ? (
          <Alert onRetry={load}>{loadError}</Alert>
        ) : isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-line/40" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-display text-sm font-semibold text-ink">Belum ada riwayat pada filter ini</p>
            <p className="text-sm text-muted">Coba ubah rentang tanggal atau filter lainnya.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="py-3 pr-4">Karyawan</th>
                  <th className="py-3 pr-4">Tanggal</th>
                  <th className="py-3 pr-4">Masuk</th>
                  <th className="py-3 pr-4">Pulang</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-line/70 last:border-0">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: r.employeeAvatarColor }}
                        >
                          {r.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{r.employeeName}</p>
                          <p className="text-xs text-muted">{r.employeeDepartment}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-ink">{formatDateTimeShort(r.date)}</td>
                    <td className="py-3.5 pr-4 font-mono text-ink">{r.checkIn ? formatTime(r.checkIn.time) : '—'}</td>
                    <td className="py-3.5 pr-4 font-mono text-ink">{r.checkOut ? formatTime(r.checkOut.time) : '—'}</td>
                    <td className="py-3.5 pr-4">
                      <Badge tone={r.status === 'ON_TIME' ? 'success' : 'warning'} dot>
                        {r.status === 'ON_TIME' ? 'Tepat Waktu' : 'Terlambat'}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge tone={r.checkIn?.withinRadius ? 'success' : 'danger'}>
                        {r.checkIn?.withinRadius ? 'Dalam Radius' : 'Luar Radius'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function SummaryStat({ label, value, tone = 'text-ink' }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  )
}
