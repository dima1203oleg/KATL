/**
 * Single source of truth for platform positioning.
 *
 * The relationship with CATL is controlled ONLY here. Until a documented status exists,
 * `catlRelationship` must stay 'independent' — no page may claim "official", "authorised",
 * "exclusive" or "partner" status. When a status is confirmed in writing, change it here
 * and every disclosure line updates together.
 */
export type Locale = 'uk-UA' | 'en' | 'zh-CN';
export type CatlRelationship = 'independent' | 'partner' | 'distributor';

export const BRAND = {
  name: 'KATL',
  legalName: 'KATL',
  siteUrl: (process.env.PUBLIC_SITE_URL || 'https://catl.site').replace(/\/$/, ''),
  catlRelationship: 'independent' as CatlRelationship,
  tagline: {
    'uk-UA': 'Платформа систем накопичення енергії',
    en: 'Energy Storage Platform',
    'zh-CN': '储能项目平台',
  } satisfies Record<Locale, string>,
  disclosure: {
    'uk-UA': 'KATL — незалежна інженерна платформа. CATL є виробником обладнання; статус партнерства публікується лише після документального підтвердження.',
    en: 'KATL is an independent engineering platform. CATL is the equipment manufacturer; any partnership status is published only once documented.',
    'zh-CN': 'KATL 为独立工程平台。CATL 为设备制造商；任何合作状态仅在书面确认后发布。',
  } satisfies Record<Locale, string>,
} as const;

export const LOCALES: Locale[] = ['uk-UA', 'en', 'zh-CN'];

export function asLocale(value: string | undefined): Locale {
  return value === 'en' || value === 'zh-CN' ? value : 'uk-UA';
}

/** Pick a localized string from a record keyed by locale. */
export function pick<T>(record: Record<Locale, T>, locale: string): T {
  return record[asLocale(locale)];
}

/** hreflang alternates for a locale-independent path (e.g. '/products'). */
export function languageAlternates(path: string) {
  const suffix = path === '/' ? '' : path;
  return {
    canonicalFor: (locale: string) => `/${asLocale(locale)}${suffix}`,
    languages: {
      'uk-UA': `/uk-UA${suffix}`,
      en: `/en${suffix}`,
      'zh-CN': `/zh-CN${suffix}`,
      'x-default': `/uk-UA${suffix}`,
    },
  };
}
