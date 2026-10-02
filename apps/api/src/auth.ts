import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { getDatabasePool } from '../../../packages/database/src/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string | null;
}

const SESSION_TTL_HOURS = 12;

export function hashPassword(password: string): string {
  if (password.length < 12 || password.length > 256) {
    throw new Error('Password must be between 12 and 256 characters');
  }
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
  const [algorithm, salt, expected] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !expected) return false;
  const expectedBytes = Buffer.from(expected, 'hex');
  const actualBytes = scryptSync(password, salt, 64);
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}

export function sessionTokenFromRequest(req: Request): string {
  const authorization = req.headers.authorization || '';
  if (authorization.startsWith('Bearer ')) return authorization.slice(7).trim();
  const token = (req.headers.cookie || '').match(/(?:^|;\s*)katl_session=([^;]+)/)?.[1];
  if (!token) return '';
  try {
    return decodeURIComponent(token);
  } catch {
    return '';
  }
}

export async function authenticate(email: string, password: string): Promise<{ user: AuthenticatedUser; token: string } | null> {
  const pool = getDatabasePool();
  const result = await pool.query(
    `SELECT id, email, name, role, company, password_hash
     FROM users WHERE lower(email) = lower($1) LIMIT 1`,
    [email.trim()]
  );
  const row = result.rows[0];
  if (!row || !row.password_hash || !verifyPasswordHash(password, row.password_hash)) return null;

  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const poolClient = await pool.connect();
  try {
    await poolClient.query('BEGIN');
    await poolClient.query(
      `INSERT INTO user_sessions (token_hash, user_id, expires_at)
       VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 hour'))`,
      [tokenHash, row.id, SESSION_TTL_HOURS]
    );
    await poolClient.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.id]);
    await poolClient.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1, 'USER_LOGIN', 'User', $2, $3, jsonb_build_object('role', $4::text))`,
      [`AUD-${randomBytes(12).toString('hex')}`, row.id, row.name, row.role]
    );
    await poolClient.query('COMMIT');
  } catch (error) {
    await poolClient.query('ROLLBACK');
    throw error;
  } finally {
    poolClient.release();
  }

  return {
    user: { id: row.id, email: row.email, name: row.name, role: row.role, company: row.company },
    token,
  };
}

export async function resolveSession(token: string): Promise<AuthenticatedUser | null> {
  if (!token) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const { rows } = await getDatabasePool().query(
    `SELECT u.id, u.email, u.name, u.role, u.company
     FROM user_sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

export async function revokeSession(token: string): Promise<void> {
  if (!token) return;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await getDatabasePool().query(
    'UPDATE user_sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL',
    [tokenHash]
  );
}
