'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button, Card } from '@/shared/ui'

const StaticRouteMap = dynamic(
  () => import('@/widgets/StaticRouteMap').then((m) => m.StaticRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500 rounded-3xl">
        Загрузка карты…
      </div>
    ),
  },
)

export function NavigatePage() {
  const [isNavigating, setIsNavigating] = useState(false)

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl shadow-soft p-6">
        <h1 className="text-3xl font-bold text-dark-900 mb-2 flex items-center gap-3">
          <span className="text-4xl">🧭</span>
          Навигация
        </h1>
        <p className="text-dark-600">
          Следуй по маршруту в реальном времени
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card hover={false} className="bg-gradient-to-br from-primary-50 to-white">
            <h3 className="font-semibold text-lg mb-4 text-dark-900">Текущий маршрут</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-dark-600 mb-1">Название</div>
                <div className="font-semibold text-dark-900">Центральный маршрут</div>
              </div>
              <div>
                <div className="text-sm text-dark-600 mb-1">Осталось</div>
                <div className="text-4xl font-bold text-primary">8.5 км</div>
              </div>
              <div>
                <div className="text-sm text-dark-600 mb-1">Время до финиша</div>
                <div className="text-2xl font-semibold text-dark-900">~35 мин</div>
              </div>
            </div>
          </Card>

          <Card hover={false} className="bg-green-50">
            <h3 className="font-semibold mb-3 text-dark-900">Следующая точка</h3>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-green-600">→ 500 м</div>
              <p className="text-dark-700 font-medium">
                Поверните направо на ул. Ленина
              </p>
            </div>
          </Card>

          <Card hover={false}>
            <h3 className="font-semibold mb-4 text-dark-900">Статистика</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-dark-600">Средняя скорость</span>
                <span className="font-semibold text-dark-900 text-lg">18 км/ч</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-600">Пройдено</span>
                <span className="font-semibold text-dark-900 text-lg">4.0 км</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-600">В пути</span>
                <span className="font-semibold text-dark-900 text-lg">13 мин</span>
              </div>
            </div>
          </Card>

          <Button
            variant={isNavigating ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={() => setIsNavigating(!isNavigating)}
          >
            {isNavigating ? '⏸️ Пауза' : '▶️ Начать навигацию'}
          </Button>

          {isNavigating && (
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth
              onClick={() => setIsNavigating(false)}
            >
              ⏹️ Завершить маршрут
            </Button>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[600px]">
            <StaticRouteMap routeSlug="pokatushka" showGrodnoRoutes={false} />
          </div>
          
          {isNavigating && (
            <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-6 text-center">
              <div className="text-green-800 font-bold text-lg mb-2 flex items-center justify-center gap-2">
                <span className="text-2xl animate-pulse">🚴‍♂️</span>
                Навигация активна
              </div>
              <div className="text-green-700">
                Следуй по синей линии на карте
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
