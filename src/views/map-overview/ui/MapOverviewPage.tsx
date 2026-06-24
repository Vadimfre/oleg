'use client'

import dynamic from 'next/dynamic'
import { useRoutes } from '@/features/routes'

const RoutesOverviewMap = dynamic(
  () => import('@/widgets/RoutesOverviewMap').then((m) => m.RoutesOverviewMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center">
        <span className="text-gray-500">Загрузка карты...</span>
      </div>
    ),
  },
)

export function MapOverviewPage() {
  const { routes, isLoading } = useRoutes()

  return (
    <div className="container mx-auto px-4 space-y-6 pb-12">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl shadow-soft p-6">
        <h1 className="text-3xl font-bold text-dark-900 mb-2 flex items-center gap-3">
          <span className="text-4xl">🗺️</span>
          Карта всех маршрутов
        </h1>
        <p className="text-dark-600">
          Все веломаршруты Гродно на одной карте. Выберите подходящий трек и откройте его
          подробности прямо с карты.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Демо-вход: demo@bikeroutes.by / demo123456
        </p>
      </div>

      <div className="h-[min(75vh,650px)]">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center">
            Загрузка маршрутов...
          </div>
        ) : (
          <RoutesOverviewMap routes={routes} className="w-full h-full" />
        )}
      </div>
    </div>
  )
}
