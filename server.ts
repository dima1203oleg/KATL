/**
 * Full-Stack Production Server for KATL Platform
 * Combines Express API (v1) with Vite Dev Server / Static Production Server on Port 3000.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './src/server/db/database';
import { aiGateway } from './src/server/ai-gateway/aiGateway';
import { calculationService } from './src/server/calculations/calculationService';
import { syncEngine } from './src/server/sync/syncEngine';
import { worker } from './apps/worker/src/index';

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Security & Observability Headers Middleware
app.use((req: Request, res: Response, next) => {
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
  const dbReady = pCount > 0;
  if (!dbReady) {
    return res.status(503).json({ status: 'NOT_READY', reason: 'PIM database not bootstrapped' });
  }
  res.json({
    status: 'READY',
    database: 'CONNECTED',
    productsInPim: pCount,
    timestamp: new Date().toISOString(),
  });
});

app.get(['/health', '/api/v1/health'], (req: Request, res: Response) => {
  const pCount = db.getAllProducts().length;
  const rfqCount = db.getAllRfqs().length;
  const aiStats = aiGateway.getStats();

  res.json({
    status: 'HEALTHY',
    service: 'katl-bess-platform',
    version: '1.0.0-prod',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      status: 'ONLINE',
      pimProductsCount: pCount,
      totalRfqsCount: rfqCount,
    },
    aiGateway: {
      status: 'ACTIVE',
      usage: aiStats,
    },
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

// -------------------------------------------------------------
// 2. PIM (Product Information Management) API
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

  res.json({
    data: product,
    provenance: product.provenance,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 2.1. Authentication & RBAC API
// -------------------------------------------------------------
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'EMAIL_REQUIRED', message: 'Вкажіть корпоративний email для входу.' });
  }

  const user = db.authenticateUser(email);
  if (!user) {
    return res.status(401).json({
      error: 'AUTH_FAILED',
      message: 'Користувача з такою адресою не знайдено. Зверніться до адміністратора платформи для активації доступу.',
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        permissions: user.permissions,
      },
      token: user.sessionToken,
    },
  });
});

app.get('/api/v1/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Необхідна авторизація.' });
  }
  const token = authHeader.split(' ')[1];
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Сесія застаріла або недійсна.' });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      permissions: user.permissions,
      lastLoginAt: user.lastLoginAt,
    },
  });
});

app.get('/api/v1/users', (req: Request, res: Response) => {
  const users = db.getAllUsers().map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    company: u.company,
    permissions: u.permissions,
    lastLoginAt: u.lastLoginAt,
  }));
  res.json({ data: users, total: users.length });
});

app.post('/api/v1/users/:id/role', (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, actor = 'Super Administrator' } = req.body;
  const updated = db.updateUserRole(id, role, actor);
  if (!updated) {
    return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Користувача не знайдено.' });
  }
  res.json({ success: true, data: updated });
});

// -------------------------------------------------------------
// 2.2. Customer Projects & Workspace API
// -------------------------------------------------------------
app.get('/api/v1/customer/projects', (req: Request, res: Response) => {
  const { userId } = req.query;
  const projects = db.getCustomerProjects(typeof userId === 'string' ? userId : undefined);
  res.json({ data: projects, total: projects.length });
});

app.post('/api/v1/customer/projects', (req: Request, res: Response) => {
  const { userId = 'usr-customer-01', customerName, projectName, location, powerKw, capacityKwh, productSlug, lcosUsdPerKwh, capexUsd, status } = req.body;
  const project = db.createCustomerProject({
    userId,
    customerName: customerName || 'ПрАТ «Індустріал-Агро Плюс»',
    projectName: projectName || 'Новий BESS Проєкт',
    location: location || 'Україна',
    powerKw: Number(powerKw) || 1200,
    capacityKwh: Number(capacityKwh) || 2400,
    productSlug: productSlug || 'catl-tener-h',
    status: status || 'DRAFT',
    lcosUsdPerKwh: Number(lcosUsdPerKwh) || 0.059,
    capexUsd: Number(capexUsd) || 580000,
  });
  res.status(201).json({ success: true, data: project });
});

// -------------------------------------------------------------
// 2.3. Partner Deals & Workspace API
// -------------------------------------------------------------
app.get('/api/v1/partner/deals', (req: Request, res: Response) => {
  const { partnerId } = req.query;
  const deals = db.getPartnerDeals(typeof partnerId === 'string' ? partnerId : undefined);
  res.json({ data: deals, total: deals.length });
});

app.post('/api/v1/partner/deals', (req: Request, res: Response) => {
  const { partnerId = 'usr-partner-01', partnerCompanyName, clientCompanyName, dealSizeMwh, estimatedVolumeUsd, stage, productInterest, commissionRatePercent } = req.body;
  const deal = db.createPartnerDeal({
    partnerId,
    partnerCompanyName: partnerCompanyName || 'ТОВ «Енерго-Системи Інжиніринг»',
    clientCompanyName: clientCompanyName || 'Новий Клієнт',
    dealSizeMwh: Number(dealSizeMwh) || 5.0,
    estimatedVolumeUsd: Number(estimatedVolumeUsd) || 1200000,
    stage: stage || 'DEAL_REGISTRATION',
    productInterest: productInterest || 'CATL TENER H',
    commissionRatePercent: Number(commissionRatePercent) || 4.0,
  });
  res.status(201).json({ success: true, data: deal });
});

// -------------------------------------------------------------
// 3. RFQ (Request for Quotation) Lead Management API
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
    selectedSeries: selectedSeries || 'CATL TENER H',
    useCase: useCase || 'Peak Shaving',
    details: details ? String(details).trim() : undefined,
    utmSource: utmSource ? String(utmSource) : undefined,
    utmCampaign: utmCampaign ? String(utmCampaign) : undefined,
  });

  res.status(201).json({
    success: true,
    message: 'Комерційний запит успішно зареєстровано у системі інжинірингу CATL.',
    data: newRfq,
  });
});

app.patch('/api/v1/rfq/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, actor = 'Lead Engineer' } = req.body;

  const updated = db.updateRfqStatus(id, status, actor);
  if (!updated) {
    return res.status(404).json({ error: 'RFQ_NOT_FOUND', message: `RFQ ${id} not found.` });
  }

  res.json({ success: true, data: updated });
});

// -------------------------------------------------------------
// 4. Engineering Calculation API
// -------------------------------------------------------------
app.post('/api/v1/calculations/bess', (req: Request, res: Response) => {
  const { solarMw = 1.5, loadMw = 1.2, durationHours = 2, tariffUah = 8.5 } = req.body;

  const result = calculationService.calculate({
    solarMw: Number(solarMw),
    loadMw: Number(loadMw),
    durationHours: Number(durationHours),
    tariffUah: Number(tariffUah),
  });

  res.json({
    data: result,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 5. CATL Product Sync & Approval Engine API
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
// 6. AI Provider Gateway API
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
// 6.1. Localization Platform API
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
// 6.2. Background Jobs & Worker API
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
// 7. Audit Logs API
// -------------------------------------------------------------
app.get('/api/v1/audit', (req: Request, res: Response) => {
  res.json({ data: db.getAuditLogs() });
});

// -------------------------------------------------------------
// 7.1. SEO & Crawlers (Sitemap & Robots)
// -------------------------------------------------------------
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'katl-energy.com.ua';
  const protocol = req.protocol || 'https';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${protocol}://${host}/sitemap.xml
`);
});

app.get(['/sitemap.xml', '/api/v1/seo/sitemap.xml'], (req: Request, res: Response) => {
  const host = req.get('host') || 'katl-energy.com.ua';
  const protocol = req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;
  const now = new Date().toISOString().split('T')[0];

  const staticPages: Array<{ path: string; priority: string; changefreq: string; lastmod?: string }> = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/products', priority: '0.9', changefreq: 'daily' },
    { path: '/solutions', priority: '0.8', changefreq: 'weekly' },
    { path: '/solutions/peak-shaving', priority: '0.8', changefreq: 'weekly' },
    { path: '/solutions/solar-storage', priority: '0.8', changefreq: 'weekly' },
    { path: '/solutions/microgrid', priority: '0.8', changefreq: 'weekly' },
    { path: '/industries', priority: '0.8', changefreq: 'weekly' },
    { path: '/engineering', priority: '0.85', changefreq: 'weekly' },
    { path: '/safety', priority: '0.8', changefreq: 'monthly' },
    { path: '/compare', priority: '0.7', changefreq: 'weekly' },
    { path: '/partners', priority: '0.6', changefreq: 'monthly' },
  ];

  const products = db.getAllProducts();
  const productEntries = products.map((p) => ({
    path: `/products/${p.id}`,
    priority: '0.95',
    changefreq: 'daily',
    lastmod: p.provenance?.verifiedAt?.split('T')[0] || now,
  }));

  const allEntries = [...staticPages, ...productEntries];
  const locales = ['uk', 'en', 'zh-cn'];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const entry of allEntries) {
    const lastmod = entry.lastmod || now;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${entry.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    for (const loc of locales) {
      xml += `    <xhtml:link rel="alternate" hreflang="${loc}" href="${baseUrl}/${loc}${entry.path}" />\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${entry.path}" />\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// -------------------------------------------------------------
// 8. Frontend Mounting (Vite in Dev / Static in Prod)
// -------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    // Fallback for SPA real URL routing in dev mode
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KATL Platform] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
