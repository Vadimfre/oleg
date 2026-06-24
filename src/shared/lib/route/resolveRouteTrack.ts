import { ROUTES_DATA } from '@/entities/route/model/constants'

/** GPX/KML путь: из API или fallback по slug из локальных данных */
export function resolveRouteGpxFile(
  route: { slug: string; gpxFile?: string | null },
): string | undefined {
  const fromApi = route.gpxFile?.trim()
  if (fromApi) return fromApi
  const local = ROUTES_DATA.find((r) => r.slug === route.slug)
  return local?.gpxFile || undefined
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
