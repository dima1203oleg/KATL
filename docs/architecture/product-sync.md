# CATL Product Sync Engine Architecture

## 1. Objective & Mandate
The **CATL Product Sync Engine** is an automated yet human-governed pipeline responsible for monitoring official CATL global datasheets, product web portals, press announcements, and certification registries to maintain up-to-date BESS technical specifications in the KATL PIM.

### Strict Architectural Invariant
**No automated ingestion or parser may publish or modify critical technical characteristics directly into production PIM without explicit engineer review and cryptographic provenance.**

---

## 2. Sync Pipeline Pipeline Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CATL Sync Architecture                          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │ CATL Source Registry  │ (Official URLs, PDFs, Portals)
                         └──────────┬────────────┘
                                    │ Scheduled Crawl / Webhook
                                    ▼
                         ┌───────────────────────┐
                         │ Fetcher / Crawler     │ (Playwright / Cheerio / PDF)
                         └──────────┬────────────┘
                                    │ Raw HTML / PDF Binary
                                    ▼
                         ┌───────────────────────┐
                         │ Source Snapshot Store │ (Immutable Hash & Timestamp)
                         └──────────┬────────────┘
                                    │ Extraction & Normalization
                                    ▼
                         ┌───────────────────────┐
                         │ Diff Engine           │ (Compares with Current PIM)
                         └──────────┬────────────┘
                                    │ Change Set Detected
                                    ▼
                         ┌───────────────────────┐
                         │   Engineer Review     │ (Status: REVIEW_REQUIRED)
                         │   Workspace UI        │
                         └──────────┬────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
              [ REJECTED ]                   [ APPROVED ]
         (Logged to Audit Store)                   │
                                                   ▼
                                         ┌───────────────────┐
                                         │ Production PIM    │
                                         │ (Version Bumped)  │
                                         └───────────────────┘
```

---

## 3. Core Components

### 3.1. Source Registry
Maintains monitored endpoints:
* Source URL / Document URI
* Source Type: `OFFICIAL_WEB`, `OFFICIAL_PDF`, `DATASHEET`, `CERTIFICATE`
* Polling Interval & Priority
* Content SHA256 Checksum

### 3.2. Snapshot Store
* Stores full raw payload with HTTP metadata and cryptographic checksum.
* Guarantees non-destructive auditability and complete historical rollbacks.

### 3.3. Diff & Anomaly Engine
* Compares incoming parsed attributes against active PIM data.
* Highlights:
  - Numerical variances (Capacity, Power, Voltage, Efficiency, Dimensions, Weight).
  - Safety and certification additions (e.g. UL 9540A, NFPA 855).
  - Discontinued / superseded products.

### 3.4. Rollback & Audit Trail
Every change record includes:
* `source_url`, `snapshot_id`
* `detected_at`, `approved_at`, `approved_by`
* `previous_value`, `new_value`
* Full rollback capability to any point in time.
