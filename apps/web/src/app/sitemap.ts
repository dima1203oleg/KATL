import type { MetadataRoute } from 'next';
import type { KatlProduct } from '@katl/shared-types';
import { pimRepository } from '../lib/pim/pimRepository';

const origin = (process.env.PUBLIC_SITE_URL || 'https://catl.site').replace(/\/$/, '');
const ukPublicRoutes = [
  '/', '/bess', '/catl-ukraine', '/energy-storage-ukraine', '/products',
  '/solutions', '/solutions/solar-bess', '/solutions/backup-power', '/solutions/peak-shaving',
  '/solutions/energy-arbitrage', '/industries', '/industries/manufacturing',
  '/industries/agriculture', '/engineering/bess-calculator', '/engineering/lcos',
  '/resources', '/resources/guides/how-to-choose-bess', '/resources/glossary',
  '/rfq',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // These are substantive, currently implemented public routes. Query/filter states,
  // unfinished locales, private paths, and unverified future products are excluded.
  const entries: MetadataRoute.Sitemap = ukPublicRoutes.map((path) => ({
    url: `${origin}/uk-UA${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.6,
  }));
  entries.push(
    { url: `${origin}/en`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${origin}/zh-CN`, changeFrequency: 'monthly', priority: 0.4 },
  );

  const productsByLocale: Array<[string, KatlProduct[]]> = await Promise.all(['uk-UA', 'en', 'zh-CN'].map(async (locale) => {
    try { return [locale, await pimRepository.getAllProducts(locale)]; }
    catch { return [locale, []]; }
  }));
  const localeProducts = new Map<string, KatlProduct[]>(productsByLocale);
  const ukProducts = localeProducts.get('uk-UA') || [];
  for (const product of ukProducts) {
    const languages: Record<string, string> = { 'uk-UA': `${origin}/uk-UA/products/${encodeURIComponent(product.id)}` };
    for (const locale of ['en', 'zh-CN']) {
      if (localeProducts.get(locale)?.some((translated) => translated.id === product.id)) {
        languages[locale] = `${origin}/${locale}/products/${encodeURIComponent(product.id)}`;
      }
    }
    entries.push({
      url: languages['uk-UA'],
      lastModified: (product as typeof product & { updatedAt?: string }).updatedAt || undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages },
    });
    for (const locale of ['en', 'zh-CN']) {
      if (languages[locale]) entries.push({ url: languages[locale], changeFrequency: 'monthly', priority: 0.7, alternates: { languages } });
    }
  }
  return entries;
}
