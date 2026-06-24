'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { distanceKm, polylineLengthKm, type LatLng } from '@/shared/lib/map/geo-utils'
import {
  startRide,
  syncRide,
  completeRide,
  type TrackPoint,
  type RideSummary,
} from './rides.api'

const MIN_POINT_DISTANCE_KM = 0.008
const MOVING_SPEED_MS = 0.8
const SYNC_INTERVAL_MS = 15000

export interface RideRecorderPosition {
  lat: number
  lng: number
  speed: number | null
  accuracy: number
  timestamp: number
}

export interface RideLiveStats {
  elapsedSec: number
  movingSec: number
  distanceKm: number
  avgSpeedKmh: number | null
  maxSpeedKmh: number
  avgPaceMinPerKm: number | null
  currentSpeedKmh: number | null
}

interface UseRideRecorderOptions {
  enabled: boolean
  isAuthenticated: boolean
  routeSlug?: string
  routeTitle: string
  plannedDistanceKm?: number
  offRouteKm?: number
  trackProgressIndex?: number
  trackPointCount?: number
}

export function useRideRecorder({
  enabled,
  isAuthenticated,
  routeSlug,
  routeTitle,
  plannedDistanceKm,
  offRouteKm = 0,
  trackProgressIndex = 0,
  trackPointCount = 0,
}: UseRideRecorderOptions) {
  const [rideId, setRideId] = useState<number | null>(null)
  const [live, setLive] = useState<RideLiveStats>({
    elapsedSec: 0,
    movingSec: 0,
    distanceKm: 0,
    avgSpeedKmh: null,
    maxSpeedKmh: 0,
    avgPaceMinPerKm: null,
    currentSpeedKmh: null,
  })
  const [lastCompleted, setLastCompleted] = useState<RideSummary | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const pointsRef = useRef<TrackPoint[]>([])
  const startedAtRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const movingRef = useRef(0)
  const maxSpeedRef = useRef(0)
  const maxOffRouteRef = useRef(0)
  const lastPointRef = useRef<LatLng | null>(null)
  const wasMovingRef = useRef(false)
  const rideIdRef = useRef<number | null>(null)

  const buildPayload = useCallback(() => {
    const distance = polylineLengthKm(
      pointsRef.current.map((p) => ({ lat: p.lat, lng: p.lng })),
    )
    const movingSec = movingRef.current
    const avgSpeedKmh =
      movingSec > 0 && distance > 0 ? distance / (movingSec / 3600) : null
    const avgPaceMinPerKm =
      distance > 0.01 && movingSec > 0 ? movingSec / 60 / distance : null
    const routeCompletion =
      plannedDistanceKm && plannedDistanceKm > 0 && trackPointCount > 1
        ? Math.min(
            100,
            Math.round((trackProgressIndex / (trackPointCount - 1)) * 100),
          )
        : distance > 0 && plannedDistanceKm
          ? Math.min(100, Math.round((distance / plannedDistanceKm) * 100))
          : null

    return {
      elapsedSec: elapsedRef.current,
      movingSec,
      distanceKm: Math.round(distance * 1000) / 1000,
      avgSpeedKmh: avgSpeedKmh ? Math.round(avgSpeedKmh * 10) / 10 : undefined,
      maxSpeedKmh: maxSpeedRef.current > 0 ? maxSpeedRef.current : undefined,
      avgPaceMinPerKm: avgPaceMinPerKm
        ? Math.round(avgPaceMinPerKm * 10) / 10
        : undefined,
      maxOffRouteKm: maxOffRouteRef.current,
      routeCompletion: routeCompletion ?? undefined,
      trackPoints: pointsRef.current,
    }
  }, [plannedDistanceKm, trackProgressIndex, trackPointCount])

  const refreshLive = useCallback(() => {
    const payload = buildPayload()
    const last = pointsRef.current[pointsRef.current.length - 1]
    const currentSpeedKmh =
      last?.speed != null && last.speed > 0 ? last.speed * 3.6 : null

    setLive({
      elapsedSec: payload.elapsedSec,
      movingSec: payload.movingSec,
      distanceKm: payload.distanceKm,
      avgSpeedKmh: payload.avgSpeedKmh ?? null,
      maxSpeedKmh: payload.maxSpeedKmh ?? 0,
      avgPaceMinPerKm: payload.avgPaceMinPerKm ?? null,
      currentSpeedKmh,
    })
  }, [buildPayload])

  const resetSession = useCallback(() => {
    pointsRef.current = []
    startedAtRef.current = null
    elapsedRef.current = 0
    movingRef.current = 0
    maxSpeedRef.current = 0
    maxOffRouteRef.current = 0
    lastPointRef.current = null
    wasMovingRef.current = false
    rideIdRef.current = null
    setRideId(null)
    setLive({
      elapsedSec: 0,
      movingSec: 0,
      distanceKm: 0,
      avgSpeedKmh: null,
      maxSpeedKmh: 0,
      avgPaceMinPerKm: null,
      currentSpeedKmh: null,
    })
  }, [])

  useEffect(() => {
    if (!enabled) return

    if (!isAuthenticated) {
      startedAtRef.current = Date.now()
      return
    }

    let cancelled = false

    startRide({ routeSlug, routeTitle })
      .then((ride) => {
        if (cancelled) return
        rideIdRef.current = ride.id
        setRideId(ride.id)
        startedAtRef.current = Date.now()
        setSaveError(null)
      })
      .catch((e) => {
        setSaveError(e instanceof Error ? e.message : 'Не удалось начать запись')
      })

    return () => {
      cancelled = true
    }
  }, [enabled, isAuthenticated, routeSlug, routeTitle])

  useEffect(() => {
    if (!enabled) return

    const tick = setInterval(() => {
      if (!startedAtRef.current) return
      elapsedRef.current = Math.floor((Date.now() - startedAtRef.current) / 1000)
      if (wasMovingRef.current) movingRef.current += 1
      refreshLive()
    }, 1000)

    return () => clearInterval(tick)
  }, [enabled, refreshLive])

  useEffect(() => {
    if (offRouteKm > maxOffRouteRef.current) maxOffRouteRef.current = offRouteKm
  }, [offRouteKm])

  useEffect(() => {
    if (!enabled || !rideIdRef.current || !isAuthenticated) return

    const sync = () => {
      const payload = buildPayload()
      syncRide(rideIdRef.current!, payload).catch(() => {})
    }

    const id = setInterval(sync, SYNC_INTERVAL_MS)
    return () => clearInterval(id)
  }, [enabled, isAuthenticated, buildPayload])

  const addPosition = useCallback(
    (pos: RideRecorderPosition) => {
      if (!enabled) return

      const point: LatLng = { lat: pos.lat, lng: pos.lng }
      const last = lastPointRef.current
      let segmentKm = 0

      if (last) {
        segmentKm = distanceKm(last, point)
        if (segmentKm < MIN_POINT_DISTANCE_KM) return
      }

      const speedMs = pos.speed ?? (segmentKm > 0 && last ? segmentKm / 5 : 0)
      const speedKmh = speedMs > 0 ? speedMs * 3.6 : 0
      if (speedKmh > maxSpeedRef.current) maxSpeedRef.current = speedKmh

      wasMovingRef.current = speedMs >= MOVING_SPEED_MS || segmentKm >= MIN_POINT_DISTANCE_KM

      pointsRef.current.push({
        lat: pos.lat,
        lng: pos.lng,
        t: pos.timestamp,
        speed: pos.speed,
      })
      lastPointRef.current = point
      refreshLive()
    },
    [enabled, refreshLive],
  )

  const finishRide = useCallback(async (): Promise<RideSummary | null> => {
    if (!enabled) return null

    const payload = buildPayload()

    if (!isAuthenticated || !rideIdRef.current) {
      resetSession()
      return null
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const completed = await completeRide(rideIdRef.current, payload)
      setLastCompleted(completed)
      resetSession()
      return completed
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Ошибка сохранения')
      return null
    } finally {
      setIsSaving(false)
    }
  }, [enabled, isAuthenticated, buildPayload, resetSession])

  useEffect(() => {
    if (!enabled) {
      resetSession()
    }
  }, [enabled, resetSession])

  return {
    rideId,
    live,
    lastCompleted,
    saveError,
    isSaving,
    isRecording: enabled && (rideId != null || !isAuthenticated),
    addPosition,
    finishRide,
    clearLastCompleted: () => setLastCompleted(null),
  }
}
