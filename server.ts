/**
 * Full-Stack Production Server for KATL Platform
 * Bridges Canonical REST API (@katl/api) with Frontend Runtime on Port 3000.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import canonicalApi from './apps/api/src/app';
import { db } from './src/server/db/database';

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

// -------------------------------------------------------------
// 1. Mount Canonical Modular API (@katl/api)
// -------------------------------------------------------------
app.use(canonicalApi);

// -------------------------------------------------------------
// 2. SEO & Crawlers (Sitemap & Robots)
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
// 3. Frontend Mounting (Vite in Dev / Static in Prod)
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
