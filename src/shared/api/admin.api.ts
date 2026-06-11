const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function adminFetch<T>(
  adminKey: string,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      'x-admin-key': adminKey,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(body?.message)
      ? body.message.join(', ')
      : typeof body?.message === 'string'
        ? body.message
        : `Ошибка ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

export type AdminStats = {
  routes: number;
  comments: number;
  ratings: number;
  users: number;
  subscribers: number;
  pushSubs: number;
};

export type AdminRoute = {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  distance: number;
  createdAt: string;
};

export type AdminComment = {
  id: number;
  routeId: string;
  text: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
};

export type AdminRating = {
  id: number;
  routeId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string };
};

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  _count: { comments: number; ratings: number; favorites: number };
};

export type AdminSubscriber = {
  id: number;
  email: string;
  active: boolean;
  createdAt: string;
};

export const adminApi = {
  getStats: (key: string) => adminFetch<AdminStats>(key, '/stats'),

  listRoutes: (key: string) => adminFetch<AdminRoute[]>(key, '/routes'),

  deleteRoute: (key: string, slug: string) =>
    adminFetch<{ message: string }>(key, `/routes/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    }),

  listComments: (key: string, routeId?: string) => {
    const q = routeId?.trim() ? `?routeId=${encodeURIComponent(routeId.trim())}` : '';
    return adminFetch<AdminComment[]>(key, `/comments${q}`);
  },

  deleteComment: (key: string, id: number) =>
    adminFetch<{ message: string }>(key, `/comments/${id}`, { method: 'DELETE' }),

  listRatings: (key: string, routeId?: string) => {
    const q = routeId?.trim() ? `?routeId=${encodeURIComponent(routeId.trim())}` : '';
    return adminFetch<AdminRating[]>(key, `/ratings${q}`);
  },

  deleteRating: (key: string, id: number) =>
    adminFetch<{ message: string }>(key, `/ratings/${id}`, { method: 'DELETE' }),

  listUsers: (key: string) => adminFetch<AdminUser[]>(key, '/users'),

  deleteUser: (key: string, id: number) =>
    adminFetch<{ message: string }>(key, `/users/${id}`, { method: 'DELETE' }),

  listSubscribers: (key: string) => adminFetch<AdminSubscriber[]>(key, '/subscribers'),

  deleteSubscriber: (key: string, id: number) =>
    adminFetch<{ message: string }>(key, `/subscribers/${id}`, { method: 'DELETE' }),
};
