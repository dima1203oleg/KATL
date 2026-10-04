# KATL / CATL ESS УКРАЇНА
MASTER TECHNICAL SPECIFICATION
Для Google Antigravity

Full-stack production transformation of dima1203oleg/KATL
Repository: dima1203oleg/KATL
Canonical branch: main
Canonical implementation: GitHub repository
ChatGPT Sites: тільки visual/design reference
Primary product: CATL stationary Energy Storage Systems / ESS / BESS
Primary market: Ukraine
Languages: українська / English / 简体中文

## 0. КРИТИЧНА ІНСТРУКЦІЯ ДЛЯ ANTIGRAVITY
Працюй безпосередньо в існуючому репозиторії dima1203oleg/KATL.
Не створюй новий проєкт.
Не роби новий repository.
Не створюй паралельну архітектуру.
Не замінюй PostgreSQL/PIM на JSON або mock data.
Не повертай стару Vite-архітектуру як production architecture.
Не копіюй дані з ChatGPT Sites у production catalog без source verification.

## 1. ГОЛОВНА МЕТА
Перетворити поточний KATL repository на:
Production-grade multilingual CATL ESS/BESS digital platform for Ukraine
Платформа повинна одночасно бути:
- корпоративним CATL ESS сайтом;
- технічним каталогом;
- PIM;
- engineering platform;
- BESS sizing platform;
- RFQ/lead platform;
- source/evidence-controlled knowledge system;
- multilingual platform;
- SEO platform;
- admin control plane;
- майбутньою customer/partner platform.

## 2. ПРОДУКТОВІ ОБМЕЖЕННЯ
Сайт охоплює тільки stationary energy storage.

**ДОЗВОЛЕНО**
Residential ESS; Commercial ESS; Industrial ESS; Utility-scale BESS; grid-scale energy storage; battery energy storage systems; battery cabinets; battery containers; battery modules; racks; PCS; EMS; BMS; transformers; switchgear; protection; HVAC; fire suppression; monitoring; controls; integration components; commissioning; maintenance; engineering; system design; energy management; storage applications.

**НЕ ВКЛЮЧАТИ**
Не створювати каталог:
електромобілів; EV batteries; тягових батарей; automotive components; автобусних батарей; truck batteries; marine batteries; загального automotive CATL; випадкової продукції CATL, яка не належить до stationary ESS.

## 3. АРХІТЕКТУРА
Зберегти monorepo.
Цільова структура:
```
KATL/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
├── packages/
│   ├── database/
│   ├── calculations/
│   ├── shared-types/
│   ├── localization/
│   ├── product-sync/
│   ├── ai-gateway/
│   └── domain/
├── src/
└── server/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   └── accessibility/
├── docs/
├── migrations/
└── .github/
    └── workflows/
```
Не допускається друга production database.
Не допускається друга PIM.
Не допускається parallel source of truth.

## 4. DATA FLOW
Канонічний pipeline:
OFFICIAL SOURCE ↓ SOURCE REGISTRY ↓ FETCH ↓ IMMUTABLE SNAPSHOT ↓ HASH ↓ NORMALIZATION ↓ FACT EXTRACTION ↓ EVIDENCE MATCH ↓ HUMAN REVIEW ↓ ENGINEER APPROVAL ↓ PUBLISH ↓ PIM ↓ API ↓ NEXT.JS ↓ PUBLIC SITE

Ніяких shortcut:
AI → directly publish (заборонено)
Mock → production (заборонено)
ChatGPT Sites → production product facts (заборонено)

## 5. FRONTEND
Основний frontend: Next.js App Router.
Не переносити production назад у Vite.

Основні маршрути
Створити/довести до production:
/[locale]
/[locale]/products
/[locale]/products/[slug]
/[locale]/compare
/[locale]/solutions
/[locale]/solutions/[slug]
/[locale]/industries
/[locale]/industries/[slug]
/[locale]/bess
/[locale]/bess-designer
/[locale]/engineering
/[locale]/engineering/bess-calculator
/[locale]/engineering/lcos
/[locale]/engineering/single-line-diagram
/[locale]/documents
/[locale]/search
/[locale]/rfq
/[locale]/about
/[locale]/contact

Private:
/[locale]/login
/[locale]/portal
/[locale]/portal/projects
/[locale]/portal/projects/[id]
/[locale]/partner
/[locale]/partner/deals
/[locale]/admin
/[locale]/admin/products
/[locale]/admin/products/[id]
/[locale]/admin/reviews
/[locale]/admin/sources
/[locale]/admin/sync
/[locale]/admin/rfq
/[locale]/admin/users
/[locale]/admin/localization
/[locale]/admin/seo
/[locale]/admin/documents
/[locale]/admin/audit
/[locale]/admin/settings

## 6. UI / DESIGN SYSTEM
Зберегти CATL visual direction, перенесений із Sites.
Ціль: premium industrial energy platform.
Не робити типовий шаблонний WordPress-style corporate site.

Візуальний принцип:
dark premium; high contrast; restrained; industrial; technical; clean; large typography; багато whitespace; чітка hierarchy; mobile-first; responsive; fast.

Використовувати:
CSS variables; design tokens; reusable components; semantic HTML.

Створити:
Button, Card, ProductCard, ProductBadge, SpecificationTable, EvidenceBadge, SourceCitation, CompareTable, FilterPanel, Modal, Drawer, Tabs, Accordion, DataTable, MetricCard, EngineeringCard, RFQForm, LanguageSwitcher, Breadcrumbs, Pagination, EmptyState, ErrorState, LoadingState.

## 7. MOBILE-FIRST
Обов’язково тестувати:
320px 375px 390px 430px 768px 1024px 1280px 1440px 1920px 2560px
Особлива увага: iPhone; Android; Safari; Chrome; touch; keyboard; reduced motion.
Ніяких горизонтальних overflow.

## 8. CATALOG
Каталог має працювати тільки через PIM/API.
Не використовувати: `const products = [...]` як production source.

Категорії:
1. Домашні системи накопичення енергії (CATL PR Series; battery modules; battery blocks; residential ESS components)
2. Комерційні та промислові ESS (C&I systems; cabinets; modular systems; PCS; EMS)
3. Великі BESS (containerized BESS; utility systems; grid-scale systems)
4. Компоненти (battery; PCS; BMS; EMS; HVAC; fire protection; switchgear; transformer; monitoring)

## 9. PRODUCT MODEL
Product entity повинна мати:
id, slug, manufacturer, family, category, productType, name, shortDescription, description, status, visibility, revision, sourceUrl, verifiedAt, verifiedBy, confidence

Specifications:
energy, power, voltage, capacity, dimensions, weight, temperature, IP rating, fire safety, communication, BMS, PCS, efficiency, cycle life, degradation, operating modes, installation, certifications, standards, compatibility

Не створювати specification field, якщо його немає в verified source.

## 10. PRODUCT STATUS
Ввести чіткі статуси: DRAFT, IN_REVIEW, ENGINEER_APPROVED, PUBLISHED, ARCHIVED, REJECTED
Public сайт показує тільки: PUBLISHED

## 11. EVIDENCE SYSTEM
Кожен критичний specification:
Product ↓ Fact ↓ Source Snapshot ↓ Source URL ↓ Excerpt ↓ Verification ↓ Reviewer

Evidence повинен містити:
sourceUrl, snapshotId, sha256, excerpt, retrievedAt, verifiedAt, verifiedBy, locator
Для PDF додати: page, section, table, figure

## 12. SOURCE REGISTRY
Створити administration interface: /admin/sources
Source: id, name, manufacturer, url, type, authority, priority, locale, lastChecked, lastSuccess, hash, status
Статуси: ACTIVE, FAILED, STALE, DISABLED, REVIEW_REQUIRED
Першочергово: catl.com
Ніяких third-party specifications як primary authority, якщо є офіційний CATL source.

## 13. AUTOMATIC SYNC
Worker: fetch ↓ snapshot ↓ hash ↓ compare ↓ detect changes ↓ create review
Ніколи: fetch → overwrite published product
Change повинен створювати: SYNC_CHANGE і чекати review.

## 14. PDF/DATASHEET PROCESSING
Додати: PDF download, PDF checksum, text extraction, page detection, table extraction, section detection, fact candidate extraction, evidence locator
Не дозволяти AI вигадувати PDF facts.
AI може запропонувати candidate fact. А publication - тільки після evidence validation + human approval.

## 15. PRODUCT COMPARISON
Compare: 2–4 products
Показувати: capacity; power; dimensions; weight; efficiency; temperature; IP; cycle life; safety; communication; installation; certifications.
Режим: differences first.
URL повинен бути shareable.

## 16. SEARCH
Повноцінний search: products, specifications, documents, solutions, industries, engineering, content.
Autocomplete, Filters, Typo tolerance, Localized search.
Search results повинні повертати тільки published content.

## 17. BESS DESIGNER
Старий BessDesigner не можна просто перенести як mock.
Побудувати production version.
Input: site, load, peak demand, duration, solar, grid, backup requirement, reserve, voltage, application, location
Engine: input validation, normalization, sizing constraints, product compatibility
Output: recommended power, required energy, reserve, system architecture, candidate CATL products, estimated configuration
Але product recommendation допускається тільки якщо compatibility rules підтверджені PIM.

## 18. BESS CALCULATOR
Зберегти deterministic calculation engine.
Версія: bess-energy-sizing-v2
Результат повинен містити: algorithmVersion, input, output, assumptions, limitations, calculatedAt
Кожен calculation snapshot повинен зберігатися.

## 19. LCOS
Зберегти: lcos-discounted-throughput-v1
Але розширити: currency; CAPEX source; OPEX source; energy throughput; degradation; replacement; augmentation; financing; tariff scenarios.
Всі економічні inputs повинні мати: source, date, currency, assumption.

## 20. SINGLE LINE DIAGRAM
Перенести legacy SLD у production.
SLD повинна генеруватися з конфігурації системи, а не бути просто картинкою.
Мінімум: Grid ↓ Transformer ↓ Switchgear ↓ PCS ↓ Battery ↓ EMS
Опційно: PV Generator, Load, Meter, Protection, HVAC, Fire System
Export: SVG, PNG, PDF

## 21. RFQ
RFQ production flow: Visitor ↓ configuration ↓ RFQ ↓ PostgreSQL ↓ outbox ↓ queue ↓ worker ↓ CRM/email
Fields: name, company, email, phone, country, project, application, power, energy, duration, timeline, message, calculationId, products
Spam protection. Rate limiting. Idempotency. Audit.

## 22. CUSTOMER PORTAL
Зробити справжній portal.
Projects, Calculations, RFQs, Documents, Proposals, Messages
Project: project ↓ calculations ↓ selected products ↓ documents ↓ RFQs ↓ proposals
Tenant isolation обов’язкова. Користувач ніколи не бачить чужі проекти.

## 23. PARTNER PORTAL
Створити: partner registration, partner verification, deal registration, protected opportunity, documents, RFQ status, commission/deal metadata
Не робити MLM. Не вигадувати партнерські статуси.

## 24. ADMIN CONTROL PLANE
Admin має мати Dashboard: RFQ; products; pending reviews; source health; sync; users; system health.
Product management: create; edit draft; review; approve; publish; archive; revision history.
Evidence: Перегляд: fact, source snapshot, excerpt, reviewer, timestamp
Sync: run; inspect; compare; approve; reject.
Audit: Immutable-style audit log.

## 25. RBAC
Ролі: SUPER_ADMIN, ADMIN, ENGINEER, REVIEWER, SALES, PARTNER, CUSTOMER
Визначити permission matrix.
Наприклад: ENGINEER → review technical facts → approve engineering content. ADMIN → publish. SALES → RFQ/CRM. CUSTOMER → own projects. PARTNER → own deals.
UI hiding ≠ authorization. Authorization має бути backend-side.

## 26. AUTH SECURITY
Покращити authentication: Argon2id; secure sessions; rotation; expiration; revocation; HTTP-only; Secure; SameSite; CSRF protection; brute-force protection; rate limits.
Додати: password reset; email verification; MFA architecture.

## 27. LOCALIZATION
Canonical locales: uk-UA, en, zh-CN
Не використовувати хаотично: uk, zh-cn як окремі production identifiers.
Створити: translation keys, terminology dictionary, translation memory, review state, approval state, fallback
Статуси: DRAFT, TRANSLATED, REVIEW, APPROVED, PUBLISHED

## 28. SEO
Для кожної public page: title, description, canonical, hreflang, OpenGraph, Twitter/X metadata, structured data
Schema.org: Organization, Product, WebSite, BreadcrumbList, Article, FAQPage (тільки там, де реально відповідає контенту).
Не генерувати fake SEO pages.

## 29. SEO GOVERNANCE
Ввести page registry: page, locale, intent, canonical, indexability, entity cluster, status
Noindex: /search, /compare, internal filters, admin, portal (за відповідними правилами).
Sitemap тільки для canonical published pages.

## 30. CONTENT MANAGEMENT
Створити CMS layer.
Content: pages, sections, blocks, translations, SEO metadata, authors, reviewers, revisions, publish dates
Workflow: DRAFT ↓ REVIEW ↓ APPROVED ↓ PUBLISHED

## 31. DOCUMENT MANAGEMENT
Documents: datasheets, manuals, certificates, brochures, technical documents, standards
Metadata: title, product, documentType, language, revision, date, source, checksum
Storage adapter: S3 / MinIO
Не зберігати великі файли безпосередньо в PostgreSQL.

## 32. RAG
Побудувати окремо від public catalog.
Pipeline: Document ↓ checksum ↓ extract ↓ chunk ↓ embedding ↓ vector store ↓ retrieval ↓ citation
AI answer повинен містити citations.
Якщо evidence немає: UNVERIFIED. AI не має права створювати technical fact.

## 33. AI ADVISOR
AI Advisor повинен працювати тільки через gateway.
UI ↓ API ↓ AI Gateway ↓ retrieval ↓ PIM ↓ verified sources ↓ LLM
AI повинен розрізняти: VERIFIED, UNVERIFIED, NOT_AVAILABLE.
Не відповідати: “CATL model X має…” якщо такого verified fact немає.

## 34. AI COST CONTROL
Додати: provider, model, tokens, estimatedCost, requestId, userId, timestamp
Budget: per user, per day, per month, per provider

## 35. DATABASE
PostgreSQL залишається canonical DB.
Потрібні таблиці для: products, product_revisions, specifications, facts, fact_evidence, sources, snapshots, documents, translations, users, sessions, roles, permissions, projects, calculations, rfqs, rfq_events, partners, deals, audit_logs, seo_pages, content_pages, ai_requests, jobs.

## 36. MIGRATIONS
Правило: тільки forward migrations. Не редагувати вже застосовану migration.
Кожна зміна: 00XX_description.sql і повинна мати: up migration; indexes; constraints; rollback strategy documented.

## 37. DATA INTEGRITY
Додати constraints: unique slug; unique source snapshot hash; valid product states; foreign keys; timestamps; reviewer requirements; publication requirements.
Product cannot become PUBLISHED, якщо: no evidence OR no engineer approval OR no required localization.

## 38. WORKER
BullMQ. Queues: source-sync, document-processing, pdf-processing, translation, embedding, email, crm, search-index
Jobs: retry, backoff, idempotency, dead-letter, observability
Не дозволяти silent failures.

## 39. OBSERVABILITY
Додати: structured logs, request ID, job ID, user ID, trace ID
Metrics: API latency, error rate, queue depth, failed jobs, sync failures, source freshness, RFQ conversion, AI usage.

## 40. ERROR HANDLING
Єдиний API error contract: { "error": { "code": "PRODUCT_NOT_FOUND", "message": "...", "requestId": "..." } }
Не віддавати stack traces production users.

## 41. SECURITY
Обов’язково: Helmet; strict CORS; CSP; HSTS; secure cookies; CSRF; SSRF protection; input validation; SQL parameterization; rate limits; upload limits; MIME validation; malware scanning architecture; secrets outside repository.

## 42. FILE UPLOAD
Для documents/RFQ: extension validation, MIME validation, size limits, checksum, virus scan, quarantine, object storage. Не довіряти extension.

## 43. SEARCH INDEX
Search engine повинен індексувати тільки: PUBLISHED
Не індексувати: DRAFT, REJECTED, IN_REVIEW

## 44. ANALYTICS
Додати privacy-aware events: page_view, product_view, compare, calculator_start, calculator_complete, rfq_start, rfq_submit, document_download
Не збирати зайві персональні дані.

## 45. PERFORMANCE
Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms
Оптимізувати: images; fonts; JS; lazy loading; caching; server rendering; API calls.

## 46. ACCESSIBILITY
Мінімум WCAG 2.2 AA.
Перевірити: keyboard; focus; labels; contrast; screen reader; semantic headings; ARIA; forms; dialogs.

## 47. TESTING
Unit: calculations; PIM; evidence; localization; auth; permissions.
Integration: PostgreSQL; API; PIM; RFQ; worker; sync.
E2E Критичний flow: home → catalog → product → compare → calculator → RFQ. Admin: login → draft → evidence → review → approve → publish. Customer: login → project → calculation → RFQ.

## 48. BROWSER MATRIX
CI: Chromium, Firefox, WebKit
Manual: Safari iPhone, Chrome Android, Safari macOS, Chrome macOS

## 49. LEGACY MIGRATION
Legacy Vite не видаляти одразу.
Створити migration matrix: LEGACY ↓ NEXT equivalent ↓ API connected ↓ tests ↓ production ↓ DELETE LEGACY
Особливо перенести корисні UX: BESS Designer; comparison; SLD; BOM; proposal; customer portal; partner portal; AI advisor.
Але не переносити hardcoded business facts.

## 50. DESIGN REFERENCE RULE
ChatGPT Sites використовується тільки для: layout, typography, spacing, colors, visual language, interaction, responsive behavior
Не використовувати Sites як: PIM database, source of technical truth, product evidence, catalog source.

## 51. PRODUCTION DEPLOYMENT
Підготувати: web, api, worker, postgres, redis, object-storage
Production secrets: DATABASE_URL, REDIS_URL, SESSION_SECRET, API_URL, S3 credentials, AI keys, SMTP, CRM
Ніколи не commit secrets.

## 52. BACKUP
PostgreSQL: daily full, continuous/WAL strategy, retention, restore test
Object storage: versioning, backup, checksum, retention
Раз на період обов’язково виконувати restore drill.

## 53. CI/CD
Pipeline: install ↓ lint ↓ typecheck ↓ unit ↓ integration ↓ security audit ↓ build ↓ E2E ↓ Docker ↓ deploy
Production deploy лише після green CI.

## 54. RELEASE GATES
Production release заборонений, якщо: ❌ failing tests ❌ missing migrations ❌ unverified products ❌ broken localization ❌ security critical issue ❌ failed build ❌ failed E2E ❌ no backup ❌ no rollback plan

## 55. ADMIN PUBLICATION GATE
Product publication: PIM DRAFT ↓ ALL REQUIRED FACTS HAVE EVIDENCE ↓ ENGINEER REVIEW ↓ TRANSLATION REVIEW ↓ ADMIN APPROVAL ↓ PUBLISH

## 56. CATL BRANDING
На сайті: CATL — manufacturer, KATL — platform / website implementation
Не заявляти: official CATL representative; authorized distributor; official partner; якщо юридично це не підтверджено.

## 57. CONTENT QUALITY
Заборонити: fake specifications; fake projects; fake customers; fake certificates; fake testimonials; invented performance; invented prices; invented availability.
Якщо даних немає: Not published або Information unavailable.

## 58. NO MOCK PRODUCTION
Перед production провести repository scan: MOCK, TODO, FIXME, DEMO, example, placeholder, Lorem, hardcoded, Math.random, fake
Кожен результат класифікувати: SAFE, DEV ONLY, LEGACY, REMOVE, PRODUCTION BLOCKER

## 59. NO RANDOM BUSINESS DATA
Заборонити: Math.random(), fake price, fake availability, fake product specs, fake reviews, fake lead numbers.

## 60. API CONTRACT
Стандартизувати: /api/v1/products, /api/v1/products/:slug, /api/v1/products/:id/revisions, /api/v1/products/:id/evidence, /api/v1/sources, /api/v1/sync, /api/v1/calculations, /api/v1/rfq, /api/v1/projects, /api/v1/documents, /api/v1/search, /api/v1/localization, /api/v1/admin
OpenAPI documentation обов’язкова.

## 61. DOMAIN SEPARATION
Не тримати все в одному server.ts.
Розділити: auth, products, pim, evidence, sources, sync, rfq, projects, documents, calculations, localization, seo, ai, admin
Router → service → repository.

## 62. TYPE SAFETY
TypeScript strict. Заборонити: any (крім обґрунтованих boundary cases).
Shared types: packages/shared-types мають бути canonical API/domain contracts.

## 63. DOCUMENTATION
Оновити: README, ARCHITECTURE, DEPLOYMENT, DATABASE, API, PIM, EVIDENCE, LOCALIZATION, AI, SECURITY, TESTING, OPERATIONS
Окремо: docs/ANTIGRAVITY_IMPLEMENTATION.md

## 64. ANTIGRAVITY EXECUTION PROTOCOL
Не намагатися зробити все одним небезпечним rewrite.
Працювати фазами.
PHASE 1: Repository audit. inspect → classify → dependency graph → identify blockers (Без destructive changes)
PHASE 2: Architecture cleanup. Next API DB Worker packages
PHASE 3: PIM + evidence.
PHASE 4: Catalog.
PHASE 5: Localization.
PHASE 6: BESS engineering.
PHASE 7: RFQ / CRM.
PHASE 8: Portals.
PHASE 9: AI/RAG.
PHASE 10: SEO/CMS.
PHASE 11: Security.
PHASE 12: Testing.
PHASE 13: Production deployment.

## 65. ПРАВИЛО ПІСЛЯ КОЖНОЇ ФАЗИ
Antigravity повинен: змінити код; запустити tests; запустити lint; запустити typecheck; запустити build; перевірити affected routes; записати результат; не переходити далі при critical regression.

## 66. FINAL ACCEPTANCE
Проєкт вважається завершеним тільки якщо: Frontend, Backend, Data, Engineering, AI, Operations, Security виконані за стандартами.

## 67. КРИТИЧНИЙ ФІНАЛЬНИЙ ПРИНЦИП
Antigravity повинен розглядати цей repository як одну цілісну систему, а не як набір сторінок. Побудувати єдину evidence-driven CATL ESS платформу, де сайт, каталог, engineering, RFQ, AI, документи й адмінка працюють від одних і тих самих перевірених даних.

### Першочерговий порядок робіт:
1. Audit існуючого KATL
2. прибрати архітектурні дублікати
3. довести PIM/evidence
4. реальний CATL catalog
5. localization
6. frontend polish
7. BESS Designer
8. engineering
9. RFQ/CRM
10. portals
11. documents/RAG
12. AI
13. SEO/CMS
14. security
15. E2E
16. production.
