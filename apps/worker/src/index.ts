import dotenv from 'dotenv';
import { createHash, randomUUID } from 'node:crypto';
import { Buffer } from 'node:buffer';
import nodemailer from 'nodemailer';
import type { PoolClient } from 'pg';
import { getDatabasePool, closeDatabasePool } from '../../../packages/database/src/client';
import {
  closePlatformQueues,
  createPlatformWorker,
  enqueuePlatformJob,
  getPlatformQueue,
  QUEUE_NAMES,
  type PlatformQueueName,
} from '../../../packages/queue/src/index';

dotenv.config();

const queueByEvent: Record<string, PlatformQueueName> = {
  CATL_SYNC_JOB: 'product-sync',
  RFQ_DISPATCH_JOB: 'rfq-dispatch',
  DATASHEET_EXTRACTION_JOB: 'document-processing',
  TRANSLATION_JOB: 'translations',
  SEO_REBUILD_JOB: 'seo',
};

async function dispatchRfq(rfqId: string) {
  const pool = getDatabasePool();
  const { rows } = await pool.query(
    'SELECT id, company_name, contact_person, phone, email, location, power_kw, capacity_kwh, duration_hours, selected_series, use_case, details FROM rfq_records WHERE id = $1',
    [rfqId]
  );
  const rfq = rows[0];
  if (!rfq) throw new Error(`RFQ_NOT_FOUND:${rfqId}`);

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const recipient = process.env.NOTIFICATION_EMAIL;
  if (!host || !recipient) throw new Error('SMTP_NOT_CONFIGURED');
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' } } : {}),
  });

  const fields = [
    `Company: ${rfq.company_name}`,
    `Contact: ${rfq.contact_person}`,
    `Email: ${rfq.email}`,
    `Phone: ${rfq.phone}`,
    `Location: ${rfq.location || '—'}`,
    `Power (kW): ${rfq.power_kw ?? '—'}`,
    `Capacity (kWh): ${rfq.capacity_kwh ?? '—'}`,
    `Duration (h): ${rfq.duration_hours ?? '—'}`,
    `Product: ${rfq.selected_series}`,
    `Use case: ${rfq.use_case}`,
    `Description: ${rfq.details || '—'}`,
    `RFQ ID: ${rfq.id}`,
  ];
  const delivery = await transporter.sendMail({
    to: recipient,
    replyTo: rfq.email,
    subject: `New KATL RFQ ${rfq.id}`,
    text: fields.join('\n'),
    messageId: `<${createHash('sha256').update(rfq.id).digest('hex')}@katl.local>`,
  });

  if (!delivery.accepted?.length) throw new Error('SMTP_RECIPIENT_NOT_ACCEPTED');

  const crmUrl = process.env.CRM_WEBHOOK_URL;
  let crmStatus = 'PENDING';
  if (crmUrl) {
    const response = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.CRM_WEBHOOK_TOKEN ? { 'x-crm-token': process.env.CRM_WEBHOOK_TOKEN } : {}),
      },
      body: JSON.stringify({ event: 'rfq.created', rfq }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`CRM_WEBHOOK_HTTP_${response.status}`);
    crmStatus = 'SYNCED';
  }

  await pool.query(
    `UPDATE rfq_records SET crm_sync_status = $1, updated_at = NOW() WHERE id = $2`,
    [crmStatus, rfq.id]
  );
  await pool.query(
    `INSERT INTO audit_logs (id, action, entity, entity_id, actor, details)
     VALUES ($1, 'RFQ_NOTIFICATION_DELIVERED', 'RFQ', $2, 'Worker', jsonb_build_object('messageId', $3::text, 'crmStatus', $4::text))`,
    [`AUD-${randomUUID()}`, rfq.id, delivery.messageId || null, crmStatus]
  );
}

function parseJsonLd(html: string): any[] {
  const values: any[] = [];
  const scripts = html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    try {
      const parsed = JSON.parse(match[1]);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (Array.isArray(entry?.['@graph'])) values.push(...entry['@graph']);
        else values.push(entry);
      }
    } catch {
      // Invalid structured metadata is evidence we cannot safely use.
    }
  }
  return values;
}

async function runCatlSync() {
  const pool = getDatabasePool();
  const { rows: sources } = await pool.query(
    'SELECT id, name, url, source_type, product_id FROM sync_sources WHERE enabled = true ORDER BY id'
  );
  const outcomes: Array<{ sourceId: string; status: string; changes: number; error?: string }> = [];
  for (const source of sources) {
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:' || !/(^|\.)catl\.com(?:\.cn)?$/i.test(url.hostname)) throw new Error('SOURCE_HOST_NOT_ALLOWED');
      const response = await fetch(url, {
        redirect: 'error',
        headers: {
          'User-Agent': 'KATL-BESS-Product-Monitor/1.0 (+https://katl-energy.com.ua/contact)',
          Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.5',
        },
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`SOURCE_HTTP_${response.status}`);
      const contentType = (response.headers.get('content-type') || 'application/octet-stream').split(';')[0];
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength > 15 * 1024 * 1024) throw new Error('SOURCE_TOO_LARGE');
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      const isPdf = contentType === 'application/pdf' || url.pathname.toLowerCase().endsWith('.pdf');
      const bodyEncoding = isPdf ? 'base64' : 'utf8';
      const rawPayload = isPdf ? bytes.toString('base64') : bytes.toString('utf8');
      const client = await pool.connect();
      let snapshotId: string;
      try {
        await client.query('BEGIN');
        const saved = await client.query(
          `INSERT INTO sync_snapshots (source_id, content_hash, raw_payload, captured_at, http_status, content_type, body_encoding, size_bytes, source_url)
           VALUES ($1,$2,$3,NOW(),$4,$5,$6,$7,$8)
           ON CONFLICT (source_id, content_hash) DO UPDATE SET captured_at = NOW(), source_url = EXCLUDED.source_url
           RETURNING id`,
          [source.id, sha256, rawPayload, response.status, contentType, bodyEncoding, bytes.byteLength, source.url]
        );
        snapshotId = saved.rows[0].id;
        await client.query('UPDATE sync_sources SET last_checked = NOW(), last_hash = $1 WHERE id = $2', [sha256, source.id]);

        let changes = 0;
        if (!isPdf && source.product_id) {
          const productResult = await client.query(
            'SELECT id, name, short_desc FROM pim_products WHERE id = $1 FOR UPDATE',
            [source.product_id]
          );
          const product = productResult.rows[0];
          const structured = parseJsonLd(rawPayload).find((value) => {
            const type = Array.isArray(value?.['@type']) ? value['@type'] : [value?.['@type']];
            return type.some((item: unknown) => String(item).toLowerCase() === 'product');
          });
          if (product && structured) {
            const candidates: Array<{ field: string; oldValue: string; newValue: string; evidence: string }> = [];
            if (typeof structured.name === 'string' && structured.name.trim() && structured.name.trim() !== product.name) {
              candidates.push({ field: 'name', oldValue: product.name, newValue: structured.name.trim().slice(0, 255), evidence: JSON.stringify({ name: structured.name }) });
            }
            if (typeof structured.description === 'string' && structured.description.trim() && structured.description.trim() !== product.short_desc) {
              candidates.push({ field: 'short_desc', oldValue: product.short_desc, newValue: structured.description.trim().slice(0, 4000), evidence: JSON.stringify({ description: structured.description }).slice(0, 4000) });
            }
            for (const candidate of candidates) {
              const existing = await client.query(
                "SELECT 1 FROM sync_changes WHERE product_id = $1 AND field = $2 AND status = 'PENDING_REVIEW' LIMIT 1",
                [product.id, candidate.field]
              );
              if (existing.rowCount) continue;
              await client.query(
                'INSERT INTO sync_changes (id, product_id, product_name, field, old_value, new_value, source_url, confidence, snapshot_id, evidence_excerpt) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,\'MEDIUM\',$8,$9)',
                [`CHG-${randomUUID()}`, product.id, product.name, candidate.field, JSON.stringify(candidate.oldValue), JSON.stringify(candidate.newValue), source.url, snapshotId, candidate.evidence]
              );
              changes++;
            }
          }
        }
        await client.query('COMMIT');
        outcomes.push({ sourceId: source.id, status: isPdf ? 'SNAPSHOT_SAVED_EXTRACTION_PENDING' : 'SNAPSHOT_SAVED', changes });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      outcomes.push({ sourceId: source.id, status: 'FAILED', changes: 0, error: error instanceof Error ? error.message : 'unknown' });
    }
  }
  if (outcomes.some((outcome) => outcome.status === 'FAILED')) {
    throw new Error(`PRODUCT_SYNC_PARTIAL_FAILURE:${JSON.stringify(outcomes)}`);
  }
  console.log(JSON.stringify({ level: 'info', event: 'product_sync_finished', outcomes }));
}

async function processJob(queue: PlatformQueueName, job: { name: string; data: Record<string, any> }) {
  if (queue === 'product-sync' && job.name === 'CATL_SYNC_JOB') {
    await runCatlSync();
    return;
  }
  if (queue === 'rfq-dispatch' && job.name === 'RFQ_DISPATCH_JOB') {
    if (typeof job.data.rfqId !== 'string') throw new Error('INVALID_RFQ_JOB');
    await dispatchRfq(job.data.rfqId);
    return;
  }
  throw new Error(`HANDLER_NOT_CONFIGURED:${queue}:${job.name}`);
}

const workers = QUEUE_NAMES.map((queue) => {
  const worker = createPlatformWorker(queue, (job) => processJob(queue, job), { concurrency: 4 });
  worker.on('failed', (job, error) => {
    console.error(JSON.stringify({ level: 'error', event: 'job_failed', queue, jobId: job?.id, error: error.message }));
  });
  worker.on('completed', (job) => {
    console.log(JSON.stringify({ level: 'info', event: 'job_completed', queue, jobId: job.id, name: job.name }));
  });
  return worker;
});

let draining = false;
async function drainOutbox() {
  if (draining) return;
  draining = true;
  let client: PoolClient | null = null;
  try {
    const transactionClient = await getDatabasePool().connect();
    client = transactionClient;
    await transactionClient.query('BEGIN');
    const { rows } = await transactionClient.query(
      "SELECT id, event_type, payload FROM platform_outbox WHERE status = 'PENDING' ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 25"
    );
    for (const event of rows) {
      const queue = queueByEvent[event.event_type];
      if (!queue) {
        await transactionClient.query("UPDATE platform_outbox SET status = 'FAILED', last_error = $1 WHERE id = $2", ['Unsupported event type', event.id]);
        continue;
      }
      const job = await enqueuePlatformJob(queue, event.event_type, event.payload, { jobId: event.id });
      await transactionClient.query(
        "UPDATE platform_outbox SET status = 'QUEUED', queue_job_id = $1, attempts = attempts + 1, queued_at = NOW(), last_error = NULL WHERE id = $2",
        [job.id, event.id]
      );
    }
    await transactionClient.query('COMMIT');
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => undefined);
    console.error(JSON.stringify({ level: 'error', event: 'outbox_drain_failed', error: error instanceof Error ? error.message : 'unknown' }));
  } finally {
    client?.release();
    draining = false;
  }
}

const outboxTimer = setInterval(() => void drainOutbox(), 2000);
void drainOutbox();
void getPlatformQueue('product-sync').add('CATL_SYNC_JOB', {}, {
  jobId: 'catl-scheduled-sync',
  repeat: { every: 6 * 60 * 60 * 1000 },
}).catch((error) => {
  console.error(JSON.stringify({ level: 'error', event: 'product_sync_schedule_failed', error: error instanceof Error ? error.message : 'unknown' }));
});
console.log(JSON.stringify({ level: 'info', event: 'worker_started', queues: QUEUE_NAMES }));

async function shutdown() {
  clearInterval(outboxTimer);
  await Promise.all(workers.map((worker) => worker.close()));
  await closePlatformQueues();
  await closeDatabasePool();
  process.exit(0);
}

process.once('SIGTERM', () => void shutdown());
process.once('SIGINT', () => void shutdown());
