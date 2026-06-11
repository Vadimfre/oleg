'use client'

import { useRouter } from 'next/navigation'
import { RouteCard } from '@/entities/route'
import { useRoutes } from '@/features/routes'
import { RouteResponse } from '@/shared/api/routes.api'
import type { RouteSort } from '@/entities/route'

interface RouteListProps {
  onRouteSelect?: (route: RouteResponse) => void
  filter?: 'all' | 'easy' | 'medium' | 'hard'
  searchQuery?: string
  sort?: RouteSort
}

export function RouteList({
  onRouteSelect,
  filter = 'all',
  searchQuery = '',
  sort = 'newest',
}: RouteListProps) {
  const router = useRouter()
  const { routes, isLoading, error } = useRoutes({
    difficulty: filter,
    q: searchQuery,
    sort,
  })

  const handleRouteClick = (route: RouteResponse) => {
    if (onRouteSelect) {
      onRouteSelect(route)
    } else {
      // Переход на страницу маршрута по slug
      router.push(`/routes/${route.slug}`)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-gray-100 rounded-[12px] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Ошибка загрузки маршрутов: {error.message}</p>
      </div>
    )
  }

  if (!isLoading && routes.length === 0) {
    return (
      <div className="text-center py-16 rounded-[12px] border border-gray-100 bg-white">
        <p className="text-lg font-semibold text-gray-900 mb-2">Ничего не найдено</p>
        <p className="text-gray-600 text-sm">Попробуй изменить поиск или фильтры</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          onClick={() => handleRouteClick(route)}
        />
      ))}
    </div>
  )
}
