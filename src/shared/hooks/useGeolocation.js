import { useCallback, useState } from 'react'

/**
 * Hook untuk mengambil lokasi perangkat via browser Geolocation API.
 * status: 'idle' | 'locating' | 'success' | 'error' | 'unsupported'
 */
export function useGeolocation() {
  const [status, setStatus] = useState('idle')
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)

  const locate = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        setStatus('unsupported')
        const err = new Error('Perangkat/browser ini tidak mendukung geolocation.')
        setError(err)
        reject(err)
        return
      }

      setStatus('locating')
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          setCoords(next)
          setStatus('success')
          resolve(next)
        },
        (err) => {
          let message = 'Gagal mengambil lokasi.'
          if (err.code === err.PERMISSION_DENIED) {
            message = 'Izin lokasi ditolak. Aktifkan izin lokasi di browser untuk absen.'
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            message = 'Lokasi tidak tersedia saat ini.'
          } else if (err.code === err.TIMEOUT) {
            message = 'Waktu permintaan lokasi habis. Coba lagi.'
          }
          const wrapped = new Error(message)
          setError(wrapped)
          setStatus('error')
          reject(wrapped)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    })
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setCoords(null)
    setError(null)
  }, [])

  return { status, coords, error, locate, reset }
}
