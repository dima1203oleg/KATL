CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(64) REFERENCES pim_products(id) ON DELETE SET NULL,
  document_type VARCHAR(32) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  version VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  source_url TEXT,
  object_key TEXT NOT NULL,
  checksum_sha256 CHAR(64) NOT NULL,
  mime_type VARCHAR(128) NOT NULL,
  size_bytes BIGINT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (object_key),
  UNIQUE (checksum_sha256)
);

CREATE INDEX IF NOT EXISTS idx_documents_product_locale
  ON documents(product_id, locale, document_type);
