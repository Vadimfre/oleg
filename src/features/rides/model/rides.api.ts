const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface TrackPoint {
  lat: number
  lng: number
  t: number
  speed?: number | null
}

export interface RideSummary {
  id: number
  routeSlug: string | null
  routeTitle: string
  status: string
  startedAt: string
  endedAt: string | null
  elapsedSec: number
  movingSec: number
  distanceKm: number
  avgSpeedKmh: number | null
  maxSpeedKmh: number | null
  avgPaceMinPerKm: number | null
  maxOffRouteKm: number
  routeCompletion: number | null
}

export interface RideDetail extends RideSummary {
  trackPoints: TrackPoint[]
}

export interface RideStats {
  ridesCount: number
  totalDistanceKm: number
  totalMovingSec: number
  totalElapsedSec: number
  avgSpeedKmh: number | null
}

export interface SyncRidePayload {
  elapsedSec: number
  movingSec: number
  distanceKm: number
  avgSpeedKmh?: number
  maxSpeedKmh?: number
  avgPaceMinPerKm?: number
  maxOffRouteKm?: number
  routeCompletion?: number
  trackPoints: TrackPoint[]
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || 'Ошибка запроса')
  }
  return res.json()
}

export const startRide = (data: { routeSlug?: string; routeTitle: string }) =>
  api<RideSummary>('/rides/start', { method: 'POST', body: JSON.stringify(data) })

export const syncRide = (id: number, payload: SyncRidePayload) =>
  api<RideSummary>(`/rides/${id}/sync`, { method: 'PUT', body: JSON.stringify(payload) })

export const completeRide = (id: number, payload: SyncRidePayload) =>
  api<RideSummary>(`/rides/${id}/complete`, { method: 'POST', body: JSON.stringify(payload) })

export const getRides = () => api<RideSummary[]>('/rides')

export const getRide = (id: number) => api<RideDetail>(`/rides/${id}`)

export const getRideStats = () => api<RideStats>('/rides/stats')

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export interface RideAnalytics {
  ridesCount: number
  totalDistanceKm: number
  maxEverSpeedKmh: number
  longestRideKm: number
  currentMonthKm: number
  monthlyGoalKm: number
  goalProgress: number
  streakDays: number
  monthlyKm: { month: string; label: string; km: number }[]
  personalRecords: {
    longestRide: { id: number; title: string; distanceKm: number; date: string } | null
    fastestRide: { id: number; title: string; avgSpeedKmh: number | null; date: string } | null
  }
  unlockedAchievements: number
  totalAchievements: number
}

export interface RouteRecommendation {
  slug: string
  title: string
  distance: number
  difficulty: string
  duration: number
  imageUrl: string
  reason: string
}

export const getAchievements = () => api<Achievement[]>('/rides/achievements')

export const getRideAnalytics = () => api<RideAnalytics>('/rides/analytics')

export const getRouteRecommendation = () =>
  api<RouteRecommendation | null>('/rides/recommendation')
