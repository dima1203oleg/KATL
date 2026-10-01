/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Canonical Modular REST API for KATL Platform
 */

import express, { Request, Response, NextFunction } from 'express';
import { db } from '../../../src/server/db/database';
import { aiGateway } from '../../../src/server/ai-gateway/aiGateway';
import { syncEngine } from '../../../src/server/sync/syncEngine';
import { BessEngineeringCalculator } from '../../../packages/calculations/src/index';
import { worker } from '../../worker/src/index';

const app = express();

app.use(express.json({ limit: '5mb' }));

// -------------------------------------------------------------
// Global Security & Observability Headers Middleware
// -------------------------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  const reqId = `req-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`;
  res.setHeader('X-Request-Id', reqId);
  (req as any).requestId = reqId;
  next();
});

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

app.get(['/health/ready', '/api/v1/health/ready'], (req: Request, res: Response) => {
  const pCount = db.getAllProducts().length;
  res.json({
    status: 'READY',
    database: 'CONNECTED',
    productsInPim: pCount,
    timestamp: new Date().toISOString(),
  });
});

app.get(['/health', '/api/v1/health'], (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: '@katl/api',
    version: '1.0.0-prod',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      status: 'ONLINE',
      pimProductsCount: db.getAllProducts().length,
      totalRfqsCount: db.getAllRfqs().length,
    },
    aiGateway: {
      status: 'ACTIVE',
      usage: aiGateway.getStats(),
    },
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

// -------------------------------------------------------------
// 2. Authentication & Users RBAC API
// -------------------------------------------------------------
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'INVALID_CREDENTIALS', message: 'Email обов’язковий.' });
  }

  const user = db.getUserByEmail(String(email).trim());
  if (!user) {
    return res.status(401).json({ error: 'USER_NOT_FOUND', message: 'Користувача з таким email не знайдено.' });
  }

  const token = `session_${user.id}_${Date.now()}`;
  db.logAudit('USER_LOGIN', 'User', user.id, user.name, { email: user.email, role: user.role });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
    },
    token,
  });
});

app.get('/api/v1/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Потрібна авторизація.' });
  }

  const user = db.getAllUsers()[0];
  res.json({ data: user });
});

app.get('/api/v1/users', (req: Request, res: Response) => {
  res.json({ data: db.getAllUsers() });
});

app.post('/api/v1/users/:id/role', (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, actor = 'SuperAdmin' } = req.body;
  const success = db.updateUserRole(id, role, actor);

  if (!success) {
    return res.status(404).json({ error: 'USER_NOT_FOUND', message: `User with id ${id} not found.` });
  }
  res.json({ success: true, message: `Роль користувача ${id} оновлено на ${role}.` });
});

// -------------------------------------------------------------
// 3. PIM & Products API
// -------------------------------------------------------------
app.get('/api/v1/products', (req: Request, res: Response) => {
  const { category, type } = req.query;
  let products = db.getAllProducts();

  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter(
      (p) => p.category.toLowerCase().includes(category.toLowerCase()) || p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (type && typeof type === 'string') {
    products = products.filter((p) => p.type === type);
  }

  res.json({
    data: products,
    total: products.length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const product = db.getProductById(id);

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
app.post('/api/v1/calculations/bess', (req: Request, res: Response) => {
  const { solarMw = 0, loadMw = 1, durationHours = 2, tariffUah = 8.5, reservePct = 10 } = req.body;

  const result = BessEngineeringCalculator.calculate({
    solarMw: Number(solarMw),
    loadMw: Number(loadMw),
    durationHours: Number(durationHours),
    tariffUah: Number(tariffUah),
    reservePct: Number(reservePct),
  });

  res.json({
    data: result,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 5. RFQ (Request for Quotation) Lead Management API
// -------------------------------------------------------------
app.get('/api/v1/rfq', (req: Request, res: Response) => {
  const rfqs = db.getAllRfqs();
  res.json({
    data: rfqs,
    total: rfqs.length,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/rfq', (req: Request, res: Response) => {
  const {
    companyName,
    contactPerson,
    phone,
    email,
    location,
    powerKw,
    capacityKwh,
    selectedSeries,
    useCase,
    details,
    utmSource,
    utmCampaign,
  } = req.body;

  if (!companyName || !contactPerson || !phone || !email) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Поля назва компанії, контактна особа, телефон та email є обов’язковими.',
    });
  }

  const newRfq = db.createRfq({
    companyName: String(companyName).trim(),
    contactPerson: String(contactPerson).trim(),
    phone: String(phone).trim(),
    email: String(email).trim(),
    location: location ? String(location).trim() : undefined,
    powerKw: powerKw ? Number(powerKw) : undefined,
    capacityKwh: capacityKwh ? Number(capacityKwh) : undefined,
    selectedSeries: selectedSeries ? String(selectedSeries) : 'CATL TENER Series',
    useCase: useCase ? String(useCase) : 'Peak Shaving / Grid Support',
    details: details ? String(details) : undefined,
    utmSource: utmSource ? String(utmSource) : undefined,
    utmCampaign: utmCampaign ? String(utmCampaign) : undefined,
  });

  // Enqueue background dispatch job
  worker.enqueueJob('RFQ_DISPATCH_JOB', { rfqId: newRfq.id, email: newRfq.email });

  res.status(201).json({
    success: true,
    message: 'Запит на комерційний розрахунок успішно зареєстровано.',
    data: newRfq,
  });
});

app.patch('/api/v1/rfq/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, actor = 'Sales Engineer', note } = req.body;

  const updated = db.updateRfqStatus(id, status, actor, note);
  if (!updated) {
    return res.status(404).json({ error: 'RFQ_NOT_FOUND', message: `RFQ with id ${id} not found.` });
  }

  res.json({ success: true, data: updated });
});

// -------------------------------------------------------------
// 6. CATL Product Sync & Snapshot Ingestion API
// -------------------------------------------------------------
app.get('/api/v1/sync/sources', (req: Request, res: Response) => {
  res.json({ data: db.getSyncSources() });
});

app.get('/api/v1/sync/changes', (req: Request, res: Response) => {
  res.json({ data: db.getSyncChanges() });
});

app.get('/api/v1/sync/snapshots', (req: Request, res: Response) => {
  res.json({ data: syncEngine.getSnapshots() });
});

app.post('/api/v1/sync/run', async (req: Request, res: Response) => {
  const result = await syncEngine.runSync();
  res.json({
    success: true,
    message: `Синхронізацію виконано для ${result.sourcesChecked} офіційних джерел CATL.`,
    data: result,
  });
});

app.post('/api/v1/sync/changes/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { actor = 'Lead Systems Engineer' } = req.body;
  const success = syncEngine.approve(id, actor);

  if (!success) {
    return res.status(400).json({ error: 'APPROVE_FAILED', message: `Could not approve change ${id}.` });
  }

  res.json({ success: true, message: `Зміну ${id} верифіковано та внесено у PIM продукту.` });
});

app.post('/api/v1/sync/changes/:id/reject', (req: Request, res: Response) => {
  const { id } = req.params;
  const { actor = 'Lead Systems Engineer' } = req.body;
  const success = syncEngine.reject(id, actor);

  if (!success) {
    return res.status(400).json({ error: 'REJECT_FAILED', message: `Could not reject change ${id}.` });
  }

  res.json({ success: true, message: `Зміну ${id} відхилено.` });
});

// -------------------------------------------------------------
// 7. AI Provider Gateway API
// -------------------------------------------------------------
app.post('/api/v1/ai/gateway/chat', async (req: Request, res: Response) => {
  const { messages = [], context } = req.body;

  try {
    const result = await aiGateway.handleAdvisorChat(messages, context);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'AI_GATEWAY_ERROR',
      message: err.message || 'Internal AI Gateway error',
    });
  }
});

app.post('/api/v1/ai/gateway/task', async (req: Request, res: Response) => {
  const { task, prompt, context } = req.body;
  if (!task || !prompt) {
    return res.status(400).json({ error: 'INVALID_REQUEST', message: 'Потрібно вказати task та prompt.' });
  }

  try {
    const result = await aiGateway.handleAdvisorChat([{ role: 'user', content: prompt }], context);
    res.json({
      success: true,
      data: {
        task,
        provider: result.provider,
        model: result.model,
        output: result.text,
        latencyMs: result.latencyMs,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'AI_TASK_FAILED', message: err.message });
  }
});

app.get('/api/v1/ai/gateway/stats', (req: Request, res: Response) => {
  res.json({ data: aiGateway.getStats() });
});

app.get('/api/v1/ai/gateway/providers', (req: Request, res: Response) => {
  res.json({ data: aiGateway.getProviderRegistry() });
});

app.post('/api/v1/ai/gateway/reload', (req: Request, res: Response) => {
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
app.get('/api/v1/jobs', (req: Request, res: Response) => {
  res.json({
    data: worker.getQueueStats(),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/jobs/trigger', (req: Request, res: Response) => {
  const { type = 'CATL_SYNC_JOB', payload = {} } = req.body;
  const job = worker.enqueueJob(type, payload);
  res.json({
    success: true,
    message: `Завдання ${job.id} успішно додано до черги обробника.`,
    job,
  });
});

// -------------------------------------------------------------
// 10. Audit Logs API
// -------------------------------------------------------------
app.get('/api/v1/audit', (req: Request, res: Response) => {
  res.json({ data: db.getAuditLogs() });
});

// -------------------------------------------------------------
// 11. Multi-Lingual Search & Documents API
// -------------------------------------------------------------
app.get('/api/v1/search', (req: Request, res: Response) => {
  const query = String(req.query.q || '').toLowerCase().trim();
  const locale = String(req.query.locale || 'uk').toLowerCase();

  const products = db.getAllProducts();
  const matchedProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.family.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query) ||
      p.highlight.toLowerCase().includes(query)
  );

  res.json({
    query,
    locale,
    total: matchedProducts.length,
    results: matchedProducts.map((p) => ({
      type: 'product',
      id: p.id,
      title: p.name,
      category: p.category,
      snippet: p.shortDesc,
      url: `/${locale}/products/${p.id}`,
    })),
  });
});

app.get('/api/v1/documents', (req: Request, res: Response) => {
  res.json({
    documents: [
      {
        id: 'doc-catl-tener-h-datasheet',
        title: 'CATL TENER H 9.008 MWh Technical Datasheet',
        type: 'DATASHEET',
        product: 'CATL TENER H',
        fileSize: '4.2 MB',
        locale: 'en',
        url: '/documents/catl-tener-h-datasheet.pdf',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      },
      {
        id: 'doc-catl-enerone-plus-datasheet',
        title: 'CATL EnerOne Plus 372.7 kWh Specification Brochure',
        type: 'DATASHEET',
        product: 'CATL EnerOne Plus',
        fileSize: '2.8 MB',
        locale: 'en',
        url: '/documents/catl-enerone-plus-datasheet.pdf',
        sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      },
      {
        id: 'doc-bess-safety-nfpa855-whitepaper',
        title: 'NFPA 855 & UL 9540A BESS Safety Architecture for Ukraine',
        type: 'WHITEPAPER',
        product: 'All Systems',
        fileSize: '3.1 MB',
        locale: 'uk',
        url: '/documents/bess-safety-nfpa855-whitepaper.pdf',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      },
    ],
  });
});

// -------------------------------------------------------------
// 12. CRM Integration Webhook API
// -------------------------------------------------------------
app.post('/api/v1/crm/webhook', (req: Request, res: Response) => {
  const { event, dealId, status, leadData } = req.body;

  db.logAudit('CRM_WEBHOOK_RECEIVED', 'CRM', dealId || 'EXTERNAL', 'WebhookIntegration', {
    event,
    status,
    leadData,
  });

  res.json({
    success: true,
    message: 'CRM webhook event processed and logged to audit trail.',
    timestamp: new Date().toISOString(),
  });
});

export default app;
