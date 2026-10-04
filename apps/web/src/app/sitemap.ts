import type { MetadataRoute } from 'next';
import type { KatlProduct } from '@katl/shared-types';
import { pimRepository } from '../lib/pim/pimRepository';
import { solutions } from '../data/solutions';
import { BRAND, LOCALES } from '../lib/brand';

const origin = BRAND.siteUrl;
const industries = ['manufacturing', 'agriculture', 'logistics', 'data-centres', 'retail', 'ev-charging', 'hotels'];

/** Routes implemented and translated in all three locales. */
const multilingualRoutes = [
  '/', '/products', '/solutions', ...solutions.map((s) => `/solutions/${s.slug}`),
  '/industries', ...industries.map((s) => `/industries/${s}`),
  '/engineering', '/engineering/bess-calculator', '/engineering/lcos', '/engineering/single-line-diagram',
  '/bess-designer', '/compare', '/documents', '/resources', '/resources/glossary', '/partner', '/rfq',
];
/** Substantive routes that currently exist only in Ukrainian (other locales are noindex). */
const ukOnlyRoutes = ['/bess', '/catl-ukraine', '/energy-storage-ukraine', '/resources/guides/how-to-choose-bess'];

const url = (locale: string, path: string) => `${origin}/${locale}${path === '/' ? '' : path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const path of multilingualRoutes) {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, url(l, path)]));
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, path),
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? (locale === 'uk-UA' ? 1 : 0.8) : locale === 'uk-UA' ? 0.7 : 0.5,
        alternates: { languages },
      });
    }
  }
  for (const path of ukOnlyRoutes) {
    entries.push({ url: url('uk-UA', path), changeFrequency: 'monthly', priority: 0.6 });
  }

  const productsByLocale: Array<[string, KatlProduct[]]> = await Promise.all(LOCALES.map(async (locale) => {
    try { return [locale, await pimRepository.getAllProducts(locale)] as [string, KatlProduct[]]; }
    catch { return [locale, []] as [string, KatlProduct[]]; }
  }));
  const localeProducts = new Map<string, KatlProduct[]>(productsByLocale);
  for (const product of localeProducts.get('uk-UA') || []) {
    const path = `/products/${encodeURIComponent(product.id)}`;
    const languages: Record<string, string> = { 'uk-UA': url('uk-UA', path) };
    for (const locale of ['en', 'zh-CN']) {
      if (localeProducts.get(locale)?.some((p) => p.id === product.id)) languages[locale] = url(locale, path);
    }
    for (const [, href] of Object.entries(languages)) {
      entries.push({
        url: href,
        lastModified: (product as typeof product & { updatedAt?: string }).updatedAt || undefined,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }
  return entries;
}
