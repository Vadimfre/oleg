import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import webpush from 'web-push';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export type NewRoutePayload = {
  title: string;
  slug: string;
  description: string;
};

@Injectable()
export class NotificationsService {
  private readonly log = new Logger(NotificationsService.name);
  private mailer: Transporter | null = null;
  private pushConfigured = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const from = this.config.get<string>('SMTP_FROM');
    if (host && user && pass && from) {
      this.mailer = createTransport({
        host,
        port: Number(this.config.get('SMTP_PORT') || 587),
        secure: this.config.get('SMTP_SECURE') === 'true',
        auth: { user, pass },
      });
      this.log.log('SMTP: транспорт настроен');
    } else {
      this.log.warn(
        'SMTP не настроен (нужны SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM) — письма пропускаются',
      );
    }

    const pub = this.config.get<string>('VAPID_PUBLIC_KEY');
    const priv = this.config.get<string>('VAPID_PRIVATE_KEY');
    const sub = this.config.get<string>('VAPID_SUBJECT') || 'mailto:admin@localhost';
    if (pub && priv) {
      webpush.setVapidDetails(sub, pub, priv);
      this.pushConfigured = true;
      this.log.log('Web Push: VAPID настроен');
    } else {
      this.log.warn(
        'Web Push не настроен (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY) — push пропускаются',
      );
    }
  }

  getVapidPublicKey(): string | null {
    return this.config.get<string>('VAPID_PUBLIC_KEY') || null;
  }

  isPushReady(): boolean {
    return this.pushConfigured;
  }

  async subscribeEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    const existing = await this.prisma.emailSubscriber.findUnique({
      where: { email: normalized },
    });
    if (existing) {
      if (!existing.active) {
        await this.prisma.emailSubscriber.update({
          where: { email: normalized },
          data: { active: true, unsubToken: randomUUID() },
        });
      }
      return { ok: true, message: 'Подписка уже есть или восстановлена' };
    }
    await this.prisma.emailSubscriber.create({
      data: {
        email: normalized,
        unsubToken: randomUUID(),
      },
    });
    return { ok: true, message: 'Вы подписаны на новости маршрутов' };
  }

  async unsubscribeEmail(token: string): Promise<boolean> {
    const sub = await this.prisma.emailSubscriber.findFirst({
      where: { unsubToken: token, active: true },
    });
    if (!sub) return false;
    await this.prisma.emailSubscriber.update({
      where: { id: sub.id },
      data: { active: false },
    });
    return true;
  }

  async savePushSubscription(body: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }) {
    if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      throw new Error('Invalid subscription payload');
    }
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      create: {
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
      update: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
    });
    return { ok: true };
  }

  async notifyNewRoute(route: NewRoutePayload): Promise<void> {
    const base =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const url = `${base.replace(/\/$/, '')}/routes/${encodeURIComponent(route.slug)}`;

    await this.sendNewRouteEmails(route, url).catch((e) =>
      this.log.error(`Email notify: ${e?.message || e}`),
    );
    await this.sendNewRoutePush(route, url).catch((e) =>
      this.log.error(`Push notify: ${e?.message || e}`),
    );
  }

  private async sendNewRouteEmails(route: NewRoutePayload, url: string) {
    if (!this.mailer) return;
    const from = this.config.get<string>('SMTP_FROM')!;
    const subs = await this.prisma.emailSubscriber.findMany({
      where: { active: true },
    });
    const apiBase =
      this.config.get<string>('PUBLIC_API_URL') ||
      `http://localhost:${this.config.get('PORT') || 3001}`;

    for (const s of subs) {
      const unsub = `${apiBase.replace(/\/$/, '')}/notifications/email/unsubscribe?token=${encodeURIComponent(s.unsubToken)}`;
      const html = `
        <p>Новый маршрут на Эко-навигаторе: <strong>${this.escapeHtml(route.title)}</strong></p>
        <p><a href="${url}">Открыть маршрут</a></p>
        <p style="font-size:12px;color:#666;">${this.escapeHtml(route.description.slice(0, 400))}${route.description.length > 400 ? '…' : ''}</p>
        <p style="font-size:12px;"><a href="${unsub}">Отписаться от рассылки</a></p>
      `;
      await this.mailer.sendMail({
        from,
        to: s.email,
        subject: `Новый маршрут: ${route.title}`,
        html,
      });
    }
    if (subs.length) this.log.log(`Отправлено писем: ${subs.length}`);
  }

  private async sendNewRoutePush(route: NewRoutePayload, url: string) {
    if (!this.pushConfigured) return;
    const subs = await this.prisma.pushSubscription.findMany();
    const payload = JSON.stringify({
      title: 'Новый маршрут',
      body: route.title,
      url,
    });
    for (const s of subs) {
      const subscription = {
        endpoint: s.endpoint,
        keys: { p256dh: s.p256dh, auth: s.auth },
      };
      try {
        await webpush.sendNotification(subscription, payload, {
          TTL: 60 * 60,
        });
      } catch (e: unknown) {
        const status = (e as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await this.prisma.pushSubscription
            .delete({ where: { endpoint: s.endpoint } })
            .catch(() => undefined);
        }
        this.log.warn(`Push failed for ${s.endpoint.slice(0, 48)}…: ${e}`);
      }
    }
    if (subs.length) this.log.log(`Push отправок: ${subs.length}`);
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
