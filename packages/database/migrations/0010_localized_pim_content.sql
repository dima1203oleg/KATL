ALTER TABLE pim_product_translations
  ADD COLUMN IF NOT EXISTS specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS translation_status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS source_revision INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(128),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

ALTER TABLE pim_product_translations DROP CONSTRAINT IF EXISTS pim_translation_status_allowed;
ALTER TABLE pim_product_translations ADD CONSTRAINT pim_translation_status_allowed
  CHECK (translation_status IN ('SOURCE', 'DRAFT', 'AI_TRANSLATED', 'HUMAN_REVIEW', 'APPROVED', 'PUBLISHED', 'OUTDATED'));

CREATE INDEX IF NOT EXISTS idx_pim_translation_publication
  ON pim_product_translations(locale, translation_status, source_revision);
