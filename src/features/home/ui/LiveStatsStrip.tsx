'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/auth'
import { getRideAnalytics } from '@/features/rides/model/rides.api'
import { formatDistance } from '@/shared/lib/map/geo-utils'

export function LiveStatsStrip() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<{
    totalDistanceKm: number
    streakDays: number
    goalProgress: number
    currentMonthKm: number
    monthlyGoalKm: number
  } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    getRideAnalytics()
      .then((a) =>
        setData({
          totalDistanceKm: a.totalDistanceKm,
          streakDays: a.streakDays,
          goalProgress: a.goalProgress,
          currentMonthKm: a.currentMonthKm,
          monthlyGoalKm: a.monthlyGoalKm,
        }),
      )
      .catch(() => setData(null))
  }, [isAuthenticated])

  if (!isAuthenticated || !data) return null

  return (
    <Link
      href="/stats"
      className="block overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-white to-sky-50 p-4 card-hover group"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-dark-600">
          Ваша статистика
        </p>
        <span className="text-xs font-bold text-blue-600 group-hover:underline">Аналитика →</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <StatPill label="Всего" value={formatDistance(data.totalDistanceKm)} />
        <StatPill label="Серия" value={`${data.streakDays} дн 🔥`} />
        <StatPill
          label="Месяц"
          value={`${data.currentMonthKm}/${data.monthlyGoalKm} км`}
          sub={`${data.goalProgress}% цели`}
        />
      </div>
      <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, data.goalProgress)}%` }}
        />
      </div>
    </Link>
  )
}

function StatPill({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-lg font-black text-gray-900 tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-gray-500">{sub}</p>}
    </div>
  )
}
