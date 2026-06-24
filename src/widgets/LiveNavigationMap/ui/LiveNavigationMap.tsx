'use client'

import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  LayersControl,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fixLeafletIcons, GRODNO_CENTER } from '@/shared/lib/map/leaflet-utils'
import { parseTrackFile, type ParsedTrack } from '@/shared/utils/trackParser'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { serializeCoordinates } from '@/shared/lib/route/resolveRouteTrack'

interface LiveNavigationMapProps {
  gpxFile?: string
  coordinates?: [number, number][]
  className?: string
}

function trackFromCoordinates(points: [number, number][]): ParsedTrack | null {
  if (points.length < 2) return null
  let distance = 0
  for (let i = 1; i < points.length; i++) {
    const [lat1, lng1] = points[i - 1]
    const [lat2, lng2] = points[i]
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    distance += 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }
  return {
    name: 'Маршрут',
    points: points.map(([lat, lng]) => ({ lat, lng })),
    distance,
  }
}

export function LiveNavigationMap({
  gpxFile,
  coordinates = [],
  className = 'w-full h-full',
}: LiveNavigationMapProps) {
  const coordsKey = serializeCoordinates(coordinates)
  const routeKey = `${gpxFile ?? ''}|${coordsKey}`

  const [track, setTrack] = useState<ParsedTrack | null>(null)
  const [mapView, setMapView] = useState<{
    center: [number, number]
    zoom: number
  }>({ center: GRODNO_CENTER, zoom: 13 })
  const [isLoadingTrack, setIsLoadingTrack] = useState(true)
  const [mapReadyKey, setMapReadyKey] = useState('')

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoadingTrack(true)
      setMapReadyKey('')

      let parsed: ParsedTrack | null = null

      if (gpxFile?.trim()) {
        try {
          const res = await fetch(gpxFile)
          if (res.ok) {
            const text = await res.text()
            parsed = parseTrackFile(text, gpxFile.split('/').pop())
          }
        } catch (e) {
          console.error('Ошибка загрузки трека:', e)
        }
      }

      if (!parsed?.points.length && coordinates.length >= 2) {
        parsed = trackFromCoordinates(coordinates)
      }

      if (cancelled) return

      setTrack(parsed)

      if (parsed?.points.length) {
        setMapView({
          center: [parsed.points[0].lat, parsed.points[0].lng],
          zoom: parsed.distance > 50 ? 11 : parsed.distance > 20 ? 12 : 13,
        })
      } else {
        setMapView({ center: GRODNO_CENTER, zoom: 13 })
      }

      setMapReadyKey(routeKey)
      setIsLoadingTrack(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [gpxFile, coordsKey])

  const hasTrack = track && track.points.length > 0

  return (
    <div
      className={`${className} rounded-3xl overflow-hidden shadow-soft relative min-h-[320px]`}
      style={{ minHeight: '320px' }}
    >
      {isLoadingTrack && (
        <div className="absolute inset-0 z-[1000] bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-4xl mb-2 animate-pulse">🗺️</div>
            <p className="text-dark-600 font-medium">Загрузка маршрута...</p>
          </div>
        </div>
      )}

      {!isLoadingTrack && !hasTrack && (
        <div className="absolute inset-0 z-[1000] bg-gray-50 flex items-center justify-center px-6 text-center">
          <p className="text-gray-500 text-sm">
            Трек маршрута не найден. Проверьте файл в public/gpx/.
          </p>
        </div>
      )}

      {hasTrack && (
        <div className="absolute top-4 left-4 z-[1000] max-w-[280px] bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2 text-xs text-gray-700 border border-gray-200">
          <div className="font-bold text-gray-900">Маршрут на карте</div>
          <div>Длина: {formatDistance(track.distance)}</div>
          <div>Точек в треке: {track.points.length}</div>
        </div>
      )}

      {!isLoadingTrack && mapReadyKey && (
        <MapContainer
          key={mapReadyKey}
          center={mapView.center}
          zoom={mapView.zoom}
          className="w-full h-full"
          style={{ height: '100%', minHeight: '320px' }}
        >
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

          {hasTrack && (
            <>
              <Polyline
                positions={track.points.map((p) => [p.lat, p.lng] as [number, number])}
                color="#ef4444"
                weight={5}
                opacity={0.9}
              />
              <Marker
                position={[track.points[0].lat, track.points[0].lng]}
                icon={L.divIcon({
                  className: '',
                  html: '<div style="background:#10b981;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white">A</div>',
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                })}
              />
              <Marker
                position={[
                  track.points[track.points.length - 1].lat,
                  track.points[track.points.length - 1].lng,
                ]}
                icon={L.divIcon({
                  className: '',
                  html: '<div style="background:#ef4444;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white">B</div>',
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                })}
              />
            </>
          )}
        </MapContainer>
      )}
    </div>
  )
}

export { formatDistance }
