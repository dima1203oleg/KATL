# KATL Final Production Report

**Assessment date:** 2026-10-02

**Final status: NOT PRODUCTION READY**

This report supersedes the previous readiness certification. That document marked the platform ready without evidence for several release gates; its claims have been withdrawn.

## Initial state

The repository contained a Vite application and an incomplete Next.js/API/worker monorepo. The API and worker TypeScript builds were not production-runnable, database configuration included an implicit fallback, auth depended on non-production paths, queued work and sync review lacked durable implementations in key flows, and generated readiness claims exceeded the verified behavior.

## Changes completed

- Added a reproducible npm lockfile and fixed the Vite/esbuild dependency conflict.
- Kept the legacy Vite/React UI in place as a functional and visual migration reference because screen-level Next.js parity has not been demonstrated. Root `dev` uses Next; `build` still verifies both the legacy bundle and canonical Next/API/worker workspaces.
- Upgraded Next.js to 16.3.8; `npm audit --audit-level=high` now reports zero vulnerabilities.
- Added PostgreSQL-backed password authentication and hashed, revocable, expiring sessions; added a provisioning command that creates a new administrator without silently elevating an existing user.
- Added PostgreSQL persistence for RFQ attribution, status history, audit/outbox records, sync evidence, and document metadata.
- Added RFQ input validation, transactional creation/status history, rate limits, API security headers, role checks, and dependency-backed readiness probes.
- Added durable BullMQ queues, an outbox poller, explicit SMTP delivery failure behavior, and a restricted official-domain CATL fetch path with hashed source snapshots and reviewable field changes.
- Removed the legacy sync engine that fabricated CATL snapshots and technical changes.
- Removed the obsolete root Express/Vite production server and its `.katl_db.json`/in-memory database implementation; the canonical Next.js and API workspace paths are now the default runtime commands.
- Removed the AI fabricated-answer fallback. Gemini is reported as unconfigured without credentials; unavailable AI returns a controlled error.
- Bundled internal TypeScript workspaces into API and worker JavaScript artifacts so the Node runtime does not import workspace `.ts` files directly.
- Added a migration service that must complete before the API starts and made the dev Compose health check match its database settings.
- Added PostgreSQL-dependent end-to-end API coverage to the CI test path and updated the old readiness report to this evidence-based result.
- Added a localized Next.js public shell, Ukrainian BESS/product/solutions/industries/RFQ routes, API-backed PIM/search/documents views, an RFQ form, a login form, and honest empty/error states. Most requested page inventory and all customer, partner, and admin portals remain incomplete; see [PAGE_ACCEPTANCE_REPORT.md](docs/implementation/PAGE_ACCEPTANCE_REPORT.md).
- Removed inherited/unverified PIM records from public availability and added publication evidence and current approved translation gates (`0009`, `0010`). No CATL products are currently inserted as verified seed data.
- Replaced the preliminary BESS sizing with a versioned deterministic calculation that does not invent product selection or economics. Added deterministic discounted-throughput LCOS math and API/UI with explicit assumptions and degradation sensitivity.
- Added root locale negotiation: explicit saved preference, trusted Vercel/Cloudflare country (Ukraine→Ukrainian, China→Simplified Chinese), then quality-ranked browser language, with Ukrainian fallback. Locale selection has five unit cases and the production server returned the expected redirect for UA, CN, browser language, and saved preference.
- Added a source-backed entity/fact model and semantic SEO planning tables for entities, aliases, relationships, provenance facts, page registry/indexability gates, query intent/locale/country, observations, and out-of-scope searches (`0011`, `0012`). Search volumes and difficulty remain null until a real provider/source is connected. CATL product candidates remain unverified; no technical claims are published from this seed.
- Added crawler policy distinguishing search crawlers from GPTBot, locale aliases, and a generated sitemap based on implemented routes plus PIM-published products. CDN/WAF bot access and external webmaster verification were not tested.
- Kept legacy Vite screens available and in the root build. Removed category links that previously queried hardcoded, unverified category labels; catalog categories must come from PIM.
- Added PIM fact-level provenance (`0016`): each technical leaf is tied to an excerpt from a successful snapshot for the exact official CATL source URL; review and publication reject missing, mismatched, stale, or unreviewed evidence. Engineer approval records reviewer identity per fact, revision history retains the evidence, and published API records expose each verified citation. The admin editor now accepts a section and exact excerpt per technical fact.
- Updated the Next.js public presentation toward the supplied dark energy/industrial visual direction: new editorial hero, schematic energy-system illustration, PIM-driven catalog styling, solution cards, engineering block, comparison styling, and consistent wordmark. The screenshot's unverified product claims, stock, case studies and numeric returns were not copied into runtime data. This is a visual direction pass, not pixel-identical reproduction or full legacy-screen parity.
- Added Playwright Chromium/Firefox/WebKit projects and basic route, localization, RFQ form, 404, and responsive-width acceptance. The CI workflow now installs the three browser engines and runs the suite.
- Fixed parameter type ambiguity in PostgreSQL JSONB audit inserts found by executing login/RFQ/status API integration flows against a real local PostgreSQL instance.
- Fixed Docker Compose migration double-application: migrations are run once by the tracked migration service. Local database/cache ports now bind to loopback; production API ports are private and web binds to loopback for a host TLS reverse proxy. Production configuration now requires an explicit session secret.
- Added optional BuildKit proxy CA mounting to web/API/worker Docker builds so the CA is not copied into resulting images.
- Made the worker wait for successful database migrations and fixed its RFQ-delivery audit insert. A full local Compose run demonstrated that a browser-submitted RFQ was persisted, dispatched by BullMQ, delivered to the Mailpit test inbox, and recorded in audit; CRM remained correctly marked PENDING because no CRM endpoint is configured.
- Tightened RFQ browser form validation so required fields and consent are checked before sending.
- Added a protected Next.js admin control center with role-gated overview, RFQ status management, CATL Sync review actions, and audit browsing. The admin route is `noindex` and runs outside the public-site header/footer.
- Added PIM draft listing/create/update/archive endpoints and an admin editor. Draft creation requires an HTTPS source URL on official CATL domains and one of the explicit stationary ESS/component categories; it automatically registers a Sync source.
- Added an explicit PIM draft → review → engineer approval → admin publication workflow. Submission requires non-empty specifications and a successful captured 2xx snapshot from the registered CATL URL; the creator cannot approve their own draft. Reviewer notes, snapshot identity, publication transitions, revision snapshots and audit events are persisted, and admins can inspect revision history. Direct Sync changes to published product values are blocked and must use staged revisions.
- Added auditable cancellation for a creator's unsubmitted staged product revision (or any such draft by an administrator). Cancelling frees the single active revision slot and leaves the public product unchanged; the UI does not report success unless the API transition succeeds.
- Extended the official source allowlist to CATL's global and China domains (`catl.com` and `catl.com.cn`, including subdomains). Admin Sync shows registered sources and reviewable changes; crawler snapshots remain limited to basic extraction and have not been live-verified against CATL.
- Closed the local admin workflow in Chromium and Firefox: create PIM draft → see registered CATL source → verify review is disabled until a source snapshot exists → inspect revision history → archive draft → verify source is disabled. PostgreSQL integration covers source-gated review, maker-checker, approval, publication, public visibility, RFQ association and protection from direct Sync changes to published data.
- Added durable BESS sizing results: each calculation stores its algorithm version, inputs, result and locale in PostgreSQL. RFQ can reference that immutable calculation; the API rejects missing or mismatched IDs/values. The calculator carries the saved calculation into the RFQ form.
- Corrected `/en/bess` and `/zh-CN/bess`: unsupported translations now show the reviewed-language notice and carry `noindex,follow` metadata instead of returning 404. Added a browser regression test for both locales.

## Database migrations

Migrations `0001`–`0018` completed on a fresh temporary PostgreSQL database for this working branch. `0016` adds fact-level provenance, `0017` adds staged revisions for published products, and `0018` permits audited cancellation of unsubmitted staged drafts. The isolated test database was removed after verification. This does not verify production migration compatibility, backups or restore.

## Verification results

| Gate | Result | Evidence |
|---|---|---|
| `npm ci` | PASS | Clean dependency installation completed. |
| Lint/typecheck | PASS | Root, API, worker, and web checks completed. |
| Current API integration suite | PASS (local) | 8 integration tests passed within `npm test` 23/23 on a fresh isolated PostgreSQL 16 database, including evidence validation, maker-checker publication, calculation-to-RFQ association, staged cancellation permissions/audit, and public-data isolation. Current branch CI has not run yet. |
| Current Next.js build | PASS | `npm run build:web` passed on the current working tree. Earlier GitHub Actions builds passed on a prior branch commit. |
| Current API / worker builds | PASS | API and worker workspace builds passed in the current local root build. Current branch Actions result is pending. |
| Clean database migrations | PASS (local) | Migration runner applied `0001`–`0018` on a newly created isolated PostgreSQL database; no production database was touched. |
| Unit/API/integration tests | PASS (local) | `npm test`: 23/23 passed against isolated PostgreSQL 16 and the local Redis service. Current branch CI result is pending. |
| Production builds | PASS locally | Local root `npm run build` passed for legacy Vite, Next.js, API and worker. Earlier Actions built all three containers on a prior branch commit. Legacy Vite remains retained pending parity and reports a 642.57 kB minified JS chunk warning. |
| Compose configuration and local stack | PASS (ephemeral local) | Full PostgreSQL, Valkey, migration, API, worker, Mailpit and Next web stack started; readiness and migration gating passed. This is not staging or production. |
| Docker image builds | CI PASS; local rebuild blocked by disk | GitHub Actions built current API, worker and web images successfully. Rebuilding locally exhausted disk even after cache cleanup; existing volumes/data were preserved. |
| GitHub Actions | PASS for current branch commit | [Run 37040248078](https://github.com/dima1203oleg/KATL/actions/runs/37040248078) for commit `ce9e629` passed lint/typecheck, PostgreSQL migrations, seed/admin setup, unit/integration tests, production build, browser acceptance across Chromium/Firefox/WebKit, API/worker/web container builds, and dependency security audit. The preceding run exposed an ambiguous Playwright accessible-name selector; the exact-name fix is included in this successful run. |
| Latest local verification | PASS | On this working tree: `npm run lint`; full `npm run build` for legacy, Next.js, API and worker; `npm test` 23/23 on an isolated PostgreSQL database; Playwright 24/24 across Chromium/Firefox. Legacy Vite still reports a 642.57 kB minified JS chunk warning. |
| Production Compose validation | PARTIAL | `docker compose -f docker-compose.yml -f docker-compose.prod.yml config --quiet` passes. A separately named production-like stack was attempted with temporary credentials and a clean database; PostgreSQL/migration/API/worker started, but the web image could not be created because the local Docker host ran out of disk space. Only this temporary stack and its volumes were removed; the existing development stack was left untouched. |
| Browser acceptance / Playwright | PASS locally in Chromium/Firefox; current WebKit pending | 24/24 checks passed across Chromium and Firefox on isolated API/database ports, including the new staged-revision cancel button and verifying unchanged published data. The prior CI run passed WebKit on earlier code. No physical iOS/Android device matrix or visual-regression baseline exists. |
| Locale routing HTTP smoke | PASS for tested routes | Root locale negotiation unit tests pass for Ukraine, China, saved preference and browser language. `/en/bess` and `/zh-CN/bess` now return 200 with localized review notices and `noindex,follow`; these routes are not represented as published translations. |
| Dependency security audit | PASS | `npm audit --audit-level=high`: zero vulnerabilities. |
| AI provider failover | NOT RUN | No provider credentials were supplied; only NOT_CONFIGURED/error behavior is implemented. |
| CATL source verification | NOT RUN | No live fetch or source-content review was performed. |
| Backup and restore | NOT RUN | No database/object-store deployment or backup target was available. |
| Staging, production deploy, rollback | BLOCKED | No deployment provider account, registry, runtime secrets, host/TLS reverse proxy or deploy credentials are configured. `https://catl.site/` returned HTTP 503 when checked. No persistent temporary domain is configured or available from this repository/session. |

## Integrations and limitations

- PostgreSQL and Valkey/Redis-BullMQ were exercised in the local Compose stack; RFQ delivery reached local Mailpit. SMTP and CRM have no configured production endpoint or credentials.
- The sync path allows official HTTPS `catl.com` and `catl.com.cn` hostnames and basic structured Product extraction. PDF extraction is pending; snapshots currently use PostgreSQL rather than S3/MinIO. No CATL source was fetched or verified during acceptance.
- AI has a Gemini adapter path but no live provider test, provider failover, durable FinOps accounting, or complete 10–15-provider adapter set.
- The web app now has a public route foundation, but many routes are status pages or incomplete flows. Catalog content is intentionally empty until reviewed PIM entities are published. Customer/partner/admin portals, CMS, localization workflow, RAG, semantic SEO operations, and full search acceptance remain incomplete.
- PIM now requires claim-level evidence from captured official CATL HTML snapshots and exposes approved citations with published facts. PDF text extraction is not implemented, and no real CATL product has yet completed a human review. Customer/partner portals, CMS, localization workflow, RAG and much of admin remain incomplete.
- Translation jobs, document processing, and SEO background jobs return explicit unconfigured-handler failures instead of fake success.
- The latest GitHub CI verified a prior feature-branch commit, not the current cancellation/test-port changes. No staging deployment, checked restore, production monitoring deployment, or verified rollback run exists. Automated browser tests do not substitute for real iOS Safari/Android/WebView validation.
- Product Sync snapshots still lack S3/MinIO object storage; the admin can review extracted changes, but source crawling/extraction coverage and engineering fact approval are incomplete.

## Deployment procedure (not yet executed)

1. Configure production secrets from `.env.example`, including `DATABASE_URL`, PostgreSQL credentials, `REDIS_URL`, `WEB_ORIGIN`, `CRM_WEBHOOK_TOKEN`, SMTP credentials, and `NOTIFICATION_EMAIL`. Do not use development defaults.
2. Build and publish immutable API, worker, and web images from the same commit.
3. Deploy `docker-compose.yml` with `docker-compose.prod.yml`; the `migrate` service must complete successfully before the API starts.
4. Run health/readiness checks, database-backed integration tests, and browser acceptance in staging.
5. Verify SMTP/CRM delivery, CATL snapshot evidence, AI provider behavior, backups, and a restore before production approval.
6. Promote the tested immutable image tags to production and run smoke checks. No production promotion has been performed.

## Rollback procedure (not yet exercised)

1. Stop promotion and redeploy the last known-good immutable web/API/worker image tags.
2. Keep schema changes backward-compatible during deployment; do not automatically roll back database migrations.
3. If data integrity is affected, pause writers and restore PostgreSQL and object storage from the last verified backups, then validate before reopening traffic.
4. Run live/ready checks and smoke tests against the recovered release. This sequence has not been validated by a restore or rollback drill.

## Blocking release gates

- Run the complete Docker Compose stack and queue workflows in staging against production-equivalent PostgreSQL/Redis. The local production-like Compose attempt remains incomplete because Docker ran out of disk during web-container creation.
- Add physical-device and visual-regression evidence; the current WebKit/Chromium/Firefox CI suite passes, while local WebKit cannot launch on this host.
- Complete the missing public routes and customer, partner, and admin workflows, plus CMS, localization, RAG, document storage, and reviewed catalog acceptance.
- Complete real CATL source review/catalog ingestion and PDF evidence extraction; no reviewed CATL product exists in PIM.
- Exercise staged submit → engineer review → admin publication controls in browser; the cancellation action is now browser-tested, while review/publish is currently integration-tested at API level.
- Expand browser coverage from 24 Chromium/Firefox checks to the complete page/workflow matrix; add visual regression, accessibility and performance gates.
- Verify real CATL sources and snapshots, document processing, AI provider fallback, SMTP, and CRM delivery.
- Rebuild current Docker images after provisioning enough disk; configure staging and production deploy credentials, run CI, backup/restore, deployment smoke tests, and rollback drill.
- Provide a compatible host/registry and a temporary domain for this Dockerized Next.js + API + PostgreSQL + Redis + worker stack; the connected Sites host cannot run this monorepo without replacing its backend and persistence architecture. `catl.site` currently returns HTTP 503.

**FINAL STATUS: NOT PRODUCTION READY**

## 2026-10-02 follow-up — staged revisions for published PIM products

- Added migration `0017_pim_staged_published_revisions.sql` and protected API/UI actions to create and edit a correction draft against an immutable base revision, submit it with source evidence, require a different engineer to approve it, and let an administrator publish it.
- Publication checks that the product is still at the draft's base revision, then updates the live product, specifications, verified fact citations, audit event, and revision snapshot inside one PostgreSQL transaction. The public record remains unchanged until this transaction commits.
- Added PostgreSQL integration coverage for duplicate staged drafts, unchanged live reads before publication, maker-checker rejection, citation retention, and updated public reads after publication.
- Verification on that working tree: fresh isolated database migrations `0001`–`0017` PASS; lint, unit/integration tests and root build PASS. The Vite build reports its existing large-chunk warning.
- Chromium and Firefox E2E then passed 20/20 on the isolated API/database. That prior run did not cover staged revision actions in the browser.
- The staged-revision gap is closed for the API path. Broader catalog readiness remains PARTIAL because the PIM has no real CATL product that has completed human source verification, PDF evidence extraction is absent, and there is no source-to-staged-draft automation or rollback UI.

## 2026-10-02 follow-up — cancel staged PIM drafts

- Added migration `0018_pim_staged_revision_cancellation.sql`; it retains the staged record and permits a `CANCELLED` status, so cancellation does not erase history.
- Added a role-checked API transition. A creator can cancel their own unsubmitted draft; an administrator can cancel any unsubmitted staged draft. Every successful cancellation creates an audit event. Drafts already submitted for review cannot be cancelled through this route.
- Added an admin PIM action that confirms the operation and reports success only after the API succeeds. The product's published state is not touched, and a new staged revision can be created once the cancelled record releases the active slot.
- Verification on current working tree: fresh isolated migrations `0001`–`0018` PASS; `npm run lint` PASS; `npm test` 23/23 PASS; `npm run build` PASS; Playwright 24/24 PASS across Chromium and Firefox. E2E uses a clearly test-only fixture in a disposable database. The staged cancellation journey passed in both engines.
- A first E2E attempt reused an already-running local API against a different database and correctly failed login; the Playwright configuration now supports isolated web/API ports, and the rerun passed without stopping or modifying the existing local service.
- GitHub run `37039328477` exposed three retries of the same strict locator ambiguity. The form button test now requires an exact accessible name; the existing admin flow and staged-cancellation flow pass together locally in Chromium and Firefox with four workers.
- GitHub run `37040248078` for current commit `ce9e629` passed the full CI pipeline, including cross-browser E2E with Chromium/Firefox/WebKit and all three service-container builds. Staging, restore, real CATL source review, physical-device checks, and production deploy remain unverified.

**Overall status remains NOT PRODUCTION READY.**
