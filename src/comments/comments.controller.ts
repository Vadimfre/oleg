import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // Создать комментарий (требует авторизации)
  @Post(':routeId')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Request() req,
    @Param('routeId') routeId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(req.user.userId, routeId, dto);
  }

  // Получить все комментарии маршрута (публичный)
  @Get('route/:routeId')
  getRouteComments(@Param('routeId') routeId: string) {
    return this.commentsService.getRouteComments(routeId);
  }

  // Получить все комментарии пользователя (требует авторизации)
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getUserComments(@Request() req) {
    return this.commentsService.getUserComments(req.user.userId);
  }

  // Удалить комментарий (требует авторизации, только свой)
  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Request() req,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.deleteComment(commentId, req.user.userId);
  }
}
