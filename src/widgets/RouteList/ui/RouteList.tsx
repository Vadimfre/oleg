'use client'

import { useRouter } from 'next/navigation'
import { RouteCard } from '@/entities/route'
import { useRoutes } from '@/features/routes'
import { RouteResponse } from '@/shared/api/routes.api'

interface RouteListProps {
  onRouteSelect?: (route: RouteResponse) => void
  filter?: 'all' | 'easy' | 'medium' | 'hard'
}

export function RouteList({ onRouteSelect, filter = 'all' }: RouteListProps) {
  const router = useRouter()
  const { routes, isLoading, error } = useRoutes({ difficulty: filter })

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
