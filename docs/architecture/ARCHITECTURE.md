# KATL Platform Architecture & Technical Reference

**System:** KATL / CATL BESS Ukraine Platform  
**Target Environment:** Node.js 20 LTS, PostgreSQL 16, Redis 7, Express 4.x, React 19, TypeScript  
**Version:** 1.0.0-prod  

---

## 1. Monorepo Architecture Overview

The codebase is organized into modular workspaces under standard NPM Workspaces:

```
KATL/
├── apps/
│   ├── web/        (Next.js / React Frontend Application)
│   ├── api/        (Canonical Modular Express REST API @katl/api)
│   └── worker/     (Background Task Queue Worker @katl/worker)
├── packages/
│   ├── shared-types/  (Domain interfaces, RBAC types, API schemas)
│   ├── database/      (PostgreSQL DDL migrations, repositories, audit)
│   ├── redis/         (Redis connection pool & cache broker)
│   ├── queue/         (BullMQ persistent background job definitions)
│   ├── calculations/  (Versioned BESS Sizing, LCOS, and BOM Engine)
│   ├── product-sync/  (CATL source crawler, SHA-256 snapshots, diff analyzer)
│   ├── localization/  (Translation memory, locales UK/EN/ZH, BESS glossary)
│   ├── ai-gateway/    (14-Provider registry, circuit breaker, FinOps accounting)
│   └── ui/            (Tailwind design tokens and shared UI components)
```

---

## 2. Core Operational Pipelines

1. **PIM Single Source of Truth**:
   PostgreSQL stores all official product specifications, dimensions, electrical parameters, and provenance records. No static or hardcoded fallbacks are used in production runtime.

2. **CATL Product Ingestion Pipeline**:
   ```
   Official CATL Sources ➔ Real HTTP Fetch ➔ SHA-256 Snapshot Store ➔ Spec Extraction ➔ Diff Analyzer ➔ Engineer Review ➔ PIM Revision Increment ➔ Live Website
   ```

3. **Multi-Provider AI Gateway**:
   ```
   AI Request ➔ Task Classifier (bess_advisor | extract | translate) ➔ Primary Provider (Gemini / Claude / GPT) ➔ Circuit Breaker / Failover ➔ Token & USD Cost Accounting
   ```

4. **Closed-Loop RFQ Lead Lifecycle**:
   ```
   Public RFQ Submission ➔ Validation ➔ Database Persistence ➔ Worker Queue Dispatch ➔ CRM Webhook Sync ➔ Engineer Assignment ➔ Proposal Delivery
   ```
