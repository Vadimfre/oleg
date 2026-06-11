const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface UserRating {
  id: number
  routeId: string
  rating: number
  comment?: string
  createdAt: string
  user: {
    id: number
    name: string
    email: string
  }
}

export async function getUserRatings(): Promise<UserRating[]> {
  const response = await fetch(`${API_URL}/ratings/my`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Ошибка загрузки рейтингов')
  }

  return response.json()
}
