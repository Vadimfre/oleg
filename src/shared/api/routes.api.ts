import axios from 'axios';
import { API_URL } from '@/shared/config/env';

export interface RouteResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  distance: number;
  duration: number;
  elevation: number;
  gpxFile: string;
  imageUrl: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

// Получить все маршруты
export const getAllRoutes = async (difficulty?: string): Promise<RouteResponse[]> => {
  const params = difficulty && difficulty !== 'all' ? { difficulty } : {};
  const response = await axios.get(`${API_URL}/routes`, { params, withCredentials: true });
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
