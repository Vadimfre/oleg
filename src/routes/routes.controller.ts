import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  async findAll(
    @Query('difficulty') difficulty?: string,
    @Query('q') q?: string,
    @Query('sort') sort?: string,
  ) {
    return this.routesService.findAll(difficulty, q, sort);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const route = await this.routesService.findBySlug(slug);

    if (!route) {
      throw new NotFoundException('Маршрут не найден');
    }

    return route;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const route = await this.routesService.findById(Number(id));

    if (!route) {
      throw new NotFoundException('Маршрут не найден');
    }

    return route;
  }
}
