/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Canonical Modular REST API for KATL Platform
 */

import express, { Request, Response, NextFunction } from 'express';
import { randomUUID, timingSafeEqual } from 'crypto';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { getDatabasePool } from '../../../packages/database/src/client';
import { getRedisClient } from '../../../packages/redis/src/index';
import { authenticate, resolveSession, revokeSession, sessionTokenFromRequest } from './auth';
import { aiTaskSchema, bessSizingSchema, createRfqSchema, lcosSchema, pimDraftSchema, rfqStatusSchema } from './validation';
import { evidenceContainsFactValue, extractTechnicalFacts, normalizeSourceEvidence, sameJsonValue } from './pim-fact-provenance';
import { QUEUE_NAMES, getPlatformQueueStats } from '../../../packages/queue/src/index';
import { aiGateway } from '../../../src/server/ai-gateway/aiGateway';
import { BessEngineeringCalculator, calculateLcos } from '../../../packages/calculations/src/index';

const app = express();

const allowedOrigins = new Set(
  (process.env.WEB_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-CRM-Token'],
}));
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
const rfqLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
const calculationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
const aiLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });

// -------------------------------------------------------------
// Global Security & Observability Headers Middleware
// -------------------------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  const suppliedRequestId = req.headers['x-request-id'];
  const reqId = typeof suppliedRequestId === 'string' && /^[A-Za-z0-9._-]{1,64}$/.test(suppliedRequestId)
    ? suppliedRequestId
    : randomUUID();
  res.setHeader('X-Request-Id', reqId);
  (req as any).requestId = reqId;
  next();
});

const requireRoles = (...roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const token = sessionTokenFromRequest(req);
  let user;
  try {
    user = await resolveSession(token);
  } catch {
    return res.status(503).json({ error: 'AUTH_SERVICE_UNAVAILABLE' });
  }
  if (!user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Потрібна авторизація.' });
  }
  if (!roles.includes(user.role)) {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Недостатньо прав для цієї операції.' });
  }
  (req as any).authUser = user;
  next();
};

const publicUser = (user: any) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  company: user.company,
});

const productFromRow = (row: any) => ({
  id: row.id,
  name: row.localized_name || row.name,
  family: row.family,
  category: row.category,
  shortDesc: row.localized_short_desc || row.short_desc,
  highlight: row.localized_highlight || row.highlight,
  status: row.status,
  type: row.product_type,
  energySpecs: row.localized_specs?.energySpecs || row.energy_specs,
  cellSpecs: row.localized_specs?.cellSpecs || row.cell_specs,
  mechanicalSpecs: row.localized_specs?.mechanicalSpecs || row.mechanical_specs,
  thermalSpecs: row.localized_specs?.thermalSpecs || row.thermal_specs,
  safetySpecs: row.localized_specs?.safetySpecs || row.safety_specs,
  compatibility: row.localized_specs?.compatibility || row.compatibility,
  provenance: {
    sourceUrl: row.source_url || '',
    verifiedAt: row.verified_at || '',
    verifiedBy: row.verified_by || '',
    confidence: row.confidence || 'UNVERIFIED',
    revision: row.revision || 1,
    lastUpdated: row.updated_at || '',
    facts: row.verified_fact_sources || {},
  },
});

async function recordPimRevision(client: any, productId: string, event: string, actor: string, note: string | null = null, sourceSnapshotId: string | null = null) {
  const { rows } = await client.query(
    `SELECT p.*, to_jsonb(s) AS specifications, COALESCE(f.data,'{}'::jsonb) AS fact_sources FROM pim_products p
     LEFT JOIN pim_specifications s ON s.product_id = p.id
     LEFT JOIN LATERAL (
       SELECT jsonb_object_agg(field_path,jsonb_build_object('pageSection',page_section,'excerpt',evidence_excerpt,'status',status,'sourceSnapshotId',source_snapshot_id)) AS data
       FROM pim_product_fact_sources WHERE product_id=p.id AND specification_revision=s.specification_revision
     ) f ON true
     WHERE p.id = $1`,
    [productId]
  );
  const product = rows[0];
  if (!product) throw new Error('PRODUCT_NOT_FOUND');
  await client.query(
    `INSERT INTO pim_product_revisions (product_id, revision, event, snapshot, actor, note, source_snapshot_id)
     VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7)`,
    [productId, product.revision, event, JSON.stringify(product), actor, note, sourceSnapshotId]
  );
}

const SPECIFICATION_COLUMNS = {
  energySpecs: 'energy_specs', cellSpecs: 'cell_specs', mechanicalSpecs: 'mechanical_specs',
  thermalSpecs: 'thermal_specs', safetySpecs: 'safety_specs', compatibility: 'compatibility',
} as const;

function factsFromPimInput(input: Record<string, any>) {
  const groups = Object.fromEntries(Object.entries(SPECIFICATION_COLUMNS).map(([key, column]) => [column, input[key] ?? input[column] ?? {}]));
  return extractTechnicalFacts(groups);
}

async function storePimFactSources(client: any, productId: string, specRevision: number, input: Record<string, any>) {
  const factSources = input.factSources || {};
  const facts = factsFromPimInput(input);
  const factByPath = new Map(facts.map((fact) => [fact.path, fact]));
  const submittedPaths = Object.keys(factSources);
  const unknownPaths = submittedPaths.filter((path) => !factByPath.has(path));
  if (unknownPaths.length) return { error: 'FACT_PROVENANCE_UNKNOWN_FIELD', paths: unknownPaths.slice(0, 50) };
  if (!submittedPaths.length) return { facts, saved: 0, error: null };

  const snapshot = await client.query(
    `SELECT ss.id,ss.raw_payload,ss.body_encoding,ss.source_url
     FROM sync_sources src JOIN sync_snapshots ss ON ss.source_id=src.id
     WHERE src.product_id=$1 AND src.enabled=true AND src.url=$2 AND ss.source_url=$2 AND ss.http_status BETWEEN 200 AND 299
     ORDER BY ss.captured_at DESC LIMIT 1`,
    [productId, input.sourceUrl]
  );
  if (!snapshot.rowCount) return { error: 'FACT_SOURCE_SNAPSHOT_REQUIRED', paths: submittedPaths.slice(0, 50) };
  const source = snapshot.rows[0];
  if (source.body_encoding !== 'utf8' || typeof source.raw_payload !== 'string') {
    return { error: 'FACT_SOURCE_TEXT_UNAVAILABLE', paths: submittedPaths.slice(0, 50) };
  }
  const sourceText = normalizeSourceEvidence(source.raw_payload);
  const invalidPaths: string[] = [];
  for (const path of submittedPaths) {
    const fact = factByPath.get(path)!;
    const evidence = factSources[path];
    const excerpt = String(evidence.excerpt || '').trim();
    const normalizedExcerpt = normalizeSourceEvidence(excerpt);
    if (normalizedExcerpt.length < 5 || !sourceText.includes(normalizedExcerpt) || !evidenceContainsFactValue(excerpt, fact.value)) invalidPaths.push(path);
  }
  if (invalidPaths.length) return { error: 'FACT_PROVENANCE_EVIDENCE_MISMATCH', paths: invalidPaths.slice(0, 50) };

  for (const path of submittedPaths) {
    const fact = factByPath.get(path)!;
    const evidence = factSources[path];
    await client.query(
      `INSERT INTO pim_product_fact_sources (product_id,specification_revision,field_path,value_snapshot,source_snapshot_id,page_section,evidence_excerpt,status,verified_by_id,verified_at)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,'PENDING',NULL,NULL)`,
      [productId,specRevision,path,JSON.stringify(fact.value),source.id,evidence.pageSection.trim(),evidence.excerpt.trim()]
    );
  }
  return { facts, saved: submittedPaths.length, error: null };
}

async function checkPimFactCoverage(client: any, productId: string, specRevision: number, input: Record<string, any>, snapshotId: string, requireVerifiedBy?: string) {
  const expected = factsFromPimInput(input);
  const rows = await client.query(
    `SELECT field_path,value_snapshot,source_snapshot_id,status,verified_by_id
     FROM pim_product_fact_sources WHERE product_id=$1 AND specification_revision=$2`,
    [productId,specRevision]
  );
  const byPath = new Map(rows.rows.map((row: any) => [row.field_path,row]));
  const missing: string[] = [];
  const stale: string[] = [];
  for (const fact of expected) {
    const row: any = byPath.get(fact.path);
    if (!row) { missing.push(fact.path); continue; }
    if (!sameJsonValue(row.value_snapshot,fact.value) || row.source_snapshot_id !== snapshotId
      || (requireVerifiedBy && (row.status !== 'VERIFIED' || row.verified_by_id !== requireVerifiedBy))) stale.push(fact.path);
  }
  return { total: expected.length, missing, stale };
}

function sendFactProvenanceError(res: Response, result: { error: string; paths: string[] }) {
  const messages: Record<string,string> = {
    FACT_PROVENANCE_UNKNOWN_FIELD: 'Джерело вказане для характеристики, якої немає в цій картці.',
    FACT_SOURCE_SNAPSHOT_REQUIRED: 'Спершу отримайте актуальний знімок офіційної сторінки CATL.',
    FACT_SOURCE_TEXT_UNAVAILABLE: 'Для цього PDF або джерела ще немає текстового знімка для перевірки цитат.',
    FACT_PROVENANCE_EVIDENCE_MISMATCH: 'Цитату не знайдено у знімку CATL або в ній немає значення характеристики.',
  };
  return res.status(422).json({ error: result.error, message: messages[result.error] || 'Не вдалося перевірити джерело характеристики.', paths: result.paths });
}

const PRODUCT_SELECT = `SELECT p.*, s.energy_specs, s.cell_specs, s.mechanical_specs,
  s.thermal_specs, s.safety_specs, s.compatibility,
  COALESCE(facts.data,'{}'::jsonb) AS verified_fact_sources,
  t.name AS localized_name, t.short_desc AS localized_short_desc, t.highlight AS localized_highlight,
  t.specifications AS localized_specs, t.translation_status, t.source_revision
  FROM pim_products p JOIN pim_specifications s ON s.product_id = p.id
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(f.field_path,jsonb_build_object('sourceUrl',ss.source_url,'pageSection',f.page_section,'excerpt',f.evidence_excerpt,'verifiedAt',f.verified_at,'verifiedBy',u.name)) AS data
    FROM pim_product_fact_sources f JOIN sync_snapshots ss ON ss.id=f.source_snapshot_id
    LEFT JOIN users u ON u.id=f.verified_by_id
    WHERE f.product_id=p.id AND f.specification_revision=s.specification_revision AND f.status='VERIFIED'
  ) facts ON true
  LEFT JOIN pim_product_translations t ON t.product_id = p.id AND t.locale = $1`;

const canonicalLocale = (value: unknown) => {
  const locale = String(value || 'uk-UA').toLowerCase();
  return locale === 'zh-cn' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA';
};

async function reviewSyncChange(changeId: string, actor: any, decision: 'APPROVED' | 'REJECTED') {
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'SELECT c.*, p.name, p.short_desc, p.status AS product_status FROM sync_changes c JOIN pim_products p ON p.id = c.product_id WHERE c.id = $1 FOR UPDATE OF c, p',
      [changeId]
    );
    const change = rows[0];
    if (!change) {
      await client.query('ROLLBACK');
      return { status: 'NOT_FOUND' as const };
    }
    if (change.status !== 'PENDING_REVIEW') {
      await client.query('ROLLBACK');
      return { status: 'CONFLICT' as const };
    }
    if (decision === 'APPROVED') {
      if (change.product_status === 'PUBLISHED') {
        await client.query('ROLLBACK');
        return { status: 'PUBLISHED_PRODUCT_REQUIRES_REVISION' as const };
      }
      const columns: Record<string, string> = { name: 'name', short_desc: 'short_desc' };
      const column = columns[change.field];
      if (!column) {
        await client.query('ROLLBACK');
        return { status: 'UNSUPPORTED_FIELD' as const };
      }
      if (change[column] !== change.old_value) {
        await client.query('ROLLBACK');
        return { status: 'STALE' as const };
      }
      const newValue = typeof change.new_value === 'string' ? change.new_value : JSON.stringify(change.new_value);
      await client.query(
        `UPDATE pim_products SET ${column} = $1, source_url = $2, verified_at = NOW(), verified_by = $3, confidence = 'OFFICIAL_CATL', revision = revision + 1, updated_at = NOW() WHERE id = $4`,
        [newValue, change.source_url, actor.name, change.product_id]
      );
      await recordPimRevision(client, change.product_id, 'UPDATED', actor.name, `CATL Sync approved: ${change.field}`, change.snapshot_id || null);
    }
    await client.query(
      'UPDATE sync_changes SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE id = $3',
      [decision, actor.name, changeId]
    );
    await client.query(
      'INSERT INTO audit_logs (id, action, entity, entity_id, actor, details) VALUES ($1,$2,\'PIM\',$3,$4,jsonb_build_object(\'field\',$5::text,\'decision\',$6::text))',
      [`AUD-${randomUUID()}`, `SYNC_CHANGE_${decision}`, change.product_id, actor.name, change.field, decision]
    );
    await client.query('COMMIT');
    return { status: 'OK' as const, productId: change.product_id, field: change.field };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// -------------------------------------------------------------
// 1. System Health & Observability Endpoints
// -------------------------------------------------------------
app.get(['/health/live', '/api/v1/health/live'], (req: Request, res: Response) => {
  res.json({
    status: 'LIVE',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get(['/health/ready', '/api/v1/health/ready'], async (_req: Request, res: Response) => {
  try {
    const pool = getDatabasePool();
    const redis = getRedisClient();
    const [databaseResult] = await Promise.all([pool.query('SELECT COUNT(*)::int AS count FROM pim_products'), redis.ping()]);
    res.json({
      status: 'READY',
      database: 'CONNECTED',
      redis: 'CONNECTED',
      productsInPim: databaseResult.rows[0]?.count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({ status: 'NOT_READY', database: 'UNAVAILABLE', timestamp: new Date().toISOString() });
  }
});

app.get(['/health', '/api/v1/health'], async (_req: Request, res: Response) => {
  try {
    const pool = getDatabasePool();
    const redis = getRedisClient();
    const [products, rfqs] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM pim_products'),
      pool.query('SELECT COUNT(*)::int AS count FROM rfq_records'),
      redis.ping(),
    ]);
    res.json({
      status: 'HEALTHY', service: '@katl/api', version: '1.0.0',
      uptimeSeconds: Math.round(process.uptime()), timestamp: new Date().toISOString(),
      database: 'CONNECTED', redis: 'CONNECTED',
      pimProductsCount: products.rows[0].count, totalRfqsCount: rfqs.rows[0].count,
      configuredAiProviders: aiGateway.getProviderRegistry().filter((provider) => provider.status === 'ACTIVE').map((provider) => provider.id),
    });
  } catch {
    res.status(503).json({ status: 'NOT_READY', timestamp: new Date().toISOString() });
  }
});

// -------------------------------------------------------------
// 2. Authentication & Users RBAC API
// -------------------------------------------------------------
app.post('/api/v1/auth/login', loginLimiter as any, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || password.length < 12 || password.length > 256) {
    return res.status(400).json({ error: 'INVALID_CREDENTIALS', message: 'Email і пароль обов’язкові.' });
  }

  let authenticated;
  try {
    authenticated = await authenticate(email, password);
  } catch {
    return res.status(503).json({ error: 'AUTH_SERVICE_UNAVAILABLE' });
  }
  if (!authenticated) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Неправильний email або пароль.' });
  }
  const { user, token } = authenticated;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `katl_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${secure}`);

  res.json({
    success: true,
    user: publicUser(user),
  });
});

app.get('/api/v1/auth/me', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'PRODUCT_MANAGER', 'CONTENT_MANAGER', 'TRANSLATOR', 'SALES', 'PARTNER', 'CUSTOMER', 'VIEWER'), (req: Request, res: Response) => {
  res.json({ data: publicUser((req as any).authUser) });
});

app.post('/api/v1/auth/logout', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'PRODUCT_MANAGER', 'CONTENT_MANAGER', 'TRANSLATOR', 'SALES', 'PARTNER', 'CUSTOMER', 'VIEWER'), async (req: Request, res: Response) => {
  const token = sessionTokenFromRequest(req);
  try {
    await revokeSession(token);
  } catch {
    return res.status(503).json({ error: 'AUTH_SERVICE_UNAVAILABLE' });
  }
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `katl_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
  res.status(204).end();
});

app.get('/api/v1/users', requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    'SELECT id, email, name, role, company, created_at, last_login_at FROM users ORDER BY created_at DESC'
  );
  res.json({ data: rows });
});

app.post('/api/v1/users/:id/role', requireRoles('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const actor = (req as any).authUser;
  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'PRODUCT_MANAGER', 'CONTENT_MANAGER', 'TRANSLATOR', 'SALES', 'PARTNER', 'CUSTOMER', 'VIEWER'];
  if (typeof role !== 'string' || !validRoles.includes(role)) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Невідома роль користувача.' });
  }
  const client = await getDatabasePool().connect();
  let updated: boolean;
  try {
    await client.query('BEGIN');
    const { rowCount } = await client.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    updated = (rowCount || 0) > 0;
    if (!updated) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: `User with id ${id} not found.` });
    }
    await client.query('UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL', [id]);
    await client.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1, 'USER_ROLE_CHANGED', 'User', $2, $3, jsonb_build_object('newRole', $4::text))`,
      [`AUD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, id, actor.name, role]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  if (!updated) {
    return res.status(404).json({ error: 'USER_NOT_FOUND', message: `User with id ${id} not found.` });
  }
  res.json({ success: true, message: `Роль користувача ${id} оновлено на ${role}.` });
});

// -------------------------------------------------------------
// 3. PIM & Products API
// -------------------------------------------------------------
const PIM_EDITOR_ROLES = ['SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'PRODUCT_MANAGER'];

app.get('/api/v1/admin/products', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 120) : '';
  const status = typeof req.query.status === 'string' ? req.query.status : null;
  const { rows } = await getDatabasePool().query(
    `SELECT p.id, p.name, p.family, p.category, p.product_type, p.short_desc, p.highlight, p.status, p.source_url,
      p.verified_at, p.verified_by, p.confidence, p.revision, p.updated_at, evidence.snapshot_id AS latest_source_snapshot_id,
      staged.id AS staged_revision_id, staged.status AS staged_revision_status, staged.base_revision AS staged_base_revision,
      COALESCE(facts.data,'{}'::jsonb) AS fact_sources,
      s.energy_specs, s.cell_specs, s.mechanical_specs, s.thermal_specs, s.safety_specs, s.compatibility
     FROM pim_products p JOIN pim_specifications s ON s.product_id = p.id
     LEFT JOIN LATERAL (
       SELECT ss.id AS snapshot_id FROM sync_sources src JOIN sync_snapshots ss ON ss.source_id=src.id
       WHERE src.product_id=p.id AND src.enabled=true AND src.url=p.source_url AND ss.source_url=p.source_url AND ss.http_status BETWEEN 200 AND 299
       ORDER BY ss.captured_at DESC LIMIT 1
     ) evidence ON true
     LEFT JOIN LATERAL (
       SELECT id,status,base_revision FROM pim_product_staged_revisions sr
       WHERE sr.product_id=p.id AND sr.status IN ('DRAFT','REVIEW','APPROVED')
       ORDER BY sr.created_at DESC LIMIT 1
     ) staged ON true
     LEFT JOIN LATERAL (
       SELECT jsonb_object_agg(field_path,jsonb_build_object('pageSection',page_section,'excerpt',evidence_excerpt,'status',status,'sourceSnapshotId',source_snapshot_id)) AS data
       FROM pim_product_fact_sources WHERE product_id=p.id AND specification_revision=s.specification_revision
     ) facts ON true
     WHERE ($1::text = '' OR p.name ILIKE '%' || $1 || '%' OR p.id ILIKE '%' || $1 || '%' OR p.family ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR p.status = $2)
     ORDER BY p.updated_at DESC LIMIT 500`,
    [query, status]
  );
  res.json({ data: rows, total: rows.length });
});

app.post('/api/v1/admin/products', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = pimDraftSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  const input = parsed.data;
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const inserted = await client.query(
      `INSERT INTO pim_products (id, name, family, category, short_desc, highlight, status, product_type, source_url, confidence, revision, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,'DRAFT',$7,$8,'UNVERIFIED',1,$9) RETURNING id, status, revision`,
      [input.id, input.name, input.family, input.category, input.shortDesc, input.highlight, input.productType, input.sourceUrl, actor.id]
    );
    await client.query(
      `INSERT INTO pim_specifications (product_id, energy_specs, cell_specs, mechanical_specs, thermal_specs, safety_specs, compatibility)
       VALUES ($1,$2::jsonb,$3::jsonb,$4::jsonb,$5::jsonb,$6::jsonb,$7::jsonb)`,
      [input.id, JSON.stringify(input.energySpecs), JSON.stringify(input.cellSpecs), JSON.stringify(input.mechanicalSpecs), JSON.stringify(input.thermalSpecs), JSON.stringify(input.safetySpecs), JSON.stringify(input.compatibility)]
    );
    await client.query(
      `INSERT INTO sync_sources (id, name, url, source_type, product_id, enabled)
       VALUES ($1,$2,$3,'OFFICIAL_WEB',$4,true)`,
      [`SRC-${input.id}`, input.name, input.sourceUrl, input.id]
    );
    const factResult = await storePimFactSources(client, input.id, 1, input);
    if (factResult.error) { await client.query('ROLLBACK'); return sendFactProvenanceError(res, factResult); }
    await client.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1,'PIM_DRAFT_CREATED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, input.id, actor.name, JSON.stringify({ sourceUrl: input.sourceUrl, status: 'DRAFT', revision: 1 })]
    );
    await recordPimRevision(client, input.id, 'CREATED', actor.name);
    await client.query('COMMIT');
    res.status(201).json({ success: true, data: inserted.rows[0] });
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error?.code === '23505') return res.status(409).json({ error: 'PRODUCT_ID_EXISTS', message: 'Ідентифікатор продукту вже використаний.' });
    throw error;
  } finally { client.release(); }
});

app.put('/api/v1/admin/products/:id', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = pimDraftSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  const input = parsed.data;
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT p.status,p.revision,s.specification_revision FROM pim_products p JOIN pim_specifications s ON s.product_id=p.id WHERE p.id = $1 FOR UPDATE OF p,s', [input.id]);
    if (!current.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (!['DRAFT', 'REVIEW'].includes(current.rows[0].status)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'PRODUCT_REVISION_REQUIRED', message: 'Опублікований або погоджений запис не можна змінювати напряму. Створіть окрему ревізію.' });
    }
    const revision = Number(current.rows[0].revision) + 1;
    await client.query(
      `UPDATE pim_products SET name=$1,family=$2,category=$3,short_desc=$4,highlight=$5,product_type=$6,
       source_url=$7,status='DRAFT',confidence='UNVERIFIED',revision=$8,updated_at=NOW() WHERE id=$9`,
      [input.name, input.family, input.category, input.shortDesc, input.highlight, input.productType, input.sourceUrl, revision, input.id]
    );
    await client.query(
      `UPDATE pim_specifications SET energy_specs=$1::jsonb,cell_specs=$2::jsonb,mechanical_specs=$3::jsonb,thermal_specs=$4::jsonb,
       safety_specs=$5::jsonb,compatibility=$6::jsonb,specification_revision=specification_revision+1,updated_at=NOW() WHERE product_id=$7`,
      [JSON.stringify(input.energySpecs), JSON.stringify(input.cellSpecs), JSON.stringify(input.mechanicalSpecs), JSON.stringify(input.thermalSpecs), JSON.stringify(input.safetySpecs), JSON.stringify(input.compatibility), input.id]
    );
    const specificationRevision = Number(current.rows[0].specification_revision) + 1;
    await client.query(
      `INSERT INTO sync_sources (id,name,url,source_type,product_id,enabled)
       VALUES ($1,$2,$3,'OFFICIAL_WEB',$4,true)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,url=EXCLUDED.url,product_id=EXCLUDED.product_id,enabled=true`,
      [`SRC-${input.id}`, input.name, input.sourceUrl, input.id]
    );
    const factResult = await storePimFactSources(client,input.id,specificationRevision,input);
    if (factResult.error) { await client.query('ROLLBACK'); return sendFactProvenanceError(res, factResult); }
    await client.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1,'PIM_DRAFT_UPDATED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, input.id, actor.name, JSON.stringify({ status: 'DRAFT', revision, sourceUrl: input.sourceUrl })]
    );
    await recordPimRevision(client, input.id, 'UPDATED', actor.name);
    await client.query('COMMIT');
    res.json({ success: true, data: { id: input.id, status: 'DRAFT', revision } });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
});

app.get('/api/v1/admin/products/:id/revisions', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    `SELECT revision, event, actor, note, source_snapshot_id, created_at
     FROM pim_product_revisions WHERE product_id=$1 ORDER BY revision DESC LIMIT 100`,
    [req.params.id]
  );
  res.json({ data: rows });
});

app.post('/api/v1/admin/products/:id/submit-review', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT p.id,p.status,p.revision,p.source_url,s.specification_revision,s.energy_specs,s.cell_specs,s.mechanical_specs,s.thermal_specs,s.safety_specs,s.compatibility
       FROM pim_products p JOIN pim_specifications s ON s.product_id=p.id WHERE p.id=$1 FOR UPDATE OF p`,
      [id]
    );
    const product = current.rows[0];
    if (!product) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (product.status !== 'DRAFT') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'PRODUCT_NOT_DRAFT', message: 'На перевірку можна подати лише чернетку.' }); }
    const technicalGroups = Object.fromEntries(['energy_specs','cell_specs','mechanical_specs','thermal_specs','safety_specs','compatibility'].map((key) => [key,product[key]]));
    const technicalFacts = extractTechnicalFacts(technicalGroups);
    if (!technicalFacts.length) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'PRODUCT_SPECS_REQUIRED', message: 'Додайте перевірювані характеристики перед поданням на перевірку.' }); }
    const snapshot = await client.query(
      `SELECT ss.id FROM sync_sources src JOIN sync_snapshots ss ON ss.source_id=src.id
       WHERE src.product_id=$1 AND src.enabled=true AND src.url=$2 AND ss.source_url=$2 AND ss.http_status BETWEEN 200 AND 299
       ORDER BY ss.captured_at DESC LIMIT 1`,
      [id, product.source_url]
    );
    if (!snapshot.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'OFFICIAL_SOURCE_NOT_FETCHED', message: 'Спочатку виконайте успішне отримання офіційного джерела CATL.' }); }
    const coverage = await checkPimFactCoverage(client,id,Number(product.specification_revision),technicalGroups,snapshot.rows[0].id);
    if (coverage.missing.length || coverage.stale.length) {
      await client.query('ROLLBACK');
      return res.status(422).json({ error: 'FACT_PROVENANCE_INCOMPLETE', message: 'Кожне технічне значення має посилатися на цитату з актуального знімка CATL.', missing: coverage.missing, stale: coverage.stale });
    }
    const revision = Number(product.revision) + 1;
    await client.query("UPDATE pim_products SET status='REVIEW',revision=$1,updated_at=NOW() WHERE id=$2", [revision, id]);
    await client.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1,'PIM_SUBMITTED_FOR_REVIEW','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, id, actor.name, JSON.stringify({ revision, sourceSnapshotId: snapshot.rows[0].id })]
    );
    await recordPimRevision(client, id, 'SUBMITTED', actor.name, null, snapshot.rows[0].id);
    await client.query('COMMIT');
    return res.json({ success: true, data: { id, status: 'REVIEW', revision, sourceSnapshotId: snapshot.rows[0].id } });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.post('/api/v1/admin/products/:id/review/approve', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const note = typeof req.body?.note === 'string' ? req.body.note.trim() : '';
  if (note.length < 20 || note.length > 2000) return res.status(400).json({ error: 'REVIEW_NOTE_REQUIRED', message: 'Залиште примітку перевірки (20–2000 символів).' });
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT p.id,p.status,p.revision,p.source_url,s.specification_revision,s.energy_specs,s.cell_specs,s.mechanical_specs,s.thermal_specs,s.safety_specs,s.compatibility
       FROM pim_products p JOIN pim_specifications s ON s.product_id=p.id WHERE p.id=$1 FOR UPDATE OF p,s`, [id]
    );
    const product = current.rows[0];
    if (!product) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (product.status !== 'REVIEW') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'PRODUCT_NOT_IN_REVIEW' }); }
    const creator = await client.query('SELECT created_by FROM pim_products WHERE id=$1', [id]);
    if (!creator.rows[0]?.created_by || creator.rows[0].created_by === actor.id) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'MAKER_CHECKER_REQUIRED', message: 'Чернетку може погодити лише інший користувач; записи без автора треба створити заново з прив’язаною особою.' });
    }
    const snapshot = await client.query(
      `SELECT ss.id FROM sync_sources src JOIN sync_snapshots ss ON ss.source_id=src.id
       WHERE src.product_id=$1 AND src.enabled=true AND src.url=$2 AND ss.source_url=$2 AND ss.http_status BETWEEN 200 AND 299
       ORDER BY ss.captured_at DESC LIMIT 1`,
      [id, product.source_url]
    );
    if (!snapshot.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'OFFICIAL_SOURCE_NOT_FETCHED' }); }
    const technicalGroups = Object.fromEntries(['energy_specs','cell_specs','mechanical_specs','thermal_specs','safety_specs','compatibility'].map((key) => [key,product[key]]));
    const coverage = await checkPimFactCoverage(client,id,Number(product.specification_revision),technicalGroups,snapshot.rows[0].id);
    if (coverage.total === 0 || coverage.missing.length || coverage.stale.length) {
      await client.query('ROLLBACK');
      return res.status(422).json({ error: 'FACT_PROVENANCE_INCOMPLETE', message: 'Перед погодженням підтвердьте кожне технічне значення цитатою з актуального знімка CATL.', missing: coverage.missing, stale: coverage.stale });
    }
    await client.query(
      `INSERT INTO pim_product_review_decisions (product_id,revision,source_snapshot_id,reviewer,reviewer_id,decision,note)
       VALUES ($1,$2,$3,$4,$5,'APPROVED',$6)`,
      [id, product.revision, snapshot.rows[0].id, actor.name, actor.id, note]
    );
    await client.query(
      `UPDATE pim_product_fact_sources SET status='VERIFIED',verified_by_id=$1,verified_at=NOW()
       WHERE product_id=$2 AND specification_revision=$3 AND source_snapshot_id=$4`,
      [actor.id,id,product.specification_revision,snapshot.rows[0].id]
    );
    const revision = Number(product.revision) + 1;
    await client.query(
      `UPDATE pim_products SET status='APPROVED',confidence='ENGINEER_REVIEWED',verified_at=NOW(),verified_by=$1,revision=$2,updated_at=NOW() WHERE id=$3`,
      [actor.name, revision, id]
    );
    await client.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1,'PIM_REVIEW_APPROVED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, id, actor.name, JSON.stringify({ revision, sourceSnapshotId: snapshot.rows[0].id, note })]
    );
    await recordPimRevision(client, id, 'APPROVED', actor.name, note, snapshot.rows[0].id);
    await client.query('COMMIT');
    return res.json({ success: true, data: { id, status: 'APPROVED', revision } });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.post('/api/v1/admin/products/:id/review/reject', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const note = typeof req.body?.note === 'string' ? req.body.note.trim() : '';
  if (note.length < 10 || note.length > 2000) return res.status(400).json({ error: 'REJECTION_NOTE_REQUIRED', message: 'Вкажіть причину відхилення (10–2000 символів).' });
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT id,status,revision,source_url FROM pim_products WHERE id=$1 FOR UPDATE', [id]);
    const product = current.rows[0];
    if (!product) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (product.status !== 'REVIEW') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'PRODUCT_NOT_IN_REVIEW' }); }
    const sourceSnapshot = await client.query(
      `SELECT ss.id FROM sync_sources src JOIN sync_snapshots ss ON ss.source_id=src.id
       WHERE src.product_id=$1 AND src.url=$2 AND ss.source_url=$2 AND ss.http_status BETWEEN 200 AND 299 ORDER BY ss.captured_at DESC LIMIT 1`, [id,product.source_url]
    );
    const snapshotId = sourceSnapshot.rows[0]?.id || null;
    if (snapshotId) await client.query(
      `INSERT INTO pim_product_review_decisions (product_id,revision,source_snapshot_id,reviewer,reviewer_id,decision,note)
       VALUES ($1,$2,$3,$4,$5,'REJECTED',$6)`, [id, product.revision, snapshotId, actor.name, actor.id, note]
    );
    const revision = Number(product.revision) + 1;
    await client.query("UPDATE pim_products SET status='DRAFT',revision=$1,updated_at=NOW() WHERE id=$2", [revision, id]);
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_REVIEW_REJECTED','Product',$2,$3,$4::jsonb)`, [`AUD-${randomUUID()}`,id,actor.name,JSON.stringify({ revision, note })]);
    await recordPimRevision(client,id,'REJECTED',actor.name,note,snapshotId);
    await client.query('COMMIT');
    return res.json({ success: true, data: { id, status: 'DRAFT', revision } });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.post('/api/v1/admin/products/:id/publish', requireRoles('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 2000) : '';
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT p.id,p.status,p.revision,p.source_url,p.verified_at,p.verified_by,s.specification_revision,s.energy_specs,s.cell_specs,s.mechanical_specs,s.thermal_specs,s.safety_specs,s.compatibility
       FROM pim_products p JOIN pim_specifications s ON s.product_id=p.id WHERE p.id=$1 FOR UPDATE OF p,s`, [id]
    );
    const product = current.rows[0];
    if (!product) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (product.status !== 'APPROVED') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'PRODUCT_REQUIRES_APPROVAL', message: 'Публікувати можна лише погоджену інженером ревізію.' }); }
    const decision = await client.query(
      `SELECT d.revision,d.source_snapshot_id,d.reviewer_id,ss.http_status FROM pim_product_review_decisions d
       JOIN sync_snapshots ss ON ss.id=d.source_snapshot_id
       WHERE d.product_id=$1 AND d.decision='APPROVED' ORDER BY d.created_at DESC LIMIT 1`, [id]
    );
    if (!decision.rowCount || !decision.rows[0].reviewer_id || Number(decision.rows[0].revision) !== Number(product.revision) - 1 || decision.rows[0].http_status < 200 || decision.rows[0].http_status >= 300 || !product.source_url || !product.verified_at || !product.verified_by) {
      await client.query('ROLLBACK'); return res.status(409).json({ error: 'PUBLICATION_EVIDENCE_INVALID', message: 'Не знайдено актуального погодження з успішним знімком офіційного джерела.' });
    }
    const technicalGroups = Object.fromEntries(['energy_specs','cell_specs','mechanical_specs','thermal_specs','safety_specs','compatibility'].map((key) => [key,product[key]]));
    const factCoverage = await checkPimFactCoverage(client,id,Number(product.specification_revision),technicalGroups,decision.rows[0].source_snapshot_id,decision.rows[0].reviewer_id || undefined);
    if (factCoverage.total === 0 || factCoverage.missing.length || factCoverage.stale.length) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'PUBLICATION_FACT_PROVENANCE_INVALID', message: 'Опублікована картка має містити перевірені джерела для кожної технічної характеристики.', missing: factCoverage.missing, stale: factCoverage.stale });
    }
    const revision = Number(product.revision) + 1;
    await client.query("UPDATE pim_products SET status='PUBLISHED',revision=$1,updated_at=NOW() WHERE id=$2", [revision, id]);
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_PRODUCT_PUBLISHED','Product',$2,$3,$4::jsonb)`, [`AUD-${randomUUID()}`,id,actor.name,JSON.stringify({ revision, approvedRevision: decision.rows[0].revision, sourceSnapshotId: decision.rows[0].source_snapshot_id, note })]);
    await recordPimRevision(client,id,'PUBLISHED',actor.name,note,decision.rows[0].source_snapshot_id);
    await client.query('COMMIT');
    return res.json({ success: true, data: { id, status: 'PUBLISHED', revision } });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

// Published product corrections are isolated from the live PIM row until an
// engineer has reviewed the cited source and an administrator explicitly publishes.
app.post('/api/v1/admin/products/:id/staged-revisions', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = pimDraftSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  const input = parsed.data;
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT id,status,revision FROM pim_products WHERE id=$1 FOR UPDATE', [input.id]);
    if (!current.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (current.rows[0].status !== 'PUBLISHED') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'PRODUCT_NOT_PUBLISHED' }); }
    const active = await client.query("SELECT id FROM pim_product_staged_revisions WHERE product_id=$1 AND status IN ('DRAFT','REVIEW','APPROVED')", [input.id]);
    if (active.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_EXISTS', revisionId: active.rows[0].id }); }
    const staged = await client.query(
      `INSERT INTO pim_product_staged_revisions (product_id,base_revision,payload,created_by_id)
       VALUES ($1,$2,$3::jsonb,$4) RETURNING id,status,base_revision,created_at`,
      [input.id, current.rows[0].revision, JSON.stringify(input), actor.id]
    );
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_STAGED_REVISION_CREATED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, input.id, actor.name, JSON.stringify({ stagedRevisionId: staged.rows[0].id, baseRevision: current.rows[0].revision })]);
    await client.query('COMMIT');
    return res.status(201).json({ data: staged.rows[0] });
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error?.code === '23505') return res.status(409).json({ error: 'STAGED_REVISION_EXISTS' });
    throw error;
  } finally { client.release(); }
});

app.put('/api/v1/admin/products/:id/staged-revisions/:revisionId', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = pimDraftSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const updated = await client.query(
      `UPDATE pim_product_staged_revisions SET payload=$1::jsonb,updated_at=NOW()
       WHERE id=$2 AND product_id=$3 AND status='DRAFT' RETURNING id,status,base_revision,updated_at`,
      [JSON.stringify(parsed.data), req.params.revisionId, req.params.id]
    );
    if (!updated.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_NOT_EDITABLE' }); }
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_STAGED_REVISION_UPDATED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`,req.params.id,actor.name,JSON.stringify({ stagedRevisionId: req.params.revisionId, editor: actor.id })]);
    await client.query('COMMIT');
    return res.json({ data: updated.rows[0] });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.get('/api/v1/admin/products/:id/staged-revisions/:revisionId', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    'SELECT id,status,base_revision,payload,source_snapshot_id,created_by_id,reviewer_id,review_note,created_at,updated_at,published_at FROM pim_product_staged_revisions WHERE id=$1 AND product_id=$2',
    [req.params.revisionId, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'STAGED_REVISION_NOT_FOUND' });
  return res.json({ data: rows[0] });
});

app.post('/api/v1/admin/products/:id/staged-revisions/:revisionId/submit-review', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT sr.*,p.status AS product_status,p.revision AS live_revision FROM pim_product_staged_revisions sr
       JOIN pim_products p ON p.id=sr.product_id WHERE sr.id=$1 AND sr.product_id=$2 FOR UPDATE OF sr,p`,
      [req.params.revisionId, req.params.id]
    );
    const staged = result.rows[0];
    if (!staged) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'STAGED_REVISION_NOT_FOUND' }); }
    if (staged.status !== 'DRAFT') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_NOT_DRAFT' }); }
    if (staged.product_status !== 'PUBLISHED' || Number(staged.live_revision) !== Number(staged.base_revision)) {
      await client.query("UPDATE pim_product_staged_revisions SET status='SUPERSEDED',updated_at=NOW() WHERE id=$1", [staged.id]);
      await client.query('COMMIT'); return res.status(409).json({ error: 'STAGED_REVISION_BASE_CHANGED' });
    }
    const input = staged.payload;
    const snapshot = await client.query(
      `SELECT ss.id,ss.raw_payload,ss.body_encoding FROM sync_sources src JOIN sync_snapshots ss ON ss.source_id=src.id
       WHERE src.product_id=$1 AND src.enabled=true AND src.url=$2 AND ss.source_url=$2 AND ss.http_status BETWEEN 200 AND 299
       ORDER BY ss.captured_at DESC LIMIT 1`, [req.params.id, input.sourceUrl]
    );
    if (!snapshot.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'OFFICIAL_SOURCE_NOT_FETCHED' }); }
    const facts = factsFromPimInput(input);
    if (!facts.length) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'PRODUCT_SPECS_REQUIRED' }); }
    const factPaths = new Set(facts.map((fact: any) => fact.path));
    const unknownPaths = Object.keys(input.factSources || {}).filter((path) => !factPaths.has(path));
    if (unknownPaths.length) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'FACT_PROVENANCE_UNKNOWN_FIELD', paths: unknownPaths.slice(0, 50) }); }
    if (snapshot.rows[0].body_encoding !== 'utf8' || typeof snapshot.rows[0].raw_payload !== 'string') {
      await client.query('ROLLBACK'); return res.status(422).json({ error: 'FACT_SOURCE_TEXT_UNAVAILABLE' });
    }
    const sourceText = normalizeSourceEvidence(snapshot.rows[0].raw_payload);
    const evidence = input.factSources || {};
    const missing = facts.filter((fact: any) => !evidence[fact.path]);
    const invalid = facts.filter((fact: any) => {
      const excerpt = String(evidence[fact.path]?.excerpt || '').trim();
      const normalized = normalizeSourceEvidence(excerpt);
      return normalized.length < 5 || !sourceText.includes(normalized) || !evidenceContainsFactValue(excerpt, fact.value);
    });
    if (missing.length || invalid.length) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'FACT_PROVENANCE_INCOMPLETE', missing: missing.map((x: any) => x.path), invalid: invalid.map((x: any) => x.path) }); }
    await client.query("UPDATE pim_product_staged_revisions SET status='REVIEW',source_snapshot_id=$1,updated_at=NOW() WHERE id=$2", [snapshot.rows[0].id, staged.id]);
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_STAGED_REVISION_SUBMITTED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, req.params.id, (req as any).authUser.name, JSON.stringify({ stagedRevisionId: staged.id, baseRevision: staged.base_revision, sourceSnapshotId: snapshot.rows[0].id })]);
    await client.query('COMMIT');
    return res.json({ data: { id: staged.id, status: 'REVIEW', sourceSnapshotId: snapshot.rows[0].id } });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.post('/api/v1/admin/products/:id/staged-revisions/:revisionId/approve', requireRoles('SUPER_ADMIN','ADMIN','ENGINEER'), async (req: Request, res: Response) => {
  const note = typeof req.body?.note === 'string' ? req.body.note.trim() : '';
  if (note.length < 20 || note.length > 2000) return res.status(400).json({ error: 'REVIEW_NOTE_REQUIRED' });
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE pim_product_staged_revisions sr SET status='APPROVED',reviewer_id=$1,review_note=$2,updated_at=NOW()
       FROM pim_products p WHERE sr.id=$3 AND sr.product_id=$4 AND sr.status='REVIEW' AND sr.created_by_id<>$1
         AND sr.product_id=p.id AND p.status='PUBLISHED' AND p.revision=sr.base_revision
       RETURNING sr.id,sr.status,sr.base_revision`, [actor.id,note,req.params.revisionId,req.params.id]
    );
    if (!result.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_APPROVAL_INVALID', message: 'Потрібен інший погоджувач і незмінена live-ревізія.' }); }
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_STAGED_REVISION_APPROVED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`,req.params.id,actor.name,JSON.stringify({ stagedRevisionId: req.params.revisionId, note })]);
    await client.query('COMMIT');
    return res.json({ data: result.rows[0] });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.post('/api/v1/admin/products/:id/staged-revisions/:revisionId/reject', requireRoles('SUPER_ADMIN','ADMIN','ENGINEER'), async (req: Request, res: Response) => {
  const note = typeof req.body?.note === 'string' ? req.body.note.trim() : '';
  if (note.length < 10 || note.length > 2000) return res.status(400).json({ error: 'REJECTION_NOTE_REQUIRED' });
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const rejected = await client.query(
      `UPDATE pim_product_staged_revisions SET status='REJECTED',reviewer_id=$1,review_note=$2,updated_at=NOW()
       WHERE id=$3 AND product_id=$4 AND status='REVIEW' AND created_by_id<>$1 RETURNING id,status,base_revision`,
      [actor.id,note,req.params.revisionId,req.params.id]
    );
    if (!rejected.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_REJECTION_INVALID' }); }
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_STAGED_REVISION_REJECTED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`,req.params.id,actor.name,JSON.stringify({ stagedRevisionId: req.params.revisionId, note })]);
    await client.query('COMMIT');
    return res.json({ data: rejected.rows[0] });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.post('/api/v1/admin/products/:id/staged-revisions/:revisionId/publish', requireRoles('SUPER_ADMIN','ADMIN'), async (req: Request, res: Response) => {
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT sr.*,p.revision AS live_revision,p.status AS live_status FROM pim_product_staged_revisions sr
       JOIN pim_products p ON p.id=sr.product_id WHERE sr.id=$1 AND sr.product_id=$2 FOR UPDATE OF sr,p`, [req.params.revisionId,req.params.id]
    );
    const staged = result.rows[0];
    if (!staged) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'STAGED_REVISION_NOT_FOUND' }); }
    if (staged.status !== 'APPROVED' || staged.live_status !== 'PUBLISHED' || Number(staged.base_revision) !== Number(staged.live_revision)) {
      await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_PUBLICATION_INVALID' });
    }
    const input = staged.payload;
    const reviewer = await client.query('SELECT name FROM users WHERE id=$1', [staged.reviewer_id]);
    if (!reviewer.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'STAGED_REVISION_REVIEWER_MISSING' }); }
    const snapshot = await client.query('SELECT http_status FROM sync_snapshots WHERE id=$1', [staged.source_snapshot_id]);
    if (!snapshot.rowCount || snapshot.rows[0].http_status < 200 || snapshot.rows[0].http_status >= 300) {
      await client.query('ROLLBACK'); return res.status(409).json({ error: 'PUBLICATION_EVIDENCE_INVALID' });
    }
    const spec = await client.query('SELECT specification_revision FROM pim_specifications WHERE product_id=$1 FOR UPDATE', [req.params.id]);
    const nextSpecRevision = Number(spec.rows[0].specification_revision) + 1;
    const nextRevision = Number(staged.live_revision) + 1;
    await client.query(
      `UPDATE pim_products SET name=$1,family=$2,category=$3,short_desc=$4,highlight=$5,product_type=$6,source_url=$7,
       confidence='ENGINEER_REVIEWED',verified_at=NOW(),verified_by=$8,status='PUBLISHED',revision=$9,updated_at=NOW() WHERE id=$10`,
      [input.name,input.family,input.category,input.shortDesc,input.highlight,input.productType,input.sourceUrl,reviewer.rows[0].name,nextRevision,req.params.id]
    );
    await client.query(
      `UPDATE pim_specifications SET energy_specs=$1::jsonb,cell_specs=$2::jsonb,mechanical_specs=$3::jsonb,thermal_specs=$4::jsonb,
       safety_specs=$5::jsonb,compatibility=$6::jsonb,specification_revision=$7,updated_at=NOW() WHERE product_id=$8`,
      [JSON.stringify(input.energySpecs),JSON.stringify(input.cellSpecs),JSON.stringify(input.mechanicalSpecs),JSON.stringify(input.thermalSpecs),JSON.stringify(input.safetySpecs),JSON.stringify(input.compatibility),nextSpecRevision,req.params.id]
    );
    await client.query(
      `INSERT INTO sync_sources (id,name,url,source_type,product_id,enabled) VALUES ($1,$2,$3,'OFFICIAL_WEB',$4,true)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,url=EXCLUDED.url,enabled=true`,
      [`SRC-${req.params.id}`,input.name,input.sourceUrl,req.params.id]
    );
    for (const fact of factsFromPimInput(input)) {
      const item = input.factSources[fact.path];
      await client.query(
        `INSERT INTO pim_product_fact_sources (product_id,specification_revision,field_path,value_snapshot,source_snapshot_id,page_section,evidence_excerpt,status,verified_by_id,verified_at)
         VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,'VERIFIED',$8,NOW())`,
        [req.params.id,nextSpecRevision,fact.path,JSON.stringify(fact.value),staged.source_snapshot_id,item.pageSection,item.excerpt,staged.reviewer_id]
      );
    }
    await client.query("UPDATE pim_product_staged_revisions SET status='PUBLISHED',published_at=NOW(),updated_at=NOW() WHERE id=$1", [staged.id]);
    await recordPimRevision(client,String(req.params.id),'REVISION_PUBLISHED',actor.name,staged.review_note,staged.source_snapshot_id);
    await client.query(`INSERT INTO audit_logs (id,action,entity,entity_id,actor,details) VALUES ($1,'PIM_STAGED_REVISION_PUBLISHED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`,req.params.id,actor.name,JSON.stringify({ stagedRevisionId: staged.id, revision: nextRevision, baseRevision: staged.base_revision })]);
    await client.query('COMMIT');
    return res.json({ data: { id: req.params.id, stagedRevisionId: staged.id, status: 'PUBLISHED', revision: nextRevision } });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});

app.delete('/api/v1/admin/products/:id', requireRoles(...PIM_EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT status, revision FROM pim_products WHERE id = $1 FOR UPDATE', [id]);
    if (!current.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' }); }
    if (!['DRAFT', 'REVIEW'].includes(current.rows[0].status)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'PRODUCT_ARCHIVE_REQUIRES_UNPUBLISHED_STATE', message: 'Опублікований продукт не можна архівувати цим маршрутом.' });
    }
    const revision = Number(current.rows[0].revision) + 1;
    await client.query("UPDATE pim_products SET status='ARCHIVED',revision=$1,updated_at=NOW() WHERE id=$2", [revision, id]);
    await client.query('UPDATE sync_sources SET enabled=false WHERE product_id=$1', [id]);
    await recordPimRevision(client, id, 'ARCHIVED', actor.name);
    await client.query(
      `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
       VALUES ($1,'PIM_DRAFT_ARCHIVED','Product',$2,$3,$4::jsonb)`,
      [`AUD-${randomUUID()}`, id, actor.name, JSON.stringify({ previousStatus: current.rows[0].status, status: 'ARCHIVED', revision })]
    );
    await client.query('COMMIT');
    res.json({ success: true, data: { id, status: 'ARCHIVED', revision } });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
});

app.get('/api/v1/products', async (req: Request, res: Response) => {
  const { category, type } = req.query;
  const locale = canonicalLocale(req.query.locale);
  const categoryFilter = typeof category === 'string' && category !== 'all' ? `%${category}%` : null;
  const typeFilter = typeof type === 'string' ? type : null;
  const { rows } = await getDatabasePool().query(
    `${PRODUCT_SELECT} WHERE p.status = 'PUBLISHED'
      AND ($1 = 'uk-UA' OR (t.translation_status = 'PUBLISHED' AND t.source_revision = p.revision AND t.specifications <> '{}'::jsonb))
      AND ($2::text IS NULL OR p.category ILIKE $2)
      AND ($3::text IS NULL OR p.product_type = $3) ORDER BY p.name`,
    [locale, categoryFilter, typeFilter]
  );
  const products = rows.map(productFromRow);
  res.json({ data: products, total: products.length, timestamp: new Date().toISOString() });
});

app.get('/api/v1/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const locale = canonicalLocale(req.query.locale);
  const { rows } = await getDatabasePool().query(`${PRODUCT_SELECT} WHERE p.id = $2 AND p.status = 'PUBLISHED' AND ($1 = 'uk-UA' OR (t.translation_status = 'PUBLISHED' AND t.source_revision = p.revision AND t.specifications <> '{}'::jsonb)) LIMIT 1`, [locale, id]);
  const product = rows[0] ? productFromRow(rows[0]) : null;

  if (!product) {
    return res.status(404).json({
      error: 'PRODUCT_NOT_FOUND',
      message: `Product with id "${id}" does not exist in PIM repository.`,
    });
  }

  res.json({ data: product });
});

// -------------------------------------------------------------
// 4. Engineering Sizing & LCOS API
// -------------------------------------------------------------
app.post('/api/v1/calculations/bess', calculationLimiter as any, async (req: Request, res: Response) => {
  const parsed = bessSizingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  let result;
  try {
    result = BessEngineeringCalculator.calculate(parsed.data);
  } catch {
    return res.status(400).json({ error: 'INVALID_CALCULATION_INPUT' });
  }
  const calculationId = randomUUID();
  await getDatabasePool().query(
    `INSERT INTO bess_calculations (id,algorithm_version,input_snapshot,result_snapshot,locale)
     VALUES ($1,$2,$3::jsonb,$4::jsonb,$5)`,
    [calculationId,result.algorithmVersion,JSON.stringify(parsed.data),JSON.stringify(result),canonicalLocale(req.body?.locale)]
  );
  res.json({ data: result, calculationId, timestamp: new Date().toISOString() });
});

app.post('/api/v1/calculations/lcos', (req: Request, res: Response) => {
  const parsed = lcosSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  try {
    return res.json({ data: calculateLcos(parsed.data), timestamp: new Date().toISOString() });
  } catch {
    return res.status(400).json({ error: 'INVALID_CALCULATION_INPUT' });
  }
});

// -------------------------------------------------------------
// 5. RFQ (Request for Quotation) Lead Management API
// -------------------------------------------------------------
app.get('/api/v1/rfq', requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query('SELECT * FROM rfq_records ORDER BY created_at DESC');
  res.json({ data: rows, total: rows.length, timestamp: new Date().toISOString() });
});

app.post('/api/v1/rfq', rfqLimiter as any, async (req: Request, res: Response) => {
  const parsed = createRfqSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', issues: parsed.error.flatten() });
  const input = parsed.data;
  const id = `RFQ-${randomUUID()}`;
  const client = await getDatabasePool().connect();
  let newRfq;
  try {
    await client.query('BEGIN');
    const selectedProducts = [...new Set(input.selectedProducts || [])];
    if (selectedProducts.length) {
      const published = await client.query("SELECT id FROM pim_products WHERE id=ANY($1::varchar[]) AND status='PUBLISHED'", [selectedProducts]);
      if (published.rowCount !== selectedProducts.length) {
        await client.query('ROLLBACK');
        return res.status(422).json({ error: 'RFQ_PRODUCT_NOT_PUBLISHED', message: 'RFQ може містити лише товари з опублікованого каталогу.' });
      }
    }
    if (input.calculationId) {
      const calculation = await client.query('SELECT result_snapshot FROM bess_calculations WHERE id=$1 FOR SHARE', [input.calculationId]);
      if (!calculation.rowCount) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'CALCULATION_NOT_FOUND', message: 'Збережений розрахунок не знайдено. Повторіть розрахунок перед надсиланням RFQ.' }); }
      const result = calculation.rows[0].result_snapshot;
      if ((input.powerKw !== undefined && Math.abs(input.powerKw - Number(result.requestedPowerMw) * 1000) > 1)
        || (input.capacityKwh !== undefined && Math.abs(input.capacityKwh - Number(result.nominalEnergyWithReserveMwh) * 1000) > 1)
        || (input.durationHours !== undefined && Math.abs(input.durationHours - Number(result.input.durationHours)) > 0.01)) {
        await client.query('ROLLBACK');
        return res.status(422).json({ error: 'CALCULATION_INPUT_MISMATCH', message: 'Параметри RFQ не збігаються зі збереженим розрахунком.' });
      }
    }
    const insertSql = "INSERT INTO rfq_records (id, company_name, contact_person, phone, email, location, power_kw, capacity_kwh, selected_series, use_case, details, status, utm_source, utm_campaign, country, region, industry, duration_hours, utm_medium, utm_content, utm_term, referrer, landing_page, locale, selected_products, calculation_id, crm_sync_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'NEW',$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24::jsonb,$25,'PENDING') RETURNING *";
    const inserted = await client.query(insertSql, [
      id, input.companyName, input.contactPerson, input.phone, input.email,
      input.location || null, input.powerKw ?? null, input.capacityKwh ?? null,
      input.selectedSeries || 'CATL ESS', input.useCase || 'General inquiry', input.details || null,
      input.utmSource || null, input.utmCampaign || null, input.country || null, input.region || null,
      input.industry || null, input.durationHours ?? null, input.utmMedium || null,
      input.utmContent || null, input.utmTerm || null,
      String(req.headers.referer || '').slice(0, 2048) || null,
      input.landingPage || req.originalUrl.slice(0, 2048), input.locale || null,
      JSON.stringify(input.selectedProducts || []), input.calculationId || null,
    ]);
    newRfq = inserted.rows[0];
    await client.query("INSERT INTO rfq_status_history (rfq_id, old_status, new_status) VALUES ($1, NULL, 'NEW')", [id]);
    await client.query(
      "INSERT INTO audit_logs (id, action, entity, entity_id, actor, details) VALUES ($1, 'RFQ_CREATED', 'RFQ', $2, $3, jsonb_build_object('company', $4::text, 'source', $5::text))",
      [`AUD-${randomUUID()}`, id, input.contactPerson, input.companyName, input.utmSource || null]
    );
    await client.query(
      "INSERT INTO platform_outbox (event_type, payload) VALUES ('RFQ_DISPATCH_JOB', $1::jsonb)",
      [JSON.stringify({ rfqId: id })]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  res.status(201).json({ success: true, message: 'Запит зареєстровано.', data: newRfq });
});

app.patch('/api/v1/rfq/:id/status', requireRoles('SUPER_ADMIN', 'ADMIN', 'SALES'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const status = rfqStatusSchema.safeParse(req.body?.status);
  const note = req.body?.note;
  if (!status.success || (note !== undefined && (typeof note !== 'string' || note.length > 4000))) {
    return res.status(400).json({ error: 'VALIDATION_ERROR' });
  }
  const actor = (req as any).authUser;
  const client = await getDatabasePool().connect();
  let updated;
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT status FROM rfq_records WHERE id = $1 FOR UPDATE', [id]);
    if (current.rowCount !== 1) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'RFQ_NOT_FOUND' });
    }
    const result = await client.query('UPDATE rfq_records SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status.data, id]);
    updated = result.rows[0];
    await client.query('INSERT INTO rfq_status_history (rfq_id, old_status, new_status, actor_id, note) VALUES ($1,$2,$3,$4,$5)', [id, current.rows[0].status, status.data, actor.id, note || null]);
    await client.query(
      "INSERT INTO audit_logs (id, action, entity, entity_id, actor, details) VALUES ($1, 'RFQ_STATUS_CHANGE', 'RFQ', $2, $3, jsonb_build_object('oldStatus',$4::text,'newStatus',$5::text,'note',$6::text))",
      [`AUD-${randomUUID()}`, id, actor.name, current.rows[0].status, status.data, note || null]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  res.json({ success: true, data: updated });
});

// -------------------------------------------------------------
// 6. CATL Product Sync & Snapshot Ingestion API
// -------------------------------------------------------------
app.get('/api/v1/sync/sources', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query('SELECT * FROM sync_sources ORDER BY name');
  res.json({ data: rows });
});

app.get('/api/v1/sync/changes', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    'SELECT c.*, s.content_hash, s.content_type, s.size_bytes FROM sync_changes c LEFT JOIN sync_snapshots s ON s.id = c.snapshot_id ORDER BY c.detected_at DESC LIMIT 500'
  );
  res.json({ data: rows });
});

app.get('/api/v1/sync/snapshots', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    'SELECT id, source_id, content_hash, captured_at, http_status, content_type, body_encoding, size_bytes FROM sync_snapshots ORDER BY captured_at DESC LIMIT 500'
  );
  res.json({ data: rows });
});

app.post('/api/v1/sync/run', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    "INSERT INTO platform_outbox (event_type, payload) VALUES ('CATL_SYNC_JOB', '{}'::jsonb) RETURNING id, status, created_at"
  );
  res.status(202).json({ accepted: true, job: rows[0] });
});

app.post('/api/v1/sync/changes/:id/approve', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await reviewSyncChange(id, (req as any).authUser, 'APPROVED');
  if (result.status === 'NOT_FOUND') return res.status(404).json({ error: 'SYNC_CHANGE_NOT_FOUND' });
  if (result.status === 'CONFLICT') return res.status(409).json({ error: 'SYNC_CHANGE_ALREADY_REVIEWED' });
  if (result.status === 'STALE') return res.status(409).json({ error: 'PRODUCT_CHANGED_SINCE_DETECTION' });
  if (result.status === 'UNSUPPORTED_FIELD') return res.status(422).json({ error: 'FIELD_REQUIRES_ENGINEERING_REVIEW' });
  if (result.status === 'PUBLISHED_PRODUCT_REQUIRES_REVISION') return res.status(409).json({ error: 'PUBLISHED_PRODUCT_REQUIRES_REVISION', message: 'Зміна не застосована до публічних даних. Спочатку потрібен окремий draft revision workflow.' });
  res.json({ success: true, data: result });
});

app.post('/api/v1/sync/changes/:id/reject', requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER'), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await reviewSyncChange(id, (req as any).authUser, 'REJECTED');
  if (result.status === 'NOT_FOUND') return res.status(404).json({ error: 'SYNC_CHANGE_NOT_FOUND' });
  if (result.status === 'CONFLICT') return res.status(409).json({ error: 'SYNC_CHANGE_ALREADY_REVIEWED' });
  res.json({ success: true, data: result });
});

// -------------------------------------------------------------
// 7. AI Provider Gateway API
// -------------------------------------------------------------
app.post('/api/v1/ai/gateway/chat', aiLimiter as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'SALES', 'PARTNER', 'CUSTOMER'), async (req: Request, res: Response) => {
  const { messages = [], context } = req.body;

  try {
    const result = await aiGateway.handleAdvisorChat(messages, context);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    const unavailable = ['AI_PROVIDER_UNAVAILABLE', 'PIM_DATA_UNAVAILABLE'].includes(err?.message);
    res.status(unavailable ? 503 : 500).json({ error: unavailable ? err.message : 'AI_GATEWAY_ERROR' });
  }
});

app.post('/api/v1/ai/gateway/task', aiLimiter as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'ENGINEER', 'SALES'), async (req: Request, res: Response) => {
  const parsed = aiTaskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_REQUEST', issues: parsed.error.flatten() });

  try {
    const result = await aiGateway.executeTask(parsed.data);
    res.json({ success: true, data: result });
  } catch (err: any) {
    const unavailable = ['AI_PROVIDER_UNAVAILABLE', 'PIM_DATA_UNAVAILABLE'].includes(err?.message);
    res.status(unavailable ? 503 : 500).json({ error: unavailable ? err.message : 'AI_TASK_FAILED' });
  }
});

app.get('/api/v1/ai/gateway/stats', requireRoles('SUPER_ADMIN', 'ADMIN'), (req: Request, res: Response) => {
  res.json({ data: aiGateway.getStats() });
});

app.get('/api/v1/ai/gateway/providers', requireRoles('SUPER_ADMIN', 'ADMIN'), (req: Request, res: Response) => {
  res.json({ data: aiGateway.getProviderRegistry() });
});

app.post('/api/v1/ai/gateway/reload', requireRoles('SUPER_ADMIN'), (req: Request, res: Response) => {
  const result = aiGateway.reloadKeysAndProviders();
  res.json({
    success: true,
    message: 'Всі конфігурації та API ключі провайдерів успішно перевірено та оновлено.',
    data: result,
  });
});

// -------------------------------------------------------------
// 8. Localization Platform API
// -------------------------------------------------------------
app.get('/api/v1/localization/locales', (req: Request, res: Response) => {
  res.json({
    locales: [
      { code: 'uk', name: 'Українська', isDefault: true },
      { code: 'en', name: 'English (International)', isDefault: false },
      { code: 'zh-cn', name: '简体中文 (CATL Technical)', isDefault: false },
    ],
  });
});

app.get('/api/v1/localization/glossary', (req: Request, res: Response) => {
  res.json({
    glossary: [
      { key: 'bess', uk: 'Система накопичення енергії акумуляторного типу (СНЕА / BESS)', en: 'Battery Energy Storage System (BESS)', zhCn: '电池储能系统' },
      { key: 'lcos', uk: 'Нормована вартість зберігання енергії (LCOS)', en: 'Levelized Cost of Storage (LCOS)', zhCn: '平准化度电储能成本' },
      { key: 'c_rate', uk: 'Швидкість розряду/заряду (C-rate)', en: 'Discharge/Charge Rate (C-rate)', zhCn: '充放电倍率' },
      { key: 'rte', uk: 'ККД повного циклу (RTE)', en: 'Round Trip Efficiency (RTE)', zhCn: '系统往返效率' },
      { key: 'grid_forming', uk: 'Режим формування мережі (Grid-Forming)', en: 'Grid-Forming Control', zhCn: '构网型控制' },
    ],
  });
});

// -------------------------------------------------------------
// 9. Background Jobs & Worker API
// -------------------------------------------------------------
app.get('/api/v1/jobs', requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req: Request, res: Response) => {
  const queues = await Promise.all(QUEUE_NAMES.map((name) => getPlatformQueueStats(name)));
  res.json({ data: queues, timestamp: new Date().toISOString() });
});

app.post('/api/v1/jobs/trigger', requireRoles('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response) => {
  const { type = 'CATL_SYNC_JOB', payload = {} } = req.body;
  const supportedJobs = ['CATL_SYNC_JOB', 'RFQ_DISPATCH_JOB', 'DATASHEET_EXTRACTION_JOB', 'TRANSLATION_JOB', 'SEO_REBUILD_JOB'];
  if (typeof type !== 'string' || !supportedJobs.includes(type) || !payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'INVALID_JOB_REQUEST' });
  }
  const { rows } = await getDatabasePool().query(
    'INSERT INTO platform_outbox (event_type, payload) VALUES ($1, $2::jsonb) RETURNING id, event_type, status, created_at',
    [type, JSON.stringify(payload)]
  );
  res.json({
    accepted: true,
    message: 'Завдання записано в durable outbox.',
    job: rows[0],
  });
});

// -------------------------------------------------------------
// 10. Audit Logs API
// -------------------------------------------------------------
app.get('/api/v1/audit', requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req: Request, res: Response) => {
  const { rows } = await getDatabasePool().query(
    'SELECT id, action, entity, entity_id, actor, timestamp, details FROM audit_logs ORDER BY timestamp DESC LIMIT 500'
  );
  res.json({ data: rows });
});

// -------------------------------------------------------------
// 11. Multi-Lingual Search & Documents API
// -------------------------------------------------------------
app.get('/api/v1/search', async (req: Request, res: Response) => {
  const query = String(req.query.q || '').trim().slice(0, 100);
  const locale = canonicalLocale(req.query.locale);
  if (query.length < 2) return res.json({ query, locale, total: 0, results: [] });
  const { rows } = await getDatabasePool().query(
    `SELECT p.id, COALESCE(t.name, p.name) AS title, p.category,
      COALESCE(t.short_desc, p.short_desc) AS snippet
     FROM pim_products p
     LEFT JOIN pim_product_translations t ON t.product_id = p.id AND t.locale = $2
     WHERE p.status = 'PUBLISHED'
       AND ($2 = 'uk-UA' OR (t.translation_status = 'PUBLISHED' AND t.source_revision = p.revision AND t.specifications <> '{}'::jsonb))
       AND (
       POSITION(lower($1) IN lower(COALESCE(t.name, p.name))) > 0 OR
       POSITION(lower($1) IN lower(p.family)) > 0 OR
       POSITION(lower($1) IN lower(p.category)) > 0 OR
       POSITION(lower($1) IN lower(COALESCE(t.short_desc, p.short_desc))) > 0 OR
       POSITION(lower($1) IN lower(COALESCE(t.highlight, p.highlight))) > 0
     ) ORDER BY p.name LIMIT 25`,
    [query, locale]
  );
  res.json({
    query, locale, total: rows.length,
    results: rows.map((product: any) => ({
      type: 'product', id: product.id, title: product.title, category: product.category,
      snippet: product.snippet, url: `/${locale}/products/${product.id}`,
    })),
  });
});

app.get('/api/v1/documents', async (req: Request, res: Response) => {
  const locale = canonicalLocale(req.query.locale);
  const productId = typeof req.query.product === 'string' ? req.query.product : null;
  const { rows } = await getDatabasePool().query(
    `SELECT d.id, d.title, d.document_type, d.locale, d.version, d.source_url,
      d.checksum_sha256, d.mime_type, d.size_bytes, p.name AS product_name
     FROM documents d LEFT JOIN pim_products p ON p.id = d.product_id
     WHERE d.published = true AND d.locale = $1 AND ($2::text IS NULL OR d.product_id = $2) ORDER BY d.title`,
    [locale, productId]
  );
  res.json({ documents: rows, total: rows.length });
});

// -------------------------------------------------------------
// 12. CRM Integration Webhook API
// -------------------------------------------------------------
app.post('/api/v1/crm/webhook', async (req: Request, res: Response) => {
  const configuredToken = process.env.CRM_WEBHOOK_TOKEN;
  const suppliedToken = String(req.headers['x-crm-token'] || '');
  if (!configuredToken) {
    return res.status(503).json({ error: 'CRM_WEBHOOK_NOT_CONFIGURED' });
  }
  const configuredBytes = Buffer.from(configuredToken);
  const suppliedBytes = Buffer.from(suppliedToken);
  if (configuredBytes.length !== suppliedBytes.length || !timingSafeEqual(configuredBytes, suppliedBytes)) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  const { event, dealId, status } = req.body || {};
  if (typeof event !== 'string' || event.length > 128 || (dealId !== undefined && typeof dealId !== 'string') || (status !== undefined && typeof status !== 'string')) {
    return res.status(400).json({ error: 'INVALID_WEBHOOK_PAYLOAD' });
  }
  await getDatabasePool().query(
    'INSERT INTO audit_logs (id, action, entity, entity_id, actor, details) VALUES ($1,$2,\'CRM\',$3,\'CRM webhook\',$4::jsonb)',
    [`AUD-${randomUUID()}`, `CRM_${event}`, String(dealId || 'EXTERNAL').slice(0, 64), JSON.stringify({ status: status || null })]
  );
  res.status(202).json({ accepted: true, timestamp: new Date().toISOString() });
});

app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).requestId || 'unknown';
  console.error(JSON.stringify({
    level: 'error',
    event: 'request_failed',
    requestId,
    error: error instanceof Error ? error.message : 'unknown',
  }));
  if (!res.headersSent) res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', requestId });
});

export default app;
