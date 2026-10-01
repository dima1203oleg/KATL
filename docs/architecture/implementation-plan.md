# Implementation Plan — KATL BESS Platform

## Phase 0: Baseline & Preservation (Completed)
- [x] Analyze codebase, identify existing Vite/Express prototype as UI & UX baseline.
- [x] Document existing implemented vs. mock modules (`docs/architecture/mock-inventory.md`).
- [x] Verify build stability and lint integrity.
- [x] Keep all existing prototype UI/UX untouched.

## Phase 1: Foundation & Monorepo (In Progress - Practical Step 1)
- [x] Define monorepo structure with npm workspaces (`apps/*`, `packages/*`).
- [x] Create `apps/web`: Next.js App Router application.
- [x] Create `apps/api`: Modular backend REST API service.
- [x] Create `apps/worker`: Background task worker for queues.
- [x] Create shared packages:
  - `packages/shared-types`: Common types (PIM, RFQ, Sync, AI, Calculations).
  - `packages/database`: PostgreSQL schema, migration runner, seed script.
  - `packages/redis`: Redis client & queue manager configuration.
- [x] Set up PostgreSQL & Redis in `docker-compose.yml` for local development.
- [x] Database migration framework with initial SQL migration (`0001_initial_pim_schema.sql`).
- [x] Configure GitHub Actions CI (`.github/workflows/ci.yml`).
- [x] Migrate control vertical slice page: `/products/catl-tener-h` in Next.js App Router without changing visual design.
- [x] Verify typecheck, lint, build for both root app and workspaces.

## Phase 2: Core Data Platform & PIM
- [ ] Connect `apps/api` and `apps/web` to live PostgreSQL via Drizzle/Kysely pool.
- [ ] Implement full PIM CRUD with schema validation, provenance tracking, and revision history.
- [ ] Build CATL Sync Worker crawler engine with snapshot storage in PostgreSQL/S3.
- [ ] Implement Engineer Review & Approval dashboard API.

## Phase 3: AI Provider Gateway & Calculations Service
- [ ] AI Provider Gateway with multi-vendor adapter (Gemini primary, Anthropic/OpenAI fallbacks).
- [ ] Token budgeting, per-tenant rate-limiting, and cost metrics in Redis.
- [ ] Calculation Service packaging with test coverage for Ukrainian tariff benchmarks.

## Phase 4: Localization & Real Integrations
- [ ] Database-driven Translation Memory (TM) and engineering glossary (UK, EN, ZH-CN).
- [ ] Real CRM integration (webhook dispatcher to HubSpot / Bitrix24 / Salesforce) for RFQ leads.
- [ ] Authentication system with JWT / RBAC (Engineer, Admin, Client).

## Phase 5: Complete Frontend Migration
- [ ] Progressively migrate remaining pages from Vite prototype to `apps/web` Next.js App Router:
  - Home page (`/`)
  - Catalog (`/products`)
  - Product comparison (`/compare`)
  - Solutions & Industries (`/solutions/*`, `/industries/*`)
  - Engineering Designer (`/engineering`)
  - Customer & Partner Portals (`/customer`, `/partners`)
- [ ] Verify SSR performance, metadata, OpenGraph, Core Web Vitals.

## Phase 6: Production Hardening & Observability
- [ ] Prometheus metrics, structured OpenTelemetry logging.
- [ ] Redis caching for product catalog and high-frequency endpoints.
- [ ] Security audits, rate-limiting, CORS, CSP headers.
