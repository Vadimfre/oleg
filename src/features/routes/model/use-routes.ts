'use client';

import { useEffect, useState } from 'react';
import { getAllRoutes, type RouteResponse } from '@/shared/api/routes.api';
import type { RouteFilters } from '@/entities/route';

export const useRoutes = (filters?: RouteFilters) => {
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const data = await getAllRoutes(filters?.difficulty);
        setRoutes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch routes'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [filters?.difficulty]);

  return {
    routes,
    isLoading,
    error,
  };
};
