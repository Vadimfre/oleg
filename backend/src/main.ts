import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  const isAllowedCorsOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true;
    const fromEnv = process.env.FRONTEND_URL;
    if (fromEnv && origin === fromEnv) return true;
    if (fromEnv) {
      const extra = (process.env.CORS_EXTRA_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (extra.includes(origin)) return true;
    }
    if (!isProd) {
      return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(
        origin,
      );
    }
    return false;
  };

  app.enableCors({
    origin: (origin, callback) => {
      if (isAllowedCorsOrigin(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'x-admin-key',
    ],
    optionsSuccessStatus: 204,
  });

  // Cookie parser
  app.use(cookieParser());

  // Статика после CORS (обложки с /upload для фронта на другом порту)
  app.useStaticAssets(join(process.cwd(), 'upload'), { prefix: '/upload/' });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Запуск сервера
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚴 Эко-навигатор Backend is running on http://localhost:${port}`);
}

bootstrap();
