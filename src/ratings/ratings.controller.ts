import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  // Оценить маршрут (требует авторизации)
  @Post(':routeId')
  @UseGuards(JwtAuthGuard)
  rateRoute(
    @Request() req,
    @Param('routeId') routeId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.rateRoute(req.user.userId, routeId, dto);
  }

  // Получить средний рейтинг маршрута (публичный)
  @Get(':routeId/average')
  getRouteAverageRating(@Param('routeId') routeId: string) {
    return this.ratingsService.getRouteAverageRating(routeId);
  }

  // Получить рейтинг пользователя для маршрута (требует авторизации)
  @Get(':routeId/my')
  @UseGuards(JwtAuthGuard)
  getUserRating(@Request() req, @Param('routeId') routeId: string) {
    return this.ratingsService.getUserRating(req.user.userId, routeId);
  }

  // Получить все рейтинги маршрута (публичный)
  @Get('route/:routeId')
  getRouteRatings(@Param('routeId') routeId: string) {
    return this.ratingsService.getRouteRatings(routeId);
  }

  // Получить все рейтинги пользователя (требует авторизации)
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getUserRatings(@Request() req) {
    return this.ratingsService.getUserRatings(req.user.userId);
  }
}
