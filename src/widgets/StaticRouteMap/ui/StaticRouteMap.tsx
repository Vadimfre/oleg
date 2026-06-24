'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { parseTrackFile, type ParsedTrack } from '@/shared/utils/trackParser'
import { fixLeafletIcons } from '@/shared/lib/map/leaflet-utils'
import { grodnoRoutes } from '@/shared/data/grodnoRoutes'
import { RoutePolyline } from '@/widgets/MapView/ui/RoutePolyline'


// Создание иконок для разных типов точек
const createIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 14px;
          font-weight: bold;
          color: white;
        ">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

interface StaticRouteMapProps {
  gpxFile?: string
  coordinates?: [number, number][]
  showGrodnoRoutes?: boolean
}

function trackFromCoordinates(points: [number, number][]): ParsedTrack | null {
  if (points.length < 2) return null
  return {
    name: 'Маршрут',
    points: points.map(([lat, lng]) => ({ lat, lng })),
    distance: 0,
  }
}

export function StaticRouteMap({
  gpxFile,
  coordinates = [],
  showGrodnoRoutes = true,
}: StaticRouteMapProps) {
  const [gpxTrack, setGpxTrack] = useState<ParsedTrack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.6693, 23.8131])
  const [mapZoom, setMapZoom] = useState(13)

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  useEffect(() => {
    const coordTrack = trackFromCoordinates(coordinates)
    if (!gpxFile?.trim()) {
      if (coordTrack) {
        setGpxTrack(coordTrack)
        setMapCenter([coordTrack.points[0].lat, coordTrack.points[0].lng])
        setMapZoom(13)
      }
      setIsLoading(false)
      return
    }

    const loadGPX = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(gpxFile)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const gpxText = await response.text()
        const track = parseTrackFile(gpxText, gpxFile.split('/').pop())

        if (track && track.points.length > 0) {
          setGpxTrack(track)
          setMapCenter([track.points[0].lat, track.points[0].lng])
          if (track.distance > 50) setMapZoom(11)
          else if (track.distance > 20) setMapZoom(12)
          else setMapZoom(13)
        } else if (coordTrack) {
          setGpxTrack(coordTrack)
          setMapCenter([coordTrack.points[0].lat, coordTrack.points[0].lng])
          setMapZoom(13)
        }
      } catch (error) {
        console.error('Ошибка загрузки GPX файла:', error)
        if (coordTrack) {
          setGpxTrack(coordTrack)
          setMapCenter([coordTrack.points[0].lat, coordTrack.points[0].lng])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadGPX()
  }, [gpxFile, coordinates])

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-soft relative min-h-[320px]">
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-pulse">🗺️</div>
            <div className="text-dark-600 font-medium">Загрузка маршрута...</div>
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        style={{ height: '100%', minHeight: '320px' }}
        zoomControl={true}
      >
        <LayersControl position="topright">
          {/* Обычная карта OpenStreetMap */}
          <LayersControl.BaseLayer checked name="🗺️ Стандартная">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* CyclOSM - карта с велосипедными путями */}
          <LayersControl.BaseLayer name="🚴 Велопути">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Humanitarian карта (хорошо видны дороги) */}
          <LayersControl.BaseLayer name="🛣️ Дороги">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Существующие веломаршруты Гродно */}
        {showGrodnoRoutes && (
          <LayersControl.Overlay name="🚴 Веломаршруты Гродно">
            <>
              {grodnoRoutes.map((route) => (
                <RoutePolyline
                  key={route.id}
                  coordinates={route.coordinates}
                  color={route.color}
                  name={route.name}
                  description={route.description}
                  distance={route.distance}
                  difficulty={route.difficulty}
                  weight={3}
                  opacity={0.5}
                  dashArray={route.type === 'long-distance' ? '10, 5' : undefined}
                />
              ))}
            </>
          </LayersControl.Overlay>
        )}

        {/* GPX трек - основной маршрут */}
        {gpxTrack && (
          <>
            <Polyline
              positions={gpxTrack.points.map((p) => [p.lat, p.lng])}
              color="#ef4444"
              weight={5}
              opacity={0.9}
              smoothFactor={1.5}
              lineCap="round"
              lineJoin="round"
            />

            {/* Маркер старта */}
            <Marker
              position={[gpxTrack.points[0].lat, gpxTrack.points[0].lng]}
              icon={createIcon('#10b981', '▶')}
            />

            {/* Маркер финиша */}
            <Marker
              position={[
                gpxTrack.points[gpxTrack.points.length - 1].lat,
                gpxTrack.points[gpxTrack.points.length - 1].lng,
              ]}
              icon={createIcon('#ef4444', '⬛')}
            />
          </>
        )}
      </MapContainer>
    </div>
  )
}
