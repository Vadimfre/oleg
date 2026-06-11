# Next.js + FSD Проект

Это проект на [Next.js](https://nextjs.org/) с архитектурой [Feature-Sliced Design](https://feature-sliced.design/).

## 🚀 Начало работы

Установи зависимости:

```bash
npm install
```

Запусти сервер разработки:

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта (FSD)

```
src/
├── app/                    # Слой приложения
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Точка входа
│   └── providers/         # Провайдеры (context, query, etc)
│
├── pages/                  # Композиция страниц
│   └── home/
│       ├── ui/            # UI компоненты страницы
│       └── index.ts       # Public API
│
├── widgets/                # Сложные самостоятельные блоки
│   └── header/
│       ├── ui/            # UI компоненты
│       ├── model/         # Бизнес-логика
│       ├── api/           # API запросы
│       └── index.ts       # Public API
│
├── features/               # Части функциональности
│   └── auth/
│       ├── ui/            # UI компоненты
│       ├── model/         # Стейт менеджмент
│       ├── api/           # API запросы
│       └── index.ts       # Public API
│
├── entities/               # Бизнес-сущности
│   └── user/
│       ├── ui/            # UI компоненты сущности
│       ├── model/         # Типы и схемы
│       ├── api/           # API запросы
│       └── index.ts       # Public API
│
└── shared/                 # Переиспользуемые модули
    ├── ui/                # UI Kit (Button, Input, etc)
    ├── lib/               # Утилиты
    ├── api/               # API клиент
    ├── config/            # Конфигурация
    ├── types/             # Общие типы
    └── styles/            # Глобальные стили
```

## 🎯 Принципы FSD

### Слои (Layers)
Располагаются по возрастанию уровня ответственности:

1. **shared** — переиспользуемый код без привязки к бизнес-логике
2. **entities** — бизнес-сущности (User, Product, Order)
3. **features** — действия пользователя (AddToCart, Login, CreatePost)
4. **widgets** — композиции фич в большие блоки (Header, Sidebar)
5. **pages** — композиция виджетов и фич в страницы
6. **app** — настройки и провайдеры приложения

### Правило импортов
Слой может импортировать только из слоев ниже:

```typescript
// ✅ Можно
import { Button } from '@/shared/ui/Button'
import { User } from '@/entities/user'

// ❌ Нельзя
import { Header } from '@/widgets/header' // из pages
import { LoginForm } from '@/features/auth' // из entities
```

### Сегменты (Segments)
Каждый модуль состоит из сегментов:

- **ui/** — UI компоненты
- **model/** — бизнес-логика, типы, стейт
- **api/** — запросы к API
- **lib/** — вспомогательные функции
- **config/** — конфигурация модуля
- **index.ts** — public API модуля

### Public API
Каждый модуль экспортирует только то, что нужно:

```typescript
// features/auth/index.ts
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/useAuth'
export type { AuthUser } from './model/types'
```

## 🛠 Технологии

- **Next.js 15** — React фреймворк
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **FSD** — архитектура

## 📚 Полезные ссылки

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔥 Примеры использования

### Создание новой фичи

```bash
src/features/add-to-cart/
├── ui/
│   └── AddToCartButton.tsx
├── model/
│   ├── useAddToCart.ts
│   └── types.ts
├── api/
│   └── addToCart.ts
└── index.ts
```

### Создание новой сущности

```bash
src/entities/product/
├── ui/
│   ├── ProductCard.tsx
│   └── ProductList.tsx
├── model/
│   └── types.ts
├── api/
│   └── getProducts.ts
└── index.ts
```

## 📝 Команды

```bash
npm run dev      # Запуск dev сервера
npm run build    # Сборка для продакшена
npm run start    # Запуск production сборки
npm run lint     # Проверка кода
```
