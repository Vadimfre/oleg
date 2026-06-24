import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  // Получить все маршруты
  async findAll(difficulty?: string) {
    const where = difficulty && difficulty !== 'all' ? { difficulty } : {};
    
    const routes = await this.prisma.route.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Парсим highlights из JSON
    return routes.map((route) => ({
      ...route,
      highlights: JSON.parse(route.highlights),
    }));
  }

  // Получить маршрут по slug
  async findBySlug(slug: string) {
    const route = await this.prisma.route.findUnique({
      where: { slug },
    });

    if (!route) {
      return null;
    }

    // Парсим highlights из JSON
    return {
      ...route,
      highlights: JSON.parse(route.highlights),
    };
  }

  // Получить маршрут по ID
  async findById(id: number) {
    const route = await this.prisma.route.findUnique({
      where: { id },
    });

    if (!route) {
      return null;
    }

    // Парсим highlights из JSON
    return {
      ...route,
      highlights: JSON.parse(route.highlights),
    };
  }
}
