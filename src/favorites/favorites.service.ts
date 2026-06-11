import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // Добавить в избранное
  async addFavorite(userId: number, routeId: string) {
    try {
      const favorite = await this.prisma.favorite.create({
        data: {
          userId,
          routeId,
        },
      });
      return { message: 'Маршрут добавлен в избранное', favorite };
    } catch (error) {
      // Если уже есть в избранном
      if (error.code === 'P2002') {
        throw new Error('Маршрут уже в избранном');
      }
      throw error;
    }
  }

  // Удалить из избранного
  async removeFavorite(userId: number, routeId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        routeId,
      },
    });

    if (!favorite) {
      throw new Error('Маршрут не найден в избранном');
    }

    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return { message: 'Маршрут удален из избранного' };
  }

  // Получить все избранные маршруты пользователя
  async getUserFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return favorites.map((f) => f.routeId);
  }

  // Проверить, в избранном ли маршрут
  async isFavorite(userId: number, routeId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        routeId,
      },
    });

    return { isFavorite: !!favorite };
  }
}
