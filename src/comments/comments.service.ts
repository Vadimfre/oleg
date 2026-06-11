import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // Создать комментарий
  async createComment(userId: number, routeId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        userId,
        routeId,
        text: dto.text,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { message: 'Комментарий добавлен', comment };
  }

  // Получить все комментарии маршрута
  async getRouteComments(routeId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { routeId },
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

    return comments;
  }

  // Получить все комментарии пользователя
  async getUserComments(userId: number) {
    const comments = await this.prisma.comment.findMany({
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

    return comments;
  }

  // Удалить комментарий (только свой)
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Комментарий не найден');
    }

    if (comment.userId !== userId) {
      throw new Error('Вы не можете удалить чужой комментарий');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Комментарий удален' };
  }
}
