import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StartRideDto } from './dto/start-ride.dto';
import { SyncRideDto } from './dto/sync-ride.dto';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RidesController {
  constructor(private ridesService: RidesService) {}

  @Post('start')
  start(@Request() req, @Body() dto: StartRideDto) {
    return this.ridesService.start(req.user.userId, dto);
  }

  @Put(':id/sync')
  sync(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SyncRideDto,
  ) {
    return this.ridesService.sync(req.user.userId, id, dto);
  }

  @Post(':id/complete')
  complete(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SyncRideDto,
  ) {
    return this.ridesService.complete(req.user.userId, id, dto);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.ridesService.getStats(req.user.userId);
  }

  @Get('achievements')
  getAchievements(@Request() req) {
    return this.ridesService.getAchievements(req.user.userId);
  }

  @Get('analytics')
  getAnalytics(@Request() req) {
    return this.ridesService.getAnalytics(req.user.userId);
  }

  @Get('recommendation')
  getRecommendation(@Request() req) {
    return this.ridesService.getRecommendation(req.user.userId);
  }

  @Get()
  list(@Request() req) {
    return this.ridesService.getUserRides(req.user.userId);
  }

  @Get(':id')
  getOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.ridesService.getRide(req.user.userId, id);
  }
}
