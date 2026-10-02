ALTER TABLE pim_specifications
  ADD COLUMN IF NOT EXISTS specification_revision INTEGER NOT NULL DEFAULT 1;

ALTER TABLE sync_snapshots
  ADD COLUMN IF NOT EXISTS source_url TEXT;

ALTER TABLE pim_product_review_decisions
  ADD COLUMN IF NOT EXISTS reviewer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS pim_product_fact_sources (
  product_id VARCHAR(64) NOT NULL REFERENCES pim_products(id) ON DELETE CASCADE,
  specification_revision INTEGER NOT NULL,
  field_path VARCHAR(512) NOT NULL,
  value_snapshot JSONB NOT NULL,
  source_snapshot_id UUID NOT NULL REFERENCES sync_snapshots(id),
  page_section VARCHAR(255) NOT NULL,
  evidence_excerpt TEXT NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  verified_by_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, specification_revision, field_path),
  CHECK ((status = 'VERIFIED') = (verified_by_id IS NOT NULL AND verified_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_pim_product_fact_sources_snapshot
  ON pim_product_fact_sources(source_snapshot_id);
