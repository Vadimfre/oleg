import { grodnoRoutes } from './grodnoRoutes'

const fromGrodno = (id: string): [number, number][] =>
  grodnoRoutes.find((r) => r.id === id)?.coordinates ?? [[53.6693, 23.8131]]

/** Координаты маршрутов по slug (lat, lng) */
export const ROUTE_COORDINATES_BY_SLUG: Record<string, [number, number][]> = {
  'avgustovsci-kanal': fromGrodno('august-canal'),
  pyshki: fromGrodno('pyshki'),
  'grodno-losevo': [
    [53.6693, 23.8131],
    [53.6750, 23.7950],
    [53.6820, 23.7780],
    [53.6900, 23.7650],
  ],
  'grodno-minsk': [
    [53.6693, 23.8131],
    [53.7200, 24.2000],
    [53.8200, 25.5000],
    [53.9000, 27.5500],
  ],
  'dlinnyj-marshrut': fromGrodno('rumlevskoe-lake'),
  pokatushka: fromGrodno('health-trail'),
}

export function getRouteCoordinates(
  slug?: string,
  coordinates?: [number, number][],
): [number, number][] {
  if (coordinates?.length) return coordinates
  if (slug && ROUTE_COORDINATES_BY_SLUG[slug]) return ROUTE_COORDINATES_BY_SLUG[slug]
  return [[53.6693, 23.8131]]
}
