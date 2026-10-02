# Monorepo architecture

## Current canonical runtime

```text
apps/
  web/       Next.js public web application
  api/       Express REST API
  worker/    BullMQ background worker
packages/
  calculations/ deterministic BESS and LCOS calculations
  database/     PostgreSQL client and migrations
  redis/        Redis client and queue definitions
  shared-types/ shared domain/API contracts
src/server/ai-gateway/ server-side AI gateway implementation imported by API code
src/             legacy Vite/React interface retained as a migration reference
infrastructure/ docker, monitoring, reverse proxy and scripts
tests/          unit and API/integration tests
```

The Vite/React interface remains until the Next.js migration has demonstrated functional, visual, data, route/SEO, regression-test, and browser parity. Root `npm run dev` uses Next.js, while `npm run build` also runs the legacy bundle check. The root Express server and its JSON/in-memory store are removed; `apps/api` is canonical. API and worker development processes run separately.

## Workspace boundaries

- The web application reads business data through the API and does not own persistence.
- The API owns validation, authorization, and business workflows.
- PostgreSQL is the system of record; Redis/BullMQ is for queued work.
- `packages/calculations` contains deterministic math and does not call an LLM.
- Business code uses the AI gateway instead of calling provider SDKs directly.
- Only published PIM records with verified provenance are public. Non-Ukrainian product data additionally requires a current published translation with full localized specifications.
- The small `packages/*` interfaces are not evidence that their domains are complete; current maturity is recorded in the [master gap matrix](../MASTER_GAP_MATRIX.md).

This describes the repository's current direction, not a claim that every listed capability is implemented. See the [page acceptance report](../implementation/PAGE_ACCEPTANCE_REPORT.md) for current pass/partial/fail status.
