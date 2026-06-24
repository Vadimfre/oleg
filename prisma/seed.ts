import { PrismaClient } from '@prisma/client';
import { seedRoutes } from '../src/seed/seed-routes';

const prisma = new PrismaClient();

seedRoutes(prisma)
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
