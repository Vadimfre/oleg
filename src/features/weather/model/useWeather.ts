'use client'

import { useEffect, useState } from 'react'
import {
  calcCyclingScore,
  findBestRideWindow,
  humidityComfort,
  type DailyForecast,
  type HourlySlot,
} from '../lib/weather-scoring'

export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  dewPoint: number
  windSpeed: number
  windGusts: number
  weatherCode: number
  precipitation: number
  rainProbability: number
  uvIndex: number
  cyclingScore: number
  isGoodForCycling: boolean
  hint: string
  humidityLabel: string
  hourly: HourlySlot[]
  daily: DailyForecast[]
  bestWindow: string | null
}

const GRODNO = { lat: 53.6693, lng: 23.8131 }

export const WMO_LABELS: Record<number, string> = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Изморозь',
  51: 'Морось',
  53: 'Морось',
  55: 'Морось',
  61: 'Дождь',
  63: 'Дождь',
  65: 'Ливень',
  71: 'Снег',
  80: 'Ливень',
  95: 'Гроза',
}

function buildHint(score: number, humidity: number, bestWindow: string | null): string {
  if (score >= 85) {
    return bestWindow
      ? `Супер день! Лучшее окно: ${bestWindow}`
      : 'Отличные условия для велопрогулки!'
  }
  if (score < 30) return 'Сегодня лучше перенести поездку'
  if (humidity > 85) return 'Высокая влажность — пейте больше воды'
  if (bestWindow) return `Оптимально выехать: ${bestWindow}`
  return 'Проверьте почасовой прогноз ниже'
}

function parseHourly(data: {
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    precipitation_probability: number[]
    wind_speed_10m: number[]
  }
}): HourlySlot[] {
  return data.hourly.time.map((t, i) => {
    const d = new Date(t)
    const temp = data.hourly.temperature_2m[i]
    const hum = data.hourly.relative_humidity_2m[i]
    const rain = data.hourly.precipitation_probability[i]
    const wind = data.hourly.wind_speed_10m[i]
    return {
      time: d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      hour: d.getHours(),
      temp: Math.round(temp),
      humidity: Math.round(hum),
      rainProb: Math.round(rain),
      wind: Math.round(wind),
      score: calcCyclingScore(temp, wind, rain, hum),
    }
  })
}

let cache: { data: WeatherData; at: number } | null = null
const CACHE_MS = 10 * 60 * 1000

export function useWeather(enabled = true, days = 7) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    if (cache && Date.now() - cache.at < CACHE_MS) {
      setWeather(cache.data)
      return
    }

    let cancelled = false
    setLoading(true)

    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(GRODNO.lat))
    url.searchParams.set('longitude', String(GRODNO.lng))
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,wind_speed_10m,wind_gusts_10m,weather_code,precipitation,uv_index',
    )
    url.searchParams.set(
      'hourly',
      'temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m',
    )
    url.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    )
    url.searchParams.set('timezone', 'Europe/Minsk')
    url.searchParams.set('forecast_days', String(days))

    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return

        const c = data.current
        const now = new Date()
        const todayStr = now.toDateString()
        const allHourly = parseHourly(data)

        const todayHourly = allHourly.filter((_, i) => new Date(data.hourly.time[i]).toDateString() === todayStr)
        const startIdx = data.hourly.time.findIndex((t: string) => new Date(t) >= now)
        const hourlySlice = allHourly.slice(
          Math.max(0, startIdx),
          Math.max(0, startIdx) + 14,
        )

        const daily: DailyForecast[] = data.daily.time.slice(0, 7).map((t: string, i: number) => {
          const max = data.daily.temperature_2m_max[i]
          const min = data.daily.temperature_2m_min[i]
          const rain = data.daily.precipitation_probability_max[i]
          const wind = data.daily.wind_speed_10m_max[i]
          const d = new Date(t)
          return {
            date: t,
            label: d.toDateString() === todayStr ? 'Сегодня' : d.toLocaleDateString('ru-RU', { weekday: 'short' }),
            tempMax: Math.round(max),
            tempMin: Math.round(min),
            rainProb: Math.round(rain),
            weatherCode: data.daily.weather_code[i],
            score: calcCyclingScore((max + min) / 2, wind, rain, 55),
          }
        })

        const temp = c.temperature_2m
        const humidity = c.relative_humidity_2m
        const wind = c.wind_speed_10m
        const rainProb = hourlySlice[0]?.rainProb ?? todayHourly[now.getHours()]?.rainProb ?? 0
        const cyclingScore = calcCyclingScore(temp, wind, rainProb, humidity, c.precipitation ?? 0)
        const best = findBestRideWindow(todayHourly)
        const hum = humidityComfort(humidity)

        const result: WeatherData = {
          temperature: Math.round(temp),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: Math.round(humidity),
          dewPoint: Math.round(c.dew_point_2m),
          windSpeed: Math.round(wind),
          windGusts: Math.round(c.wind_gusts_10m ?? wind),
          weatherCode: c.weather_code,
          precipitation: c.precipitation ?? 0,
          rainProbability: rainProb,
          uvIndex: Math.round(c.uv_index ?? 0),
          cyclingScore,
          isGoodForCycling: cyclingScore >= 55,
          hint: buildHint(cyclingScore, humidity, best),
          humidityLabel: hum.label,
          hourly: hourlySlice,
          daily,
          bestWindow: best,
        }

        cache = { data: result, at: Date.now() }
        setWeather(result)
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError('Не удалось загрузить погоду')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, days])

  const label = weather ? WMO_LABELS[weather.weatherCode] ?? 'Облачно' : ''

  return { weather, loading, error, label }
}
