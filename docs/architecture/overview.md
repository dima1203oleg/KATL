# System Architecture Overview — KATL Platform

## 1. System Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Frontend Layer                      │
│   Next.js / Vite SPA Shell · HTML5 History Routing · UI Engine  │
│   (Home, Catalog, Product PIM, Compare, Solutions, Portals)     │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP / REST API (v1)
┌───────────────────────────────▼─────────────────────────────────┐
│                   Backend Application Layer                     │
│                 (Express / Node.js Runtime)                     │
│                                                                 │
│  ├── /api/v1/products     (PIM Service & Provenance)            │
│  ├── /api/v1/rfq          (Lead Intake & CRM Dispatcher)        │
│  ├── /api/v1/calculations (BESS Sizing, LCOS, BOM Generator)    │
│  ├── /api/v1/sync         (CATL Product Sync & Approval Engine) │
│  ├── /api/v1/ai/gateway   (AI Orchestration, Task Routing)      │
│  ├── /api/v1/localization (Translation Memory & Glossary)       │
│  └── /api/v1/health       (Readiness, Liveness, Latency)        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Persistence & Cache
┌───────────────────────────────▼─────────────────────────────────┐
│                    Data Storage Layer                           │
│  PostgreSQL / Persistent Store · Snapshot DB · Audit Log Store  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Invariants & Principles
1. **Product Data Integrity**: Жодних захардкоджених технічних характеристик у visual components. Всі параметри приходять через API із PIM.
2. **AI Provider Independence**: Frontend не знає про конкретних вендорів (Gemini, OpenAI, Claude, Qwen) і не містить секретних ключів.
3. **Engineering Approval Requirement**: Жодні парсери не змінюють параметри обладнання автоматично без підтвердження інженером (`REVIEW_REQUIRED` -> `APPROVED`).
4. **Reproducible Engineering**: Розрахунки потужності, ємності, LCOS та однолінійні схеми мають номер версії алгоритму та вхідних тарифів.
5. **Real URLs**: Всі сторінки та порівняння систем мають прямі адреси з підтримкою закладки та надсилання колегам (`/compare?products=catl-tener-h,catl-tener-s`).
