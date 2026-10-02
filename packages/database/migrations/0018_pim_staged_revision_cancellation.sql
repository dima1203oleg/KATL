ALTER TABLE pim_product_staged_revisions
  DROP CONSTRAINT IF EXISTS pim_product_staged_revisions_status_check;

ALTER TABLE pim_product_staged_revisions
  ADD CONSTRAINT pim_product_staged_revisions_status_check
  CHECK (status IN ('DRAFT','REVIEW','APPROVED','REJECTED','PUBLISHED','SUPERSEDED','CANCELLED'));
