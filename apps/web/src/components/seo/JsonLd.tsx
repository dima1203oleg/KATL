import { BRAND, pick, type Locale } from '../../lib/brand';

/** Renders schema.org JSON-LD safely (escapes `<` to prevent script injection). */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function siteGraph(locale: Locale) {
  const url = BRAND.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: BRAND.name,
        url,
        description: pick(BRAND.disclosure, locale),
        knowsAbout: [
          'Battery energy storage system (BESS)',
          'Energy storage system (ESS)',
          'Peak shaving',
          'Solar plus storage',
          'Energy arbitrage',
          'Levelized cost of storage (LCOS)',
          'Lithium iron phosphate (LFP) batteries',
          'Sodium-ion batteries',
          'Power conversion system (PCS)',
          'Energy management system (EMS)',
          'Battery management system (BMS)',
        ],
        areaServed: { '@type': 'Country', name: 'Ukraine' },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: `${BRAND.name} — ${pick(BRAND.tagline, locale)}`,
        inLanguage: ['uk-UA', 'en', 'zh-CN'],
        publisher: { '@id': `${url}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${url}/${locale}/search?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function breadcrumbLd(items: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${BRAND.siteUrl}${path}`,
    })),
  };
}

export function faqLd(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
