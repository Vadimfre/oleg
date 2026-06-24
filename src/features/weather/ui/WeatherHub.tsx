'use client'

import Link from 'next/link'
import { useWeather, WMO_LABELS } from '../model/useWeather'
import { scoreLabel, humidityComfort } from '../lib/weather-scoring'

export function WeatherHub() {
  const { weather, loading, error, label } = useWeather(true, 7)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Загружаем прогноз для велосипедистов...
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">{error}</div>
    )
  }

  const sl = scoreLabel(weather.cyclingScore)
  const hum = humidityComfort(weather.humidity)
  const maxHourlyScore = Math.max(...weather.hourly.map((h) => h.score), 1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">[Гродно]</p>
          <h1 className="text-[40px] font-black text-gray-900 uppercase tracking-tight leading-none">
            Погода
            <br />
            для вело
          </h1>
        </div>

        {/* Hero score */}
        <div
          className={`rounded-3xl p-8 mb-6 bg-gradient-to-br ${sl.bg} text-white shadow-xl relative overflow-hidden`}
        >
          <div className="absolute right-4 top-4 text-8xl opacity-20">{sl.emoji}</div>
          <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Индекс комфорта</p>
          <div className="flex items-end gap-4">
            <span className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tabular-nums">
              {weather.cyclingScore}
            </span>
            <span className="text-2xl font-bold pb-4">/ 100</span>
          </div>
          <p className="text-xl font-bold mt-2">{sl.text}</p>
          <p className="text-sm opacity-90 mt-4 max-w-md">{weather.hint}</p>
          {weather.bestWindow && (
            <p className="mt-4 inline-block bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm font-bold">
              ⏰ {weather.bestWindow}
            </p>
          )}
        </div>

        {/* Current metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <MetricCard title="Температура" value={`${weather.temperature}°C`} sub={`Ощущ. ${weather.feelsLike}° · ${label}`} />
          <MetricCard
            title="Влажность"
            value={`${weather.humidity}%`}
            sub={`${hum.label} · роса ${weather.dewPoint}°`}
            highlight={weather.humidity > 80}
          />
          <MetricCard title="Ветер" value={`${weather.windSpeed} км/ч`} sub={`Порывы до ${weather.windGusts} км/ч`} />
          <MetricCard title="Дождь" value={`${weather.rainProbability}%`} sub={weather.precipitation > 0 ? 'Идёт осадки' : 'Сухо сейчас'} />
          <MetricCard title="UV-индекс" value={String(weather.uvIndex)} sub={weather.uvIndex > 6 ? 'Используйте SPF' : 'Умеренный'} />
          <MetricCard title="Вело-индекс" value={`${weather.cyclingScore}`} sub={sl.text} />
        </div>

        {/* Humidity bar */}
        <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-black uppercase tracking-tight mb-4">Влажность воздуха</h2>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl font-black text-blue-600 tabular-nums">{weather.humidity}%</span>
            <span className={`text-sm font-bold ${hum.color}`}>{hum.label}</span>
          </div>
          <div className="h-4 bg-gradient-to-r from-amber-200 via-green-300 to-blue-500 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 bottom-0 w-1 bg-gray-900 rounded-full shadow"
              style={{ left: `${weather.humidity}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>сухо 0%</span>
            <span>комфорт 50%</span>
            <span>влажно 100%</span>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            При влажности выше 80% тело хуже охлаждается — на вело пейте больше и выбирайте
            лёгкую одежду.
          </p>
        </div>

        {/* Hourly */}
        <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-black uppercase tracking-tight mb-4">
            Почасовой прогноз
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {weather.hourly.map((h) => (
              <div
                key={h.time}
                className={`shrink-0 w-16 rounded-xl p-2 text-center border ${
                  h.score >= 70
                    ? 'bg-green-50 border-green-200'
                    : h.score >= 45
                      ? 'bg-amber-50 border-amber-100'
                      : 'bg-gray-50 border-gray-100'
                }`}
              >
                <p className="text-[10px] text-gray-500">{h.time}</p>
                <p className="text-lg font-black text-gray-900">{h.temp}°</p>
                <p className="text-[10px] text-blue-600">{h.humidity}%</p>
                <p className="text-[10px] text-gray-400">{h.rainProb}%🌧</p>
                <div
                  className="mt-1 mx-auto h-8 w-2 bg-gray-100 rounded-full overflow-hidden flex flex-col-reverse"
                >
                  <div
                    className={`w-full rounded-full ${
                      h.score >= 70 ? 'bg-green-500' : h.score >= 45 ? 'bg-amber-400' : 'bg-gray-300'
                    }`}
                    style={{ height: `${(h.score / maxHourlyScore) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold mt-1 text-gray-700">{h.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7 days */}
        <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-8">
          <h2 className="text-sm font-black uppercase tracking-tight mb-4">7 дней</h2>
          <div className="space-y-2">
            {weather.daily.map((d) => {
              const dl = scoreLabel(d.score)
              return (
                <div
                  key={d.date}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${dl.bg} flex items-center justify-center text-white text-xs font-black`}
                  >
                    {d.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{d.label}</p>
                    <p className="text-xs text-gray-500">
                      {WMO_LABELS[d.weatherCode]} · 🌧 {d.rainProb}%
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 tabular-nums shrink-0">
                    {d.tempMax}° / {d.tempMin}°
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/navigate"
            className="bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold text-sm uppercase"
          >
            Начать поездку
          </Link>
          <Link
            href="/"
            className="border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-sm"
          >
            Маршруты
          </Link>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  sub,
  highlight,
}: {
  title: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-[12px] p-4 border ${
        highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">{title}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  )
}
