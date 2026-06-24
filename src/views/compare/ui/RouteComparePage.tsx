'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRoutes } from '@/features/routes'

const difficultyConfig = {
  easy: {
    label: 'Лёгкий',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/90',
  },
  medium: {
    label: 'Средний',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/90',
  },
  hard: {
    label: 'Сложный',
    dot: 'bg-rose-500',
    badge: 'bg-rose-600/90',
  },
} as const

type DifficultyKey = keyof typeof difficultyConfig

export function RouteComparePage() {
  const { routes, isLoading } = useRoutes()
  const [slugA, setSlugA] = useState('pokatushka')
  const [slugB, setSlugB] = useState('grodno-losevo')

  const a = routes.find((r) => r.slug === slugA)
  const b = routes.find((r) => r.slug === slugB)

  const swapRoutes = () => {
    setSlugA(slugB)
    setSlugB(slugA)
  }

  const shorter =
    a && b
      ? a.distance < b.distance
        ? a
        : b.distance < a.distance
          ? b
          : null
      : null

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4 py-10 max-w-[1200px]">
        <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">[инструмент]</p>
        <h1 className="text-[32px] sm:text-[40px] font-black text-gray-900 uppercase tracking-tight mb-8">
          Сравнение
          <br />
          маршрутов
        </h1>

        {isLoading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-5 items-end mb-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Маршрут A
                </label>
                <select
                  value={slugA}
                  onChange={(e) => setSlugA(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {routes.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swapRoutes}
                className="hidden lg:flex w-11 h-11 mx-auto mb-1 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-primary hover:text-dark-900 hover:bg-primary/10 transition-colors shrink-0"
                aria-label="Поменять маршруты местами"
                title="Поменять местами"
              >
                ⇄
              </button>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Маршрут B
                </label>
                <select
                  value={slugB}
                  onChange={(e) => setSlugB(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {routes.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={swapRoutes}
              className="lg:hidden w-full mb-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ⇄ Поменять местами
            </button>

            {a && b && (
              <>
                <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-5">
                  <CompareCard route={a} other={b} label="A" />
                  <div className="flex lg:flex-col items-center justify-center shrink-0 py-1 lg:py-0">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-primary font-black text-sm tracking-widest shadow-lg">
                      VS
                    </span>
                  </div>
                  <CompareCard route={b} other={a} label="B" />
                </div>

                <ComparisonTable a={a} b={b} />

                <div className="mt-8 bg-gray-900 text-white rounded-2xl p-6 sm:p-8">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Вердикт</p>
                  <p className="text-lg sm:text-xl font-bold leading-snug mb-5">
                    {shorter
                      ? `«${shorter.title}» короче на ${Math.abs(a.distance - b.distance).toFixed(1)} км — удобнее для новичка`
                      : 'Похожая длина — выбирайте по сложности и погоде'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/navigate?slug=${shorter?.slug ?? a.slug}`}
                      className="text-center text-sm font-black uppercase tracking-tight bg-primary text-dark-900 px-5 py-3.5 rounded-xl btn-glow"
                    >
                      Поехать: {shorter?.title ?? a.title}
                    </Link>
                    <Link
                      href="/weather"
                      className="text-center text-sm font-bold px-5 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 transition-colors"
                    >
                      Смотреть погоду
                    </Link>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CompareCard({
  route,
  other,
  label,
}: {
  route: {
    title: string
    slug: string
    distance: number
    duration: number
    elevation: number
    difficulty: string
    imageUrl: string
    description?: string
  }
  other: {
    distance: number
    duration: number
    elevation: number
    difficulty: string
  }
  label: 'A' | 'B'
}) {
  const diff = difficultyConfig[route.difficulty as DifficultyKey] ?? difficultyConfig.medium

  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm card-hover">
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100 rounded-t-2xl">
        <img
          src={route.imageUrl}
          alt={route.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />
        <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-white/15 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/20">
          {label}
        </span>
        <span
          className={`absolute top-3 right-3 flex items-center gap-1.5 ${diff.badge} text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
          {diff.label}
        </span>
        <h3 className="absolute bottom-3 left-4 right-4 text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight">
          {route.title}
        </h3>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {route.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{route.description}</p>
        )}

        <div className="grid grid-cols-3 gap-2">
          <MetricBox
            label="Дистанция"
            value={`${route.distance}`}
            unit="км"
            winner={route.distance < other.distance}
          />
          <MetricBox
            label="Время"
            value={`${route.duration}`}
            unit="ч"
            winner={route.duration < other.duration}
            highlight
          />
          <MetricBox
            label="Перепад"
            value={`${route.elevation}`}
            unit="м"
            winner={route.elevation < other.elevation}
          />
        </div>

        <Link
          href={`/routes/${route.slug}`}
          className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm font-bold text-gray-900 hover:text-primary transition-colors"
        >
          Подробнее
          <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">
            →
          </span>
        </Link>
      </div>
    </div>
  )
}

function MetricBox({
  label,
  value,
  unit,
  winner,
  highlight,
}: {
  label: string
  value: string
  unit: string
  winner?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={`text-center rounded-xl py-3 px-1 ${
        winner
          ? 'bg-primary/20 border border-primary/30 ring-1 ring-primary/20'
          : highlight
            ? 'bg-gray-50 border border-gray-100'
            : 'bg-gray-50'
      }`}
    >
      <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-black text-gray-900 tabular-nums leading-none">{value}</p>
      <p className="text-[10px] text-gray-500 uppercase mt-0.5">{unit}</p>
    </div>
  )
}

function ComparisonTable({
  a,
  b,
}: {
  a: { title: string; distance: number; duration: number; elevation: number; difficulty: string }
  b: { title: string; distance: number; duration: number; elevation: number; difficulty: string }
}) {
  const diffLabel = (d: string) =>
    d === 'easy' ? 'Лёгкий' : d === 'medium' ? 'Средний' : 'Сложный'

  const rows = [
    {
      label: 'Дистанция',
      aVal: `${a.distance} км`,
      bVal: `${b.distance} км`,
      better: a.distance === b.distance ? null : a.distance < b.distance ? 'a' : 'b',
    },
    {
      label: 'Время',
      aVal: `${a.duration} ч`,
      bVal: `${b.duration} ч`,
      better: a.duration === b.duration ? null : a.duration < b.duration ? 'a' : 'b',
    },
    {
      label: 'Перепад',
      aVal: `${a.elevation} м`,
      bVal: `${b.elevation} м`,
      better: a.elevation === b.elevation ? null : a.elevation < b.elevation ? 'a' : 'b',
    },
    {
      label: 'Сложность',
      aVal: diffLabel(a.difficulty),
      bVal: diffLabel(b.difficulty),
      better: null,
    },
  ] as const

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Сводка</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Параметр
              </th>
              <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {a.title}
              </th>
              <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {b.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3.5 font-medium text-gray-600">{row.label}</td>
                <td
                  className={`px-4 py-3.5 text-center font-black tabular-nums ${
                    row.better === 'a' ? 'text-dark-900 bg-primary/10' : 'text-gray-900'
                  }`}
                >
                  {row.aVal}
                </td>
                <td
                  className={`px-4 py-3.5 text-center font-black tabular-nums ${
                    row.better === 'b' ? 'text-dark-900 bg-primary/10' : 'text-gray-900'
                  }`}
                >
                  {row.bVal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
