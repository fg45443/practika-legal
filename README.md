# LegalCRM — Система для юридической фирмы

Веб-приложение для управления клиентами, делами, документами и судебными заседаниями.

## Стек

- **Next.js 15** (App Router) + TypeScript
- **Prisma** + SQLite
- **NextAuth.js** (авторизация)
- **Tailwind CSS**
- **lucide-react** (иконки)

## Возможности

- Авторизация (логин / пароль)
- Дашборд со статистикой
- CRUD клиентов
- CRUD дел (с привязкой к клиенту и юристу)
- Документы по делам
- Судебные заседания
- Поиск клиентов
- Адаптивный интерфейс

## Быстрый старт (локально)

```bash
# 1. Установить зависимости
npm install

# 2. Создать базу и применить схему
npx prisma db push

# 3. Заполнить демо-данными
npx tsx prisma/seed.ts

# 4. Запустить
npm run dev
```

Открой http://localhost:3000

**Демо-логины:**
- `admin@legal.ru` / `admin123`
- `lawyer@legal.ru` / `admin123`

## Деплой на Vercel

1. Создай репозиторий на GitHub и загрузи код:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LegalCRM"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ_ЮЗЕРНЕЙМ/legal-firm.git
   git push -u origin main
   ```

2. Зайди на [vercel.com](https://vercel.com) → New Project → Import репозиторий.

3. В Environment Variables добавь:
   - `DATABASE_URL` = `file:./dev.db` (или лучше используй Turso / Neon / Vercel Postgres)
   - `NEXTAUTH_SECRET` = любая длинная случайная строка
   - `NEXTAUTH_URL` = `https://твой-проект.vercel.app`

4. Deploy.

> **Важно:** SQLite на Vercel работает ограниченно (read-only после деплоя).  
> Для полноценной работы на проде рекомендуется:
> - [Turso](https://turso.tech) (SQLite в облаке) — бесплатно
> - или [Neon](https://neon.tech) / Vercel Postgres

Для учебного проекта демо-данные после первого `prisma db push` + seed на локальной машине достаточно, а на Vercel можно показать интерфейс.

## Структура

```
src/
  app/
    (app)/          # защищённые страницы
      dashboard/
      clients/
      cases/
      documents/
      hearings/
    api/            # API routes
    login/
  components/
  lib/
prisma/
  schema.prisma
  seed.ts
```

## Автор

Учебный проект (группа 25ИС2)
