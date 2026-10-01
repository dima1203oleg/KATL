# KATL Platform API Specification (v1)

## Overview
The KATL backend provides a typed RESTful API versioned under `/api/v1/*`. All responses follow a standardized JSON envelope structure.

---

## 1. Response & Error Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-01T12:00:00.000Z",
    "version": "v1.0.0"
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Product with slug 'catl-tener-x' was not found in PIM.",
    "requestId": "req-98421092"
  }
}
```

---

## 2. API Route Groups

| Endpoint Group | Description | Status |
|---|---|---|
| `/api/v1/health` | Service liveness, readiness, latency, DB connection status | **LIVE** |
| `/api/v1/products` | PIM catalog, product detail by slug, technical specifications | **LIVE** |
| `/api/v1/calculations` | Sizing calculation, LCOS simulation, BOM generation, SLD export | **LIVE** |
| `/api/v1/rfq` | Commercial lead submission, qualification, status updates | **LIVE** |
| `/api/v1/sync` | Source registry, snapshots, diff engine, review approval | **LIVE** |
| `/api/v1/ai/gateway` | AI task execution (`advisor_chat`, `extract_specs`, `translate`) | **LIVE** |
| `/api/v1/localization`| Locales registry, translation memory, glossary terms | **LIVE** |
| `/api/v1/seo` | Sitemap generation, meta tags, schema.org definitions | **PLANNED** |
| `/api/v1/customers` | Customer project configurations and RFQ tracking | **PLANNED (PHASE 4/6)** |
| `/api/v1/partners` | Partner deal registration and protected collateral | **PLANNED (PHASE 4/6)** |
