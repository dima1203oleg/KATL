# Monorepo Architecture & Workspace Layout

## 1. Directory Structure

```
├── apps/
│   ├── web/               # Next.js App Router (Client & Server Components, SSR)
│   ├── api/               # Express / Node.js Production REST API (Modular Monolith)
│   └── worker/            # Background Worker (BullMQ + Redis for sync, reports, emails)
├── packages/
│   ├── shared-types/      # TypeScript contracts (PIM, RFQ, Sync, AI Gateway, Calc)
│   ├── database/          # PostgreSQL schema, DDL migrations, connection pool, seed data
│   └── redis/             # Redis client wrapper, cache keys, queue definitions
├── src/                   # Existing Vite/React prototype (preserved as UI/UX baseline)
├── docs/                  # Architecture, ADRs, blueprints, and mock inventory
├── docker-compose.yml     # Local orchestration: PostgreSQL, Redis, API, Worker, Web
└── .github/workflows/     # CI pipelines (Lint, Typecheck, Test, Build)
```

## 2. Workspaces Configuration

Managed via NPM Workspaces in root `package.json`:
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

## 3. Dependency Graph & Isolation Rules
- `packages/shared-types` has zero runtime dependencies.
- `packages/database` depends only on `shared-types` and PostgreSQL driver (`pg`).
- `packages/redis` depends only on `shared-types` and `ioredis`.
- `apps/api` depends on `packages/database`, `packages/redis`, `packages/shared-types`.
- `apps/worker` depends on `packages/database`, `packages/redis`, `packages/shared-types`.
- `apps/web` depends on `packages/database`, `packages/shared-types`.
- Neither `apps/web` nor business modules may directly import vendor AI SDKs; all AI interactions must route through the AI Gateway.
- The existing Vite/React codebase in `/src` remains fully intact as the UX baseline during progressive migration.
