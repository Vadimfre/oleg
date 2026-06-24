'use client'

import type { RideLiveStats } from '../model/useRideRecorder'
import { formatDuration, formatPace, formatSpeed } from '@/shared/lib/ride/format'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { estimateCalories } from '@/shared/lib/ride/calories'

interface RideLivePanelProps {
  live: RideLiveStats
  routeTitle: string
  isAuthenticated: boolean
}

export function RideLivePanel({ live, routeTitle, isAuthenticated }: RideLivePanelProps) {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Запись поездки
          </p>
          <p className="font-bold text-sm truncate">{routeTitle}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCell label="Время" value={formatDuration(live.elapsedSec)} large />
        <StatCell
          label="В движении"
          value={formatDuration(live.movingSec)}
          sub="активное время"
        />
        <StatCell
          label="Проехали"
          value={formatDistance(live.distanceKm)}
          large
        />
        <StatCell label="Темп" value={formatPace(live.avgPaceMinPerKm)} />
        <StatCell label="Сейчас" value={formatSpeed(live.currentSpeedKmh)} />
        <StatCell label="Средняя" value={formatSpeed(live.avgSpeedKmh)} />
        <StatCell
          label="Ккал ≈"
          value={String(estimateCalories(live.movingSec, live.distanceKm))}
        />
      </div>

      {!isAuthenticated && (
        <p className="text-xs text-amber-300 bg-amber-400/10 rounded-lg px-3 py-2">
          Войдите в аккаунт — поездка сохранится в историю
        </p>
      )}
    </div>
  )
}

function StatCell({
  label,
  value,
  sub,
  large,
}: {
  label: string
  value: string
  sub?: string
  large?: boolean
}) {
  return (
    <div className="bg-white/5 rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className={`font-black tabular-nums ${large ? 'text-2xl' : 'text-lg'}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}
