import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { NotificationsService } from './notifications.service';
import { SubscribeEmailDto } from './dto/subscribe-email.dto';
import { PushSubscribeDto } from './dto/push-subscribe.dto';
import { ConfigService } from '@nestjs/config';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  @Post('email/subscribe')
  @HttpCode(200)
  async subscribeEmail(@Body() dto: SubscribeEmailDto) {
    return this.notifications.subscribeEmail(dto.email);
  }

  @Get('email/unsubscribe')
  async unsubscribeEmail(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const ok = await this.notifications.unsubscribeEmail(token || '');
    const fe =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const base = fe.replace(/\/$/, '');
    res.redirect(302, `${base}/?email_unsub=${ok ? '1' : '0'}`);
  }

  @Get('push/vapid-public')
  vapidPublic() {
    const publicKey = this.notifications.getVapidPublicKey();
    return {
      ok: !!publicKey,
      publicKey,
      pushReady: this.notifications.isPushReady(),
    };
  }

  @Post('push/subscribe')
  @HttpCode(200)
  async pushSubscribe(@Body() body: PushSubscribeDto) {
    await this.notifications.savePushSubscription(body);
    return { ok: true };
  }
}
