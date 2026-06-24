'use client'

import { useWeather } from '../model/useWeather'
import { scoreLabel } from '../lib/weather-scoring'

interface RideReadinessPanelProps {
  routeTitle: string
  routeDistance: number
  routeDifficulty: 'easy' | 'medium' | 'hard'
}

export function RideReadinessPanel({
  routeTitle,
  routeDistance,
  routeDifficulty,
}: RideReadinessPanelProps) {
  const { weather, loading } = useWeather()

  if (loading || !weather) return null

  const diffPenalty = routeDifficulty === 'hard' ? 12 : routeDifficulty === 'medium' ? 5 : 0
  const readiness = Math.max(0, Math.min(100, weather.cyclingScore - diffPenalty))
  const sl = scoreLabel(readiness)

  const estHours = routeDistance / (readiness >= 70 ? 18 : 14)
  const estMin = Math.round(estHours * 60)

  return (
    <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-r from-sky-50 to-blue-50 p-4">
      <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-2">
        Готовность к поездке
      </p>
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sl.bg} flex items-center justify-center text-white font-black text-lg shadow`}
        >
          {readiness}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{routeTitle}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            Погода {weather.cyclingScore} · 💧 {weather.humidity}% · ~{estMin} мин в пути
          </p>
        </div>
      </div>
      {readiness < 45 && (
        <p className="text-xs text-amber-800 bg-amber-100 rounded-lg px-3 py-2 mt-3">
          ⚠️ Погода не идеальна — проверьте{' '}
          <a href="/weather" className="font-bold underline">
            полный прогноз
          </a>
        </p>
      )}
    </div>
  )
}
