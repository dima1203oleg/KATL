import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import app from '../../apps/api/src/app.ts';
import { hashPassword } from '../../apps/api/src/auth';
import { closeDatabasePool, getDatabasePool } from '../../packages/database/src/client';
const expressApp = (app as any).default ?? app;

const server = expressApp.listen(0);
await once(server, 'listening');
const address = server.address();
if (!address || typeof address === 'string') {
  throw new Error('Test API did not bind to a TCP port');
}

after(async () => {
  server.close();
  await once(server, 'close');
  await closeDatabasePool();
});

test('live health endpoint responds over HTTP', async () => {
  const response = await fetch(`http://127.0.0.1:${address.port}/health/live`);
  const body = await response.json() as { status?: string };

  assert.equal(response.status, 200);
  assert.equal(body.status, 'LIVE');
});

test('administrative endpoints require an authenticated role', async () => {
  const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/users`);
  assert.equal(response.status, 401);
});

test('email-only authentication is rejected', async () => {
  const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@katl-energy.com.ua' }),
  });
  assert.equal(response.status, 400);
});

test('RFQ rejects malformed input before persistence', async () => {
  const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/rfq`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ companyName: 'x', email: 'not-an-email' }),
  });
  assert.equal(response.status, 400);
});

test('BESS sizing API validates input and returns only reproducible technical estimates', async () => {
  const valid = await fetch(`http://127.0.0.1:${address.port}/api/v1/calculations/bess`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ loadMw: 1.5, durationHours: 3, reservePct: 10 }),
  });
  assert.equal(valid.status, 200);
  const { data } = await valid.json() as { data: { requestedDeliverableEnergyMwh: number; nominalEnergyWithReserveMwh: number; limitations: string[]; recommendedProduct?: unknown } };
  assert.equal(data.requestedDeliverableEnergyMwh, 4.5);
  assert.equal(data.nominalEnergyWithReserveMwh, 4.95);
  assert.ok(data.limitations.length > 0);
  assert.equal(data.recommendedProduct, undefined);

  const invalid = await fetch(`http://127.0.0.1:${address.port}/api/v1/calculations/bess`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ loadMw: 0, durationHours: 2 }),
  });
  assert.equal(invalid.status, 400);
});

test('LCOS API calculates from explicit financial and operating inputs', async () => {
  const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/calculations/lcos`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      capexUsd: 27000, annualOpexUsd: 0, capacityKwh: 1000, cyclesPerYear: 300,
      degradationPct: 0, lifetimeYears: 10, roundTripEfficiencyPct: 90, discountRatePct: 0,
    }),
  });
  assert.equal(response.status, 200);
  const { data } = await response.json() as { data: { lcosUsdPerKwh: number; annualThroughputKwh: number; algorithmVersion: string } };
  assert.equal(data.lcosUsdPerKwh, 0.01);
  assert.equal(data.annualThroughputKwh, 270000);
  assert.equal(data.algorithmVersion, 'lcos-discounted-throughput-v1');

  const invalid = await fetch(`http://127.0.0.1:${address.port}/api/v1/calculations/lcos`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ capexUsd: 1 }),
  });
  assert.equal(invalid.status, 400);
});

test('CRM webhook stays closed without a configured secret', async () => {
  const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/crm/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ event: 'deal.updated' }),
  });
  assert.equal(response.status, 503);
});

test('PostgreSQL login, RFQ lifecycle, and audit close end to end', { skip: !process.env.DATABASE_URL }, async () => {
  const pool = getDatabasePool();
  const userId = `test-${randomUUID()}`;
  const email = `${userId}@example.test`;
  let rfqId: string | undefined;
  const productId = `pim-${randomUUID()}`;
  try {
    await pool.query(
      'INSERT INTO users (id, email, name, role, password_hash) VALUES ($1,$2,$3,\'SUPER_ADMIN\',$4)',
      [userId, email, 'Integration Test Admin', hashPassword('Integration-Test-Password-2026')]
    );

    const login = await fetch(`http://127.0.0.1:${address.port}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password: 'Integration-Test-Password-2026' }),
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie');
    assert.ok(cookie?.includes('HttpOnly'));
    const sessionCookie = cookie!.split(';', 1)[0];

    const deniedPim = await fetch(`http://127.0.0.1:${address.port}/api/v1/admin/products`);
    assert.equal(deniedPim.status, 401);
    const invalidPimSource = await fetch(`http://127.0.0.1:${address.port}/api/v1/admin/products`, {
      method: 'POST', headers: { 'content-type': 'application/json', cookie: sessionCookie },
      body: JSON.stringify({ id: productId, name: 'Untrusted draft', family: 'TEST', category: 'Utility-scale ESS', productType: 'ESS_SYSTEM', sourceUrl: 'https://example.test/product' }),
    });
    assert.equal(invalidPimSource.status, 400);
    const createPim = await fetch(`http://127.0.0.1:${address.port}/api/v1/admin/products`, {
      method: 'POST', headers: { 'content-type': 'application/json', cookie: sessionCookie },
      body: JSON.stringify({
        id: productId, name: 'Integration test draft', family: 'TEST', category: 'Utility-scale ESS', productType: 'ESS_SYSTEM',
        sourceUrl: 'https://www.catl.com/en/news/test-source', energySpecs: {}, cellSpecs: {}, mechanicalSpecs: {}, thermalSpecs: {}, safetySpecs: {}, compatibility: {},
      }),
    });
    assert.equal(createPim.status, 201);
    const createdPim = await createPim.json() as { data: { status: string; revision: number } };
    assert.equal(createdPim.data.status, 'DRAFT');
    assert.equal(createdPim.data.revision, 1);
    const sourceRow = await pool.query('SELECT url, product_id, enabled FROM sync_sources WHERE id = $1', [`SRC-${productId}`]);
    assert.deepEqual(sourceRow.rows[0], { url: 'https://www.catl.com/en/news/test-source', product_id: productId, enabled: true });

    const publicDraft = await fetch(`http://127.0.0.1:${address.port}/api/v1/products/${productId}`);
    assert.equal(publicDraft.status, 404);

    const updatePim = await fetch(`http://127.0.0.1:${address.port}/api/v1/admin/products/${productId}`, {
      method: 'PUT', headers: { 'content-type': 'application/json', cookie: sessionCookie },
      body: JSON.stringify({
        id: productId, name: 'Updated integration test draft', family: 'TEST', category: 'Utility-scale ESS', productType: 'ESS_SYSTEM',
        sourceUrl: 'https://www.catl.com/en/news/test-source', energySpecs: {}, cellSpecs: {}, mechanicalSpecs: {}, thermalSpecs: {}, safetySpecs: {}, compatibility: {},
      }),
    });
    assert.equal(updatePim.status, 200);
    const updatedPim = await updatePim.json() as { data: { status: string; revision: number } };
    assert.equal(updatedPim.data.status, 'DRAFT');
    assert.equal(updatedPim.data.revision, 2);
    const storedPim = await pool.query('SELECT name, status, revision, source_url FROM pim_products WHERE id = $1', [productId]);
    assert.deepEqual(storedPim.rows[0], { name: 'Updated integration test draft', status: 'DRAFT', revision: 2, source_url: 'https://www.catl.com/en/news/test-source' });
    const archivePim = await fetch(`http://127.0.0.1:${address.port}/api/v1/admin/products/${productId}`, { method: 'DELETE', headers: { cookie: sessionCookie } });
    assert.equal(archivePim.status, 200);
    const archivedSource = await pool.query('SELECT enabled FROM sync_sources WHERE id = $1', [`SRC-${productId}`]);
    assert.equal(archivedSource.rows[0].enabled, false);
    const archivedPim = await pool.query('SELECT status, revision FROM pim_products WHERE id = $1', [productId]);
    assert.deepEqual(archivedPim.rows[0], { status: 'ARCHIVED', revision: 3 });

    const create = await fetch(`http://127.0.0.1:${address.port}/api/v1/rfq`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Integration Test Company', contactPerson: 'Test Engineer',
        phone: '+10000000000', email: 'rfq@example.test', country: 'US',
        powerKw: 500, capacityKwh: 1000, durationHours: 2,
        useCase: 'integration test', utmSource: 'ci', selectedProducts: ['catl-tener-h'],
      }),
    });
    assert.equal(create.status, 201);
    const created = await create.json() as { data: { id: string } };
    rfqId = created.data.id;

    const stored = await pool.query('SELECT status, utm_source, selected_products FROM rfq_records WHERE id = $1', [rfqId]);
    assert.equal(stored.rows[0].status, 'NEW');
    assert.equal(stored.rows[0].utm_source, 'ci');
    assert.deepEqual(stored.rows[0].selected_products, ['catl-tener-h']);

    const update = await fetch(`http://127.0.0.1:${address.port}/api/v1/rfq/${rfqId}/status`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: sessionCookie },
      body: JSON.stringify({ status: 'QUALIFICATION', note: 'Integration test update' }),
    });
    assert.equal(update.status, 200);
    const history = await pool.query('SELECT old_status, new_status FROM rfq_status_history WHERE rfq_id = $1 ORDER BY created_at', [rfqId]);
    assert.deepEqual(history.rows.map((row) => row.new_status), ['NEW', 'QUALIFICATION']);

    const logout = await fetch(`http://127.0.0.1:${address.port}/api/v1/auth/logout`, {
      method: 'POST', headers: { cookie: sessionCookie },
    });
    assert.equal(logout.status, 204);
  } finally {
    if (rfqId) {
      await pool.query("DELETE FROM platform_outbox WHERE payload->>'rfqId' = $1", [rfqId]);
      await pool.query("DELETE FROM audit_logs WHERE entity = 'RFQ' AND entity_id = $1", [rfqId]);
      await pool.query('DELETE FROM rfq_records WHERE id = $1', [rfqId]);
    }
    await pool.query("DELETE FROM audit_logs WHERE entity = 'Product' AND entity_id = $1", [productId]);
    await pool.query('DELETE FROM sync_sources WHERE id = $1', [`SRC-${productId}`]);
    await pool.query('DELETE FROM pim_products WHERE id = $1', [productId]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  }
});
