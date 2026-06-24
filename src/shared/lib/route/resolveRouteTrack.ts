/**
 * Каноническое соответствие slug → файл трека в public/gpx/
 * (источник истины для отображения на карте)
 */
export const ROUTE_TRACK_BY_SLUG: Record<string, string> = {
  'avgustovsci-kanal': '/gpx/avgust-velo.kml',
  pyshki: '/gpx/pyshki.gpx',
  'grodno-losevo': '/gpx/grodno-losevo.gpx',
  'grodno-minsk': '/gpx/grodno-minsk.gpx',
  'dlinnyj-marshrut': '/gpx/Long-bike.gpx',
  'grodno-korobchitsy': '/gpx/grodno-korobchitsy.gpx',
}

/** GPX/KML путь: сначала канонический по slug, затем из API */
export function resolveRouteGpxFile(
  route: { slug: string; gpxFile?: string | null },
): string | undefined {
  const canonical = ROUTE_TRACK_BY_SLUG[route.slug]
  if (canonical) return canonical
  const fromApi = route.gpxFile?.trim()
  return fromApi || undefined
}

/** Координаты из API (JSON [[lat,lng],...]) */
export function parseRouteCoordinates(
  raw?: string | null,
): [number, number][] {
  if (!raw?.trim()) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((point) => {
        if (!Array.isArray(point) || point.length < 2) return null
        const lat = Number(point[0])
        const lng = Number(point[1])
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
        return [lat, lng] as [number, number]
      })
      .filter((p): p is [number, number] => p !== null)
  } catch {
    return []
  }
}

export function serializeCoordinates(coords: [number, number][]): string {
  if (!coords.length) return ''
  return coords.map((c) => `${c[0]},${c[1]}`).join(';')
}
