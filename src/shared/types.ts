export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Coordinates {
  lat: number
  lng: number
}

export interface RoutePoint extends Coordinates {
  id: string
  type: 'start' | 'waypoint' | 'end'
  name?: string
}

export interface Route {
  id: string
  name: string
  description: string
  distance: number // в км
  duration: number // в минутах
  difficulty: Difficulty
  elevation: number // подъем в метрах
  surface: string // тип покрытия
  rating: number // от 1 до 5
  createdAt: Date
  imageUrl?: string
  points: RoutePoint[]
}
