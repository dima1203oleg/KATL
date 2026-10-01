# ADR-002: Monorepo Structure & Progressive Vertical Slice Migration

## Status
Accepted

## Context
The KATL BESS platform was initially developed as a single-repository Vite + React + Express prototype with comprehensive UI/UX. The Technical Specification (TZ) mandates a production-grade architecture featuring:
- Monorepo structure (`apps/web`, `apps/api`, `apps/worker`, `packages/*`)
- PostgreSQL for relational data storage and audit trails
- Redis for caching and asynchronous queues
- Next.js App Router for server-rendered web experience, SEO, and locale-aware routing
- Progressive migration ensuring the existing UI/UX is not destroyed during the transition.

## Decision
1. **Adopt NPM Workspaces Monorepo**: Establish `apps/web` (Next.js), `apps/api` (Express REST service), `apps/worker` (BullMQ background processor), and shared packages (`packages/shared-types`, `packages/database`, `packages/redis`).
2. **Preserve Prototype Baseline**: Keep the current Vite/React application and root Express server functioning to guarantee immediate usability and reference integrity.
3. **Execute Control Vertical Slice**: Migrate the flagship product page `/products/catl-tener-h` to `apps/web` under the Next.js App Router. This slice verifies:
   - Server-Side Rendering (SSR)
   - Dynamic metadata (`generateMetadata`) with OpenGraph and structured SEO
   - Locale-aware routing (`/[locale]/products/[slug]` with fallback)
   - Data Access Layer (DAL) querying product specifications from the PIM repository
   - 100% design fidelity preservation (hero, 3D interactive viewer, technical specs matrix, container graphic, RFQ integration).

## Consequences
- Clean separation between frontend, API, worker, and data layers.
- Safe, non-breaking evolution from prototype to production architecture.
- Full verification of Next.js App Router capabilities before migrating remaining 50+ components.
