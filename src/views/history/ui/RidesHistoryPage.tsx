'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/auth'
import { getRides, getRideStats, RideHistoryCard, type RideSummary, type RideStats } from '@/features/rides'
import { formatDuration } from '@/shared/lib/ride/format'
import { formatDistance } from '@/shared/lib/map/geo-utils'

export function RidesHistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [rides, setRides] = useState<RideSummary[]>([])
  const [stats, setStats] = useState<RideStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    Promise.all([getRides(), getRideStats()])
      .then(([r, s]) => {
        setRides(r)
        setStats(s)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Загрузка...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-[12px] border border-gray-100 p-10 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-black text-gray-900 uppercase mb-2">История поездок</h2>
          <p className="text-gray-600 mb-6">Войдите, чтобы видеть пройденные маршруты, темп и время</p>
          <Link
            href="/login"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold text-sm uppercase"
          >
            Войти
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">[ваши тренировки]</p>
          <h1 className="text-[40px] font-black text-gray-900 uppercase tracking-tight leading-none">
            История
            <br />
            поездок
          </h1>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <SummaryCard label="Поездок" value={String(stats.ridesCount)} />
            <SummaryCard
              label="Всего км"
              value={formatDistance(stats.totalDistanceKm)}
            />
            <SummaryCard label="В движении" value={formatDuration(stats.totalMovingSec)} />
            <SummaryCard
              label="Ср. скорость"
              value={
                stats.avgSpeedKmh != null ? `${stats.avgSpeedKmh} км/ч` : '—'
              }
            />
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-12">Загрузка истории...</p>
        ) : rides.length === 0 ? (
          <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">🚴</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Пока пусто</h3>
            <p className="text-gray-600 mb-6">
              Здесь появятся сохранённые поездки, когда они будут доступны в вашем аккаунте
            </p>
            <Link
              href="/map"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold text-sm uppercase"
            >
              Открыть карту
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideHistoryCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-100 p-4">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-black text-gray-900 tabular-nums">{value}</p>
    </div>
  )
}
