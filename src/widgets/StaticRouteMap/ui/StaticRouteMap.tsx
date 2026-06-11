'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { grodnoRoutes } from '@/shared/data/grodnoRoutes'
import { getRouteCoordinates } from '@/shared/data/routeCoordinates'
import { RoutePolyline } from '@/widgets/MapView/ui/RoutePolyline'

const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

const createIcon = (color: string, label: string) =>
  L.divIcon({
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

interface StaticRouteMapProps {
  coordinates?: [number, number][]
  routeSlug?: string
  showGrodnoRoutes?: boolean
}

export function StaticRouteMap({
  coordinates,
  routeSlug,
  showGrodnoRoutes = true,
}: StaticRouteMapProps) {
  const track = useMemo(
    () => getRouteCoordinates(routeSlug, coordinates),
    [routeSlug, coordinates],
  )

  const mapCenter = track[0] ?? ([53.6693, 23.8131] as [number, number])
  const mapZoom = track.length > 20 ? 11 : track.length > 8 ? 12 : 13
  const mapInstanceKey = `${routeSlug ?? 'custom'}-${showGrodnoRoutes ? 'on' : 'off'}-${track.length}`

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-soft relative">
      <MapContainer
        key={mapInstanceKey}
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="🗺️ Стандартная">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="🚴 Велопути">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="🛣️ Дороги">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

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

        {track.length > 1 && (
          <>
            <Polyline
              positions={track}
              color="#ef4444"
              weight={5}
              opacity={0.9}
              smoothFactor={1.5}
              lineCap="round"
              lineJoin="round"
            />
            <Marker position={track[0]} icon={createIcon('#10b981', '▶')} />
            <Marker position={track[track.length - 1]} icon={createIcon('#ef4444', '⬛')} />
          </>
        )}
      </MapContainer>
    </div>
  )
}
