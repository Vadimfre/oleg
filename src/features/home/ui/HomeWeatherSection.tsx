'use client'

import Link from 'next/link'
import { useAuth } from '@/features/auth'
import { RouteRecommendationBanner } from '@/features/rides'
import { WeatherCard } from '@/features/weather'

function GuestActionsPanel() {
  return (
    <div className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden bg-gradient-to-br from-dark-900 via-gray-900 to-dark-800 p-6 lg:p-8 text-white">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative z-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Планируй поездку
        </span>
        <h3 className="mb-2 text-2xl font-black uppercase tracking-tight">
          Выбери маршрут
          <br />
          под погоду
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-gray-300">
          Сравни дистанцию, сложность и покрытие — найди идеальный маршрут на сегодня.
        </p>
      </div>

      <div className="relative z-10 mt-6 space-y-3">
        <Link
          href="/compare"
          className="flex items-center justify-between rounded-xl bg-primary px-5 py-4 text-sm font-black uppercase tracking-tight text-dark-900 transition-transform hover:scale-[1.01] btn-glow"
        >
          <span>⚔️ Сравнить маршруты</span>
          <span aria-hidden>→</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-between rounded-xl border border-white/20 px-5 py-4 text-sm font-bold transition-colors hover:bg-white/10"
        >
          <span>Войти для рекомендации</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}

export function HomeWeatherSection() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <WeatherCard className="h-full rounded-none border-0 shadow-none" />

        <div className="border-t border-gray-100 lg:border-l lg:border-t-0">
          {isAuthenticated ? (
            <RouteRecommendationBanner embedded />
          ) : (
            <GuestActionsPanel />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 border-t border-gray-100 sm:grid-cols-2">
        <Link
          href="/weather"
          className="group flex items-center gap-4 border-b border-gray-100 bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-5 text-sm font-black uppercase tracking-tight text-white transition-all hover:from-sky-600 hover:to-blue-700 sm:border-b-0 sm:border-r sm:border-gray-200/20"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl transition-transform group-hover:scale-110">
            🌤
          </span>
          <span className="leading-snug">
            Полный прогноз
            <span className="block text-[11px] font-semibold normal-case tracking-normal text-white/80">
              Влажность · почасовой
            </span>
          </span>
        </Link>
        <Link
          href="/compare"
          className="group flex items-center gap-4 bg-gray-900 px-6 py-5 text-sm font-black uppercase tracking-tight text-white transition-colors hover:bg-gray-800"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl transition-transform group-hover:scale-110">
            ⚔️
          </span>
          <span className="leading-snug">
            Сравнить два маршрута
            <span className="block text-[11px] font-semibold normal-case tracking-normal text-gray-400">
              Дистанция · сложность · время
            </span>
          </span>
        </Link>
      </div>
    </div>
  )
}
