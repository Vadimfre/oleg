/** Единая точка: URL бэкенда из NEXT_PUBLIC_API_URL (.env / Coolify) */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const ENV = {
  API_URL,
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const
