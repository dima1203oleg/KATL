# Inventory of Implemented vs. Mock / Demo Modules

Audit performed according to Technical Specification (TZ) and Baseline Code Review.

## 1. Status Legend
- **IMPLEMENTED (PRODUCTION-READY / PERSISTENT)**: Fully backed by database / persistent storage, server validation, real logic.
- **MOCK / PROTOTYPE / PARTIAL**: Code exists in memory or JSON file, but lacks external database (PostgreSQL/Redis), real third-party integrations (CRM, ERP, official CATL web scrapers), or distributed workers.
- **NOT IMPLEMENTED**: Feature specified in TZ but not yet created.

---

## 2. Component-by-Component Baseline Audit

| Module / Subsystem | Current State | Technical Details & Limitations | Target TZ Architecture |
|---|---|---|---|
| **PIM (Product Information Management)** | **PARTIAL (In-memory + JSON file)** | Stored in `.katl_db.json` and memory map (`src/server/db/database.ts`). Supports CRUD, provenance fields (`sourceUrl`, `verifiedAt`, `verifiedBy`). | **PostgreSQL Relational DB** (`pim_products`, `pim_specifications`) with strict schema, revision history, and audit triggers. |
| **BESS Engineering Sizing Engine** | **IMPLEMENTED (Deterministic Service)** | `src/server/calculations/calculationService.ts` implements formula `v1.4.2-ua-2026` for solar/load sizing, LCOS, IRR, Capex, and BOM generation. | Retain calculation algorithms, expose via microservice/package, add telemetry and sensitivity analysis. |
| **RFQ (Request for Quotation) Lead Intake** | **PARTIAL (JSON DB + Express API)** | Validates required fields, persists to `.katl_db.json`, tracks status changes and audit log. | **PostgreSQL + Redis Queue** with webhook dispatchers to real CRM (HubSpot / Bitrix24 / Salesforce) and email notifications. |
| **CATL Product Sync Engine** | **MOCK / SIMULATED** | `src/server/sync/syncEngine.ts` registers official CATL URLs, but runs simulated diffs on scheduled check. Requires manual approval (`approve`/`reject`). | **apps/worker + BullMQ + Headless Browser / Cheerio Crawler** with snapshot storage in S3/PostgreSQL and diff engine before approval. |
| **AI Provider Gateway** | **PARTIAL (Real Gemini SDK + Mock Failover)** | Direct backend integration with `@google/genai` (Gemini 2.5 Flash), tracks token usage, calculates cost in USD. Secondary models (OpenAI/Anthropic) are fallback stubs. | **Gateway Service** with multi-provider adapter pattern (Gemini, Claude, OpenAI, DeepSeek), token limiter, and audit logger. |
| **Localization Platform (i18n)** | **PARTIAL (Client Dictionary + Routing)** | Client-side locale state ('uk', 'en', 'zh-cn'), dictionary terms for BESS engineering. | **Centralized Translation Memory (TM)**, glossary database in PostgreSQL, locale-aware URLs (`/uk/...`, `/en/...`). |
| **Authentication & RBAC** | **NOT IMPLEMENTED (Frontend Role Switcher)** | User/Engineer switcher in UI without JWT / session / OAuth / 2FA. | **JWT / Auth0 / NextAuth / Firebase Auth** with secure HTTP-only cookies and role permissions (`Admin`, `Engineer`, `Client`). |
| **Single Line Diagram (SLD) Generator** | **IMPLEMENTED (Client SVG/Interactive)** | Generates interactive topological schemes based on sizing parameters (BESS, Inverter/PCS, Transformer, Grid connection). | Reusable component in `packages/ui` / `apps/web`. |
| **Financial / LCOS Simulator** | **IMPLEMENTED (Client & Server)** | Real formulas for LCOS ($/kWh), payback, degradation curves. | Shared engineering package `packages/calculations`. |

---

## 3. Strict Prohibitions Enforced
1. **No direct AI provider calls from frontend**: All AI interactions must pass through `/api/v1/ai/gateway/chat`.
2. **No automated publishing of parsed data**: Data extracted from external sources must remain in `PENDING_REVIEW` until approved by an engineer.
3. **No hardcoded product specs as source-of-truth**: All specs must originate from the PIM database.
4. **Localization Platform and AI Gateway remain independent**: Neither module directly depends on the other.
