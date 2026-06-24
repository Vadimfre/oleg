'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button, Card } from '@/shared/ui'

const RouteBuilderMap = dynamic(
  () => import('@/widgets/RouteBuilderMap').then((m) => m.RouteBuilderMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500 rounded-3xl">
        Загрузка карты…
      </div>
    ),
  },
)

interface RoutePoint {
  lat: number
  lng: number
  id: string
}

export function CreateRoutePage() {
  const [routeName, setRouteName] = useState('')
  const [description, setDescription] = useState('')
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [distance, setDistance] = useState(0)

  const handleRouteChange = (points: RoutePoint[], dist: number) => {
    setRoutePoints(points)
    setDistance(dist)
  }

  const estimatedTime = Math.round((distance / 15) * 60) // Примерная скорость 15 км/ч

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-soft p-6">
        <h1 className="text-3xl font-bold text-dark-900 mb-2">
          Создать новый маршрут
        </h1>
        <p className="text-dark-600">
          Отметь точки на карте и создай свой уникальный маршрут
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 space-y-4">
          <Card hover={false}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Название маршрута
                </label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Например: Прогулка по центру"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Описание
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Краткое описание маршрута"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Сложность
                </label>
                <select className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none bg-white">
                  <option value="easy">🟢 Легкий</option>
                  <option value="medium">🟡 Средний</option>
                  <option value="hard">🔴 Сложный</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Тип покрытия
                </label>
                <select className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none bg-white">
                  <option>Асфальт</option>
                  <option>Грунт</option>
                  <option>Гравий</option>
                  <option>Смешанный</option>
                </select>
              </div>
            </div>
          </Card>

          <Card hover={false} className="bg-primary-50">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-dark-900 mb-1">Подсказка</h3>
                <p className="text-sm text-dark-600">
                  Кликай на карту, чтобы добавить точки маршрута. Первая точка - старт, последняя - финиш.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button variant="primary" size="lg" fullWidth>
              Сохранить маршрут
            </Button>
            <Button variant="outline" size="lg" fullWidth>
              Отмена
            </Button>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[600px]">
            <RouteBuilderMap onRouteChange={handleRouteChange} />
          </div>
          
          <Card hover={false}>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {distance.toFixed(1)} км
                </div>
                <div className="text-sm text-dark-600">Дистанция</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {routePoints.length}
                </div>
                <div className="text-sm text-dark-600">Точек маршрута</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {estimatedTime > 0 ? `${estimatedTime} мин` : '0 мин'}
                </div>
                <div className="text-sm text-dark-600">Примерное время</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
