-- Entity graph, source-backed facts, and governed query-to-page semantic core.
-- Candidate facts and search metrics are intentionally not seeded without evidence.

CREATE TABLE IF NOT EXISTS source_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_key VARCHAR(160) NOT NULL UNIQUE,
  publisher VARCHAR(255) NOT NULL,
  document_title TEXT NOT NULL,
  original_url TEXT NOT NULL,
  publication_date DATE,
  accessed_at TIMESTAMPTZ,
  document_version VARCHAR(128),
  language VARCHAR(16) NOT NULL,
  source_type VARCHAR(32) NOT NULL CHECK (source_type IN ('OFFICIAL_WEB', 'DATASHEET', 'MANUAL', 'CERTIFICATE', 'BROCHURE', 'REGULATION', 'STANDARD', 'OTHER')),
  verification_status VARCHAR(24) NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED', 'SUPERSEDED')),
  content_sha256 CHAR(64),
  object_key TEXT,
  verified_by VARCHAR(128),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (verification_status <> 'VERIFIED' OR (verified_by IS NOT NULL AND verified_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS knowledge_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_key VARCHAR(180) NOT NULL UNIQUE,
  entity_type VARCHAR(32) NOT NULL CHECK (entity_type IN ('MANUFACTURER', 'BRAND', 'PRODUCT_FAMILY', 'PRODUCT', 'CATEGORY', 'TECHNOLOGY', 'APPLICATION', 'INDUSTRY', 'COMPONENT', 'STANDARD', 'SERVICE', 'REGULATORY_TOPIC', 'CAPACITY_CLASS', 'POWER_CLASS')),
  canonical_name VARCHAR(255) NOT NULL,
  lifecycle_status VARCHAR(24) NOT NULL DEFAULT 'CANDIDATE' CHECK (lifecycle_status IN ('CANDIDATE', 'REVIEW', 'VERIFIED', 'ARCHIVED')),
  primary_source_id UUID REFERENCES source_documents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_entity_aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  locale VARCHAR(16) NOT NULL CHECK (locale IN ('uk-UA', 'en', 'zh-CN', 'ru')),
  alias TEXT NOT NULL,
  alias_type VARCHAR(24) NOT NULL DEFAULT 'SYNONYM' CHECK (alias_type IN ('PREFERRED', 'SYNONYM', 'ABBREVIATION', 'MODEL', 'SEARCH_VARIANT')),
  search_only BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (entity_id, locale, alias)
);

CREATE TABLE IF NOT EXISTS knowledge_entity_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  relationship VARCHAR(40) NOT NULL CHECK (relationship IN ('PART_OF', 'HAS_COMPONENT', 'USES_TECHNOLOGY', 'HAS_APPLICATION', 'USED_IN_INDUSTRY', 'COMPATIBLE_WITH', 'HAS_DOCUMENT', 'HAS_STANDARD', 'SUPERSEDES', 'RELATED_TO')),
  to_entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  source_id UUID REFERENCES source_documents(id) ON DELETE SET NULL,
  verification_status VARCHAR(24) NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED')),
  verified_by VARCHAR(128),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (from_entity_id <> to_entity_id),
  CHECK (verification_status <> 'VERIFIED' OR (source_id IS NOT NULL AND verified_by IS NOT NULL AND verified_at IS NOT NULL)),
  UNIQUE (from_entity_id, relationship, to_entity_id)
);

CREATE TABLE IF NOT EXISTS entity_facts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  predicate VARCHAR(160) NOT NULL,
  value JSONB NOT NULL,
  unit VARCHAR(48),
  valid_from DATE,
  valid_to DATE,
  source_id UUID NOT NULL REFERENCES source_documents(id) ON DELETE RESTRICT,
  source_locator VARCHAR(255),
  verification_status VARCHAR(24) NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'CONFLICT', 'REJECTED', 'SUPERSEDED')),
  confidence NUMERIC(5,4) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  last_checked_at TIMESTAMPTZ,
  verified_by VARCHAR(128),
  verified_at TIMESTAMPTZ,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  supersedes_fact_id UUID REFERENCES entity_facts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from),
  CHECK (verification_status <> 'VERIFIED' OR (verified_by IS NOT NULL AND verified_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_entity_facts_current ON entity_facts(entity_id, predicate, verification_status, valid_to);
CREATE INDEX IF NOT EXISTS idx_entity_relationships_from ON knowledge_entity_relationships(from_entity_id, relationship);

CREATE TABLE IF NOT EXISTS seo_page_registry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key VARCHAR(180) NOT NULL UNIQUE,
  locale VARCHAR(16) NOT NULL CHECK (locale IN ('uk-UA', 'en', 'zh-CN')),
  canonical_path TEXT NOT NULL CHECK (canonical_path LIKE '/%'),
  page_type VARCHAR(32) NOT NULL CHECK (page_type IN ('HOME', 'CATEGORY', 'PRODUCT', 'FAMILY', 'SOLUTION', 'INDUSTRY', 'TECHNOLOGY', 'COMPONENT', 'SERVICE', 'CALCULATOR', 'GUIDE', 'GLOSSARY', 'DOCUMENT', 'REGULATORY', 'CONTACT', 'RFQ', 'OTHER')),
  lifecycle_status VARCHAR(24) NOT NULL DEFAULT 'PLANNED' CHECK (lifecycle_status IN ('PLANNED', 'DRAFT', 'REVIEW', 'PUBLISHED', 'REDIRECTED', 'ARCHIVED')),
  index_policy VARCHAR(24) NOT NULL DEFAULT 'NOINDEX' CHECK (index_policy IN ('INDEX', 'NOINDEX', 'CANONICAL_PARENT', 'REDIRECT')),
  search_intent VARCHAR(32) CHECK (search_intent IN ('INFORMATIONAL', 'COMMERCIAL_INVESTIGATION', 'TRANSACTIONAL', 'ENGINEERING', 'COMPARISON', 'REGULATORY', 'NAVIGATIONAL')),
  primary_entity_id UUID REFERENCES knowledge_entities(id) ON DELETE SET NULL,
  canonical_parent_id UUID REFERENCES seo_page_registry(id) ON DELETE SET NULL,
  content_reviewed_by VARCHAR(128),
  last_content_review_at TIMESTAMPTZ,
  last_fact_review_at TIMESTAMPTZ,
  noindex_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale, canonical_path),
  CHECK (index_policy <> 'INDEX' OR (lifecycle_status = 'PUBLISHED' AND search_intent IS NOT NULL AND content_reviewed_by IS NOT NULL AND last_content_review_at IS NOT NULL)),
  CHECK (index_policy <> 'NOINDEX' OR noindex_reason IS NOT NULL OR lifecycle_status IN ('PLANNED', 'DRAFT', 'REVIEW'))
);

CREATE TABLE IF NOT EXISTS seo_semantic_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_key VARCHAR(180) NOT NULL UNIQUE,
  locale VARCHAR(16) NOT NULL CHECK (locale IN ('uk-UA', 'en', 'zh-CN')),
  cluster_name VARCHAR(255) NOT NULL,
  primary_query TEXT NOT NULL,
  intent VARCHAR(32) NOT NULL CHECK (intent IN ('INFORMATIONAL', 'COMMERCIAL_INVESTIGATION', 'TRANSACTIONAL', 'ENGINEERING', 'COMPARISON', 'REGULATORY', 'NAVIGATIONAL')),
  funnel_stage VARCHAR(8) NOT NULL CHECK (funnel_stage IN ('TOFU', 'MOFU', 'BOFU')),
  priority VARCHAR(4) NOT NULL CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  parent_cluster_id UUID REFERENCES seo_semantic_clusters(id) ON DELETE SET NULL,
  primary_page_id UUID REFERENCES seo_page_registry(id) ON DELETE SET NULL,
  demand_validated BOOLEAN NOT NULL DEFAULT FALSE,
  demand_source VARCHAR(80),
  demand_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (demand_validated = FALSE OR (demand_source IS NOT NULL AND demand_checked_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS seo_semantic_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_text TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  locale VARCHAR(16) NOT NULL CHECK (locale IN ('uk-UA', 'en', 'zh-CN', 'ru')),
  country_code CHAR(2) NOT NULL DEFAULT 'UA',
  query_role VARCHAR(24) NOT NULL CHECK (query_role IN ('PRIMARY', 'SECONDARY', 'SYNONYM', 'LONG_TAIL', 'OBSERVED')),
  intent VARCHAR(32) NOT NULL CHECK (intent IN ('INFORMATIONAL', 'COMMERCIAL_INVESTIGATION', 'TRANSACTIONAL', 'ENGINEERING', 'COMPARISON', 'REGULATORY', 'NAVIGATIONAL')),
  funnel_stage VARCHAR(8) CHECK (funnel_stage IN ('TOFU', 'MOFU', 'BOFU')),
  cluster_id UUID REFERENCES seo_semantic_clusters(id) ON DELETE SET NULL,
  target_page_id UUID REFERENCES seo_page_registry(id) ON DELETE SET NULL,
  target_entity_id UUID REFERENCES knowledge_entities(id) ON DELETE SET NULL,
  search_volume NUMERIC(12,2),
  volume_source VARCHAR(80),
  volume_checked_at TIMESTAMPTZ,
  difficulty_score NUMERIC(5,2) CHECK (difficulty_score IS NULL OR (difficulty_score >= 0 AND difficulty_score <= 100)),
  difficulty_source VARCHAR(80),
  difficulty_checked_at TIMESTAMPTZ,
  commercial_value_score NUMERIC(5,2) CHECK (commercial_value_score IS NULL OR (commercial_value_score >= 0 AND commercial_value_score <= 100)),
  commercial_value_source VARCHAR(80),
  commercial_value_checked_at TIMESTAMPTZ,
  serp_type VARCHAR(64),
  priority VARCHAR(4) CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  query_status VARCHAR(24) NOT NULL DEFAULT 'PLANNED' CHECK (query_status IN ('PLANNED', 'OBSERVED', 'MAPPED', 'EXCLUDED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale, normalized_query),
  CHECK (search_volume IS NULL OR (volume_source IS NOT NULL AND volume_checked_at IS NOT NULL)),
  CHECK (difficulty_score IS NULL OR (difficulty_source IS NOT NULL AND difficulty_checked_at IS NOT NULL)),
  CHECK (commercial_value_score IS NULL OR (commercial_value_source IS NOT NULL AND commercial_value_checked_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS seo_query_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_id UUID NOT NULL REFERENCES seo_semantic_queries(id) ON DELETE CASCADE,
  provider VARCHAR(24) NOT NULL CHECK (provider IN ('GSC', 'BING', 'KEYWORD_PLANNER', 'AHREFS', 'SEMRUSH', 'AI_CITATION')),
  observed_at DATE NOT NULL,
  impressions BIGINT,
  clicks BIGINT,
  ctr NUMERIC(8,6),
  average_position NUMERIC(8,3),
  citation_present BOOLEAN,
  cited_url TEXT,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (query_id, provider, observed_at)
);

CREATE TABLE IF NOT EXISTS seo_page_entities (
  page_id UUID NOT NULL REFERENCES seo_page_registry(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  entity_role VARCHAR(24) NOT NULL CHECK (entity_role IN ('PRIMARY', 'RELATED', 'ANSWERED', 'COMPARED', 'CITED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (page_id, entity_id, entity_role)
);

CREATE TABLE IF NOT EXISTS seo_query_exclusions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_pattern TEXT NOT NULL,
  locale VARCHAR(16) NOT NULL DEFAULT 'all' CHECK (locale IN ('all', 'uk-UA', 'en', 'zh-CN', 'ru')),
  match_type VARCHAR(16) NOT NULL CHECK (match_type IN ('EXACT', 'PHRASE', 'REGEX')),
  exclusion_scope VARCHAR(24) NOT NULL CHECK (exclusion_scope IN ('CONTENT', 'PAID_SEARCH', 'INTERNAL_SEARCH', 'ALL_ACQUISITION')),
  reason_code VARCHAR(64) NOT NULL,
  explanation TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (query_pattern, locale, match_type, exclusion_scope, reason_code)
);

CREATE INDEX IF NOT EXISTS idx_semantic_queries_cluster ON seo_semantic_queries(cluster_id, intent, priority);
CREATE INDEX IF NOT EXISTS idx_semantic_queries_target_page ON seo_semantic_queries(target_page_id);
CREATE INDEX IF NOT EXISTS idx_seo_pages_publication ON seo_page_registry(lifecycle_status, index_policy, locale);
CREATE INDEX IF NOT EXISTS idx_source_documents_verification ON source_documents(verification_status, source_type);
