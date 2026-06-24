import { API_URL } from '@/shared/config/env'

// Добавить маршрут в избранное
export async function addToFavorites(routeId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/favorites/${routeId}`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка добавления в избранное')
  }

  return response.json()
}

// Удалить из избранного
export async function removeFromFavorites(routeId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/favorites/${routeId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка удаления из избранного')
  }

  return response.json()
}

// Получить все избранные маршруты
export async function getFavorites(): Promise<string[]> {
  const response = await fetch(`${API_URL}/favorites`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Не удалось получить избранное')
  }

  return response.json()
}

// Проверить, в избранном ли маршрут
export async function checkIsFavorite(routeId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/favorites/${routeId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.isFavorite
  } catch {
    return false
  }
}
