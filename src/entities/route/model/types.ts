export interface Route {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  distance: number; // в км
  duration: number; // в часах
  elevation: number; // перепад высот в метрах
  gpxFile: string;
  imageUrl: string;
  highlights: string[]; // Достопримечательности
  createdAt: string;
}

export interface RouteFilters {
  difficulty?: 'all' | 'easy' | 'medium' | 'hard';
}
