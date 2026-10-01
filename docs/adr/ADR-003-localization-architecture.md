# ADR-003: Provider-Agnostic Localization Architecture & BESS Glossary

## Status
Accepted (2026-10-01)

## Context
The KATL platform serves Ukrainian commercial customers, international EPC contractors, and CATL engineering teams. Technical terminology (e.g. LCOS, C-rate, grid-forming, round-trip efficiency) requires deterministic Ukrainian and English equivalents without hallucinations. Relying directly on external AI APIs for dynamic runtime translation causes inconsistency, latency, and vendor lock-in.

## Decision
1. Establish an independent **Localization Platform** module with Translation Memory (TM) and a curated BESS Glossary.
2. Store approved translations in persistent storage (`packages/database`).
3. Support locale-aware routing (`/uk/...`, `/en/...`, `/zh-cn/...`) with Ukrainian as the default locale.
4. Utilize the **AI Provider Gateway** solely for drafting translations, subject to technical human approval (`HUMAN_REVIEW` -> `APPROVED`).

## Consequences
- Guarantees zero runtime dependency on external AI services for standard page loads.
- Ensures exact terminology alignment across all public pages, datasheets, and engineering outputs.
