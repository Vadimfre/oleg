import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteAdminDto } from './dto/create-route-admin.dto';
import { NotificationsService } from '../notifications/notifications.service';

const DEFAULT_ROUTE_IMAGE =
  'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=600&fit=crop';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getStats() {
    const [routes, comments, ratings, users, subscribers, pushSubs] =
      await Promise.all([
        this.prisma.route.count(),
        this.prisma.comment.count(),
        this.prisma.rating.count(),
        this.prisma.user.count(),
        this.prisma.emailSubscriber.count(),
        this.prisma.pushSubscription.count(),
      ]);

    return { routes, comments, ratings, users, subscribers, pushSubs };
  }

  async listRoutes() {
    const routes = await this.prisma.route.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return routes.map((route) => ({
      ...route,
      coordinates: JSON.parse(route.coordinates) as [number, number][],
      highlights: JSON.parse(route.highlights) as string[],
    }));
  }

  async deleteRoute(slug: string) {
    const route = await this.prisma.route.findUnique({ where: { slug } });
    if (!route) {
      throw new NotFoundException('Маршрут не найден');
    }

    await this.prisma.$transaction([
      this.prisma.favorite.deleteMany({ where: { routeId: slug } }),
      this.prisma.comment.deleteMany({ where: { routeId: slug } }),
      this.prisma.rating.deleteMany({ where: { routeId: slug } }),
      this.prisma.route.delete({ where: { slug } }),
    ]);

    return { message: 'Маршрут удалён', slug };
  }

  async listComments(routeId?: string, take = 200) {
    return this.prisma.comment.findMany({
      where: routeId?.trim() ? { routeId: routeId.trim() } : undefined,
      take: Math.min(Math.max(take, 1), 500),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async deleteComment(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Комментарий удалён', id };
  }

  async listRatings(routeId?: string, take = 200) {
    return this.prisma.rating.findMany({
      where: routeId?.trim() ? { routeId: routeId.trim() } : undefined,
      take: Math.min(Math.max(take, 1), 500),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async deleteRating(id: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Оценка не найдена');
    }

    await this.prisma.rating.delete({ where: { id } });
    return { message: 'Оценка удалена', id };
  }

  async listUsers(take = 200) {
    return this.prisma.user.findMany({
      take: Math.min(Math.max(take, 1), 500),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { comments: true, ratings: true, favorites: true },
        },
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Пользователь удалён', id };
  }

  async listSubscribers(take = 200) {
    return this.prisma.emailSubscriber.findMany({
      take: Math.min(Math.max(take, 1), 500),
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteSubscriber(id: number) {
    const sub = await this.prisma.emailSubscriber.findUnique({ where: { id } });
    if (!sub) {
      throw new NotFoundException('Подписчик не найден');
    }

    await this.prisma.emailSubscriber.delete({ where: { id } });
    return { message: 'Подписчик удалён', id };
  }

  async createRoute(
    dto: CreateRouteAdminDto,
    files: {
      cover?: { buffer: Buffer; originalname?: string };
    },
  ) {
    const existing = await this.prisma.route.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Маршрут с таким slug уже есть');
    }

    let coordinates: [number, number][];
    try {
      const parsed = JSON.parse(dto.coordinates) as unknown;
      if (!Array.isArray(parsed) || parsed.length < 2) {
        throw new Error('invalid');
      }
      coordinates = parsed.map((point) => {
        if (!Array.isArray(point) || point.length < 2) throw new Error('invalid');
        const lat = Number(point[0]);
        const lng = Number(point[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('invalid');
        return [lat, lng] as [number, number];
      });
    } catch {
      throw new BadRequestException(
        'Нужны координаты маршрута: минимум 2 точки [[lat, lng], ...]',
      );
    }

    const uploadRoot = join(process.cwd(), 'upload');
    const imgDir = join(uploadRoot, 'images');
    await fs.mkdir(imgDir, { recursive: true });

    let imageUrl = dto.imageUrl?.trim() || DEFAULT_ROUTE_IMAGE;
    const cover = files.cover;
    if (cover?.buffer?.length) {
      const imgExt = extname(cover.originalname || '').toLowerCase() || '.jpg';
      if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(imgExt)) {
        throw new BadRequestException('Обложка: допустимы jpg, png, webp, gif');
      }
      const imgName = `${randomUUID()}${imgExt}`;
      await fs.writeFile(join(imgDir, imgName), cover.buffer);
      imageUrl = `/upload/images/${imgName}`;
    }

    const highlightLines = dto.highlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (highlightLines.length === 0) {
      throw new BadRequestException('Добавьте хотя бы одну строку в достопримечательностях');
    }

    const route = await this.prisma.route.create({
      data: {
        slug: dto.slug.trim(),
        title: dto.title.trim(),
        description: dto.description.trim(),
        difficulty: dto.difficulty,
        distance: dto.distance,
        duration: dto.duration,
        elevation: dto.elevation,
        coordinates: JSON.stringify(coordinates),
        imageUrl,
        highlights: JSON.stringify(highlightLines),
      },
    });

    void this.notifications
      .notifyNewRoute({
        title: route.title,
        slug: route.slug,
        description: route.description,
      })
      .catch(() => undefined);

    return {
      ...route,
      coordinates,
      highlights: highlightLines,
    };
  }
}
