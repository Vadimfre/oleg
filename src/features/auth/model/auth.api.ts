import { RegisterData, LoginData, AuthResponse, User } from './types'

import { API_URL } from '@/shared/config/env'

// Регистрация
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Важно для cookies
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка регистрации')
  }

  return response.json()
}

// Логин
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Важно для cookies
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка входа')
  }

  return response.json()
}

// Выход
export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Ошибка выхода')
  }
}

// Получить профиль
export async function getProfile(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    credentials: 'include', // Важно для cookies
  })

  if (!response.ok) {
    throw new Error('Не авторизован')
  }

  return response.json()
}

// Обновить профиль
export async function updateProfile(data: {
  name?: string
  email?: string
  monthlyGoalKm?: number
}): Promise<{ user: User }> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка обновления профиля')
  }

  return response.json()
}

// Проверить авторизацию
export async function checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
  try {
    const user = await getProfile()
    return { isAuthenticated: true, user }
  } catch {
    return { isAuthenticated: false }
  }
}
