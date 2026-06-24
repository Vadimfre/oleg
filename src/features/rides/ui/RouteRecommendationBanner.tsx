'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getRouteRecommendation, type RouteRecommendation } from '../model/rides.api'

interface RouteRecommendationBannerProps {
  embedded?: boolean
}

export function RouteRecommendationBanner({ embedded = false }: RouteRecommendationBannerProps) {
  const [rec, setRec] = useState<RouteRecommendation | null>(null)

  useEffect(() => {
    getRouteRecommendation()
      .then(setRec)
      .catch(() => setRec(null))
  }, [])

  if (!rec) return null

  const diffLabel =
    rec.difficulty === 'easy' ? 'Лёгкий' : rec.difficulty === 'medium' ? 'Средний' : 'Сложный'
  const diffColor =
    rec.difficulty === 'easy'
      ? 'text-emerald-400'
      : rec.difficulty === 'medium'
        ? 'text-amber-400'
        : 'text-rose-400'

  return (
    <div
      className={`relative overflow-hidden bg-dark-900 text-white group min-h-[280px] h-full ${
        embedded ? 'rounded-none' : 'rounded-2xl card-hover'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${rec.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/95 via-dark-900/80 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 flex flex-col justify-center h-full">
        <span className="inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Для вас
        </span>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{rec.title}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{rec.reason}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-5">
          <span className="font-bold text-white">{rec.distance} км</span>
          <span>·</span>
          <span>{rec.duration} ч</span>
          <span>·</span>
          <span className={diffColor}>{diffLabel}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/navigate?slug=${rec.slug}`}
            className="bg-primary text-dark-900 px-5 py-2.5 rounded-xl text-sm font-black uppercase btn-glow"
          >
            Поехали
          </Link>
          <Link
            href={`/routes/${rec.slug}`}
            className="border border-white/25 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
          >
            Карточка
          </Link>
        </div>
      </div>
    </div>
  )
}
