import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ROUTE_COORDINATES_BY_SLUG } from '../data/route-coordinates';

const DEMO_USER = {
  email: 'demo@bikeroutes.by',
  password: 'demo123456',
  name: 'Олег Демо',
};

/** Устаревшие slug — удаляем при каждом seed (замена в БД) */
const OBSOLETE_ROUTE_SLUGS = ['lestnica-v-nebo', 'pokatushka'];

const ROUTES_SEED_DATA = [
  {
    slug: 'avgustovsci-kanal',
    title: 'Августовский канал',
    description:
      'Живописный маршрут вдоль исторического Августовского канала. Проходит через уникальные шлюзы XIX века, старинные мосты и нетронутую природу Гродненской области. Идеальный маршрут для любителей истории и экотуризма.',
    difficulty: 'medium',
    distance: 45,
    duration: 4.5,
    elevation: 120,
    gpxFile: '/gpx/avgust-velo.kml',
    imageUrl: '/images/routes/avgustovsci-kanal.png',
    highlights: JSON.stringify([
      'Шлюзы Августовского канала',
      'Исторические мосты',
      'Деревни вдоль канала',
      'Лесные массивы',
      'Панорамные виды на воду',
    ]),
  },
  {
    slug: 'pyshki',
    title: 'Тропа здоровья · Пышки',
    description:
      'Велосипедный маршрут «Тропа Здоровья» № 418 в урочище Пышки. Кольцевой маршрут от ул. Фестивальной через форт № 1 Гродненской крепости, спуск к Неману с памятником курсантам-пограничникам и обратно вдоль правого берега реки.',
    difficulty: 'easy',
    distance: 6.15,
    duration: 1.5,
    elevation: 54,
    gpxFile: '/gpx/pyshki.gpx',
    imageUrl: '/images/routes/pyshki.png',
    highlights: JSON.stringify([
      'Форт № 1 Гродненской крепости',
      'Памятник курсантам-пограничникам',
      'Берег реки Неман',
      'Кафе «Пышки»',
      'Беседки отдыха на тропе',
    ]),
  },
  {
    slug: 'grodno-losevo',
    title: 'Гродно - Лосево',
    description:
      'Классический загородный маршрут из Гродно в живописную деревню Лосево. Проходит через сельскую местность, поля и небольшие лесные массивы. Идеален для однодневной поездки с семьёй или друзьями.',
    difficulty: 'easy',
    distance: 28,
    duration: 2.5,
    elevation: 80,
    gpxFile: '/gpx/grodno-losevo.gpx',
    imageUrl: '/images/routes/grodno-losevo.png',
    highlights: JSON.stringify([
      'Сельские пейзажи',
      'Деревня Лосево',
      'Поля и луга',
      'Малые реки',
      'Тихие проселочные дороги',
    ]),
  },
  {
    slug: 'grodno-minsk',
    title: 'Гродно - Минск',
    description:
      'Длинный междугородный маршрут, соединяющий два крупнейших города Беларуси. Проходит через несколько районов, малые города и живописные деревни. Для опытных велосипедистов, готовых к серьёзному вызову.',
    difficulty: 'hard',
    distance: 285,
    duration: 18,
    elevation: 450,
    gpxFile: '/gpx/grodno-minsk.gpx',
    imageUrl: '/images/routes/grodno-minsk.png',
    highlights: JSON.stringify([
      'Междугородная трасса',
      'Города по пути: Лида, Новогрудок',
      'Разнообразные ландшафты',
      'Исторические памятники',
      'Придорожные кафе и остановки',
    ]),
  },
  {
    slug: 'dlinnyj-marshrut',
    title: 'Длинный маршрут',
    description:
      'Экстремальный тренировочный маршрут для подготовленных велосипедистов. Включает разнообразные участки: холмы, равнины, лесные дороги и асфальтированные трассы. Отличная подготовка к велогонкам.',
    difficulty: 'hard',
    distance: 95,
    duration: 7.5,
    elevation: 380,
    gpxFile: '/gpx/Long-bike.gpx',
    imageUrl: '/images/routes/dlinnyj-marshrut.png',
    highlights: JSON.stringify([
      'Разнообразный рельеф',
      'Тренировочные подъёмы',
      'Лесные участки',
      'Асфальтированные дороги',
      'Технические спуски',
    ]),
  },
  {
    slug: 'grodno-korobchitsy',
    title: 'Гродно — Коробчицы',
    description:
      'Кольцевой маршрут из Гродно к агротуристическому комплексу «Коробчицы». Гравий и грунт через лесные массивы, поля и берега водоёмов. Подходит для новичков и семейных поездок с детским креслом или трейлер-коляской. Горный, городской и гравийный велосипед.',
    difficulty: 'easy',
    distance: 27,
    duration: 2.5,
    elevation: 159,
    gpxFile: '/gpx/grodno-korobchitsy.gpx',
    imageUrl: '/images/routes/grodno-korobchitsy.png',
    highlights: JSON.stringify([
      'Дикая природа и лесные массивы',
      'Озёра и водоёмы по пути',
      'Агрокомплекс «Коробчицы»',
      'Тренировочный круговой маршрут',
      'Подходит для поездок с детьми',
    ]),
  },
];

async function seedDemoUser(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {
      name: DEMO_USER.name,
      password: hashedPassword,
    },
    create: {
      email: DEMO_USER.email,
      password: hashedPassword,
      name: DEMO_USER.name,
    },
  });

  await prisma.favorite.upsert({
    where: {
      userId_routeId: { userId: user.id, routeId: 'grodno-korobchitsy' },
    },
    update: {},
    create: { userId: user.id, routeId: 'grodno-korobchitsy' },
  });

  console.log(`✅ Демо-аккаунт: ${DEMO_USER.email} / ${DEMO_USER.password}`);
}

export async function seedRoutes(prisma: PrismaClient) {
  console.log('🚴 Начинаем seed...');

  await seedDemoUser(prisma);

  if (OBSOLETE_ROUTE_SLUGS.length > 0) {
    const removed = await prisma.route.deleteMany({
      where: { slug: { in: OBSOLETE_ROUTE_SLUGS } },
    });
    if (removed.count > 0) {
      console.log(
        `✅ Удалены устаревшие маршруты: ${OBSOLETE_ROUTE_SLUGS.join(', ')}`,
      );
    }
  }

  for (const route of ROUTES_SEED_DATA) {
    const coordinates = JSON.stringify(
      ROUTE_COORDINATES_BY_SLUG[route.slug] ?? [[53.6693, 23.8131]],
    );
    await prisma.route.upsert({
      where: { slug: route.slug },
      update: {
        title: route.title,
        description: route.description,
        difficulty: route.difficulty,
        distance: route.distance,
        duration: route.duration,
        elevation: route.elevation,
        coordinates,
        gpxFile: route.gpxFile,
        imageUrl: route.imageUrl,
        highlights: route.highlights,
      },
      create: { ...route, coordinates },
    });
    console.log(`✅ Маршрут: ${route.title}`);
  }

  console.log('🎉 Seed завершен успешно!');
}
