import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RouteResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  distance: number;
  duration: number;
  elevation: number;
  coordinates: [number, number][];
  imageUrl: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export type GetRoutesParams = {
  difficulty?: string;
  q?: string;
  sort?: string;
};

// Получить все маршруты (фильтры и поиск — query на бэкенде)
export const getAllRoutes = async (
  filters?: GetRoutesParams,
): Promise<RouteResponse[]> => {
  const params: Record<string, string> = {};
  if (filters?.difficulty && filters.difficulty !== 'all') {
    params.difficulty = filters.difficulty;
  }
  if (filters?.q?.trim()) {
    params.q = filters.q.trim();
  }
  if (filters?.sort) {
    params.sort = filters.sort;
  }
  const response = await axios.get(`${API_URL}/routes`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

// Получить маршрут по slug
export const getRouteBySlug = async (slug: string): Promise<RouteResponse> => {
  const response = await axios.get(`${API_URL}/routes/slug/${slug}`, { withCredentials: true });
  return response.data;
};

// Получить маршрут по ID
export const getRouteById = async (id: number): Promise<RouteResponse> => {
  const response = await axios.get(`${API_URL}/routes/${id}`, { withCredentials: true });
  return response.data;
};
