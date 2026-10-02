# KATL page acceptance report

Date: 2026-10-02
Branch: `main`
Scope: implementation based on GitHub `main` commit `d6d1030` plus uncommitted milestone `0016` on 2026-10-02. This report does not certify production readiness.

Latest verification delta: migration `0016` applied successfully to local Compose PostgreSQL; unit tests pass 15/15, PostgreSQL integration tests pass 8/8 including fact evidence rejection/approval/public citation, `npm run lint` and API/worker/web production builds pass. Chromium and Firefox acceptance pass 18/18 including the PIM citation workflow’s no-snapshot UI state. Local WebKit could not launch because this environment lacks GTK 4, Graphene, HarfBuzz ICU, Manette, Hyphen and GLESv2 libraries. GitHub Actions for this source change is pending.

## Acceptance rules and test environment

`PASS (route)` means the Next.js route is implemented and returned an expected response during the local production-server route check. It does not mean the backed workflow, browser layout, persistence, SEO, accessibility, or integrations passed. `PARTIAL` means some honest UI or an early step exists, while required behavior is absent. `FAIL` means the requested page or workflow is absent, intentionally unavailable, or cannot complete its acceptance path.

Checks completed for the current web implementation:

| Check | Result | Evidence / limit |
|---|---|---|
| TypeScript and workspace typecheck | PASS | `npm run lint` |
| Unit, API and PostgreSQL integration tests | PASS | Local unit suite: 15/15. Current API PostgreSQL suite: 8/8, including missing/incorrect per-fact evidence rejection, engineer verification, public fact citation, source-gated publication and persisted calculation-to-RFQ association. GitHub Actions for milestone `0016` is pending. |
| Next.js production build | PASS | `npm run build:web` |
| API build | PASS | `npm run build:api` |
| Worker build | PASS | included in canonical `npm run build` |
| Production browser journeys | PARTIAL PASS | Against the current local Next/API runtime, Playwright Chromium 9/9 and Firefox 9/9 pass (18/18). Includes geo/preference routing, localized HTML, public RFQ, persisted calculator → RFQ with unchanged values, protected admin login/status change, PIM draft creation, source registration, citation editor and no-snapshot warning, disabled pre-sync review, revision history, archive/source disable, logout, 404 and responsive checks. Customer/partner flows remain absent. |
| Responsive viewport checks | PARTIAL PASS | Home has no horizontal overflow at 320, 375, 390, 430, 768, 1024, 1366 and 1920 px in Chromium and Firefox. Foldable, 200% zoom, orientation, catalog/product responsive matrix, and real device checks are pending. |
| WebKit/Safari | BLOCKED locally; physical Safari untested | Local launch lacks GTK 4, Graphene, HarfBuzz ICU, Manette, Hyphen and GLESv2. Previous GitHub Actions acceptance passed WebKit before this source change; the current commit must rerun it. No physical iPhone/iPad Safari verification yet. |
| PostgreSQL-backed journeys | PASS (local only) | Migrations `0001`–`0015` passed on a fresh temporary PostgreSQL database; `0016` applied to local Compose PostgreSQL. Current API tests ran against local Compose PostgreSQL. A calculation snapshot was saved and attached to its RFQ. Earlier Compose acceptance stored a browser RFQ, dispatched it to local Mailpit and recorded audit; CRM remained `PENDING` because no endpoint is configured. |
| Docker/Compose production images | PASS in CI; local rebuild blocked | GitHub Actions built the current API, worker and web images. Local Docker rebuild ran out of disk. No staging deployment was performed. |
| Actual PIM data and source review | FAIL / unavailable | The workflow now requires per-fact excerpts from the latest successful HTML snapshot and exposes verified citations publicly. No real CATL product/document has been reviewed; PDF text extraction is not implemented. Public catalog correctly remains empty. |
| Supplied visual reference | PARTIAL | Public home, product list and compare visual language now uses the supplied dark energy hero/navigation, white catalog, dark solution/engineering blocks and industrial schematic art. Exact image assets are not available; unverified specs and demo metrics were not copied. Admin has a separate compact control-center design; customer/partner screens are absent. |
| Locale detection | PASS (unit + HTTP smoke) | Five unit cases pass. Production server returned `/` redirects: UA→`/uk-UA`, CN→`/zh-CN`, browser `zh-CN`→`/zh-CN`, saved EN preference→`/en`; country selection consumes only Vercel/Cloudflare edge headers. |
| Locale coverage | FAIL / partial | Localized home pages exist; approved translated product reads are gated by PIM. Most public routes are UK-only; `/zh-CN/bess` currently returns 404. Full UK/EN/ZH page parity and semantic translations remain blocking. |
| Search/AI crawler access | IMPLEMENTED / UNTESTED | `robots.ts`, `sitemap.ts`, locale aliases, and search noindex metadata are in code. Production CDN/WAF and Search Console/Bing tests are pending. |

The legacy Vite/React application remains in the repository as a migration reference. It must stay until its screens have passed functional, data, design, route/SEO, regression, and browser parity in Next.js. The root build currently checks both the legacy bundle and canonical Next/API/worker workspaces.

Responsive/browser gates are partial. Chromium and Firefox exercise the responsive home through 1920 px and 404/locale/catalog/RFQ flows, including a persisted RFQ on the full local Compose stack. GitHub Actions passed Chromium, Firefox and WebKit projects. Required coverage still includes 2560–3440 px, foldable and landscape, 200% zoom, real safe-area devices, Chrome/Edge/Opera, Android browsers and in-app WebViews. Visual-regression baselines are not configured.

## Public route inventory

| Requested page / route | Status | Current evidence and blocker |
|---|---|---|
| Home `/`, `/uk-UA`, `/en`, `/zh-CN` | PARTIAL | Root redirects by saved locale/edge country/language; localized home routes passed Chromium/Firefox. Visual direction updated toward the supplied screenshot, with verified-data empty states. No reviewed PIM products, full localization, or analytics verification. |
| BESS hub `/[locale]/bess` | PARTIAL | Ukrainian educational page implemented; EN and ZH-CN are unavailable pending translation approval. |
| CATL Ukraine `/[locale]/catl-ukraine` | PARTIAL | Honest status page; it explicitly does not claim official representation. EN/ZH unavailable. |
| Ukraine energy storage `/[locale]/energy-storage-ukraine` | PARTIAL | Basic Ukrainian informational page; regulatory claims require source review; no localized versions. |
| Product index `/[locale]/products` | PARTIAL | PIM-backed API listing, filters and empty/error UI; needs working PostgreSQL and published reviewed catalog entities. EN/ZH requires current approved full-field translations. |
| Product family `/[locale]/products/tener` and family pages | FAIL | No family entity/route workflow in PIM or family detail template. |
| Product detail `/[locale]/products/[slug]` | PARTIAL | Server-rendered PIM detail route and real-field-only spec rendering; no reviewed published product exists, so no real detail page can pass. |
| Comparison `/[locale]/compare` | PARTIAL | PIM-backed comparison page with empty state; selection management and a 2–4 product comparison journey are incomplete. |
| Solutions index `/[locale]/solutions` | PARTIAL | Ukrainian page implemented; localized pages not approved. |
| Solution details `/[locale]/solutions/[slug]` | PARTIAL | Several Ukrainian solution pages (including solar+BESS, backup, peak shaving, arbitrage, microgrid, EV charging, wind) have content; engineering configuration, calculators, sourced claims, and translations are incomplete. |
| Industry index `/[locale]/industries` | PARTIAL | Ukrainian index implemented; localization and CMS integration absent. |
| Industry details `/[locale]/industries/[slug]` | PARTIAL | Several Ukrainian templates/pages exist; some requested sectors, sourced unique content, real case studies, and localization are missing. |
| Engineering hub `/[locale]/engineering` | PARTIAL | Ukrainian directory/status page; most linked engineering tools remain unavailable. |
| BESS Designer `/[locale]/bess-designer` | PARTIAL | Honest status page links to preliminary sizing; no six-step wizard, saved project, PDF, BOM, catalog selection, or customer workspace integration. |
| BESS calculator `/[locale]/engineering/bess-calculator` | PARTIAL | Deterministic versioned calculation persists input/result/locale snapshots. The saved ID passes into RFQ and mismatched values are rejected. It does not choose a product, include losses, or persist a customer project. |
| LCOS `/[locale]/engineering/lcos` | PARTIAL | Deterministic versioned LCOS API and connected input/result/sensitivity form. No chart, saved scenario, verified project financial inputs, or localized UX. |
| ROI `/[locale]/engineering/roi` | FAIL | Informational availability note only; no calculator. |
| Backup runtime `/[locale]/engineering/backup-runtime` | FAIL | Informational note only; no interactive calculator. |
| Solar+BESS calculator `/[locale]/engineering/solar-bess` | FAIL | No calculator. |
| Peak shaving calculator `/[locale]/engineering/peak-shaving` | FAIL | No calculator or interval-load visualization. |
| Diesel vs BESS `/[locale]/engineering/diesel-vs-bess` | FAIL | Informational note only; no comparison tool. |
| Knowledge hub `/[locale]/resources` | PARTIAL | Basic Ukrainian link hub; no CMS-backed search, article index, categories, or review metadata. |
| Guide `/[locale]/resources/guides/[slug]` | PARTIAL | One basic procurement guide exists; article CMS, source list, review workflow, rich blocks, and broader requested inventory are absent. |
| Glossary `/[locale]/resources/glossary` and terms | PARTIAL | Small hardcoded Ukrainian glossary subset; not managed through PIM/CMS/localization. |
| Document library `/[locale]/documents` | PARTIAL | API-backed list and empty/error states; requires document data/storage and working DB. |
| Document detail/download `/[locale]/documents/[slug]` | FAIL | No detail route, object storage integration, or working download flow. |
| Search `/[locale]/search` | PARTIAL | Server-backed product search and noindex page; no full-text multilingual search across documents, articles, glossary, solutions, or industries. |
| BESS price `/[locale]/bess-price` | PARTIAL | Honest no-price page; no verified dated price ranges or commercial costing service. |
| Regional pages `/[locale]/regions/[region]` | FAIL | No regional route/template or verified unique regional material. |
| RFQ `/[locale]/rfq` | PARTIAL | Connected form posts to API and provides validation/error/success states and URL attribution. Browser submission persisted to PostgreSQL and reached the worker/Mailpit test inbox. Attachment upload, end-to-end admin lifecycle, real CRM delivery, and production email remain incomplete. |
| Contact `/[locale]/contact` | PARTIAL | Informational page only; no working contact form or confirmed legal/contact details. |
| About `/[locale]/about` | PARTIAL | Honest operator/status content; real entity, team, terms, and business details are missing. |
| Partner landing `/[locale]/partners` | PARTIAL | Informational status and login links; no partner application workflow or partner portal. |
| Login `/[locale]/login` | PARTIAL | Password auth API and login UI exist; verified user provisioning, browser session journey, reset/verification flows and role portals remain incomplete. |
| Password reset `/[locale]/password-reset` | FAIL | No reset workflow/page. |
| Privacy and terms `/[locale]/privacy`, `/[locale]/terms` | FAIL | Pages state that legal text must be supplied and reviewed; these are not publishable legal policies. |
| 404 / 500 / maintenance | PARTIAL | Framework 404 exists; branded, verified error and maintenance UX with request reference has not been accepted. |

## Private customer and partner inventory

| Requested private area | Status | Blocker |
|---|---|---|
| Customer dashboard, projects, project detail, calculations, RFQs, RFQ detail, documents, profile | FAIL | No authenticated customer portal routes, ownership-filtered workflows, project persistence, or E2E tests. |
| Partner dashboard, deals, deal detail, deal registration, resources, RFQs, profile | FAIL | No tenant-isolated partner portal or deal registration lifecycle. |

## Admin inventory

| Requested admin area | Status | Blocker |
|---|---|---|
| Admin login/dashboard | PARTIAL | Protected role-aware Next admin entry, login/logout, API-backed readiness/RFQ/sync metrics and noindex metadata exist and pass Chromium/Firefox. User/role management and broad operational dashboards remain missing. |
| Products/editor/categories/families/revisions | PARTIAL | PIM listing, draft create/edit/archive, Sync source registration, revision history, source-cited fact editor and review→approval→publication path are implemented. API integration verifies facts against the exact source snapshot and exposes approved citations. No browser acceptance of the new editor, staged published-product revisions, family/spec definitions, translation or media workflow. |
| Sync sources/runs/review | PARTIAL | Admin lists registered sources and can enqueue sync and approve/reject pending changes with old/new values, evidence excerpt and source link. Source registry editing, full field diffs, source snapshot object storage, rollback, PDF extraction and verified live CATL acceptance remain incomplete. |
| Documents/RAG | FAIL | No object storage, processing pipeline, embeddings, retrieval, or citations. |
| CMS, translations, glossary, translation memory | FAIL | No review workflows, translation memory, glossary editor, or publish/outdated lifecycle. |
| SEO dashboard, semantic core, redirects | FAIL | No operational SEO management pages or verified analytics integration. |
| RFQ board/detail/customers/partners | PARTIAL | Admin RFQ queue reads persisted records and status changes retain history/audit; the browser flow passes. Detail timeline, tasks/notes, proposals, customer/company admin and configured CRM delivery remain missing. |
| Users/roles/sessions | FAIL | No admin UI for user and RBAC operations. |
| AI providers/models/usage | FAIL | No provider administration and no real failover acceptance. |
| Audit/system health | PARTIAL | Admin can browse audit events; overview reads API, PostgreSQL and Redis readiness. Metrics dashboards, traces, alerts and production observability integrations remain missing. |
| Queues/notifications/analytics/settings | FAIL | No completed operational dashboards or production integrations. |

## Release decision

**FINAL STATUS: NOT PRODUCTION READY.** A protected admin control center supports RFQ status, sync review, audit browsing and a human PIM publication workflow. Local API, migration and Chromium/Firefox checks cover the implemented path. Most requested public pages remain partial or absent; claim-level provenance, reviewed product data and legal operator details are unavailable; customer/partner portals, WebKit/Safari, the full device/browser matrix, visual regression, accessibility/performance, backup/restore, staging, domain deployment and rollback have not passed.

No production deployment to `catl.site` was made. There are no production credentials/configuration, and the current release gates do not pass.
