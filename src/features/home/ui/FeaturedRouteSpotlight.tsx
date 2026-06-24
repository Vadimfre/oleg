'use client'

import Link from 'next/link'
import { useRoutes } from '@/features/routes'
import { useWeather } from '@/features/weather'

export function FeaturedRouteSpotlight() {
  const { routes, isLoading } = useRoutes()
  const { weather } = useWeather()

  if (isLoading || routes.length === 0) return null

  const featured = routes.find((r) => r.slug === 'grodno-losevo') ?? routes[0]
  const score = weather?.cyclingScore

  return (
    <div className="relative overflow-hidden rounded-3xl bg-dark-900 text-white min-h-[280px] card-hover group">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${featured.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/85 to-dark-900/40" />

      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 mesh-blob animate-float" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-blue-500/15 mesh-blob animate-float-delayed" />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-6">
        <div className="min-w-0">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3 px-3 py-1 rounded-full bg-primary/15 border border-primary/30">
            Маршрут недели
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
            {featured.title}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
            {featured.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="font-bold tabular-nums">{featured.distance} км</span>
            <span className="text-gray-500">·</span>
            <span>{featured.duration} ч</span>
            <span className="text-gray-500">·</span>
            <span>↑ {featured.elevation} м</span>
            {score != null && (
              <>
                <span className="text-gray-500">·</span>
                <span className="text-primary font-bold">Вело-индекс {score}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Link
            href={`/navigate?slug=${featured.slug}`}
            className="w-full text-center bg-primary text-dark-900 font-black uppercase text-xs sm:text-sm px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl btn-glow"
          >
            Открыть маршрут
          </Link>
          <Link
            href={`/routes/${featured.slug}`}
            className="w-full text-center border border-white/30 font-bold uppercase text-xs sm:text-sm px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  )
}
