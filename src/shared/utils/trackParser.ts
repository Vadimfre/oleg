export interface TrackPoint {
  lat: number
  lng: number
  ele?: number
}

export interface ParsedTrack {
  name: string
  points: TrackPoint[]
  distance: number
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calculateTotalDistance(points: TrackPoint[]): number {
  if (points.length < 2) return 0
  let total = 0
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(
      points[i].lat,
      points[i].lng,
      points[i + 1].lat,
      points[i + 1].lng,
    )
  }
  return total
}

function parseCoordinateString(text: string): TrackPoint[] {
  const points: TrackPoint[] = []
  const parts = text.trim().split(/\s+/)

  for (const part of parts) {
    const coords = part.split(',').map((c) => parseFloat(c.trim()))
    if (coords.length >= 2 && !Number.isNaN(coords[0]) && !Number.isNaN(coords[1])) {
      const lng = coords[0]
      const lat = coords[1]
      const ele = coords.length >= 3 ? coords[2] : undefined
      if (lat !== 0 || lng !== 0) {
        points.push({ lat, lng, ele })
      }
    }
  }

  return points
}

function parseGpxPoints(xmlDoc: Document): TrackPoint[] {
  const points: TrackPoint[] = []
  const trackPoints = xmlDoc.querySelectorAll('trkpt')

  trackPoints.forEach((trkpt) => {
    const lat = parseFloat(trkpt.getAttribute('lat') || '0')
    const lon = parseFloat(trkpt.getAttribute('lon') || '0')
    const eleElement = trkpt.querySelector('ele')
    const ele = eleElement
      ? parseFloat(eleElement.textContent || '0')
      : undefined
    if (lat && lon) {
      points.push({ lat, lng: lon, ele })
    }
  })

  if (points.length === 0) {
    const rtePoints = xmlDoc.querySelectorAll('rtept')
    rtePoints.forEach((rtept) => {
      const lat = parseFloat(rtept.getAttribute('lat') || '0')
      const lon = parseFloat(rtept.getAttribute('lon') || '0')
      if (lat && lon) points.push({ lat, lng: lon })
    })
  }

  return points
}

function parseKmlPoints(xmlDoc: Document): TrackPoint[] {
  const points: TrackPoint[] = []
  const coordElements = xmlDoc.querySelectorAll('coordinates')

  coordElements.forEach((el) => {
    const text = el.textContent?.trim()
    if (text) {
      points.push(...parseCoordinateString(text))
    }
  })

  return points
}

/** Парсит GPX или KML в единый формат трека */
export function parseTrackFile(fileText: string, fileName?: string): ParsedTrack | null {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(fileText, 'text/xml')
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      console.error('Ошибка парсинга трека:', parserError.textContent)
      return null
    }

    const rootName = xmlDoc.documentElement.tagName.toLowerCase()
    const isKml = rootName.includes('kml')

    let points: TrackPoint[] = []
    if (isKml) {
      points = parseKmlPoints(xmlDoc)
    } else {
      points = parseGpxPoints(xmlDoc)
    }

    if (points.length === 0) {
      return null
    }

    const nameEl =
      xmlDoc.querySelector('trk > name') ||
      xmlDoc.querySelector('Document > name') ||
      xmlDoc.querySelector('name')
    const trackName =
      nameEl?.textContent?.trim() ||
      fileName?.replace(/\.(gpx|kml)$/i, '') ||
      'Маршрут'

    return {
      name: trackName,
      points,
      distance: calculateTotalDistance(points),
    }
  } catch (error) {
    console.error('Ошибка обработки файла трека:', error)
    return null
  }
}

/** @deprecated Используйте parseTrackFile */
export function parseGPX(gpxText: string) {
  return parseTrackFile(gpxText)
}

export type GPXPoint = TrackPoint
export type GPXTrack = ParsedTrack
