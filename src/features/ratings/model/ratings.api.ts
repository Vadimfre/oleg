const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface RateRouteData {
  rating: number
  comment?: string
}

export async function rateRoute(routeId: string, data: RateRouteData) {
  const response = await fetch(`${API_URL}/ratings/${routeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка сохранения оценки')
  }

  return response.json()
}

export async function getRouteAverageRating(routeId: string) {
  const response = await fetch(`${API_URL}/ratings/${routeId}/average`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения рейтинга')
  }

  return response.json()
}

export async function getUserRating(routeId: string) {
  try {
    const response = await fetch(`${API_URL}/ratings/${routeId}/my`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}
