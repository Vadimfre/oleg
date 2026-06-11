# BikeRoutes Architecture 🚴

## Структура проекта

```
oleg/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   └── schema.prisma      # Prisma схема (SQLite)
│   ├── src/
│   │   ├── auth/              # Модуль аутентификации
│   │   ├── prisma/            # Prisma сервис
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── dev.db                 # SQLite база данных
│   ├── test-api.js            # Тестовый скрипт
│   └── package.json
│
├── src/                        # Next.js Frontend
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # + AuthProvider
│   │   ├── page.tsx           # Главная
│   │   ├── routes/
│   │   │   ├── page.tsx       # Список маршрутов
│   │   │   └── [slug]/        # Детали маршрута
│   │   ├── navigate/          # Навигация
│   │   └── create/            # Создание маршрута
│   │
│   ├── features/              # Фичи приложения
│   │   └── auth/              # ⭐ Авторизация (новое!)
│   │       ├── model/
│   │       │   ├── types.ts           # TypeScript типы
│   │       │   ├── auth.api.ts        # API запросы
│   │       │   ├── AuthContext.tsx    # React Context
│   │       │   └── index.ts
│   │       ├── ui/
│   │       │   ├── LoginModal.tsx     # Модалка входа
│   │       │   ├── RegisterModal.tsx  # Модалка регистрации
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── widgets/               # Виджеты
│   │   ├── Header/            # Хедер с профилем
│   │   ├── MapView/
│   │   ├── StaticRouteMap/
│   │   └── RouteList/
│   │
│   ├── entities/              # Сущности
│   │   └── route/
│   │
│   ├── shared/                # Общие модули
│   │   ├── ui/               # UI компоненты
│   │   ├── styles/
│   │   └── utils/
│   │
│   └── views/                 # Страницы
│       ├── home/
│       ├── routes/
│       ├── navigate/
│       └── route-detail/
│
└── public/
    └── gpx/                   # GPX файлы маршрутов
```

## Auth Feature Architecture 🔐

### Структура features/auth

```
features/auth/
├── model/                     # Бизнес-логика
│   ├── types.ts              # User, AuthResponse, RegisterData, LoginData
│   ├── auth.api.ts           # API методы (register, login, logout, getProfile)
│   ├── AuthContext.tsx       # React Context для управления состоянием auth
│   └── index.ts
│
├── ui/                        # UI компоненты
│   ├── LoginModal.tsx        # Модальное окно входа
│   ├── RegisterModal.tsx     # Модальное окно регистрации
│   └── index.ts
│
└── index.ts                   # Главный экспорт
```

### Как работает Auth

#### 1. **AuthContext** (src/features/auth/model/AuthContext.tsx)
- Хранит пользователя в глобальном состоянии
- Проверяет авторизацию при загрузке приложения
- Предоставляет методы: `logout`, `refreshUser`

```tsx
const { user, isAuthenticated, logout, refreshUser } = useAuth()
```

#### 2. **API** (src/features/auth/model/auth.api.ts)
- Работает с cookies (httpOnly)
- Все запросы с `credentials: 'include'`

```typescript
// Регистрация
await register({ email, password, name })

// Логин
await login({ email, password })

// Выход
await logout()

// Профиль
const user = await getProfile()
```

#### 3. **Backend Cookies**
Токен сохраняется в httpOnly cookie:
```typescript
res.cookie('token', jwt_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
});
```

#### 4. **Header Integration**
Header показывает:
- Если НЕ авторизован: кнопки "Войти" и "Регистрация"
- Если авторизован: имя пользователя + аватар + меню с выходом

## Backend API

### Endpoints

#### POST `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

Ответ:
```json
{
  "message": "Регистрация успешна",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```
+ Cookie: `token` (httpOnly)

#### POST `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Ответ: аналогично register + cookie

#### POST `/auth/logout`
Удаляет cookie `token`

#### GET `/auth/profile` (требует авторизации)
Возвращает профиль пользователя из cookie

## Технологии

### Backend
- **NestJS** - фреймворк
- **Prisma** - ORM
- **SQLite** - база данных (dev.db)
- **JWT** - токены в httpOnly cookies
- **bcrypt** - хеширование паролей

### Frontend
- **Next.js 14** - App Router
- **React Context** - управление состоянием auth
- **TypeScript** - типизация
- **Tailwind CSS** - стили
- **Leaflet** - карты

## Безопасность

1. ✅ **httpOnly cookies** - защита от XSS
2. ✅ **Хеширование паролей** - bcrypt
3. ✅ **JWT токены** - 7 дней
4. ✅ **CORS** настроен для фронтенда
5. ✅ **Валидация** всех данных (class-validator)

## Запуск

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Backend: http://localhost:3001

### Frontend
```bash
npm install
npm run dev
```

Frontend: http://localhost:3000

---

Made with ❤️ for BikeRoutes 🚴
