CREATE TABLE IF NOT EXISTS user_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_expiry
  ON user_sessions(user_id, expires_at DESC);

CREATE TABLE IF NOT EXISTS rfq_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id VARCHAR(64) NOT NULL REFERENCES rfq_records(id) ON DELETE CASCADE,
  old_status VARCHAR(32),
  new_status VARCHAR(32) NOT NULL,
  actor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfq_status_history_rfq
  ON rfq_status_history(rfq_id, created_at DESC);
