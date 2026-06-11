'use client';

import { useEffect, useState } from 'react';
import { getRouteBySlug, type RouteResponse } from '@/shared/api/routes.api';

export const useRoute = (slug: string) => {
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setIsLoading(true);
        const data = await getRouteBySlug(slug);
        setRoute(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Маршрут не найден'));
        setRoute(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchRoute();
    }
  }, [slug]);

  return {
    route,
    isLoading,
    error,
  };
};
