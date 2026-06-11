const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
