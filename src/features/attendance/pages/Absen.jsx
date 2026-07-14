import { useEffect, useState } from 'react'
// import { useAuth } from "@/shared/hooks/useAuth"
import { useEmployee } from "@/features/auth/hooks/useEmployee"
import { useGeolocation } from "@/shared/hooks/useGeolocation"
import { useToast } from "@/shared/hooks/useToast"
import { attendanceApi } from "@/features/attendance/api/attendanceApi"
import { getDistanceInMeters } from "@/utils/geoUtils"
import { WFH_RADIUS_METERS } from "@/utils/constants"
import { formatTime } from "@/utils/dateUtils"
import Card from "@/shared/components/common/Card.jsx"
import Badge from "@/shared/components/common/Badge.jsx"
import Alert from "@/shared/components/common/Alert.jsx"
import CheckInCard from "@/features/attendance/components/CheckInCard.jsx"
import LocationStatus from "@/features/attendance/components/LocationStatus.jsx"
import Spinner from "@/shared/components/common/Spinner.jsx"

export default function Absen() {
  // const { user } = useAuth()
  const employee = useEmployee();
  const geo = useGeolocation()
  const toast = useToast()

  const [today, setToday] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [lastDistance, setLastDistance] = useState(null)
  const [lastWithinRadius, setLastWithinRadius] = useState(null)

  const loadToday = () => {
    setIsFetching(true)
    setFetchError('')
    attendanceApi
      .getToday(employee.employeeId)
      .then(setToday)
      .catch((err) => setFetchError(err.message || 'Gagal memuat status absen hari ini.'))
      .finally(() => setIsFetching(false))
  }

  useEffect(loadToday, [employee.employeeId])

  const mode = today?.checkIn ? 'CHECK_OUT' : 'CHECK_IN'
  const alreadyDone = today?.checkIn && today?.checkOut

  const handleStamp = async () => {
    setErrorMsg('')
    setIsSubmitting(true)
    try {
      const coords = await geo.locate()
      // const distanceMeters = getDistanceInMeters(coords, employee.homeLocation)
      // const withinRadius = distanceMeters <= WFH_RADIUS_METERS
      setLastDistance(distanceMeters)
      setLastWithinRadius(withinRadius)

      const payload = {
        userId: employee.employeeId,
        coords,
        // address: user.homeLocation.label,
        // distanceMeters,
        // withinRadius,
      }

      const record =
        mode === 'CHECK_IN' ? await attendanceApi.checkIn(payload) : await attendanceApi.checkOut(payload)

      setToday(record)
      toast.success(mode === 'CHECK_IN' ? 'Absen masuk berhasil dicatat.' : 'Absen pulang berhasil dicatat.')
    } catch (err) {
      const message = err.message || 'Terjadi kesalahan saat absen.'
      setErrorMsg(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFetching) return <Spinner label="Memuat status absen..." />

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Halo, {employee.fullName.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted">
          Lokasi WFH terdaftar: <span className="font-medium text-ink"></span>
        </p>
      </div>

      {fetchError ? (
        <Card>
          <Alert onRetry={loadToday}>{fetchError}</Alert>
        </Card>
      ) : (
        <Card>
        {alreadyDone ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-success">
              <CheckIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Presensi hari ini selesai</p>
              <p className="mt-1 text-sm text-muted">Sampai jumpa besok!</p>
            </div>
            <div className="flex gap-8 pt-2">
              <div className="text-center">
                <p className="text-xs text-muted">Masuk</p>
                <p className="font-mono text-lg font-semibold text-ink">{formatTime(today.checkIn.time)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted">Pulang</p>
                <p className="font-mono text-lg font-semibold text-ink">{formatTime(today.checkOut.time)}</p>
              </div>
            </div>
            <Badge tone={today.status === 'ON_TIME' ? 'success' : 'warning'} dot>
              {today.status === 'ON_TIME' ? 'Tepat Waktu' : 'Terlambat'}
            </Badge>
          </div>
        ) : (
          <>
            <CheckInCard mode={mode} onStamp={handleStamp} isLoading={isSubmitting} disabled={isSubmitting} />
            <div className="mt-2">
              <LocationStatus
                geoStatus={geo.status}
                coords={geo.coords}
                distanceMeters={lastDistance}
                withinRadius={lastWithinRadius}
                error={geo.error}
                homeLabel=''
              />
            </div>
            {errorMsg && (
              <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-danger">{errorMsg}</p>
            )}
          </>
        )}
        </Card>
      )}

      {today?.checkIn && !alreadyDone && (
        <Card title="Absen masuk hari ini" className="text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Waktu masuk</span>
            <span className="font-mono font-medium text-ink">{formatTime(today.checkIn.time)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted">Status</span>
            <Badge tone={today.status === 'ON_TIME' ? 'success' : 'warning'} dot>
              {today.status === 'ON_TIME' ? 'Tepat Waktu' : 'Terlambat'}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted">Lokasi</span>
            <Badge tone={today.checkIn.withinRadius ? 'success' : 'danger'}>
              {today.checkIn.withinRadius ? 'Dalam Radius' : 'Luar Radius'}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
