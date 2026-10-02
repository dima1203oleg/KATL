# KATL master gap matrix

Audit basis: repository `main` commit `82eb7f9` on 2026-10-02 includes PIM review/publication, revision history, safe published-data sync guards, and persisted BESS calculations linked to RFQs. Runtime claims were checked with source builds, clean PostgreSQL migrations through `0015`, API integration tests, local Compose services, Chromium/Firefox local acceptance, and a successful GitHub Actions run including Chromium/Firefox/WebKit and Docker builds. This remains a gap analysis, not a production certification.

## Status key

- **WORKING**: runtime path exercised with meaningful evidence.
- **PARTIAL**: real implementation exists but material workflow gates remain.
- **MOCK**: demo, fixture, hardcoded business behavior, or non-persistent interaction.
- **BROKEN**: attempted runtime path fails its intended behavior.
- **MISSING**: no runtime implementation.
- **LEGACY**: retained Vite-era implementation; not canonical production path.
- **DUPLICATED**: overlapping definitions or parallel sources of truth.
- **UNTESTED**: code exists but required integration/browser/deployment evidence is absent.

Statuses can be combined. Presence of an interface, package, route, test filename, or README bullet is not evidence by itself.

## Actual module matrix

| Module | Status | Evidence in current tree | Gap / next gate |
|---|---|---|---|
| Next.js public web | PARTIAL | Localized home, BESS, product listing/detail, compare, solutions, industries, RFQ, search, documents, BESS sizing and LCOS routes build. `/` chooses saved preference, trusted edge country (UA→uk-UA, CN→zh-CN), browser language, then uk-UA. Chromium and Firefox pass 8/8 each (16 total) for public and tested admin flows; responsive home has checks from 320–1920 px. | Many requested routes are content/status pages, catalogue has no reviewed products, most page translations are incomplete. WebKit, accessibility, performance, real device/ultra-wide and visual regression acceptance remain. Geo routing requires the CDN to overwrite trusted country headers. |
| Legacy React/Vite UI | LEGACY, MOCK, UNTESTED | `src/App.tsx`, `src/components/katl/*`, `src/data/titanPlatformData.ts`; root `build:legacy` bundles it. The UI contains product, portals, designer, BOM/proposal and AI screens. | The screens use local state and hardcoded/demonstration data. Do not delete until the migration matrix below reaches parity; separately classify useful interaction patterns versus unsafe data/actions. |
| Root Express/JSON persistence | LEGACY / REMOVED IN LOCAL HEAD | The current local commit removed root `server.ts` and `src/server/db/database.ts`; `apps/api` and PostgreSQL are canonical. | Verify Vite UI does not silently depend on deleted endpoints/storage. Do not restore a second production database. |
| API | PARTIAL | Health, auth, published PIM reads, restricted PIM draft list/create/edit, BESS/LCOS, RFQ/status, sync review/trigger, AI, localization, jobs, audit, search, documents and CRM webhook routes exist. The PIM writes enforce an allowlisted stationary-ESS category, HTTPS CATL source host, draft-only status and audit/revision updates. | The central router is still large; error contract/OpenAPI and domain modules are absent. No publish/revision approval API, fact-level provenance, CMS or portal APIs. |
| PostgreSQL | PARTIAL | Migration runner and migrations `0001`–`0012` were applied to ephemeral PostgreSQL 16; auth, PIM draft, RFQ history/attribution, audit, outbox and sync evidence were exercised locally. | No production DB, backup, restore or failover drill. No reviewed CATL product data; semantic entity migrations are schema/seed groundwork, not a populated verified graph. |
| PIM | PARTIAL | Protected admin flow supports draft → review → engineer approval → admin publication. Submission requires non-empty specifications plus a successful 2xx snapshot for the exact registered CATL URL. Creator cannot approve their own draft; approval requires a review note. Publication is bound to the submitted revision and source snapshot. Product snapshots/events are persisted in `pim_product_revisions`; API and history UI are covered by PostgreSQL integration and Chromium/Firefox checks. | No claim-level provenance/evidence validation: reviewer notes and page snapshots do not prove every individual specification. No staged edits of published products, family/variant/specification-definition workflows, full localization review, media/document lifecycle or compatibility management. No CATL product is yet approved for sale. |
| CATL Product Sync | PARTIAL, UNTESTED | `apps/worker/src/index.ts` fetches only HTTPS `*.catl.com`, stores content and SHA-256 snapshot in PostgreSQL, and extracts JSON-LD name/description candidates into human-review changes. Directly applying a detected change to a published product is now rejected. | Published-product revision workflow is not implemented; PDF is snapshotted but not parsed; no S3/MinIO, broad datasheet extraction, field-level spec diffs, rollback UI, change propagation, or successful live official-source review. `packages/product-sync` is contracts only. |
| Queue/worker | PARTIAL | BullMQ/Redis queues, outbox poller, retries and real sync/RFQ dispatch handlers exist. | Translation, indexing, document/PDF, proposal and several queue events deliberately fail with `HANDLER_NOT_CONFIGURED`; restart/DLQ workflow not integration-tested. |
| Authentication | PARTIAL | Password login/logout, HTTP-only sessions, expiry/revocation and role guards; browser-tested admin login, logout and role-gated interface. | No reset/verification/MFA, portal session tests, CSRF token policy or independent security review. Hashing uses scrypt rather than requested Argon2id. |
| RBAC / tenant isolation | PARTIAL | `requireRoles` protects sensitive routes; role enum and session identity exist. | No permission matrix and no customer/partner data ownership model to test. UI visibility is not complete authorization. |
| RFQ/CRM | PARTIAL | RFQ form persists to PostgreSQL with attribution/outbox; worker dispatch reached local Mailpit. Admin list/status update and audit/history pass browser and DB tests. | No attachments, task/contact/proposal pipeline or sales lifecycle. Mailpit is not a real mail provider; no configured CRM webhook or delivery acceptance. |
| BESS calculations | PARTIAL | `packages/calculations` BESS sizing v2 and LCOS v1 have deterministic API/UI and unit/API tests. Sizing saves algorithm/input/result/locale snapshots in PostgreSQL; an RFQ can reference the calculation, and the API rejects value mismatches. | Sizing is basic power × duration plus reserve; no profile, usable-energy/product constraints, BOM, tariff, cost model, customer project, currency/source snapshot or SLD. Legacy economic outputs are MOCK and must not be merged as facts. |
| Domain package | MOCK / DUPLICATED / UNUSED | `packages/domain/src/index.ts` has a broad output interface including a recommended product, CAPEX, savings, payback and LCOS. | No runtime implementation or evidence; its result contract conflicts with the actual deterministic calculation package. Reconcile contracts before connecting it. |
| AI Provider Gateway | PARTIAL, UNTESTED | `src/server/ai-gateway/aiGateway.ts` calls Gemini when configured, grounds the advisor in PIM rows, reports unconfigured provider states; API returns a controlled unavailable error. | Only Gemini is implemented; no real secondary adapters/failover, durable budget/cost controls or live-provider test. `packages/ai-gateway` is a registry/interface, not 13 integrations. |
| Localization | PARTIAL / DUPLICATED | API locale/glossary endpoints and PIM translations exist; Next uses canonical path segments `uk-UA`, `en`, `zh-CN`. | `packages/localization` uses inconsistent `uk`/`zh-cn` codes and hardcoded glossary examples. No TM persistence, CMS translation workflow, reviewer UI, complete translations or parity. |
| Entity graph / fact provenance | PARTIAL SCHEMA / UNTESTED | Existing PIM stores broad JSON specification groups with product-level provenance. Migrations `0011`/`0012` define a sourced fact/entity graph and candidate CATL ESS entities with all edges explicitly unverified. | No graph rows have been applied; no fact-level writer/read model, source evidence UI, impact propagation or database migration test. Do not publish user-provided 2026 specs before official verification. |
| Semantic SEO / Search Intelligence | PARTIAL SCHEMA / UNTESTED | Migrations `0011`/`0012` define the page registry, query/intent map, target entities, exclusions, volume/difficulty provenance fields and time-series observations. Seed rows are planned/noindex only, with no invented volumes. `SEO_ARCHITECTURE.md` describes URL/intent/query governance. | Schema has not run against PostgreSQL; no admin/CMS interface, GSC/Bing inputs, validated demand, cannibalization checks, AI citation monitoring, crawler logs or SEO quality CI. |
| CMS | MISSING | Marketing pages are React code; no content workflow tables/UI. | No page/block drafts, preview, review, scheduled publish, revisions, author/reviewer, rollback or locale content service. |
| Documents / object storage / RAG | PARTIAL / MOCK | Document metadata API/table and public list route exist. | No MinIO/S3 adapter, upload/download lifecycle, PDF text extraction, checksum deduplication, chunks/embeddings, retrieval or source citations. |
| Customer portal | LEGACY, MOCK in Vite; MISSING in Next | `src/components/katl/KatlCustomerPortal.tsx` renders a prototype; Next private route is absent. | No persisted projects/calculations/proposals/files or tenant isolation; migrate only after backend ownership model and tests exist. |
| Partner portal | LEGACY, MOCK in Vite; MISSING in Next | `KatlPartnerPortal.tsx` prototype exists; no Next partner routes. | No verified partners, registration/deal protection, tenant separation, resources or status lifecycle. |
| Admin control plane | PARTIAL; legacy prototype remains | Protected Next admin entry with role-aware overview, RFQ status, sync source/change review, audit browsing and PIM draft/review/publish/revision history. PostgreSQL tests cover source-gated review, maker-checker, approval, publication, visibility, RFQ association and protection against direct changes to published data; Chromium/Firefox cover the admin workflow UI. Legacy Vite admin remains demo-only. | No complete user/role manager, fact-level review or published-product revision editor, source registry editor, CMS/localization/SEO/AI, settings, queue or metrics dashboards. |
| SEO technical core | PARTIAL, UNTESTED | Next route metadata exists on several pages; search and comparison pages are noindex; product filters are noindex; robots/sitemap routes, canonical alias redirects and locale negotiation are in this working tree. Next production build and local SSR were verified. | Sitemap routes are temporarily code-listed; no page registry integration, complete hreflang parity checks, schema validation, redirect registry, crawler/WAF verification or Search Console. |
| Analytics | MISSING | No accepted event pipeline/reporting evidence. | No event schema, consent gating, funnel, qualified lead outcome, or AI-referral/citation measurement. |
| Notifications | PARTIAL | SMTP dispatch ran to ephemeral local Mailpit during RFQ queue acceptance; unconfigured production status is not reported as success. | No real provider credentials, delivery/complaint monitoring, complete templates, retry/idempotency acceptance or password reset. |
| Security | PARTIAL, UNTESTED | Helmet, CORS allowlist, validation, rate limits, password/session path, role guards and secret examples exist. | No current automated security scan evidence, CSRF/CSP/HSTS acceptance, SSRF test matrix, file-upload defenses, MFA or tenant isolation. |
| Observability / backup / DR | PARTIAL / UNTESTED | Health routes, structured worker logs and deployment/runbook notes exist. | No traces/metrics dashboards/alerts, production request propagation, automated DB/object backup or restore drill. |
| CI / Docker | PARTIAL | GitHub Actions run `36982476784` passed lint/typecheck, migrations, tests, production build, Chromium/Firefox/WebKit E2E, API/worker/web image builds and dependency audit. Local Chromium/Firefox acceptance passed 18/18. | Rebuilding current images ran out of local disk. Visual regression, staging and production deployment stack are unverified. |
| Production release | MISSING | No production credentials, staging, domain deployment or rollback evidence. | All blocking release gates; see [`FINAL_PRODUCTION_REPORT.md`](../FINAL_PRODUCTION_REPORT.md). |

## Legacy-to-Next migration matrix

No legacy screen is considered migrated based on similar-looking UI alone. `N` identifies current Next destination; `L` identifies the retained legacy source.

| Legacy screen/component | Legacy behavior currently represented | Next destination | Parity status | Data / acceptance still required |
|---|---|---|---|---|
| `KatlNavbar`, `KatlFooter` | Navigation, quick actions, modal triggers | `SiteShell` | PARTIAL | Compare links/actions/locales; keyboard/mobile browser parity |
| `KatlHomePage` | Hero, product/solution and designer sections | `/[locale]` | PARTIAL | Remove unsupported local product truth; API/CMS data and visual checks |
| `KatlCatalogPage` | Local product filtering/cards/compare controls | `/[locale]/products` | PARTIAL | PIM-only filters, category coverage, compare persistence and empty/error tests |
| `KatlProductDetailPage` | Hardcoded detail content/CTA | `/[locale]/products/[slug]` | PARTIAL | Verified PIM record, documents, compatibility, provenance, field parity |
| `KatlComparePage` | Local comparison | `/[locale]/compare` | PARTIAL | Shareable 2–4 model URL, differences-first, responsive table, RFQ loop |
| `KatlSolutionsPage` | Local solution presentations | `/[locale]/solutions` and `[slug]` | PARTIAL | CMS, verified architecture, solution-to-product-to-tool links |
| `KatlIndustriesPage` | Local industry presentation | `/[locale]/industries` and `[slug]` | PARTIAL | Unique source-backed industry pages, no fake projects, locale parity |
| `KatlTechnologySafetyPage`, `KatlTechPage` | Technical/safety modal/page content | `/[locale]/bess`, resources | PARTIAL | Source provenance, standards review, citations and structured HTML |
| `BessDesigner` patterns in home/modal | Wizard-like client UI and local sample config | `/[locale]/bess-designer` | FAIL | Deterministic project model, validated PIM constraints, persistence, BOM, tests |
| `BessLcosSimulator` / domain result interfaces | Simulated financial/product outputs | `/[locale]/engineering/lcos` | PARTIAL | Preserve only safe UX; replace every fixture formula/value; save input snapshots and sources |
| `BessBomSolutionModal` | Client-side BOM/proposal presentation | No Next equivalent | FAIL | Real product compatibility/catalog pricing and persistent editable BOM |
| `BessProposalModal` | Generated-looking proposal UI | No Next equivalent | FAIL | Quote/revision/prices, PDF and audit workflow |
| `BessSingleLineDiagram` | Client-side SLD diagram | No Next equivalent | FAIL | Configuration-derived diagram plus SVG/PNG/PDF export tests |
| `KatlCustomerPortal` | Demo dashboard | No Next equivalent | FAIL | Authenticated projects, isolation, docs/proposals, E2E |
| `KatlPartnerPortal` | Demo dashboard | No Next equivalent | FAIL | Verified partner tenant, deal registration and E2E |
| `KatlAdminPortal`, Page Registry, SEO Center, Engineer Review | Demo control-plane panels | No Next equivalent | FAIL | Real API/DB permissions, auditability, CRUD/review, E2E |
| `KatlAiAdvisorModal` | Client-visible advisor interaction | No grounded Next UI | FAIL | Real API gateway UI, citations, unavailable/failover behavior; no fabricated answer |
| `KatlSearchModal` | Local search overlay | `/[locale]/search` | PARTIAL | Product/spec/document/article index, autosuggest, keyboard accessibility |
| `KatlRfqModal` | Local request form/CTA | `/[locale]/rfq` | PARTIAL | Attachments, attribution persistence, CRM/admin status browser journey |
| `KatlVideoModal` / `KatlVisualAssets` | Prototype visual assets/modal | No matched production content service | UNTESTED | Verify rights, source/claims and migrate only approved assets |

## Immediate P0 sequence

1. Apply migrations `0011`–`0015` from a clean database in CI; local clean migration passed, while the current Docker rebuild ran out of disk before a repeatable image rebuild.
2. Add claim-level provenance and validate each publishable fact against an exact source excerpt/page; a successful page snapshot and reviewer note alone are insufficient.
3. Add staged revisions for published products; the Sync worker now blocks direct changes, pending a safe public revision path.
4. Add semantic-core import/validation and reviewed seed clusters without invented search volumes.
5. Resolve canonical URL policy and build metadata/sitemap/robots from published registry data; verify HTML, 404s, alternates and filter noindex rules.
6. Add Search Console/Bing and citation observation adapters only after account access is configured.
7. Keep Vite UI until every legacy screen has accepted Next parity; only then schedule removal with redirect and regression evidence.

## Responsive and browser acceptance

The CSS includes fluid container gutters, safe-area spacing, a responsive layout, reduced-motion handling, and an orientation fallback. These are implementation details, not cross-device proof. Release acceptance still requires Playwright against Chromium, WebKit, and Firefox plus visual checks at 320, 360, 375, 390, 393, 412, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1920, 2560, and 3440 px, portrait/landscape, 200% zoom, keyboard, and touch. Safari/iOS, Android browsers, and in-app WebViews are currently **UNTESTED**. CI has no passing cross-browser or visual-regression gate.

## Release statement

**NOT PRODUCTION READY.** This matrix records partial progress and open gates; it is not a `PRODUCTION READY` certification.
