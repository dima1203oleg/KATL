CREATE TABLE IF NOT EXISTS pim_product_staged_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(64) NOT NULL REFERENCES pim_products(id) ON DELETE CASCADE,
  base_revision INTEGER NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','REVIEW','APPROVED','REJECTED','PUBLISHED','SUPERSEDED')),
  payload JSONB NOT NULL,
  source_snapshot_id UUID REFERENCES sync_snapshots(id) ON DELETE SET NULL,
  created_by_id VARCHAR(64) NOT NULL REFERENCES users(id),
  reviewer_id VARCHAR(64) REFERENCES users(id),
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pim_staged_revisions_product
  ON pim_product_staged_revisions(product_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pim_staged_revisions_one_open
  ON pim_product_staged_revisions(product_id)
  WHERE status IN ('DRAFT','REVIEW','APPROVED');

ALTER TABLE pim_product_revisions DROP CONSTRAINT IF EXISTS pim_product_revisions_event_check;
ALTER TABLE pim_product_revisions ADD CONSTRAINT pim_product_revisions_event_check
  CHECK (event IN ('CREATED','UPDATED','SUBMITTED','APPROVED','REJECTED','PUBLISHED','ARCHIVED','REVISION_PUBLISHED'));
