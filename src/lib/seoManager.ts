/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouteState } from '../router/useAppRouter';
import { getTitanProductById } from '../data/titanPlatformData';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  schemaJsonLd?: object[];
}

export function computeSeoMetadata(route: RouteState): SeoMetadata {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://katl-energy.com.ua';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalUrl = `${origin}${pathname}`;

  if (route.page === 'product' && route.productId) {
    const product = getTitanProductById(route.productId);
    const title = product 
      ? `${product.name} (${product.energySpecs.nominalCapacity}) — Промисловий BESS CATL в Україні`
      : 'Промисловий накопичувач енергії CATL — Специфікації BESS';
    const description = product
      ? `Офіційні технічні характеристики ${product.name}: номінальна ємність ${product.energySpecs.nominalCapacity}, C-rate ${product.energySpecs.cRate}, хімія ${product.cellSpecs.chemistry}, рідинне охолодження, розрахунок окупності та LCOS.`
      : 'Технічні характеристики та специфікації промислових BESS CATL в Україні.';

    const schemaJsonLd: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.name || 'CATL BESS System',
        description: description,
        brand: {
          '@type': 'Brand',
          name: 'CATL',
        },
        category: 'Battery Energy Storage System',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'USD',
          price: '0',
          priceValidUntil: '2027-12-31',
          url: canonicalUrl,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Головна',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Каталог BESS',
            item: `${origin}/products`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product?.name || route.productId,
            item: canonicalUrl,
          },
        ],
      },
    ];

    return {
      title,
      description,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      schemaJsonLd,
    };
  }

  if (route.page === 'catalog') {
    return {
      title: 'Каталог промислових систем накопичення енергії BESS CATL в Україні',
      description: 'Офіційний модельний ряд BESS CATL: контейнерні накопичувачі TENER, EnerOne, EnerC, шафові рішення для промисловості та сонячних електростанцій.',
      canonicalUrl,
      ogTitle: 'Каталог BESS CATL в Україні — TENER, EnerOne Plus, EnerC+',
      ogDescription: 'Вибір потужності від 100 кВт до 50+ МВт. Контейнерні та шафові BESS CATL для бізнесу.',
      schemaJsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Каталог промислових систем накопичення енергії BESS CATL',
          description: 'Модельний ряд BESS CATL в Україні',
          url: canonicalUrl,
        },
      ],
    };
  }

  if (route.page === 'compare') {
    return {
      title: 'Порівняння характеристик систем накопичення енергії BESS CATL',
      description: 'Порівняння параметрів CATL TENER H, TENER S, EnerOne Plus: ємність (МВт·год), потужність (кВт), C-rate, вага, габарити та LCOS.',
      canonicalUrl,
      ogTitle: 'Порівняння моделей BESS CATL',
      ogDescription: 'Інженерне порівняння параметрів промислових накопичувачів енергії.',
    };
  }

  if (route.page === 'solutions') {
    return {
      title: 'Готові рішення BESS для підприємств та ВДЕ в Україні — CATL',
      description: 'Інженерні рішення CATL BESS: Peak Shaving (зрізання піків), Solar + Storage для СЕС, Microgrid, автономне та резервне живлення об’єктів критичної інфраструктури.',
      canonicalUrl,
      ogTitle: 'Інженерні рішення BESS CATL для бізнесу',
      ogDescription: 'Зниження витрат на потужність, арбітраж та резервне живлення промислових об’єктів.',
    };
  }

  // Default Home Page
  return {
    title: 'CATL BESS Ukraine — Промислові накопичувачі енергії | Офіційна платформа',
    description: 'Офіційна інженерна платформа промислових систем накопичення енергії (BESS / ESS) CATL в Україні: CATL TENER, EnerOne, конфігуратор потужності та розрахунок ROI.',
    canonicalUrl,
    ogTitle: 'CATL BESS Ukraine — Системи накопичення енергії',
    ogDescription: 'Промислові системи зберігання енергії CATL. Конфігуратор BESS, моделювання LCOS, розрахунок окупності.',
    schemaJsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CATL BESS Ukraine Engineering',
        url: origin,
        logo: `${origin}/logo.png`,
        description: 'Платформа інжинірингу та постачання промислових накопичувачів енергії CATL',
      },
    ],
  };
}

export function applySeoToDocument(seo: SeoMetadata) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = seo.title;

  // Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', seo.description);

  // Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', seo.canonicalUrl);

  // OpenGraph Tags
  const setOgMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setOgMeta('og:title', seo.ogTitle);
  setOgMeta('og:description', seo.ogDescription);
  setOgMeta('og:url', seo.canonicalUrl);
  setOgMeta('og:type', 'website');

  // JSON-LD Structured Data
  const existingScript = document.getElementById('seo-json-ld-data');
  if (existingScript) {
    existingScript.remove();
  }

  if (seo.schemaJsonLd && seo.schemaJsonLd.length > 0) {
    const script = document.createElement('script');
    script.id = 'seo-json-ld-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(seo.schemaJsonLd);
    document.head.appendChild(script);
  }
}
