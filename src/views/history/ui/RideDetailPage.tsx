'use client'

import { useEffect, useState } from 'react'
import { showToast } from '@/shared/ui/Toast'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getRide, type RideDetail } from '@/features/rides'
import {
  formatDateTime,
  formatDuration,
  formatPace,
  formatSpeed,
} from '@/shared/lib/ride/format'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { buildRideGpx, downloadGpx } from '@/shared/lib/gpx/exportRideGpx'
import { estimateCalories } from '@/shared/lib/ride/calories'
import { shareRide } from '@/shared/lib/ride/shareRide'

const RideTrackMap = dynamic(
  () => import('@/widgets/RideTrackMap').then((m) => m.RideTrackMap),
  { ssr: false, loading: () => <div className="h-[280px] bg-gray-100 rounded-2xl animate-pulse" /> },
)

export function RideDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const [ride, setRide] = useState<RideDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)

  const calories = ride ? estimateCalories(ride.movingSec, ride.distanceKm) : 0

  useEffect(() => {
    if (!id || Number.isNaN(id)) return
    getRide(id)
      .then(setRide)
      .catch((e) => setError(e instanceof Error ? e.message : 'Ошибка'))
  }, [id])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/history" className="font-bold underline">
          ← К истории
        </Link>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-500">
        Загрузка поездки...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/history"
          className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 inline-block"
        >
          ← Все поездки
        </Link>

        <div className="bg-white rounded-[12px] border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {formatDateTime(ride.startedAt)}
            </p>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              {ride.routeTitle}
            </h1>
            {ride.routeSlug && (
              <Link
                href={`/routes/${ride.routeSlug}`}
                className="text-sm text-blue-600 font-semibold mt-2 inline-block"
              >
                Страница маршрута →
              </Link>
            )}
          </div>

          <RideTrackMap points={ride.trackPoints} className="w-full h-[300px]" />

          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DetailMetric label="Проехали" value={formatDistance(ride.distanceKm)} highlight />
            <DetailMetric label="Общее время" value={formatDuration(ride.elapsedSec)} />
            <DetailMetric label="В движении" value={formatDuration(ride.movingSec)} />
            <DetailMetric label="Темп" value={formatPace(ride.avgPaceMinPerKm)} />
            <DetailMetric label="Средняя скорость" value={formatSpeed(ride.avgSpeedKmh)} />
            <DetailMetric label="Макс. скорость" value={formatSpeed(ride.maxSpeedKmh)} />
            {ride.routeCompletion != null && (
              <DetailMetric
                label="Маршрута пройдено"
                value={`${Math.round(ride.routeCompletion)}%`}
              />
            )}
            {ride.maxOffRouteKm > 0.05 && (
              <DetailMetric
                label="Макс. отклонение"
                value={formatDistance(ride.maxOffRouteKm)}
              />
            )}
            <DetailMetric label="Калории ≈" value={`${calories} ккал`} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <button
            type="button"
            disabled={sharing}
            onClick={async () => {
              setSharing(true)
              try {
                const r = await shareRide(ride)
                showToast(r === 'shared' ? 'Отправлено!' : 'Скопировано в буфер')
              } catch {
                showToast('Не удалось поделиться')
              } finally {
                setSharing(false)
              }
            }}
            className="flex-1 min-w-[140px] border-2 border-blue-600 text-blue-700 py-4 rounded-[12px] font-bold uppercase tracking-wide text-sm hover:bg-blue-50 disabled:opacity-50"
          >
            {sharing ? '...' : '📤 Поделиться'}
          </button>
          {ride.trackPoints.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const gpx = buildRideGpx(ride.routeTitle, ride.trackPoints)
                downloadGpx(`bikeroutes-${ride.id}`, gpx)
              }}
              className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-[12px] font-bold uppercase tracking-wide text-sm hover:bg-gray-50"
            >
              ⬇ Скачать GPX
            </button>
          )}
          <Link
            href="/navigate"
            className="flex-1 text-center bg-gray-900 text-white py-4 rounded-[12px] font-bold uppercase tracking-wide hover:bg-gray-800"
          >
            Новая поездка
          </Link>
        </div>
      </div>
    </div>
  )
}

function DetailMetric({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={highlight ? 'col-span-2 sm:col-span-1' : ''}>
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      <p
        className={`font-black tabular-nums ${highlight ? 'text-3xl text-gray-900' : 'text-xl text-gray-900'}`}
      >
        {value}
      </p>
    </div>
  )
}
