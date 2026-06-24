import { API_URL } from '@/shared/config/env'

export interface Comment {
  id: number
  text: string
  createdAt: string
  user: {
    id: number
    name: string
    email: string
  }
}

export async function createComment(routeId: string, text: string) {
  const response = await fetch(`${API_URL}/comments/${routeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка добавления комментария')
  }

  return response.json()
}

export async function getRouteComments(routeId: string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/route/${routeId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка загрузки комментариев')
  }

  return response.json()
}

export async function getUserComments(): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/my`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Ошибка загрузки комментариев')
  }

  return response.json()
}

export async function deleteComment(commentId: number) {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка удаления комментария')
  }

  return response.json()
}
