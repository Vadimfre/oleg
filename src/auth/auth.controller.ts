import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Request,
  Response,
  Res,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { getAuthCookieOptions } from './cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res() res: ExpressResponse,
  ) {
    const result = await this.authService.register(dto);
    
    res.cookie('token', result.token, getAuthCookieOptions());

    return res.json({
      message: result.message,
      user: result.user,
    });
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: ExpressResponse,
  ) {
    const result = await this.authService.login(dto);
    
    res.cookie('token', result.token, getAuthCookieOptions());

    return res.json({
      message: result.message,
      user: result.user,
    });
  }

  @Post('logout')
  logout(@Res() res: ExpressResponse) {
    const c = getAuthCookieOptions();
    res.clearCookie('token', {
      path: c.path,
      sameSite: c.sameSite,
      secure: c.secure,
    });
    return res.json({ message: 'Выход выполнен успешно' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.userId, dto);
  }
}
