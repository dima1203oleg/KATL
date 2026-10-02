CREATE TABLE IF NOT EXISTS platform_outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  queue_job_id VARCHAR(128),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  queued_at TIMESTAMPTZ,
  CONSTRAINT platform_outbox_status_allowed CHECK (status IN ('PENDING', 'QUEUED', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_platform_outbox_pending
  ON platform_outbox(created_at) WHERE status = 'PENDING';
