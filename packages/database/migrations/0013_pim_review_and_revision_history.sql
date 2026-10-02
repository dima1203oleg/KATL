CREATE TABLE IF NOT EXISTS pim_product_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(64) NOT NULL REFERENCES pim_products(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL,
  event VARCHAR(32) NOT NULL CHECK (event IN ('CREATED', 'UPDATED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED')),
  snapshot JSONB NOT NULL,
  actor VARCHAR(128) NOT NULL,
  note TEXT,
  source_snapshot_id UUID REFERENCES sync_snapshots(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_pim_product_revisions_product
  ON pim_product_revisions(product_id, revision DESC);

CREATE TABLE IF NOT EXISTS pim_product_review_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(64) NOT NULL REFERENCES pim_products(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL,
  source_snapshot_id UUID NOT NULL REFERENCES sync_snapshots(id),
  reviewer VARCHAR(128) NOT NULL,
  decision VARCHAR(16) NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED')),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pim_product_review_decisions_product
  ON pim_product_review_decisions(product_id, created_at DESC);
