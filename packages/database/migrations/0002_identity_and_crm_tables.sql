-- =============================================================================
-- Migration 0002: Identity, CRM, Translation Memory, and FinOps Schema
-- =============================================================================

-- 1. Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'VIEWER',
    company VARCHAR(255),
    password_hash VARCHAR(255),
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 2. Customer Projects
CREATE TABLE IF NOT EXISTS customer_projects (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    power_kw NUMERIC(10, 2) NOT NULL,
    capacity_kwh NUMERIC(10, 2) NOT NULL,
    product_slug VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'ENGINEERING_REVIEW',
    lcos_usd_per_kwh NUMERIC(6, 4),
    capex_usd NUMERIC(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Partner Deals
CREATE TABLE IF NOT EXISTS partner_deals (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_company_name VARCHAR(255) NOT NULL,
    client_company_name VARCHAR(255) NOT NULL,
    deal_size_mwh NUMERIC(10, 2) NOT NULL,
    estimated_volume_usd NUMERIC(12, 2) NOT NULL,
    stage VARCHAR(64) NOT NULL DEFAULT 'DEAL_REGISTRATION',
    product_interest VARCHAR(128) NOT NULL,
    commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 3.0,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Translation Memory & BESS Glossary
CREATE TABLE IF NOT EXISTS glossary_terms (
    key VARCHAR(128) PRIMARY KEY,
    term_uk TEXT NOT NULL,
    term_en TEXT NOT NULL,
    term_zh_cn TEXT NOT NULL,
    definition TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS translation_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_hash VARCHAR(128) NOT NULL,
    source_locale VARCHAR(10) NOT NULL,
    target_locale VARCHAR(10) NOT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AI Provider FinOps Accounting
CREATE TABLE IF NOT EXISTS ai_provider_requests (
    id VARCHAR(64) PRIMARY KEY,
    task_type VARCHAR(64) NOT NULL,
    provider_id VARCHAR(64) NOT NULL,
    model_name VARCHAR(128) NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_customer_projects_user ON customer_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_deals_partner ON partner_deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_tm_source_hash ON translation_memory(source_hash);
CREATE INDEX IF NOT EXISTS idx_ai_requests_task ON ai_provider_requests(task_type, created_at DESC);
