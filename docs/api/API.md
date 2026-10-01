# KATL Platform REST API Reference (v1)

**Base URL:** `/api/v1`  
**Security Headers:** `X-Request-Id`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`  

---

## 1. System & Health Endpoints

* `GET /health/live`: Process liveness probe.
* `GET /health/ready`: Dependency readiness probe (PostgreSQL, PIM count).
* `GET /health`: Comprehensive observability & system metrics.

---

## 2. Authentication & Users

* `POST /api/v1/auth/login`: Authenticate user and issue session token.
* `GET /api/v1/auth/me`: Retrieve authenticated user context and permissions.
* `GET /api/v1/users`: List users (requires admin/manager role).
* `POST /api/v1/users/:id/role`: Update user role and log to audit trail.

---

## 3. PIM & Products Catalog

* `GET /api/v1/products`: Filter products by category, type, and status.
* `GET /api/v1/products/:id`: Get complete technical specification and provenance.

---

## 4. Engineering Sizing & LCOS

* `POST /api/v1/calculations/bess`: Calculate BESS capacity, container count, CAPEX, LCOS, and BOM.

---

## 5. RFQ Commercial Pipeline

* `GET /api/v1/rfq`: List commercial RFQ leads.
* `POST /api/v1/rfq`: Submit a new commercial RFQ.
* `PATCH /api/v1/rfq/:id/status`: Transition RFQ status across the 8 lifecycle stages.

---

## 6. CATL Product Sync

* `GET /api/v1/sync/sources`: List registered official CATL sources.
* `GET /api/v1/sync/changes`: List detected specification diffs.
* `GET /api/v1/sync/snapshots`: View SHA-256 source snapshots.
* `POST /api/v1/sync/run`: Trigger immediate crawler run.
* `POST /api/v1/sync/changes/:id/approve`: Approve diff and update PIM revision.
* `POST /api/v1/sync/changes/:id/reject`: Reject diff.

---

## 7. AI Provider Gateway

* `POST /api/v1/ai/gateway/chat`: Interactive Energy Advisor grounded in PIM.
* `GET /api/v1/ai/gateway/stats`: Token usage and FinOps USD accounting.
* `GET /api/v1/ai/gateway/providers`: List 14 AI providers and health statuses.
* `POST /api/v1/ai/gateway/reload`: Dynamically reload and re-verify API keys.

---

## 8. Localization & Search

* `GET /api/v1/localization/locales`: Supported locales (UK, EN, ZH-CN).
* `GET /api/v1/localization/glossary`: BESS technical glossary terms.
* `GET /api/v1/search?q={query}&locale={locale}`: Multi-lingual search.
* `GET /api/v1/documents`: Official datasheets, whitepapers, and certifications.
