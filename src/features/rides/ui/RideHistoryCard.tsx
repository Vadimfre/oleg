'use client'

import Link from 'next/link'
import type { RideSummary } from '../model/rides.api'
import { formatDateTime, formatDuration, formatPace, formatSpeed } from '@/shared/lib/ride/format'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { estimateCalories } from '@/shared/lib/ride/calories'

interface RideHistoryCardProps {
  ride: RideSummary
}

export function RideHistoryCard({ ride }: RideHistoryCardProps) {
  return (
    <Link
      href={`/history/${ride.id}`}
      className="block bg-white rounded-[12px] border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {ride.routeTitle}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{formatDateTime(ride.startedAt)}</p>
        </div>
        {ride.routeCompletion != null && (
          <div className="shrink-0 text-center bg-gray-900 text-white rounded-xl px-3 py-2">
            <div className="text-lg font-black leading-none">{Math.round(ride.routeCompletion)}%</div>
            <div className="text-[9px] uppercase tracking-wide opacity-70">маршрута</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric label="Дистанция" value={formatDistance(ride.distanceKm)} />
        <Metric label="Время" value={formatDuration(ride.elapsedSec)} />
        <Metric label="Темп" value={formatPace(ride.avgPaceMinPerKm)} />
        <Metric label="Ср. скорость" value={formatSpeed(ride.avgSpeedKmh)} />
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {ride.maxSpeedKmh != null && ride.maxSpeedKmh > 0 && (
          <>Макс. {formatSpeed(ride.maxSpeedKmh)} · </>
        )}
        ≈ {estimateCalories(ride.movingSec, ride.distanceKm)} ккал
      </p>
    </Link>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-base font-bold text-gray-900 tabular-nums">{value}</p>
    </div>
  )
}
