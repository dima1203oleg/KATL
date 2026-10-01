# Redis Architecture & Caching Strategy

## 1. Role of Redis in KATL Platform

Redis serves three primary purposes:
1. **Low-Latency Cache Layer**:
   - Cache serialized PIM product cards (`pim:product:<id>`, TTL: 1 hour).
   - Cache engineering calculation results for standard sizing scenarios (`calc:scenario:<hash>`, TTL: 24 hours).
   - Cache localization translations (`i18n:bundle:<locale>`, TTL: 6 hours).

2. **Job Queues (BullMQ / Distributed Task Processing)**:
   - `catl-sync-queue`: Scheduled scraping & HTTP polling of official CATL sources.
   - `lead-dispatch-queue`: Asynchronous delivery of RFQs to external CRM systems and email relays.
   - `report-generation-queue`: PDF/Excel datasheet and calculation export generation.

3. **Rate Limiting & Token Budgeting**:
   - AI Gateway usage metering per client/IP (`ai:ratelimit:<client_id>`, sliding window).
   - Daily token consumption counters to prevent runaway LLM costs.

## 2. Key Naming Convention
- `pim:product:{id}`
- `pim:catalog:filter:{hash}`
- `calc:bess:{hash}`
- `ai:tokens:daily:{date}`
- `queue:sync:{job_id}`
- `queue:rfq:{job_id}`
