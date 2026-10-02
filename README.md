# KATL / CATL BESS platform

KATL is a Next.js web application, a canonical Express API, and a background worker for a CATL/BESS product and engineering platform focused on Ukraine. The repository is under active implementation and is **not production ready**. The current route-level evidence and known gaps are tracked in [`docs/implementation/PAGE_ACCEPTANCE_REPORT.md`](docs/implementation/PAGE_ACCEPTANCE_REPORT.md) and [`FINAL_PRODUCTION_REPORT.md`](FINAL_PRODUCTION_REPORT.md).

The public catalog reads only published PIM records from the API. No unverified CATL product data is seeded. The BESS sizing and LCOS tools are deterministic preliminary calculations; neither selects equipment nor substitutes for engineering design or a quote.

## Workspaces

- `apps/web`: Next.js public site and current RFQ/login/calculator interfaces.
- `apps/api`: canonical REST API.
- `apps/worker`: background jobs.
- `packages/database`: PostgreSQL migrations and database access.
- `packages/redis`: Redis and queue definitions.
- `packages/calculations`: deterministic engineering/economic calculations.
- `packages/shared-types`: shared API/domain types.
- `src/server/ai-gateway`: server-side AI gateway used by API code.

The Vite/React interface remains in the repository as a legacy functional/UI reference while Next.js migration is incomplete. The default `dev` command starts Next.js, and `build:web` explicitly verifies that production web app. Legacy UI must not be removed until its screen-by-screen feature, data, visual, URL, SEO, and browser parity is accepted. The removed root Express/JSON server is not a supported backend; `apps/api` is canonical.

## Local development

Install dependencies with `npm ci`. Run the web app using `npm run dev`; run API and worker in separate terminals with `npm run dev:api` and `npm run dev:worker`. PostgreSQL and Redis must be configured for persistence-backed workflows. Set `DATABASE_URL`, `REDIS_URL`, and other required secrets from the environment-specific configuration; do not use production secrets locally.

Run `npm run lint`, `npm test`, and `npm run build` for typechecks, tests, and web/API/worker builds (the root build also runs the legacy bundle check). Database migrations are applied with `npm run db:migrate` after configuring PostgreSQL. Seeding deliberately does not create example CATL products.

## Current release status

**NOT PRODUCTION READY.** The customer and partner portals, complete PIM publication/provenance workflow, CMS, verified product catalog, localization workflow, full document/RAG platform, complete calculator suite, WebKit/device browser acceptance, backups/restore, staging, and production deployment remain release blockers. Local Chromium/Firefox tests do not certify those missing workflows. Never treat a successful build or an HTTP 200 response as completion of them.
