export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const
