# Database Schema & PIM Model — KATL Platform

## Entity Relationship Overview

### 1. Products (PIM Source-of-Truth)
* `id` (VARCHAR PK): e.g. `catl-tener-h`
* `name` (VARCHAR): e.g. `CATL TENER H`
* `family` (VARCHAR): `TENER Series`, `EnerOne Series`
* `category` (VARCHAR): `Utility Scale`, `Commercial & Industrial`, `Sodium-ion`
* `short_desc` (TEXT)
* `highlight` (VARCHAR)
* `status` (ENUM): `AVAILABLE`, `PRE_ORDER`, `COMMERCIAL_2027`
* `type` (VARCHAR): `tener-h`, `tener-s`, `stack`, `enerone`, `sodium`
* `energy_specs` (JSONB): nominalCapacity, usableCapacity, nominalVoltage, voltageRange, cRate, efficiencyRoundTrip
* `cell_specs` (JSONB): chemistry, cellModel, cellCapacity, cycleLife, degradationFirstYears
* `mechanical_specs` (JSONB): dimensions, weight, containerStandard, protectionRating
* `thermal_specs` (JSONB): coolingMethod, tempControlAccuracy, operatingTempRange
* `safety_specs` (JSONB): fireSuppression, deflagrationProtection, gasDetection, certifications
* `compatibility` (JSONB): pcs, ems, transformer
* `provenance` (JSONB): sourceUrl, verifiedAt, verifiedBy, confidence, revision

### 2. RFQ Leads
* `id` (UUID PK)
* `company_name` (VARCHAR)
* `contact_person` (VARCHAR)
* `phone` (VARCHAR)
* `email` (VARCHAR)
* `location` (VARCHAR)
* `power_kw` (NUMERIC)
* `capacity_kwh` (NUMERIC)
* `selected_product` (VARCHAR)
* `use_case` (VARCHAR)
* `details` (TEXT)
* `status` (ENUM): `NEW`, `QUALIFICATION`, `ENGINEERING`, `PROPOSAL_SENT`, `WON`, `LOST`
* `created_at` (TIMESTAMP)

### 3. CATL Sync Snapshots & ChangeSets
* `snapshot_id` (UUID PK)
* `source_id` (VARCHAR)
* `url` (VARCHAR)
* `content_hash` (VARCHAR)
* `raw_data` (JSONB)
* `detected_changes` (JSONB)
* `review_status` (ENUM): `PENDING_REVIEW`, `APPROVED`, `REJECTED`
* `reviewed_by` (VARCHAR)
* `reviewed_at` (TIMESTAMP)

### 4. Calculations & Project Proposals
* `id` (UUID PK)
* `project_name` (VARCHAR)
* `customer_id` (VARCHAR)
* `solar_mw` (NUMERIC)
* `load_mw` (NUMERIC)
* `duration_hours` (NUMERIC)
* `recommended_product` (VARCHAR)
* `algorithm_version` (VARCHAR)
* `payback_years` (NUMERIC)
* `irr_percent` (NUMERIC)
* `bom_breakdown` (JSONB)
* `created_at` (TIMESTAMP)
