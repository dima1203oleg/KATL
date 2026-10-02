-- Keep inherited/demo catalogue records out of public routes until reviewed.
UPDATE pim_products
SET status = 'DRAFT', updated_at = NOW()
WHERE status IN ('AVAILABLE', 'PRE_ORDER', 'DEVELOPMENT');

ALTER TABLE pim_products ALTER COLUMN status SET DEFAULT 'DRAFT';
ALTER TABLE pim_products ALTER COLUMN confidence SET DEFAULT 'UNVERIFIED';
ALTER TABLE pim_products DROP CONSTRAINT IF EXISTS pim_products_status_allowed;
ALTER TABLE pim_products ADD CONSTRAINT pim_products_status_allowed
  CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED'));

ALTER TABLE pim_products DROP CONSTRAINT IF EXISTS pim_products_publication_evidence;
ALTER TABLE pim_products ADD CONSTRAINT pim_products_publication_evidence
  CHECK (status <> 'PUBLISHED' OR (source_url IS NOT NULL AND verified_at IS NOT NULL AND verified_by IS NOT NULL));
