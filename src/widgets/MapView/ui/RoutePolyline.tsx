'use client'

import { useEffect, useState } from 'react'
import { Polyline, Popup } from 'react-leaflet'

interface RoutePolylineProps {
  coordinates: [number, number][]
  color: string
  name: string
  description: string
  distance: number
  difficulty: 'easy' | 'medium' | 'hard'
  weight?: number
  opacity?: number
  dashArray?: string
}

// Функция для получения маршрута от OSRM
async function getRoutedPath(coordinates: [number, number][]): Promise<[number, number][]> {
  if (coordinates.length < 2) return coordinates
  
  const coords = coordinates.map(c => `${c[1]},${c[0]}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/cycling/${coords}?overview=full&geometries=geojson`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
    }
  } catch (error) {
    console.error('Ошибка получения маршрута:', error)
  }
  
  return coordinates
}

export function RoutePolyline({
  coordinates,
  color,
  name,
  description,
  distance,
  difficulty,
  weight = 3,
  opacity = 0.7,
  dashArray,
}: RoutePolylineProps) {
  const [routedCoordinates, setRoutedCoordinates] = useState<[number, number][]>(coordinates)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoading(true)
      const routed = await getRoutedPath(coordinates)
      setRoutedCoordinates(routed)
      setIsLoading(false)
    }

    fetchRoute()
  }, [coordinates])

  if (isLoading) {
    // Показываем простую линию пока загружается роутинг
    return (
      <Polyline
        positions={coordinates}
        color={color}
        weight={weight - 1}
        opacity={opacity * 0.4}
        dashArray="5, 10"
        smoothFactor={3}
        lineCap="round"
        lineJoin="round"
      />
    )
  }

  return (
    <Polyline
      positions={routedCoordinates}
      color={color}
      weight={weight}
      opacity={opacity}
      dashArray={dashArray}
      smoothFactor={1.5}
      lineCap="round"
      lineJoin="round"
    >
      <Popup>
        <div className="text-sm space-y-1">
          <strong className="text-base">{name}</strong>
          <p className="text-gray-600">{description}</p>
          <div className="flex items-center gap-2 text-xs pt-1">
            <span className="bg-gray-100 px-2 py-1 rounded">
              📏 {distance} км
            </span>
            <span className={`px-2 py-1 rounded ${
              difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {difficulty === 'easy' ? '🟢 Легкий' :
               difficulty === 'medium' ? '🟡 Средний' :
               '🔴 Сложный'}
            </span>
          </div>
        </div>
      </Popup>
    </Polyline>
  )
}
