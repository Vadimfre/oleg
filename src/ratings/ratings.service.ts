import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  // Добавить или обновить рейтинг
  async rateRoute(userId: number, routeId: string, dto: CreateRatingDto) {
    const rating = await this.prisma.rating.upsert({
      where: {
        userId_routeId: {
          userId,
          routeId,
        },
      },
      update: {
        rating: dto.rating,
        comment: dto.comment,
      },
      create: {
        userId,
        routeId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    return { message: 'Оценка сохранена', rating };
  }

  // Получить средний рейтинг маршрута
  async getRouteAverageRating(routeId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { routeId },
    });

    if (ratings.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = sum / ratings.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
    };
  }

  // Получить рейтинг пользователя для маршрута
  async getUserRating(userId: number, routeId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_routeId: {
          userId,
          routeId,
        },
      },
    });

    return rating;
  }

  // Получить все рейтинги маршрута
  async getRouteRatings(routeId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { routeId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }

  // Получить все рейтинги пользователя
  async getUserRatings(userId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }
}
