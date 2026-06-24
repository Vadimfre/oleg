'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fixLeafletIcons, GRODNO_CENTER } from '@/shared/lib/map/leaflet-utils'
import type { TrackPoint } from '@/features/rides/model/rides.api'

interface RideTrackMapProps {
  points: TrackPoint[]
  className?: string
}

export function RideTrackMap({ points, className = 'w-full h-[280px]' }: RideTrackMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fixLeafletIcons()
    setMounted(true)
  }, [])

  if (!mounted || points.length === 0) {
    return (
      <div className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Нет трека поездки</span>
      </div>
    )
  }

  const positions = points.map((p) => [p.lat, p.lng] as [number, number])
  const start = positions[0]
  const end = positions[positions.length - 1]

  return (
    <div className={`${className} rounded-2xl overflow-hidden border border-gray-100`}>
      <MapContainer
        key={`ride-${points.length}`}
        center={start ?? GRODNO_CENTER}
        zoom={14}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={positions} color="#2563eb" weight={4} opacity={0.85} />
        <Marker
          position={start}
          icon={L.divIcon({
            className: '',
            html: '<div style="background:#10b981;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white">A</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        />
        <Marker
          position={end}
          icon={L.divIcon({
            className: '',
            html: '<div style="background:#ef4444;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white">B</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        />
      </MapContainer>
    </div>
  )
}
