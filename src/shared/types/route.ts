export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Coordinates {
  lat: number
  lng: number
}

export interface RoutePoint extends Coordinates {
  id: string
  name?: string
  type: 'start' | 'waypoint' | 'end'
}

export interface Route {
  id: string
  name: string
  description: string
  distance: number // в км
  duration: number // в минутах
  difficulty: Difficulty
  points: RoutePoint[]
  elevation: number // набор высоты в метрах
  surface: string // тип покрытия
  createdAt: Date
  rating?: number
  imageUrl?: string
}
