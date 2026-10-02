# Sites design reference and canonical KATL implementation

The code in this repository is the canonical implementation. The separate ChatGPT Sites project is a published snapshot and does not automatically synchronize edits with GitHub.

On 2026-10-02, Sites version 13 was reviewed as the current visual reference. Its design is being integrated incrementally in the KATL Next.js app on the existing feature branch; it has not been merged to `main` yet. The Sites source was based on an older KATL commit, so its visual decisions are adapted onto the newer PIM-backed routes instead of replacing the repository. The user uses the Sites tab to explore visual design; it is a design reference, not a second implementation or a catalog editor.

## Imported

- CATL-branded responsive shell, typography, homepage, catalog and product detail presentation.
- Design reference images, visibly disclosed as concept illustrations.
- Catalog category/specification filters and product comparison selection, backed by published PIM records.
- Ukrainian, English and Simplified Chinese public shell and metadata.
- The existing root locale selection remains in place: trusted CDN country headers select Ukrainian for Ukraine and Chinese for China; saved preference and browser language determine other visits.

The catalog and comparison update was committed to the existing PR branch. `npm run lint`, `npm run build:web`, 15 unit tests, and the focused catalog/comparison E2E test in Chromium and Firefox passed locally. Local WebKit could not launch because this execution host lacks its system libraries; the GitHub Actions run is the cross-engine gate. The catalog currently shows an honest empty state until product records are reviewed and published in PIM.

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
