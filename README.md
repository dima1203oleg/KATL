# KATL / CATL BESS Ukraine Platform — Production Foundation

Авторизована інженерна веб-платформа промислових систем накопичення енергії (BESS / ESS) CATL в Україні.

## Архітектурна концепція

Проєкт реалізовано відповідно до **Технічного завдання: Production Foundation**:
- **Existing UI збережено**: Повний набір інтерфейсів (Головна, Каталог, Картка продукту, Порівняння, Рішення, Галузі, Інженерія BESS Designer, LCOS симулятор, Однолінійна схема SLD, RFQ, AI Energy Advisor, Особистий кабінет, Партнерський портал, Панель адміністратора).
- **Реальний URL Routing**: Всі сторінки мають постійні URL-адреси (`/`, `/products`, `/products/catl-tener-h`, `/compare?products=...`, `/solutions`, `/industries`, `/admin` тощо) з підтримкою `pushState` / `popstate` та прямого переходу/перезавантаження.
- **Backend API (`apps/api` / `server.ts`)**: Окремий REST API шар на Express/Node.js підтримує ендпоінти версії `/api/v1/*` для продуктів, розрахунків, лідів, синхронізації та AI.
- **PIM (Product Information Management)**: Керована база даних технічних специфікацій із перевіркою достовірності (provenance, verification status, source date).
- **CATL Product Sync Engine**: Модуль відстеження змін офіційних джерел CATL (Source Registry, Snapshot Store, Diff Engine, Engineer Approval Workflow).
- **AI Provider Gateway**: Серверна абстракція оркестрації моделей штучного інтелекту без прямих викликів SDK з фронтенду, з підтримкою failover, обліку витрат токенів та бюджетів.
- **Localization Platform**: Незалежний шар інтернаціоналізації (UK, EN, ZH-CN) з глосарієм термінології BESS та пам'яттю перекладів (Translation Memory).

## Швидкий запуск

```bash
# Встановлення залежностей
npm install

# Запуск повностекового середовища (Express API + Vite Frontend на порту 3000)
npm run dev

# Перевірка типів та синтаксису
npm run lint

# Продакшн-збірка
npm run build
```

## Документація

Детальні інженерні документи знаходяться у директорії `docs/`:
- `docs/architecture/overview.md` — Загальний огляд системних рівнів
- `docs/architecture/database.md` — Схема бази даних та PIM-сутності
- `docs/architecture/ai-gateway.md` — Архітектура AI Provider Gateway
- `docs/architecture/product-sync.md` — Двигун синхронізації CATL Product Sync
- `docs/architecture/localization.md` — Мультимовна платформа та глосарій
- `docs/adr/` — Журнал архітектурних рішень (Architecture Decision Records)
