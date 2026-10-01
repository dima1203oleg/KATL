# ADR-005: CATL Sync Provenance & Mandatory Engineer Approval

## Status
Accepted (2026-10-01)

## Context
Industrial BESS products (such as CATL TENER with 9.008 MWh capacity) undergo frequent datasheet revisions, minor model variations, and regional certifications. Automatically publishing crawled specs could introduce erroneous electrical or mechanical data, leading to severe commercial and safety risks.

## Decision
1. All extracted data from CATL datasheets and websites must enter the system as `DETECTED` / `REVIEW_REQUIRED`.
2. Every specification point must maintain cryptographic provenance (`source_url`, `snapshot_hash`, `detected_at`).
3. Only a designated Chief Engineer or Admin can transition a change set to `APPROVED`.
4. The system maintains full snapshot history and provides instantaneous rollback functionality.

## Consequences
- 100% elimination of unverified automated spec publishing.
- Complete regulatory and engineering auditability.
