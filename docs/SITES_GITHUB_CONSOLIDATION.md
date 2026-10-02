# Sites design import into the canonical GitHub repository

The code in this repository is the canonical implementation. The separate ChatGPT Sites project is a published snapshot and does not automatically synchronize edits with GitHub.

On 2026-10-02, the compatible public website design work from the Sites source was merged into the current `main` implementation. The Sites source was based on an older KATL commit, so its public pages were adapted onto the newer PIM-backed routes rather than replacing the repository.

## Imported

- CATL-branded responsive shell, typography, homepage and catalog styling.
- Design reference images, visibly disclosed as concept illustrations.
- Updated catalog, product comparison and product detail presentation.
- Ukrainian, English and Simplified Chinese public shell and metadata.
- The existing root locale selection remains in place: trusted CDN country headers select Ukrainian for Ukraine and Chinese for China; saved preference and browser language determine other visits.

## Preserved and checked

- The current KATL API, PIM, PostgreSQL, fact provenance and product publication workflow remain the source of catalog data.
- Design preview content is not inserted into PIM or the product API. Unverified example specifications were removed from the preview.
- CATL is presented as the manufacturer; KATL remains identified as the platform. No distributor or official representative status is claimed.
- Sites does not sync source changes to GitHub. Continue code edits from this repository; use the platform CMS for content when its publishing workflow is available.

## Limits

This import does not configure a GitHub-connected public deployment or change the currently published Sites deployment. A deployment from GitHub requires a configured production host and release pipeline. The local build and smoke checks do not certify the full site as production-ready.
