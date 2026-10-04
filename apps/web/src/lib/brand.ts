/**
 * Single source of truth for platform positioning.
 *
 * The relationship with CATL is controlled ONLY here. The site owner confirmed (04.10.2026)
 * that a CATL document backs a distribution status, so `catlRelationship` is 'distributor'.
 * Wording deliberately stays at "distributor": no "exclusive" / "sole" claims unless the
 * document says so. If the status changes, edit it here and every page follows.
 */
export type Locale = 'uk-UA' | 'en' | 'zh-CN';
export type CatlRelationship = 'independent' | 'partner' | 'distributor';

const RELATIONSHIP: CatlRelationship = 'distributor';

const DISCLOSURE: Record<CatlRelationship, Record<Locale, string>> = {
  independent: {
    'uk-UA': 'Незалежна інженерна платформа. CATL є виробником обладнання; статус партнерства публікується лише після документального підтвердження.',
    en: 'An independent engineering platform. CATL is the equipment manufacturer; any partnership status is published only once documented.',
    'zh-CN': '独立工程平台。CATL 为设备制造商；任何合作状态仅在书面确认后发布。',
  },
  partner: {
    'uk-UA': 'Партнер CATL з проєктів накопичення енергії в Україні. Підтвердний документ надаємо на запит.',
    en: 'CATL partner for energy storage projects in Ukraine. Supporting documentation available on request.',
    'zh-CN': 'CATL 乌克兰储能项目合作伙伴。证明文件可应要求提供。',
  },
  distributor: {
    'uk-UA': 'Дистриб’юція та інжиніринг систем накопичення енергії CATL в Україні. Статус підтверджено документом CATL — копію надаємо на запит.',
    en: 'Distribution and engineering of CATL energy storage systems in Ukraine. Status confirmed by a CATL document — copy available on request.',
    'zh-CN': 'CATL 储能系统乌克兰分销与工程服务。资质由 CATL 文件确认，可应要求提供副本。',
  },
};

export const BRAND = {
  /** Short name used in titles, schema.org and the header wordmark. */
  name: 'CATL ESS Ukraine',
  wordmark: 'CATL',
  wordmarkCaption: { 'uk-UA': 'СИСТЕМИ НАКОПИЧЕННЯ · УКРАЇНА', en: 'ENERGY STORAGE · UKRAINE', 'zh-CN': '储能系统 · 乌克兰' } satisfies Record<Locale, string>,
  legalName: 'CATL ESS Ukraine',
  siteUrl: (process.env.PUBLIC_SITE_URL || 'https://catl.site').replace(/\/$/, ''),
  catlRelationship: RELATIONSHIP,
  tagline: {
    'uk-UA': 'Системи накопичення енергії CATL в Україні',
    en: 'CATL Energy Storage Systems in Ukraine',
    'zh-CN': 'CATL 储能系统 · 乌克兰',
  } satisfies Record<Locale, string>,
  disclosure: DISCLOSURE[RELATIONSHIP],
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
