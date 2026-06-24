'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/auth'
import {
  getRideAnalytics,
  getAchievements,
  type RideAnalytics,
  type Achievement,
} from '@/features/rides'
import { MonthlyGoalCard } from '@/features/rides/ui/MonthlyGoalCard'
import { AchievementsGrid } from '@/features/achievements'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { formatDuration, formatSpeed, formatDateTime } from '@/shared/lib/ride/format'

export function StatsDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<RideAnalytics | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [goalKm, setGoalKm] = useState(80)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    Promise.all([getRideAnalytics(), getAchievements()])
      .then(([a, ach]) => {
        setAnalytics(a)
        setGoalKm(a.monthlyGoalKm)
        setAchievements(ach)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (authLoading || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Загрузка аналитики...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black uppercase mb-4">Аналитика</h2>
        <p className="text-gray-600 mb-6">Войдите, чтобы видеть графики и достижения</p>
        <Link href="/login" className="bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold">
          Войти
        </Link>
      </div>
    )
  }

  if (!analytics) return null

  const maxKm = Math.max(...analytics.monthlyKm.map((m) => m.km), 1)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-dark-900 text-white p-8 md:p-10 mb-8 shadow-hard">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
          <p className="relative text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">
            Дипломный модуль
          </p>
          <h1 className="relative text-[40px] md:text-[48px] font-black uppercase tracking-tight leading-none">
            Ваша
            <br />
            аналитика
          </h1>
          <p className="relative text-gray-300 mt-4 max-w-lg">
            Прогресс, рекорды и достижения — всё, что система собирает во время поездок
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatBox label="Всего км" value={formatDistance(analytics.totalDistanceKm)} dark />
          <StatBox label="Поездок" value={String(analytics.ridesCount)} />
          <StatBox
            label="Серия дней"
            value={`${analytics.streakDays} 🔥`}
          />
          <StatBox
            label="Достижений"
            value={`${analytics.unlockedAchievements}/${analytics.totalAchievements}`}
          />
        </div>

        <Link
          href="/weather"
          className="block mb-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-[12px] p-5 hover:shadow-lg transition-shadow"
        >
          <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Перед поездкой</p>
          <p className="text-lg font-black">Полный прогноз погоды → влажность, почасовой, 7 дней</p>
        </Link>

        <div className="mb-6">
          <MonthlyGoalCard
            currentKm={analytics.currentMonthKm}
            goalKm={goalKm}
            progress={analytics.goalProgress}
            editable
            onGoalUpdated={setGoalKm}
          />
        </div>

        <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-black uppercase tracking-tight mb-6">
            Километры по месяцам
          </h2>
          <div className="flex items-end gap-2 h-40">
            {analytics.monthlyKm.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gray-900 rounded-t-lg min-h-[4px] transition-all"
                  style={{ height: `${Math.max(4, (m.km / maxKm) * 100)}%` }}
                  title={`${m.km} км`}
                />
                <span className="text-[10px] text-gray-500 uppercase">{m.label}</span>
                <span className="text-xs font-bold text-gray-900">{m.km}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {analytics.personalRecords.longestRide && (
            <RecordCard
              title="Самая длинная"
              icon="🛤️"
              main={formatDistance(analytics.personalRecords.longestRide.distanceKm)}
              sub={analytics.personalRecords.longestRide.title}
              date={analytics.personalRecords.longestRide.date}
              href={`/history/${analytics.personalRecords.longestRide.id}`}
            />
          )}
          {analytics.personalRecords.fastestRide && (
            <RecordCard
              title="Самая быстрая"
              icon="⚡"
              main={formatSpeed(analytics.personalRecords.fastestRide.avgSpeedKmh)}
              sub={analytics.personalRecords.fastestRide.title}
              date={analytics.personalRecords.fastestRide.date}
              href={`/history/${analytics.personalRecords.fastestRide.id}`}
            />
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-black uppercase tracking-tight">Достижения</h2>
            <span className="text-sm text-gray-500">
              {achievements.filter((a) => a.unlocked).length} из {achievements.length}
            </span>
          </div>
          <AchievementsGrid achievements={achievements} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/navigate"
            className="bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold text-sm uppercase"
          >
            Новая поездка
          </Link>
          <Link
            href="/history"
            className="border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-sm"
          >
            История
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  dark,
}: {
  label: string
  value: string
  dark?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-4 card-hover ${dark ? 'bg-gray-900 text-white shadow-hard' : 'bg-white border border-gray-100 shadow-soft'}`}
    >
      <p className={`text-[10px] uppercase tracking-wide mb-1 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className="text-xl font-black tabular-nums">{value}</p>
    </div>
  )
}

function RecordCard({
  title,
  icon,
  main,
  sub,
  date,
  href,
}: {
  title: string
  icon: string
  main: string
  sub: string
  date: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-[12px] border border-gray-100 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-xs uppercase tracking-wide text-gray-400">{title}</p>
      </div>
      <p className="text-2xl font-black text-gray-900">{main}</p>
      <p className="text-sm font-semibold text-gray-700 mt-1 truncate">{sub}</p>
      <p className="text-xs text-gray-400 mt-2">{formatDateTime(date)}</p>
    </Link>
  )
}
