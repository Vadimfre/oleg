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

interface LiveNavigationMapProps {
  gpxFile: string
  className?: string
}

export function LiveNavigationMap({
  gpxFile,
  className = 'w-full h-full',
}: LiveNavigationMapProps) {
  const [track, setTrack] = useState<ParsedTrack | null>(null)
  const [isLoadingTrack, setIsLoadingTrack] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>(GRODNO_CENTER)
  const [mapZoom, setMapZoom] = useState(13)

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  useEffect(() => {
    if (!gpxFile) {
      setIsLoadingTrack(false)
      return
    }

    const load = async () => {
      try {
        setIsLoadingTrack(true)
        const res = await fetch(gpxFile)
        const text = await res.text()
        const parsed = parseTrackFile(text, gpxFile.split('/').pop())
        if (parsed?.points.length) {
          setTrack(parsed)
          setMapCenter([parsed.points[0].lat, parsed.points[0].lng])
          setMapZoom(parsed.distance > 50 ? 11 : parsed.distance > 20 ? 12 : 13)
        }
      } catch (e) {
        console.error('Ошибка загрузки трека:', e)
      } finally {
        setIsLoadingTrack(false)
      }
    }

    load()
  }, [gpxFile])

  return (
    <div className={`${className} rounded-3xl overflow-hidden shadow-soft relative`}>
      {isLoadingTrack && (
        <div className="absolute inset-0 z-[1000] bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-4xl mb-2 animate-pulse">🗺️</div>
            <p className="text-dark-600 font-medium">Загрузка маршрута...</p>
          </div>
        </div>
      )}

      {track && (
        <div className="absolute top-4 left-4 z-[1000] max-w-[280px] bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2 text-xs text-gray-700 border border-gray-200">
          <div className="font-bold text-gray-900">Маршрут на карте</div>
          <div>Длина: {formatDistance(track.distance)}</div>
          <div>Точек в треке: {track.points.length}</div>
        </div>
      )}

      <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full">
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

        {track && track.points.length > 0 && (
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
    </div>
  )
}

export { formatDistance }
