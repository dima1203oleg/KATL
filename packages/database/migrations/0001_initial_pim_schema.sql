-- =============================================================================
-- Migration 0001: Initial Relational PIM and Platform Schema for KATL BESS
-- Compatible with PostgreSQL 14+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PIM Products (Master Catalog)
CREATE TABLE IF NOT EXISTS pim_products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    family VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_desc TEXT NOT NULL,
    highlight TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
    product_type VARCHAR(64) NOT NULL,
    source_url TEXT,
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    confidence VARCHAR(32) DEFAULT 'OFFICIAL_CATL',
    revision INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Structured Specifications
CREATE TABLE IF NOT EXISTS pim_specifications (
    product_id VARCHAR(64) PRIMARY KEY REFERENCES pim_products(id) ON DELETE CASCADE,
    energy_specs JSONB NOT NULL,
    cell_specs JSONB NOT NULL,
    mechanical_specs JSONB NOT NULL,
    thermal_specs JSONB NOT NULL,
    safety_specs JSONB NOT NULL,
    compatibility JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Localized Content
CREATE TABLE IF NOT EXISTS pim_product_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(64) NOT NULL REFERENCES pim_products(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(255),
    short_desc TEXT,
    highlight TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_locale UNIQUE (product_id, locale)
);

-- 4. RFQ (Request for Quotation) Leads
CREATE TABLE IF NOT EXISTS rfq_records (
    id VARCHAR(64) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    power_kw NUMERIC(10, 2),
    capacity_kwh NUMERIC(10, 2),
    selected_series VARCHAR(128) NOT NULL,
    use_case VARCHAR(128) NOT NULL,
    details TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW',
    utm_source VARCHAR(128),
    utm_campaign VARCHAR(128),
    notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CATL Product Sync: Source Registry
CREATE TABLE IF NOT EXISTS sync_sources (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    source_type VARCHAR(32) NOT NULL DEFAULT 'OFFICIAL_WEB',
    poll_interval_minutes INTEGER NOT NULL DEFAULT 60,
    last_checked TIMESTAMPTZ,
    last_hash VARCHAR(128),
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CATL Product Sync: Raw Snapshots
CREATE TABLE IF NOT EXISTS sync_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(64) NOT NULL REFERENCES sync_sources(id) ON DELETE CASCADE,
    content_hash VARCHAR(128) NOT NULL,
    raw_payload TEXT,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CATL Product Sync: Detected Changes (Requires Engineering Approval)
CREATE TABLE IF NOT EXISTS sync_changes (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES pim_products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    field VARCHAR(128) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    source_url TEXT NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confidence VARCHAR(32) NOT NULL DEFAULT 'HIGH',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW',
    reviewed_by VARCHAR(128),
    reviewed_at TIMESTAMPTZ
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(128) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    actor VARCHAR(128) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    details JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pim_products_family ON pim_products(family);
CREATE INDEX IF NOT EXISTS idx_pim_products_category ON pim_products(category);
CREATE INDEX IF NOT EXISTS idx_rfq_records_status ON rfq_records(status);
CREATE INDEX IF NOT EXISTS idx_rfq_records_created_at ON rfq_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_changes_status ON sync_changes(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
