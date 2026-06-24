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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res() res: ExpressResponse,
  ) {
    const result = await this.authService.register(dto);
    
    // Устанавливаем cookie с токеном
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

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
    
    // Устанавливаем cookie с токеном
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return res.json({
      message: result.message,
      user: result.user,
    });
  }

  @Post('logout')
  logout(@Res() res: ExpressResponse) {
    res.clearCookie('token');
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
