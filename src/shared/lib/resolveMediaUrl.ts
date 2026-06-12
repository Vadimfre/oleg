import { API_URL } from '@/shared/config/env';

/**
 * Пути вида /upload/... отдаются с бэкенда.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/upload')) {
    return `${API_URL}${url}`;
  }
  return url;
}
