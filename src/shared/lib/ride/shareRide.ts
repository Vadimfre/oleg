import type { RideSummary } from '@/features/rides/model/rides.api'
import { formatDuration, formatPace } from '@/shared/lib/ride/format'

export function buildRideShareText(ride: RideSummary): string {
  const pace = ride.avgPaceMinPerKm ? formatPace(ride.avgPaceMinPerKm) : '—'
  return [
    `🚴 BikeRoutes — ${ride.routeTitle}`,
    `📏 ${ride.distanceKm.toFixed(1)} км`,
    `⏱ ${formatDuration(ride.elapsedSec)} (в движении ${formatDuration(ride.movingSec)})`,
    `⚡ Темп: ${pace}`,
    ride.avgSpeedKmh ? `📊 Ср. ${ride.avgSpeedKmh} км/ч` : '',
    '',
    'Гродно · bikeroutes',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function shareRide(ride: RideSummary): Promise<'shared' | 'copied'> {
  const text = buildRideShareText(ride)

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `Поездка: ${ride.routeTitle}`,
        text,
      })
      return 'shared'
    } catch {
      /* fallback copy */
    }
  }

  await navigator.clipboard.writeText(text)
  return 'copied'
}
