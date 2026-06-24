'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, LayersControl, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from '@/shared/ui'
import { grodnoRoutes } from '@/shared/data/grodnoRoutes'
import { RoutePolyline } from '@/widgets/MapView/ui/RoutePolyline'
import { parseGPX, GPXTrack } from '@/shared/utils/gpxParser'

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

interface RoutePoint {
  lat: number
  lng: number
  id: string
}

interface RouteBuilderMapProps {
  onRouteChange?: (points: RoutePoint[], distance: number) => void
}

// Функция для получения маршрута от OSRM
async function getRoute(points: RoutePoint[]): Promise<[number, number][]> {
  if (points.length < 2) return []
  
  const coordinates = points.map(p => `${p.lng},${p.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/cycling/${coordinates}?overview=full&geometries=geojson`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
    }
  } catch (error) {
    console.error('Ошибка получения маршрута:', error)
  }
  
  return points.map(p => [p.lat, p.lng])
}

// Компонент для обработки кликов по карте
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Функция расчета расстояния между двумя точками (формула Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Компонент для автоматического центрирования карты на маршруте
function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])
  
  return null
}

export function RouteBuilderMap({ onRouteChange }: RouteBuilderMapProps) {
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([])
  const [totalDistance, setTotalDistance] = useState(0)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [showExistingRoutes, setShowExistingRoutes] = useState(true)
  const [gpxTrack, setGpxTrack] = useState<GPXTrack | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.6693, 23.8131])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  // Получение маршрута по дорогам при изменении точек
  useEffect(() => {
    if (routePoints.length < 2) {
      setRouteGeometry([])
      return
    }

    const fetchRoute = async () => {
      setIsLoadingRoute(true)
      const geometry = await getRoute(routePoints)
      setRouteGeometry(geometry)
      setIsLoadingRoute(false)
    }

    fetchRoute()
  }, [routePoints])

  // Расчет общей дистанции маршрута по геометрии
  useEffect(() => {
    if (routeGeometry.length < 2) {
      setTotalDistance(0)
      return
    }

    let distance = 0
    for (let i = 0; i < routeGeometry.length - 1; i++) {
      distance += calculateDistance(
        routeGeometry[i][0],
        routeGeometry[i][1],
        routeGeometry[i + 1][0],
        routeGeometry[i + 1][1]
      )
    }
    setTotalDistance(distance)

    // Вызов callback с данными маршрута
    if (onRouteChange) {
      onRouteChange(routePoints, distance)
    }
  }, [routeGeometry, routePoints, onRouteChange])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newPoint: RoutePoint = {
      lat,
      lng,
      id: `point-${Date.now()}`,
    }
    setRoutePoints((prev) => [...prev, newPoint])
  }, [])

  const handleClearRoute = () => {
    setRoutePoints([])
    setRouteGeometry([])
    setTotalDistance(0)
  }

  const handleRemoveLastPoint = () => {
    setRoutePoints((prev) => prev.slice(0, -1))
  }

  const handleRemovePoint = (id: string) => {
    setRoutePoints((prev) => prev.filter((point) => point.id !== id))
  }

  const handleGPXUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const gpxText = e.target?.result as string
      const track = parseGPX(gpxText)
      
      if (track) {
        setGpxTrack(track)
        setTotalDistance(track.distance)
        
        // Центрируем карту на первой точке маршрута
        if (track.points.length > 0) {
          setMapCenter([track.points[0].lat, track.points[0].lng])
        }
        
        // Очищаем ручной маршрут
        setRoutePoints([])
        setRouteGeometry([])
        
        if (onRouteChange) {
          onRouteChange([], track.distance)
        }
      }
    }
    reader.readAsText(file)
  }, [onRouteChange])

  const handleRemoveGPX = () => {
    setGpxTrack(null)
    setTotalDistance(0)
  }

  // Получение иконки в зависимости от позиции точки
  const getMarkerIcon = (index: number, total: number) => {
    if (index === 0) {
      return createIcon('#10b981', '▶') // Зеленый - старт
    } else if (index === total - 1) {
      return createIcon('#ef4444', '⬛') // Красный - финиш
    } else {
      return createIcon('#3b82f6', (index + 1).toString()) // Синий - промежуточные точки
    }
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-soft relative">
      {/* Панель управления поверх карты */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-2xl shadow-lg p-4 space-y-3 max-w-xs">
        {gpxTrack ? (
          // Информация о загруженном GPX
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-600">GPX:</span>
              <span className="text-xs font-bold text-blue-600 truncate max-w-[150px]">
                {gpxTrack.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-600">Точек:</span>
              <span className="text-lg font-bold text-primary">{gpxTrack.points.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-600">Дистанция:</span>
              <span className="text-lg font-bold text-green-600">
                {gpxTrack.distance.toFixed(2)} км
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRemoveGPX}
              className="w-full"
            >
              🗑️ Удалить GPX
            </Button>
          </div>
        ) : (
          // Обычный режим создания маршрута
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-600">Точек:</span>
              <span className="text-lg font-bold text-primary">{routePoints.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-600">Дистанция:</span>
              <span className="text-lg font-bold text-green-600">
                {totalDistance.toFixed(2)} км
              </span>
            </div>
          </div>
        )}

        {!gpxTrack && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveLastPoint}
              disabled={routePoints.length === 0}
              className="flex-1"
            >
              ↶ Назад
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearRoute}
              disabled={routePoints.length === 0}
              className="flex-1"
            >
              🗑️ Очистить
            </Button>
          </div>
        )}

        {/* Кнопка загрузки GPX */}
        <div className="pt-2 border-t border-dark-200">
          <input
            ref={fileInputRef}
            type="file"
            accept=".gpx"
            onChange={handleGPXUpload}
            className="hidden"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            📁 Загрузить GPX
          </Button>
        </div>

        {!gpxTrack && (
          <div className="text-xs text-dark-500 pt-2 border-t border-dark-200">
            💡 Кликай по карте или загрузи GPX файл
          </div>
        )}

        <label className="flex items-center gap-2 pt-2 border-t border-dark-200 cursor-pointer">
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
        center={mapCenter}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
      >
        <MapUpdater center={mapCenter} />
        {!gpxTrack && <MapClickHandler onMapClick={handleMapClick} />}

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

        {/* Существующие веломаршруты Гродно с роутингом */}
        {showExistingRoutes && (
          <LayersControl.Overlay checked name="🚴 Веломаршруты Гродно">
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
                  opacity={0.65}
                  dashArray={route.type === 'long-distance' ? '10, 5' : undefined}
                />
              ))}
            </>
          </LayersControl.Overlay>
        )}

        {/* GPX трек */}
        {gpxTrack && (
          <Polyline
            positions={gpxTrack.points.map((p) => [p.lat, p.lng])}
            color="#ef4444"
            weight={4}
            opacity={0.8}
            smoothFactor={1.5}
            lineCap="round"
            lineJoin="round"
          >
            <Popup>
              <div className="text-sm space-y-1">
                <strong className="text-base">{gpxTrack.name}</strong>
                <div className="text-gray-600">
                  📏 {gpxTrack.distance.toFixed(2)} км
                </div>
                <div className="text-gray-600">
                  📍 {gpxTrack.points.length} точек
                </div>
              </div>
            </Popup>
          </Polyline>
        )}

        {/* Линия маршрута по дорогам */}
        {!gpxTrack && routeGeometry.length > 1 && (
          <Polyline
            positions={routeGeometry}
            color="#3b82f6"
            weight={5}
            opacity={0.8}
            smoothFactor={1.5}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Индикатор загрузки маршрута */}
        {!gpxTrack && isLoadingRoute && routePoints.length > 1 && (
          <Polyline
            positions={routePoints.map((p) => [p.lat, p.lng])}
            color="#94a3b8"
            weight={3}
            opacity={0.5}
            dashArray="10, 10"
            smoothFactor={2}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Маркеры точек маршрута */}
        {!gpxTrack && routePoints.map((point, index) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={getMarkerIcon(index, routePoints.length)}
            eventHandlers={{
              click: () => {
                // Опционально: можно добавить удаление точки по клику
              },
            }}
          >
            <Popup>
              <div className="text-center space-y-2">
                <strong>
                  {index === 0
                    ? '🏁 Старт'
                    : index === routePoints.length - 1
                    ? '🎯 Финиш'
                    : `📍 Точка ${index + 1}`}
                </strong>
                <br />
                <span className="text-xs text-gray-600">
                  {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                </span>
                <br />
                <button
                  onClick={() => handleRemovePoint(point.id)}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors mt-2"
                >
                  Удалить точку
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Маркеры для GPX трека (старт и финиш) */}
        {gpxTrack && gpxTrack.points.length > 0 && (
          <>
            <Marker
              position={[gpxTrack.points[0].lat, gpxTrack.points[0].lng]}
              icon={createIcon('#10b981', '▶')}
            >
              <Popup>
                <div className="text-center">
                  <strong>🏁 Старт</strong>
                  <br />
                  <span className="text-xs text-gray-600">
                    {gpxTrack.points[0].lat.toFixed(5)}, {gpxTrack.points[0].lng.toFixed(5)}
                  </span>
                </div>
              </Popup>
            </Marker>
            <Marker
              position={[
                gpxTrack.points[gpxTrack.points.length - 1].lat,
                gpxTrack.points[gpxTrack.points.length - 1].lng,
              ]}
              icon={createIcon('#ef4444', '⬛')}
            >
              <Popup>
                <div className="text-center">
                  <strong>🎯 Финиш</strong>
                  <br />
                  <span className="text-xs text-gray-600">
                    {gpxTrack.points[gpxTrack.points.length - 1].lat.toFixed(5)},{' '}
                    {gpxTrack.points[gpxTrack.points.length - 1].lng.toFixed(5)}
                  </span>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  )
}
