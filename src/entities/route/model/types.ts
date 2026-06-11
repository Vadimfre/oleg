export interface Route {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  distance: number; // в км
  duration: number; // в часах
  elevation: number; // перепад высот в метрах
  coordinates: [number, number][];
  imageUrl: string;
  highlights: string[]; // Достопримечательности
  createdAt: string;
}

export type RouteSort =
  | 'newest'
  | 'oldest'
  | 'distance_asc'
  | 'distance_desc'
  | 'duration_asc'
  | 'duration_desc'
  | 'elevation_asc'
  | 'elevation_desc'
  | 'title_asc';

export interface RouteFilters {
  difficulty?: 'all' | 'easy' | 'medium' | 'hard';
  /** Поиск по названию, описанию, slug и тексту highlights */
  q?: string;
  sort?: RouteSort;
}
