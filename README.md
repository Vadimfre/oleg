# BikeRoutes Backend API 🚴

Backend API для велосипедного приложения на NestJS с Prisma и **PostgreSQL**.

## 🚀 Стек

- **NestJS** — API
- **Prisma** — ORM
- **PostgreSQL** — база данных
- **JWT** — авторизация

## 📦 Установка

```bash
cd backend
npm install
```

### PostgreSQL

1. Установи PostgreSQL (локально или Docker).
2. Создай базу:

```sql
CREATE DATABASE bikeroutes;
```

3. Скопируй переменные окружения:

```bash
cp .env.example .env
```

4. В `.env` укажи `DATABASE_URL`, например:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bikeroutes?schema=public"
ADMIN_API_KEY="your-secret-admin-key"
```

5. Примени миграции и seed:

```bash
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
```

## 🏃 Запуск

```bash
npm run start:dev
```

API: `http://localhost:3001`

## 🔐 Админка

Фронт: `/admin`  
Заголовок: `x-admin-key: <ADMIN_API_KEY>`

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/admin/stats` | Статистика |
| GET/POST | `/admin/routes` | Список / создание |
| DELETE | `/admin/routes/:slug` | Удалить маршрут |
| GET | `/admin/comments` | Комментарии (`?routeId=`) |
| DELETE | `/admin/comments/:id` | Удалить комментарий |
| GET | `/admin/ratings` | Оценки |
| DELETE | `/admin/ratings/:id` | Удалить оценку |
| GET | `/admin/users` | Пользователи |
| DELETE | `/admin/users/:id` | Удалить пользователя |
| GET | `/admin/subscribers` | Email-подписчики |
| DELETE | `/admin/subscribers/:id` | Удалить подписчика |

## 🗄️ Prisma

```bash
npx prisma studio      # UI для БД
npx prisma migrate dev # новая миграция (dev)
```

## 🐳 Docker (опционально)

```bash
docker run --name bikeroutes-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bikeroutes -p 5432:5432 -d postgres:16
```

---

Made with ❤️ for BikeRoutes 🚴
