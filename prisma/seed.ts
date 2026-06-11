import { PrismaClient } from '@prisma/client';
import { ROUTE_COORDINATES_BY_SLUG } from '../src/data/route-coordinates';

const prisma = new PrismaClient();

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
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    highlights: JSON.stringify([
      'Шлюзы Августовского канала',
      'Исторические мосты',
      'Деревни вдоль канала',
      'Лесные массивы',
      'Панорамные виды на воду',
    ]),
  },
  {
    slug: 'lestnica-v-nebo',
    title: 'Лестница в небо',
    description:
      'Захватывающий маршрут из Гродно в Санники через холмистую местность. Маршрут получил название "Лестница в небо" благодаря живописным подъёмам с видами на долины. Отличается красивыми ландшафтами и разнообразием природных зон.',
    difficulty: 'hard',
    distance: 38,
    duration: 4,
    elevation: 280,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    highlights: JSON.stringify([
      'Панорамные холмы',
      'Смотровые площадки',
      'Деревня Санники',
      'Лесные тропы',
      'Исторические усадьбы',
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
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=800&h=600&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    highlights: JSON.stringify([
      'Разнообразный рельеф',
      'Тренировочные подъёмы',
      'Лесные участки',
      'Асфальтированные дороги',
      'Технические спуски',
    ]),
  },
  {
    slug: 'pokatushka',
    title: 'Покатушка',
    description:
      'Лёгкий развлекательный маршрут для вечерних прогулок и семейных поездок. Проходит по живописным окраинам Гродно, парковым зонам и набережным. Идеален для новичков и детей.',
    difficulty: 'easy',
    distance: 15,
    duration: 1.5,
    elevation: 40,
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=600&fit=crop',
    highlights: JSON.stringify([
      'Городские парки',
      'Набережная Немана',
      'Зелёные зоны',
      'Безопасные велодорожки',
      'Места для отдыха',
    ]),
  },
];

async function main() {
  console.log('🚴 Начинаем seed маршрутов...');

  await prisma.route.deleteMany({});
  console.log('✅ Старые маршруты удалены');

  for (const route of ROUTES_SEED_DATA) {
    const coordinates = JSON.stringify(ROUTE_COORDINATES_BY_SLUG[route.slug] ?? [[53.6693, 23.8131]]);
    await prisma.route.create({
      data: { ...route, coordinates },
    });
    console.log(`✅ Добавлен маршрут: ${route.title}`);
  }

  console.log('🎉 Seed завершен успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
