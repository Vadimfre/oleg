export interface LatLng {
  lat: number
  lng: number
}

/** Расстояние между точками в км (Haversine) */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

/** Длина полилинии в км */
export function polylineLengthKm(points: LatLng[]): number {
  if (points.length < 2) return 0
  let total = 0
  for (let i = 0; i < points.length - 1; i++) {
    total += distanceKm(points[i], points[i + 1])
  }
  return total
}

/** Ближайшая точка на треке + индекс + расстояние до неё в км */
export function nearestPointOnTrack(
  user: LatLng,
  track: LatLng[],
): { point: LatLng; index: number; distanceKm: number } | null {
  if (track.length === 0) return null

  let minDist = Infinity
  let nearest = track[0]
  let nearestIndex = 0

  for (let i = 0; i < track.length; i++) {
    const d = distanceKm(user, track[i])
    if (d < minDist) {
      minDist = d
      nearest = track[i]
      nearestIndex = i
    }
  }

  return { point: nearest, index: nearestIndex, distanceKm: minDist }
}

/** Оставшаяся дистанция по треку от ближайшей точки до конца, км */
export function remainingTrackDistanceKm(track: LatLng[], fromIndex: number): number {
  if (fromIndex >= track.length - 1) return 0
  return polylineLengthKm(track.slice(fromIndex))
}

/** Форматирование расстояния */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} м`
  return `${km.toFixed(1)} км`
}
