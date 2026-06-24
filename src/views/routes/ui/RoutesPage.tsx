'use client'

import { useState } from 'react'
import { RouteList } from '@/widgets/RouteList'
import { Button, Card } from '@/shared/ui'
import Link from 'next/link'
import { MapView } from '@/widgets/MapView'

export function RoutesPage() {
  const [showMap, setShowMap] = useState(true)

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-3xl p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
            Все маршруты Гродно
          </h1>
          <p className="text-lg text-dark-600 mb-6">
            🚴 6 веломаршрутов: от легких прогулок по центру до путешествия к Августовскому каналу
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/create">
              <Button variant="primary" size="lg">
                + Создать свой маршрут
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? '📋 Только список' : '🗺️ Показать карту'}
            </Button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <Card hover={false} className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b border-dark-200">
            <h2 className="text-2xl font-bold text-dark-900 mb-2">
              🗺️ Все маршруты на карте
            </h2>
            <p className="text-dark-600">
              Кликни на любой маршрут, чтобы увидеть подробности
            </p>
          </div>
          <div className="h-[500px]">
            <MapView />
          </div>
        </Card>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Поиск маршрутов..."
            className="flex-1 min-w-[250px] px-5 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none"
          />
          <select className="px-5 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none bg-white">
            <option>Все сложности</option>
            <option>Легкие</option>
            <option>Средние</option>
            <option>Сложные</option>
          </select>
          <select className="px-5 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none bg-white">
            <option>Сортировка</option>
            <option>По популярности</option>
            <option>По расстоянию</option>
            <option>По рейтингу</option>
          </select>
        </div>
      </div>
      
      {/* Routes List */}
      <RouteList />
    </div>
  )
}
