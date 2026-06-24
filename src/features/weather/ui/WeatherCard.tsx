'use client'

import Link from 'next/link'
import { useWeather } from '../model/useWeather'
import { scoreLabel, humidityComfort } from '../lib/weather-scoring'

interface WeatherCardProps {
  compact?: boolean
  showLink?: boolean
  className?: string
}

export function WeatherCard({ compact, showLink = true, className = '' }: WeatherCardProps) {
  const { weather, loading, error, label } = useWeather()

  if (loading) {
    return (
      <div className={`bg-white rounded-[12px] border border-gray-100 p-4 animate-pulse ${className}`}>
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-8 bg-gray-100 rounded w-1/3" />
      </div>
    )
  }

  if (error || !weather) return null

  const sl = scoreLabel(weather.cyclingScore)
  const hum = humidityComfort(weather.humidity)

  if (compact) {
    return (
      <Link
        href="/weather"
        className={`block rounded-xl border px-3 py-2.5 transition-shadow hover:shadow-md ${
          weather.cyclingScore >= 65
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200'
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${sl.bg} flex items-center justify-center text-white font-black text-sm shrink-0`}
          >
            {weather.cyclingScore}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900">
              {weather.temperature}° (ощущ. {weather.feelsLike}°) · {label}
            </p>
            <p className="text-xs text-gray-600">
              💧 {weather.humidity}% {hum.label} · 💨 {weather.windSpeed} км/ч
            </p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden card-hover ${
        weather.cyclingScore >= 65
          ? 'bg-gradient-to-br from-sky-50 via-green-50 to-emerald-50 border-green-200/80 shadow-soft'
          : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/80 shadow-soft'
      } ${className}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            Погода · Гродно
          </p>
          {showLink && (
            <Link href="/weather" className="text-xs font-bold text-blue-600 hover:underline">
              Подробнее →
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sl.bg} flex flex-col items-center justify-center text-white shadow-lg shrink-0`}
          >
            <span className="text-2xl font-black leading-none">{weather.cyclingScore}</span>
            <span className="text-[9px] uppercase tracking-wide opacity-90">вело-индекс</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">
              {weather.temperature}°
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Ощущается {weather.feelsLike}° · {label}
            </p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{sl.emoji} {sl.text}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <MiniStat icon="💧" value={`${weather.humidity}%`} sub={hum.label} />
          <MiniStat icon="💨" value={`${weather.windSpeed}`} sub="км/ч ветер" />
          <MiniStat icon="🌧" value={`${weather.rainProbability}%`} sub="дождь" />
          <MiniStat icon="☀️" value={`${weather.uvIndex}`} sub="UV" />
        </div>

        {weather.bestWindow && (
          <p className="text-xs font-semibold text-green-800 bg-green-100/80 rounded-lg px-3 py-2 mb-3">
            ⏰ Лучшее время: {weather.bestWindow}
          </p>
        )}

        <p
          className={`text-sm font-medium rounded-lg px-3 py-2 ${
            weather.cyclingScore >= 65
              ? 'bg-green-100/80 text-green-900'
              : 'bg-amber-100/80 text-amber-900'
          }`}
        >
          {weather.hint}
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  icon,
  value,
  sub,
}: {
  icon: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-white/70 rounded-lg px-2 py-2 text-center">
      <span className="text-sm">{icon}</span>
      <p className="text-sm font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-[9px] text-gray-500 leading-tight">{sub}</p>
    </div>
  )
}
