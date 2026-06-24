export interface User {
  id: number
  email: string
  name: string
  monthlyGoalKm?: number
  createdAt?: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}
