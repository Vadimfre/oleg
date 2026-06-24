'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/shared/ui'
import { useRoutes } from '@/features/routes'
import { WeatherCard, RideReadinessPanel } from '@/features/weather'
import {
  parseRouteCoordinates,
  resolveRouteGpxFile,
} from '@/shared/lib/route/resolveRouteTrack'

const LiveNavigationMap = dynamic(
  () =>
    import('@/widgets/LiveNavigationMap').then((m) => m.LiveNavigationMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center">
        <span className="text-gray-500">Загрузка карты...</span>
      </div>
    ),
  },
)

function NavigatePageContent() {
  const searchParams = useSearchParams()
  const slugFromUrl = searchParams.get('slug') || 'pyshki'
  const { routes, isLoading: routesLoading } = useRoutes()
  const [selectedSlug, setSelectedSlug] = useState(slugFromUrl)

  useEffect(() => {
    if (slugFromUrl) setSelectedSlug(slugFromUrl)
  }, [slugFromUrl])

  const selectedRoute = routes.find((r) => r.slug === selectedSlug) ?? routes[0]
  const trackGpx = useMemo(
    () => (selectedRoute ? resolveRouteGpxFile(selectedRoute) : undefined),
    [selectedRoute?.slug, selectedRoute?.gpxFile],
  )
  const trackCoords = useMemo(
    () =>
      selectedRoute ? parseRouteCoordinates(selectedRoute.coordinates) : [],
    [selectedRoute?.coordinates],
  )

  return (
    <div className="container mx-auto px-4 space-y-6 pb-12">
      <div className="relative overflow-hidden rounded-3xl bg-dark-900 text-white p-8 shadow-hard">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/25 rounded-full blur-3xl" />
        <h1 className="relative text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
          <span className="text-4xl">🧭</span>
          Маршрут на карте
        </h1>
        <p className="relative text-gray-300 max-w-2xl">
          Выберите маршрут, изучите его трек на карте и перейдите к подробному описанию
          перед поездкой.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <WeatherCard compact />

          {selectedRoute && (
            <RideReadinessPanel
              routeTitle={selectedRoute.title}
              routeDistance={selectedRoute.distance}
              routeDifficulty={selectedRoute.difficulty}
            />
          )}

          <Card hover={false}>
            <h3 className="font-semibold text-lg mb-4 text-dark-900">Маршрут</h3>
            {routesLoading ? (
              <p className="text-sm text-gray-500">Загрузка...</p>
            ) : (
              <select
                value={selectedSlug}
                onChange={(e) => {
                  setSelectedSlug(e.target.value)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4"
              >
                {routes.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.title} ({r.distance} км)
                  </option>
                ))}
              </select>
            )}

            {selectedRoute && (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-dark-600">Длина маршрута: </span>
                  <span className="font-bold text-primary text-xl">
                    {selectedRoute.distance} км
                  </span>
                </div>
                <div>
                  <span className="text-dark-600">Ориентировочное время: </span>
                  <span className="font-semibold">{selectedRoute.duration} ч</span>
                </div>
                <div>
                  <span className="text-dark-600">Сложность: </span>
                  <span className="font-semibold">{selectedRoute.difficulty}</span>
                </div>
              </div>
            )}
          </Card>

          {selectedRoute && (
            <Link href={`/routes/${selectedRoute.slug}`}>
              <div className="w-full text-center border border-gray-200 hover:border-gray-300 bg-white rounded-xl px-5 py-4 font-semibold transition-colors">
                Описание маршрута
              </div>
            </Link>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="h-[min(70vh,600px)] min-h-[360px]">
            {selectedRoute && (
              <LiveNavigationMap
                key={selectedRoute.slug}
                gpxFile={trackGpx}
                coordinates={trackCoords}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NavigatePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 text-center text-gray-500">
          Загрузка навигации...
        </div>
      }
    >
      <NavigatePageContent />
    </Suspense>
  )
}
