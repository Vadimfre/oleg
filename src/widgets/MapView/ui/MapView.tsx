'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { grodnoRoutes } from '@/shared/data/grodnoRoutes'
import { RoutePolyline } from './RoutePolyline'

// Исправление иконок маркеров в Leaflet
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

export function MapView() {
  const [showExistingRoutes, setShowExistingRoutes] = useState(true)

  useEffect(() => {
    fixLeafletIcons()
  }, [])


  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-soft relative">
      {/* Переключатель маршрутов */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showExistingRoutes}
            onChange={(e) => setShowExistingRoutes(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <span className="text-sm text-dark-700 font-medium">
            Показать маршруты Гродно
          </span>
        </label>
      </div>

      <MapContainer
        center={[53.6693, 23.8131]} // Гродно
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
      >
        <LayersControl position="topright">
          {/* Обычная карта OpenStreetMap */}
          <LayersControl.BaseLayer checked name="🗺️ Стандартная карта">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* CyclOSM - карта с велосипедными путями */}
          <LayersControl.BaseLayer name="🚴 Велосипедные пути (CyclOSM)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* OpenTopoMap - топографическая карта */}
          <LayersControl.BaseLayer name="🏔️ Топографическая">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Humanitarian карта (хорошо видны дороги) */}
          <LayersControl.BaseLayer name="🛣️ Гуманитарная (дороги)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Веломаршруты Гродно */}
        {showExistingRoutes && grodnoRoutes.map((route) => (
          <RoutePolyline
            key={route.id}
            coordinates={route.coordinates}
            color={route.color}
            name={route.name}
            description={route.description}
            distance={route.distance}
            difficulty={route.difficulty}
            weight={4}
            opacity={0.75}
            dashArray={route.type === 'long-distance' ? '10, 5' : undefined}
          />
        ))}
      </MapContainer>
    </div>
  )
}
