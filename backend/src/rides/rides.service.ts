import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartRideDto } from './dto/start-ride.dto';
import { SyncRideDto } from './dto/sync-ride.dto';
import {
  ACHIEVEMENTS,
  type AchievementCheckContext,
} from './achievements.definitions';

@Injectable()
export class RidesService {
  constructor(private prisma: PrismaService) {}

  async start(userId: number, dto: StartRideDto) {
    await this.prisma.ride.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'cancelled', endedAt: new Date() },
    });

    const ride = await this.prisma.ride.create({
      data: {
        userId,
        routeSlug: dto.routeSlug ?? null,
        routeTitle: dto.routeTitle,
        status: 'active',
      },
    });

    return this.toSummary(ride);
  }

  async sync(userId: number, rideId: number, dto: SyncRideDto) {
    const ride = await this.findOwned(userId, rideId);

    const updated = await this.prisma.ride.update({
      where: { id: ride.id },
      data: {
        elapsedSec: dto.elapsedSec,
        movingSec: dto.movingSec,
        distanceKm: dto.distanceKm,
        avgSpeedKmh: dto.avgSpeedKmh ?? null,
        maxSpeedKmh: dto.maxSpeedKmh ?? null,
        avgPaceMinPerKm: dto.avgPaceMinPerKm ?? null,
        maxOffRouteKm: dto.maxOffRouteKm ?? 0,
        routeCompletion: dto.routeCompletion ?? null,
        trackPoints: JSON.stringify(dto.trackPoints),
      },
    });

    return this.toSummary(updated);
  }

  async complete(userId: number, rideId: number, dto: SyncRideDto) {
    const ride = await this.findOwned(userId, rideId);

    const updated = await this.prisma.ride.update({
      where: { id: ride.id },
      data: {
        status: 'completed',
        endedAt: new Date(),
        elapsedSec: dto.elapsedSec,
        movingSec: dto.movingSec,
        distanceKm: dto.distanceKm,
        avgSpeedKmh: dto.avgSpeedKmh ?? null,
        maxSpeedKmh: dto.maxSpeedKmh ?? null,
        avgPaceMinPerKm: dto.avgPaceMinPerKm ?? null,
        maxOffRouteKm: dto.maxOffRouteKm ?? 0,
        routeCompletion: dto.routeCompletion ?? null,
        trackPoints: JSON.stringify(dto.trackPoints),
      },
    });

    return this.toSummary(updated);
  }

  async getUserRides(userId: number) {
    const rides = await this.prisma.ride.findMany({
      where: { userId, status: 'completed' },
      orderBy: { startedAt: 'desc' },
    });
    return rides.map((r) => this.toSummary(r));
  }

  async getRide(userId: number, rideId: number) {
    const ride = await this.findOwned(userId, rideId);
    return this.toDetail(ride);
  }

  async getStats(userId: number) {
    const rides = await this.prisma.ride.findMany({
      where: { userId, status: 'completed' },
    });

    const totalDistanceKm = rides.reduce((s, r) => s + r.distanceKm, 0);
    const totalMovingSec = rides.reduce((s, r) => s + r.movingSec, 0);
    const totalElapsedSec = rides.reduce((s, r) => s + r.elapsedSec, 0);

    const avgSpeed =
      totalMovingSec > 0
        ? totalDistanceKm / (totalMovingSec / 3600)
        : null;

    return {
      ridesCount: rides.length,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      totalMovingSec,
      totalElapsedSec,
      avgSpeedKmh: avgSpeed ? Math.round(avgSpeed * 10) / 10 : null,
    };
  }

  private async buildContext(userId: number): Promise<AchievementCheckContext> {
    const [user, rides] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.ride.findMany({
        where: { userId, status: 'completed' },
      }),
    ]);

    const totalDistanceKm = rides.reduce((s, r) => s + r.distanceKm, 0);
    const maxEverSpeedKmh = rides.reduce(
      (m, r) => Math.max(m, r.maxSpeedKmh ?? 0),
      0,
    );
    const longestRideKm = rides.reduce(
      (m, r) => Math.max(m, r.distanceKm),
      0,
    );

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthKm = rides
      .filter((r) => r.startedAt >= monthStart)
      .reduce((s, r) => s + r.distanceKm, 0);

    const rideDays = [
      ...new Set(
        rides.map((r) => r.startedAt.toISOString().slice(0, 10)),
      ),
    ].sort();

    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (rideDays.includes(key)) streakDays++;
      else break;
    }

    return {
      ridesCount: rides.length,
      totalDistanceKm,
      maxEverSpeedKmh,
      longestRideKm,
      currentMonthKm: Math.round(currentMonthKm * 10) / 10,
      monthlyGoalKm: user?.monthlyGoalKm ?? 80,
      streakDays,
    };
  }

  async getAchievements(userId: number) {
    const ctx = await this.buildContext(userId);
    return ACHIEVEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      unlocked: a.check(ctx),
    }));
  }

  async getAnalytics(userId: number) {
    const ctx = await this.buildContext(userId);
    const rides = await this.prisma.ride.findMany({
      where: { userId, status: 'completed' },
      orderBy: { startedAt: 'asc' },
    });

    const monthlyKm: { month: string; label: string; km: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('ru-RU', { month: 'short' });
      const km = rides
        .filter(
          (r) =>
            r.startedAt.getFullYear() === d.getFullYear() &&
            r.startedAt.getMonth() === d.getMonth(),
        )
        .reduce((s, r) => s + r.distanceKm, 0);
      monthlyKm.push({ month: key, label, km: Math.round(km * 10) / 10 });
    }

    const longest =
      rides.length > 0
        ? rides.reduce((a, b) => (a.distanceKm > b.distanceKm ? a : b))
        : null;
    const fastest =
      rides.length > 0
        ? rides.reduce((a, b) =>
            (a.avgSpeedKmh ?? 0) > (b.avgSpeedKmh ?? 0) ? a : b,
          )
        : null;

    const goalProgress =
      ctx.monthlyGoalKm > 0
        ? Math.min(100, Math.round((ctx.currentMonthKm / ctx.monthlyGoalKm) * 100))
        : 0;

    return {
      ...ctx,
      monthlyGoalKm: ctx.monthlyGoalKm,
      currentMonthKm: ctx.currentMonthKm,
      goalProgress,
      streakDays: ctx.streakDays,
      monthlyKm,
      personalRecords: {
        longestRide: longest
          ? {
              id: longest.id,
              title: longest.routeTitle,
              distanceKm: longest.distanceKm,
              date: longest.startedAt.toISOString(),
            }
          : null,
        fastestRide: fastest
          ? {
              id: fastest.id,
              title: fastest.routeTitle,
              avgSpeedKmh: fastest.avgSpeedKmh,
              date: fastest.startedAt.toISOString(),
            }
          : null,
      },
      unlockedAchievements: ACHIEVEMENTS.filter((a) => a.check(ctx)).length,
      totalAchievements: ACHIEVEMENTS.length,
    };
  }

  async getRecommendation(userId: number) {
    const [rides, routes] = await Promise.all([
      this.prisma.ride.findMany({
        where: { userId, status: 'completed' },
      }),
      this.prisma.route.findMany(),
    ]);

    const completedSlugs = new Set(
      rides.map((r) => r.routeSlug).filter(Boolean) as string[],
    );

    const notCompleted = routes.filter((r) => !completedSlugs.has(r.slug));
    const pool = notCompleted.length > 0 ? notCompleted : routes;

    const difficultyScore = { easy: 1, medium: 2, hard: 3 };
    const avgCompleted =
      rides.length > 0
        ? rides.reduce((s, r) => {
            const route = routes.find((rt) => rt.slug === r.routeSlug);
            return s + (route ? difficultyScore[route.difficulty as keyof typeof difficultyScore] ?? 2 : 2);
          }, 0) / rides.length
        : 1.5;

    const targetDifficulty =
      avgCompleted < 1.5 ? 'easy' : avgCompleted < 2.5 ? 'medium' : 'hard';

    const sorted = [...pool].sort((a, b) => {
      const da = Math.abs(
        (difficultyScore[a.difficulty as keyof typeof difficultyScore] ?? 2) -
          (avgCompleted || 2),
      );
      const db = Math.abs(
        (difficultyScore[b.difficulty as keyof typeof difficultyScore] ?? 2) -
          (avgCompleted || 2),
      );
      return da - db;
    });

    const pick = sorted[0] ?? routes[0];
    if (!pick) return null;

    const reason =
      notCompleted.length > 0
        ? completedSlugs.size === 0
          ? 'Отличный маршрут для первой поездки'
          : `Вы ещё не проходили «${pick.title}» — подходит под ваш уровень`
        : 'Повторите любимый маршрут и побейте свой рекорд';

    return {
      slug: pick.slug,
      title: pick.title,
      distance: pick.distance,
      difficulty: pick.difficulty,
      duration: pick.duration,
      imageUrl: pick.imageUrl,
      reason,
    };
  }

  private async findOwned(userId: number, rideId: number) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Поездка не найдена');
    if (ride.userId !== userId) throw new ForbiddenException('Нет доступа');
    return ride;
  }

  private toSummary(ride: {
    id: number;
    routeSlug: string | null;
    routeTitle: string;
    status: string;
    startedAt: Date;
    endedAt: Date | null;
    elapsedSec: number;
    movingSec: number;
    distanceKm: number;
    avgSpeedKmh: number | null;
    maxSpeedKmh: number | null;
    avgPaceMinPerKm: number | null;
    maxOffRouteKm: number;
    routeCompletion: number | null;
  }) {
    return {
      id: ride.id,
      routeSlug: ride.routeSlug,
      routeTitle: ride.routeTitle,
      status: ride.status,
      startedAt: ride.startedAt.toISOString(),
      endedAt: ride.endedAt?.toISOString() ?? null,
      elapsedSec: ride.elapsedSec,
      movingSec: ride.movingSec,
      distanceKm: ride.distanceKm,
      avgSpeedKmh: ride.avgSpeedKmh,
      maxSpeedKmh: ride.maxSpeedKmh,
      avgPaceMinPerKm: ride.avgPaceMinPerKm,
      maxOffRouteKm: ride.maxOffRouteKm,
      routeCompletion: ride.routeCompletion,
    };
  }

  private toDetail(ride: {
    id: number;
    routeSlug: string | null;
    routeTitle: string;
    status: string;
    startedAt: Date;
    endedAt: Date | null;
    elapsedSec: number;
    movingSec: number;
    distanceKm: number;
    avgSpeedKmh: number | null;
    maxSpeedKmh: number | null;
    avgPaceMinPerKm: number | null;
    maxOffRouteKm: number;
    routeCompletion: number | null;
    trackPoints: string;
  }) {
    let trackPoints: { lat: number; lng: number; t: number; speed?: number | null }[] = [];
    try {
      trackPoints = JSON.parse(ride.trackPoints);
    } catch {
      trackPoints = [];
    }

    return {
      ...this.toSummary(ride),
      trackPoints,
    };
  }
}
