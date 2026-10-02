# Sites design reference and canonical KATL implementation

The code in this repository is the canonical implementation. The separate ChatGPT Sites project is a published snapshot and does not automatically synchronize edits with GitHub.

On 2026-10-02, Sites version 13 was reviewed as the current visual reference. Its design is being integrated incrementally in the KATL Next.js app on the existing feature branch; it has not been merged to `main` yet. The Sites source was based on an older KATL commit, so its visual decisions are adapted onto the newer PIM-backed routes instead of replacing the repository. The user uses the Sites tab to explore visual design; it is a design reference, not a second implementation or a catalog editor.

## Imported

- CATL-branded responsive shell, typography, homepage, catalog and product detail presentation.
- Design reference images, visibly disclosed as concept illustrations.
- Catalog category/specification filters and product comparison selection, backed by published PIM records.
- Ukrainian, English and Simplified Chinese public shell and metadata.
- The existing root locale selection remains in place: trusted CDN country headers select Ukrainian for Ukraine and Chinese for China; saved preference and browser language determine other visits.

The catalog and comparison update is on the existing PR branch. It keeps filters and comparison selection connected to published PIM data. Current test evidence for this branch is maintained in `docs/implementation/PAGE_ACCEPTANCE_REPORT.md`; the current branch has not yet passed GitHub Actions. The catalog remains honestly empty until products are sourced, reviewed, and published in PIM.

## Preserved and checked

- The current KATL API, PIM, PostgreSQL, fact provenance and product publication workflow remain the source of catalog data.
- Design preview content is not inserted into PIM or the product API. Unverified example specifications were removed from the preview.
- CATL is presented as the manufacturer; KATL remains identified as the platform. No distributor or official representative status is claimed.
- Sites does not sync source changes to GitHub. Continue implementation in this repository and treat later Sites updates as visual references to review and adapt.

## Design-reference handoff contract

When the Sites design changes, bring over only approved visual decisions: layout, typography, color, spacing, responsive behavior, and interaction patterns. Implement them as reusable components and design tokens within `apps/web`; keep route composition in App Router pages and shared business rules in the relevant packages and API modules.

Do not copy product records, specifications, availability, certifications, source claims, or catalog structure from a visual mockup into production. The public catalog reads published product records through `apps/web/src/lib/pim/pimRepository.ts` from the canonical API/PIM. PIM and PostgreSQL remain the source of truth; mockup text and imagery are never product evidence.

For each design update, review the reference, map changes to existing modules, implement the compatible UI changes in GitHub, and verify that the UI still consumes the same PIM/API data and preserves localization, accessibility, and responsive behavior. This is a deliberate design-to-code review, not automatic synchronization.

## Limits

This import does not configure a GitHub-connected public deployment or change the currently published Sites deployment. A deployment from GitHub requires a configured production host and release pipeline. The local build and smoke checks do not certify the full site as production-ready.

## Latest KATL handoff — 2026-10-02

**Sites reference / KATL routes:** the last reviewed Sites version remains the visual reference for the existing home, catalog, product detail, and comparison direction. This work did not add new visual sections from Sites; no new Sites design input was provided. The Next.js catalog and comparison remain backed by published PIM records and retain an empty state when there are no approved products.

**KATL functional work:** added cancellation of an unsubmitted staged PIM revision. The creator can cancel their own draft; an administrator can cancel any draft. API and audit records keep the action attributable, cancellation releases the open revision slot, and the published product is unchanged. The admin control now exposes this action with confirmation and honest API error handling.

**Changed files:** `packages/database/migrations/0018_pim_staged_revision_cancellation.sql`, `apps/api/src/app.ts`, `apps/web/src/components/admin/AdminWorkspace.tsx`, `apps/web/src/components/admin/PimManager.tsx`, `playwright.config.ts`, `tests/integration/api.test.ts`, `tests/e2e/public.spec.ts`, plus the readiness and acceptance reports.

**Verification:** fresh isolated PostgreSQL migrations `0001`–`0018` PASS; `npm run lint` PASS; `npm test` 23/23 PASS; `npm run build` PASS; Playwright 24/24 PASS across Chromium and Firefox, including the cancellation flow. Current GitHub run `37039328477` passed migration, unit/integration, build, container and security steps and 33 browser checks; three retries hit an ambiguous selector in an older PIM draft test, now fixed with an exact accessible-name locator. The affected admin/cancellation tests pass in both local engines with four workers; full CI rerun is pending. Staging, production, backup/restore and physical-device checks remain pending.

**Remaining differences / blockers:** no human-reviewed CATL product is published, so the catalog and product detail pages have no real product records. The Sites reference imagery is conceptual and its technical metrics, stock, certificates, and claims are not production data. No new visual differences were reconciled in this stage. CMS, full locale translation, partner/customer portals, PDF evidence extraction, full staged review/publish browser journey, and deployment gates remain incomplete.

**Next concrete step:** obtain and review an official CATL product source/datasheet through the PIM source workflow, create a sourced draft, and have an independent engineer review it. After approval, verify the real product in catalog/detail/compare. For the next design handoff, provide the changed Sites version and identify its target page; continue with one page at a time.
