import type { CookieOptions } from 'express';

/**
 * Кросс-ориджин (фронт :3000, API :3001): для XHR с credentials нужен SameSite=None; Secure.
 * Lax не шлёт куки между разными origin (в т.ч. разные порты). Для None в dev на localhost Chrome допускает Secure+http.
 */
export function getAuthCookieOptions(): CookieOptions {
  const isDev = process.env.NODE_ENV !== 'production';
  const o = process.env.AUTH_COOKIE_SAME_SITE;
  const sameSite: 'lax' | 'none' =
    o === 'lax' ? 'lax' : o === 'none' ? 'none' : isDev ? 'none' : 'lax';
  return {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite,
    secure: sameSite === 'none' || process.env.NODE_ENV === 'production',
  };
}
