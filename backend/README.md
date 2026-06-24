# BikeRoutes Backend API 🚴

Backend API для велосипедного приложения на NestJS с Prisma и SQLite.

## 🚀 Стек технологий

- **NestJS** - фреймворк для Node.js
- **Prisma** - ORM для работы с базой данных
- **SQLite** - файловая база данных (для простоты разработки)
- **JWT** - аутентификация пользователей
- **TypeScript** - типизация
- **bcrypt** - хеширование паролей

## 📦 Установка

```bash
# Установить зависимости
npm install

# Создать базу данных и применить миграции
npx prisma migrate dev

# Сгенерировать Prisma Client
npx prisma generate
```

## ⚙️ Настройка .env

Файл `.env` уже создан с настройками:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="bike-routes-super-secret-jwt-key-2025"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## 🗄️ База данных

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание и применение миграций
npx prisma migrate dev --name your_migration_name

# Открыть Prisma Studio (UI для базы данных)
npx prisma studio
```

## 🏃 Запуск

```bash
# Development mode (с hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Backend будет доступен на `http://localhost:3001`

## 📡 API Endpoints

### Аутентификация

#### POST `/auth/register` - Регистрация пользователя
```json
{
  "email": "cyclist@example.com",
  "password": "password123",
  "name": "Cyclist Name"
}
```

Ответ:
```json
{
  "message": "Регистрация успешна",
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": 1,
    "email": "cyclist@example.com",
    "name": "Cyclist Name"
  }
}
```

#### POST `/auth/login` - Вход пользователя
```json
{
  "email": "cyclist@example.com",
  "password": "password123"
}
```

Ответ:
```json
{
  "message": "Вход выполнен успешно",
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": 1,
    "email": "cyclist@example.com",
    "name": "Cyclist Name"
  }
}
```

#### GET `/auth/profile` - Получить профиль (требует авторизации)
Headers:
```
Authorization: Bearer <token>
```

Ответ:
```json
{
  "id": 1,
  "email": "cyclist@example.com",
  "name": "Cyclist Name",
  "createdAt": "2026-01-15T23:04:08.929Z"
}
```

## 📊 Структура проекта

```
backend/
├── prisma/
│   ├── schema.prisma          # Prisma схема
│   └── migrations/            # Миграции базы данных
├── src/
│   ├── auth/                  # Модуль аутентификации
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── prisma/                # Prisma сервис
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts          # Корневой модуль
│   └── main.ts                # Точка входа
├── test-api.js                # Тестовый скрипт
├── package.json
└── tsconfig.json
```

## 🎭 Модели данных

### User (Пользователь)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔒 Аутентификация

API использует JWT токены.

Для защищенных endpoints необходимо:
- Header `Authorization: Bearer <token>`

Токен действителен 7 дней.

## 🧪 Тестирование

```bash
# Запустить тестовый скрипт
node test-api.js
```

Тестовый скрипт проверяет:
- ✅ Регистрацию пользователя
- ✅ Логин пользователя
- ✅ Получение профиля с JWT токеном

## 🚀 Production

```bash
# Собрать проект
npm run build

# Запустить в production режиме
npm run start:prod
```

## 🔗 Интеграция с фронтендом

Frontend работает на `http://localhost:3000` (Next.js)

CORS настроен для разрешения запросов с фронтенда.

API клиент на фронтенде: `src/shared/api/auth.api.ts`

---

Made with ❤️ for BikeRoutes 🚴
