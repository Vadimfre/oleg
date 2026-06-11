'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { RouteList } from '@/widgets/RouteList'
import { Button, Card } from '@/shared/ui'
import type { RouteSort } from '@/entities/route'
import { RouteNotificationsSubscribe } from '@/widgets/RouteNotificationsSubscribe'

const MapView = dynamic(() => import('@/widgets/MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500">
      Загрузка карты…
    </div>
  ),
})

export function RoutesPage() {
  const [showMap, setShowMap] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [sort, setSort] = useState<RouteSort>('newest')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  return (
    <div className="container mx-auto px-4 space-y-8">
      <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-3xl p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
            Все маршруты Гродно
          </h1>
          <p className="text-lg text-dark-600 mb-6">
            Веломаршруты: поиск по названию и описанию, фильтр по сложности и сортировка
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

      <div className="bg-white rounded-2xl shadow-soft p-6">
        <div className="flex flex-col lg:flex-row flex-wrap gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск: название, описание, slug…"
            className="flex-1 min-w-[220px] px-5 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none"
          />
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as typeof difficulty)
            }
            className="min-w-[180px] px-5 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none bg-white"
          >
            <option value="all">Все сложности</option>
            <option value="easy">Лёгкие</option>
            <option value="medium">Средние</option>
            <option value="hard">Сложные</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as RouteSort)}
            className="min-w-[220px] px-5 py-3 rounded-xl border-2 border-dark-200 focus:border-primary focus:outline-none bg-white"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="distance_asc">Дистанция ↑</option>
            <option value="distance_desc">Дистанция ↓</option>
            <option value="duration_asc">Время в пути ↑</option>
            <option value="duration_desc">Время в пути ↓</option>
            <option value="elevation_desc">Перепад высот ↓</option>
            <option value="elevation_asc">Перепад высот ↑</option>
            <option value="title_asc">По названию (А–Я)</option>
          </select>
        </div>
      </div>

      <RouteList
        filter={difficulty}
        searchQuery={debouncedSearch}
        sort={sort}
      />

      <RouteNotificationsSubscribe />
    </div>
  )
}
