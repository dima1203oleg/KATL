CREATE TABLE IF NOT EXISTS bess_calculations (
  id VARCHAR(64) PRIMARY KEY,
  algorithm_version VARCHAR(64) NOT NULL,
  input_snapshot JSONB NOT NULL,
  result_snapshot JSONB NOT NULL,
  locale VARCHAR(10),
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bess_calculations_created_at
  ON bess_calculations(created_at DESC);

ALTER TABLE rfq_records
  ADD CONSTRAINT rfq_records_calculation_fk
  FOREIGN KEY (calculation_id) REFERENCES bess_calculations(id) NOT VALID;
