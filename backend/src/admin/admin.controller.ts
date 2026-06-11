import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminService } from './admin.service';
import { CreateRouteAdminDto } from './dto/create-route-admin.dto';

const routeFiles = FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }], {
  storage: memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

@Controller('admin')
@UseGuards(AdminApiKeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('routes')
  listRoutes() {
    return this.adminService.listRoutes();
  }

  @Delete('routes/:slug')
  deleteRoute(@Param('slug') slug: string) {
    return this.adminService.deleteRoute(slug);
  }

  @Post('routes')
  @UseInterceptors(routeFiles)
  createRoute(
    @Body() dto: CreateRouteAdminDto,
    @UploadedFiles()
    files: { cover?: Express.Multer.File[] },
  ) {
    return this.adminService.createRoute(dto, {
      cover: files?.cover?.[0],
    });
  }

  @Get('comments')
  listComments(
    @Query('routeId') routeId?: string,
    @Query('take') take?: string,
  ) {
    return this.adminService.listComments(routeId, take ? parseInt(take, 10) : 200);
  }

  @Delete('comments/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteComment(id);
  }

  @Get('ratings')
  listRatings(
    @Query('routeId') routeId?: string,
    @Query('take') take?: string,
  ) {
    return this.adminService.listRatings(routeId, take ? parseInt(take, 10) : 200);
  }

  @Delete('ratings/:id')
  deleteRating(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteRating(id);
  }

  @Get('users')
  listUsers(@Query('take') take?: string) {
    return this.adminService.listUsers(take ? parseInt(take, 10) : 200);
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('subscribers')
  listSubscribers(@Query('take') take?: string) {
    return this.adminService.listSubscribers(take ? parseInt(take, 10) : 200);
  }

  @Delete('subscribers/:id')
  deleteSubscriber(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteSubscriber(id);
  }
}
