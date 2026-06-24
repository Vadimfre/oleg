export interface HourlySlot {
  time: string
  hour: number
  temp: number
  humidity: number
  rainProb: number
  wind: number
  score: number
}

export interface DailyForecast {
  date: string
  label: string
  tempMax: number
  tempMin: number
  rainProb: number
  weatherCode: number
  score: number
}

/** Индекс комфорта для велосипеда 0–100 */
export function calcCyclingScore(
  temp: number,
  wind: number,
  rainProb: number,
  humidity: number,
  precip = 0,
): number {
  let score = 100

  if (rainProb > 70 || precip > 1) score -= 45
  else if (rainProb > 40) score -= 25
  else if (rainProb > 20) score -= 10

  if (wind > 35) score -= 35
  else if (wind > 25) score -= 20
  else if (wind > 18) score -= 8

  if (temp < 0) score -= 40
  else if (temp < 5) score -= 25
  else if (temp < 10) score -= 12
  else if (temp > 32) score -= 35
  else if (temp > 28) score -= 18

  if (humidity > 90) score -= 15
  else if (humidity > 80) score -= 8
  else if (humidity < 25) score -= 5

  if (temp >= 14 && temp <= 24 && wind < 15 && rainProb < 25 && humidity >= 35 && humidity <= 70) {
    score = Math.min(100, score + 8)
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function humidityComfort(humidity: number): { label: string; color: string } {
  if (humidity >= 85) return { label: 'Очень влажно', color: 'text-blue-700' }
  if (humidity >= 70) return { label: 'Влажно', color: 'text-blue-600' }
  if (humidity >= 45) return { label: 'Комфортно', color: 'text-green-600' }
  if (humidity >= 25) return { label: 'Сухо', color: 'text-amber-600' }
  return { label: 'Очень сухо', color: 'text-orange-600' }
}

export function scoreLabel(score: number): { text: string; emoji: string; bg: string } {
  if (score >= 85) return { text: 'Идеально для вело', emoji: '🚴‍♂️', bg: 'from-emerald-400 to-green-600' }
  if (score >= 65) return { text: 'Хорошие условия', emoji: '👍', bg: 'from-green-400 to-emerald-500' }
  if (score >= 45) return { text: 'Можно ехать', emoji: '🌤️', bg: 'from-yellow-400 to-amber-500' }
  if (score >= 25) return { text: 'Осторожно', emoji: '⚠️', bg: 'from-orange-400 to-amber-600' }
  return { text: 'Лучше отложить', emoji: '🌧️', bg: 'from-slate-400 to-gray-600' }
}

export function findBestRideWindow(hourly: HourlySlot[]): string | null {
  const good = hourly.filter((h) => h.score >= 70 && h.hour >= 6 && h.hour <= 21)
  if (good.length === 0) return null

  const start = good[0]
  const end = good[good.length - 1]
  return `${start.time} – ${end.time}`
}
