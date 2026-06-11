import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  // Добавить в избранное
  @Post(':routeId')
  addFavorite(@Request() req, @Param('routeId') routeId: string) {
    return this.favoritesService.addFavorite(req.user.userId, routeId);
  }

  // Удалить из избранного
  @Delete(':routeId')
  removeFavorite(@Request() req, @Param('routeId') routeId: string) {
    return this.favoritesService.removeFavorite(req.user.userId, routeId);
  }

  // Получить все избранные
  @Get()
  getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  // Проверить, в избранном ли
  @Get(':routeId')
  isFavorite(@Request() req, @Param('routeId') routeId: string) {
    return this.favoritesService.isFavorite(req.user.userId, routeId);
  }
}
