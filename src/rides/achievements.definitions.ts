export interface AchievementCheckContext {
  ridesCount: number;
  totalDistanceKm: number;
  maxEverSpeedKmh: number;
  longestRideKm: number;
  currentMonthKm: number;
  monthlyGoalKm: number;
  streakDays: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (ctx: AchievementCheckContext) => boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_ride',
    title: 'Первый старт',
    description: 'Завершите первую поездку',
    icon: '🚴',
    check: (c) => c.ridesCount >= 1,
  },
  {
    id: 'explorer',
    title: 'Исследователь',
    description: '5 завершённых поездок',
    icon: '🗺️',
    check: (c) => c.ridesCount >= 5,
  },
  {
    id: 'marathon',
    title: 'Марафонец',
    description: '10 поездок в истории',
    icon: '🏅',
    check: (c) => c.ridesCount >= 10,
  },
  {
    id: 'ten_km',
    title: 'Десятка',
    description: '10 км суммарно',
    icon: '🎯',
    check: (c) => c.totalDistanceKm >= 10,
  },
  {
    id: 'century',
    title: 'Сотня',
    description: '100 км суммарно за всё время',
    icon: '💯',
    check: (c) => c.totalDistanceKm >= 100,
  },
  {
    id: 'half_century',
    title: 'Полтинник',
    description: '50 км суммарно',
    icon: '⭐',
    check: (c) => c.totalDistanceKm >= 50,
  },
  {
    id: 'long_ride',
    title: 'Дальняк',
    description: 'Одна поездка длиннее 20 км',
    icon: '🛤️',
    check: (c) => c.longestRideKm >= 20,
  },
  {
    id: 'sprinter',
    title: 'Спринтер',
    description: 'Макс. скорость выше 25 км/ч',
    icon: '⚡',
    check: (c) => c.maxEverSpeedKmh >= 25,
  },
  {
    id: 'month_goal',
    title: 'Цель месяца',
    description: 'Выполните месячную норму км',
    icon: '🎖️',
    check: (c) => c.currentMonthKm >= c.monthlyGoalKm && c.monthlyGoalKm > 0,
  },
  {
    id: 'streak_3',
    title: 'Серия 3 дня',
    description: 'Поездки 3 дня подряд',
    icon: '🔥',
    check: (c) => c.streakDays >= 3,
  },
  {
    id: 'streak_7',
    title: 'Неделя огня',
    description: '7 дней подряд с поездками',
    icon: '💥',
    check: (c) => c.streakDays >= 7,
  },
  {
    id: 'weather_ride',
    title: 'В любую погоду',
    description: '10 поездок — вы настоящий байкер',
    icon: '🌦️',
    check: (c) => c.ridesCount >= 10,
  },
];
