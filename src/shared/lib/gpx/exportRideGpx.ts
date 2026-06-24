import type { TrackPoint } from '@/features/rides/model/rides.api'

export function buildRideGpx(name: string, points: TrackPoint[]): string {
  const trkpts = points
    .map(
      (p) =>
        `      <trkpt lat="${p.lat}" lon="${p.lng}">` +
        (p.t ? `<time>${new Date(p.t).toISOString()}</time>` : '') +
        `</trkpt>`,
    )
    .join('\n')

  const escaped = name.replace(/&/g, '&amp;').replace(/</g, '&lt;')

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="BikeRoutes" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escaped}</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${escaped}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`
}

export function downloadGpx(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/gpx+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.gpx') ? filename : `${filename}.gpx`
  a.click()
  URL.revokeObjectURL(url)
}
