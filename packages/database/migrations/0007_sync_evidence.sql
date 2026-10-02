ALTER TABLE sync_sources
  ADD COLUMN IF NOT EXISTS product_id VARCHAR(64) REFERENCES pim_products(id) ON DELETE SET NULL;

ALTER TABLE sync_snapshots
  ADD COLUMN IF NOT EXISTS http_status INTEGER,
  ADD COLUMN IF NOT EXISTS content_type VARCHAR(255),
  ADD COLUMN IF NOT EXISTS body_encoding VARCHAR(16) NOT NULL DEFAULT 'utf8',
  ADD COLUMN IF NOT EXISTS size_bytes BIGINT NOT NULL DEFAULT 0;

ALTER TABLE sync_changes
  ADD COLUMN IF NOT EXISTS snapshot_id UUID REFERENCES sync_snapshots(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS evidence_excerpt TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_sync_snapshot_source_hash
  ON sync_snapshots(source_id, content_hash);
