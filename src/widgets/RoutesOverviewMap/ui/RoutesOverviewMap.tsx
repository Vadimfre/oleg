'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fixLeafletIcons, GRODNO_CENTER } from '@/shared/lib/map/leaflet-utils'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { parseTrackFile, type ParsedTrack } from '@/shared/utils/trackParser'
import type { RouteResponse } from '@/shared/api/routes.api'

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
}

interface LoadedRouteTrack {
  route: RouteResponse
  track: ParsedTrack
  color: string
}

function FitBounds({ tracks }: { tracks: LoadedRouteTrack[] }) {
  const map = useMap()

  useEffect(() => {
    const allPoints = tracks.flatMap((t) =>
      t.track.points.map((p) => [p.lat, p.lng] as [number, number]),
    )
    if (allPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40] })
    }
  }, [tracks, map])

  return null
}

interface RoutesOverviewMapProps {
  routes: RouteResponse[]
  className?: string
}

export function RoutesOverviewMap({ routes, className = 'w-full h-full' }: RoutesOverviewMapProps) {
  const [mounted, setMounted] = useState(false)
  const [loadedTracks, setLoadedTracks] = useState<LoadedRouteTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  useEffect(() => {
    if (routes.length === 0) {
      setLoadedTracks([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    const loadAll = async () => {
      setIsLoading(true)
      const results: LoadedRouteTrack[] = []

      for (const route of routes) {
        if (!route.gpxFile) continue
        try {
          const res = await fetch(route.gpxFile)
          const text = await res.text()
          const track = parseTrackFile(text, route.gpxFile.split('/').pop())
          if (track?.points.length) {
            results.push({
              route,
              track,
              color: DIFFICULTY_COLORS[route.difficulty] ?? '#3b82f6',
            })
          }
        } catch (e) {
          console.error(`Не удалось загрузить ${route.slug}:`, e)
        }
      }

      if (!cancelled) {
        setLoadedTracks(results)
        if (results[0]) setSelectedSlug(results[0].route.slug)
        setIsLoading(false)
      }
    }

    loadAll()
    return () => {
      cancelled = true
    }
  }, [routes])

  useEffect(() => {
    if (loadedTracks[0] && !selectedSlug) {
      setSelectedSlug(loadedTracks[0].route.slug)
    }
  }, [loadedTracks, selectedSlug])

  const selected = loadedTracks.find((t) => t.route.slug === selectedSlug)

  if (!mounted) {
    return (
      <div className={`${className} rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-500">Инициализация карты...</span>
      </div>
    )
  }

  return (
    <div className={`${className} rounded-3xl overflow-hidden shadow-soft relative`}>
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-white/90 flex items-center justify-center">
          <p className="text-gray-600 font-medium">Загрузка маршрутов на карту...</p>
        </div>
      )}

      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 max-w-[300px]">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-sm">
          <p className="font-bold text-gray-900 mb-2">🗺️ Все маршруты</p>
          <p className="text-gray-600 text-xs mb-2">
            Клик по линии — выбор маршрута. Зелёный / жёлтый / красный — сложность.
          </p>
          <p className="text-gray-500 text-xs">
            Нажмите на маршрут или стартовую точку, чтобы открыть подробности.
          </p>
        </div>

        {selected && (
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-sm">
            <p className="font-bold text-gray-900">{selected.route.title}</p>
            <p className="text-gray-600 text-xs mt-1">
              {selected.route.distance} км · {selected.route.duration} ч
            </p>
            <Link
              href={`/navigate?slug=${selected.route.slug}`}
              className="mt-2 block text-center bg-gray-900 text-white text-xs font-bold py-2 rounded-lg"
            >
              Открыть маршрут →
            </Link>
          </div>
        )}
      </div>

      <MapContainer key="routes-overview-map" center={GRODNO_CENTER} zoom={12} className="w-full h-full">
        <FitBounds tracks={loadedTracks} />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Стандартная">
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Велопути">
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {loadedTracks.map(({ route, track, color }) => (
          <Polyline
            key={route.slug}
            positions={track.points.map((p) => [p.lat, p.lng] as [number, number])}
            color={color}
            weight={selectedSlug === route.slug ? 7 : 4}
            opacity={selectedSlug === route.slug ? 1 : 0.55}
            eventHandlers={{
              click: () => setSelectedSlug(route.slug),
            }}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <strong>{route.title}</strong>
                <div>{route.distance} км</div>
                <Link href={`/navigate?slug=${route.slug}`} className="text-blue-600 underline">
                  Открыть маршрут
                </Link>
              </div>
            </Popup>
          </Polyline>
        ))}

        {loadedTracks.map(({ route, track, color }) => (
          <Marker
            key={`start-${route.slug}`}
            position={[track.points[0].lat, track.points[0].lng]}
            icon={L.divIcon({
              className: '',
              html: `<div style="background:${color};color:white;width:22px;height:22px;border-radius:50%;border:2px solid white;font-size:10px;font-weight:bold;display:flex;align-items:center;justify-content:center">▶</div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            })}
          />
        ))}
      </MapContainer>
    </div>
  )
}
