import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type RoutePoint = [number, number];

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  private mapRoute(route: {
    id: number;
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    distance: number;
    duration: number;
    elevation: number;
    coordinates: string;
    imageUrl: string;
    highlights: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...route,
      coordinates: JSON.parse(route.coordinates) as RoutePoint[],
      highlights: JSON.parse(route.highlights) as string[],
    };
  }

  async findAll(difficulty?: string, q?: string, sort?: string) {
    const where: Prisma.RouteWhereInput = {};
    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }
    const term = q?.trim();
    if (term) {
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
        { highlights: { contains: term, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.RouteOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'distance_asc':
        orderBy = { distance: 'asc' };
        break;
      case 'distance_desc':
        orderBy = { distance: 'desc' };
        break;
      case 'duration_asc':
        orderBy = { duration: 'asc' };
        break;
      case 'duration_desc':
        orderBy = { duration: 'desc' };
        break;
      case 'elevation_asc':
        orderBy = { elevation: 'asc' };
        break;
      case 'elevation_desc':
        orderBy = { elevation: 'desc' };
        break;
      case 'title_asc':
        orderBy = { title: 'asc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const routes = await this.prisma.route.findMany({ where, orderBy });
    return routes.map((route) => this.mapRoute(route));
  }

  async findBySlug(slug: string) {
    const route = await this.prisma.route.findUnique({ where: { slug } });
    if (!route) return null;
    return this.mapRoute(route);
  }

  async findById(id: number) {
    const route = await this.prisma.route.findUnique({ where: { id } });
    if (!route) return null;
    return this.mapRoute(route);
  }
}
