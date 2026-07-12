/**
 * Menghitung jarak antara dua titik koordinat (lat/lng) dalam meter
 * menggunakan formula Haversine.
 */
export function getDistanceInMeters(coordA, coordB) {
  if (!coordA || !coordB) return Infinity

  const R = 6371000 // radius bumi dalam meter
  const toRad = (deg) => (deg * Math.PI) / 180

  const dLat = toRad(coordB.lat - coordA.lat)
  const dLng = toRad(coordB.lng - coordA.lng)

  const lat1 = toRad(coordA.lat)
  const lat2 = toRad(coordB.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function formatDistance(meters) {
  if (!isFinite(meters)) return '—'
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}
