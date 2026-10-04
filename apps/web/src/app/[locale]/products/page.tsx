import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search, ShieldCheck, ArrowRight, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { pimRepository } from '../../../lib/pim/pimRepository';
import type { KatlProduct } from '@katl/shared-types';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const ui = {
  'uk-UA': {
    title: 'Каталог систем накопичення енергії CATL | Офіційна платформа в Україні',
    description: 'Офіційний каталог стаціонарних BESS та ESS CATL в Україні: системи для дому, бізнесу, підприємств, великі контейнери TENER та компоненти.',
    home: 'Головна',
    catalog: 'Каталог систем',
    heading: 'Системи накопичення енергії CATL',
    intro: 'Повний модельний ряд стаціонарних накопичувачів, батарейних шаф, контейнерних рішень та компонентів із верифікованими характеристиками.',
    searchLabel: 'Пошук у каталозі',
    placeholder: 'Пошук за моделлю (TENER, EnerOne, PR-15, 314Ah) або категорією...',
    search: 'Шукати',
    allTab: 'Всі системи (16)',
    unavailable: 'Каталог тимчасово оновлюється. Будь ласка, зачекайте або залиште запит.',
    empty: 'Для обраної категорії немає опублікованих продуктів',
    emptyText: 'Усі картки проходять інженерну верифікацію. Надішліть параметри вашого об’єкта, і ми підберемо конфігурацію.',
    rfq: 'Створити інженерний запит →',
    more: 'Детальніше →',
    compare: 'Порівняти',
    categories: [
      { key: 'Домашні системи', label: 'Домашні системи' },
      { key: 'Батарейні шафи', label: 'Батарейні шафи' },
      { key: 'Контейнерні BESS', label: 'Контейнерні BESS' },
      { key: 'Комерційні та промислові ESS', label: 'Комерційні та промислові' },
      { key: 'Великі BESS', label: 'Великі BESS' },
      { key: 'Компоненти', label: 'Компоненти' },
    ]
  },
  en: {
    title: 'CATL Energy Storage Systems Catalog | Official Ukraine Platform',
    description: 'Official stationary BESS & ESS catalog in Ukraine: Home storage, C&I cabinets, TENER container systems, and core components.',
    home: 'Home',
    catalog: 'Catalog',
    heading: 'CATL Energy Storage Systems',
    intro: 'Comprehensive lineup of utility-scale containers, outdoor cabinets, residential ESS, and certified engineering components.',
    searchLabel: 'Search catalog',
    placeholder: 'Search by model (TENER, EnerOne, PR-15, 314Ah) or category...',
    search: 'Search',
    allTab: 'All Systems (16)',
    unavailable: 'Catalog data is temporarily unavailable.',
    empty: 'No published products found in this category',
    emptyText: 'All items undergo rigorous engineering verification. Submit your site requirements for custom sizing.',
    rfq: 'Submit an engineering request →',
    more: 'View Details →',
    compare: 'Compare',
    categories: [
      { key: 'Домашні системи', label: 'Residential ESS' },
      { key: 'Батарейні шафи', label: 'Battery Cabinets' },
      { key: 'Контейнерні BESS', label: 'Container BESS' },
      { key: 'Комерційні та промислові ESS', label: 'Commercial & Industrial' },
      { key: 'Великі BESS', label: 'Utility BESS' },
      { key: 'Компоненти', label: 'Components' },
    ]
  },
  'zh-CN': {
    title: 'CATL 储能系统产品目录 | 乌克兰官方技术平台',
    description: 'CATL 乌克兰官方固定式储能产品目录：户用储能、工商业电池柜、天恒集装箱大储及核心部件。',
    home: '首页',
    catalog: '产品目录',
    heading: 'CATL 储能系统 (ESS / BESS)',
    intro: '涵盖公用事业级集装箱系统、户外储能柜、户用系统及原厂核心部件的完整产品矩阵。',
    searchLabel: '搜索产品',
    placeholder: '搜索型号 (天恒 TENER、EnerOne、PR-15、314Ah) 或分类...',
    search: '搜索',
    allTab: '全系列 (16)',
    unavailable: '目录数据暂时无法访问。',
    empty: '该分类下暂无已发布的产品',
    emptyText: '所有产品参数均经过严格技术核实。如需选型帮助，请提交工程咨询。',
    rfq: '提交工程咨询 →',
    more: '查看详情 →',
    compare: '对比',
    categories: [
      { key: 'Домашні системи', label: '户用储能' },
      { key: 'Батарейні шафи', label: '户外电池柜' },
      { key: 'Контейнерні BESS', label: '集装箱储能' },
      { key: 'Комерційні та промислові ESS', label: '工商业储能' },
      { key: 'Великі BESS', label: '电网级大储' },
      { key: 'Компоненти', label: '核心部件' },
    ]
  }
} as const;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  let hasPublishedProducts = false;
  try {
    hasPublishedProducts = (await pimRepository.getAllProducts(locale)).length > 0;
  } catch {}
  const hasFilters = Object.values(query).some(Boolean);
  const t = ui[locale as keyof typeof ui] ?? ui['uk-UA'];
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/${locale}/products` },
    ...(!hasPublishedProducts || hasFilters ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const [{ locale }, { category, q }] = await Promise.all([params, searchParams]);
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();
  const t = ui[locale as keyof typeof ui];

  let products: KatlProduct[] | null = null;
  try {
    products = await pimRepository.getAllProducts(locale, category ? { category } : {});
    if (q && products) {
      const queryLower = q.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.shortDesc.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower) ||
          p.family.toLowerCase().includes(queryLower)
      );
    }
  } catch {
    products = null;
  }

  return (
    <main className="catalog-page">
      {/* Catalog Hero */}
      <section className="page-hero catalog-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{t.home}</Link> / {t.catalog}
          </div>
          <div className="eyebrow">CATL ENERGY STORAGE PLATFORM</div>
          <AnimatedSection direction="up" delay={0.05}>
            <h1>{t.heading}</h1>
            <p>{t.intro}</p>
          </AnimatedSection>

          <form action={`/${locale}/products`} className="search-box" style={{ maxWidth: 680, marginTop: 24 }}>
            <label className="sr-only" htmlFor="catalog-search">
              {t.searchLabel}
            </label>
            <input
              id="catalog-search"
              name="q"
              defaultValue={q || ''}
              placeholder={t.placeholder}
            />
            <button className="button" aria-label={t.search}>
              <Search size={16} /> {t.search}
            </button>
          </form>
        </div>
      </section>

      {/* Catalog Content Area */}
      <AnimatedSection className="content-section catalog-content">
        <div className="container">
          {/* Category Filter Tabs */}
          <div className="catalog-tabs">
            <Link
              className={`catalog-tab ${!category ? 'is-active' : ''}`}
              href={`/${locale}/products${q ? `?q=${encodeURIComponent(q)}` : ''}`}
            >
              <SlidersHorizontal size={13} style={{ marginRight: 6 }} />
              {t.allTab}
            </Link>
            {t.categories.map((cat) => (
              <Link
                key={cat.key}
                className={`catalog-tab ${category === cat.key ? 'is-active' : ''}`}
                href={`/${locale}/products?category=${encodeURIComponent(cat.key)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Grid or Empty Status */}
          {products === null ? (
            <div className="error-note" role="status">
              {t.unavailable}
            </div>
          ) : products.length ? (
            <AnimatedStaggerGroup className="product-grid" delay={0.1}>
              {products.map((product) => (
                <AnimatedStaggerItem key={product.id}>
                  <ProductCard product={product} locale={locale} labels={t} />
                </AnimatedStaggerItem>
              ))}
            </AnimatedStaggerGroup>
          ) : (
            <div className="empty-state">
              <ShieldCheck color="#005bff" size={28} />
              <div>
                <h3>{t.empty}</h3>
                <p>{t.emptyText}</p>
                <Link className="text-link" href={`/${locale}/rfq`}>
                  {t.rfq}
                </Link>
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    </main>
  );
}

function ProductCard({
  product,
  locale,
  labels,
}: {
  product: KatlProduct;
  locale: string;
  labels: typeof ui[keyof typeof ui];
}) {
  const isEn = locale === 'en';
  const isZh = locale === 'zh-CN';
  const imageNote = isEn ? 'Concept illustration' : isZh ? '概念插图' : 'Концептуальна ілюстрація';

  const energySpecs = product.energySpecs as any;
  const priceDisplay =
    energySpecs?.priceDisplayUah ||
    (isEn ? 'Price on request' : isZh ? '价格电议' : 'Ціна за запитом');

  return (
    <article className="product-card">
      <figure className="product-art">
        <img
          src={`/design/products/${product.id}.webp`}
          alt={product.name}
          width="240"
          height="140"
          loading="lazy"
        />
      </figure>

      <div className="product-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div className="product-kicker">
            {product.family} · {product.category}
          </div>
          <span className="provenance-tag">
            <ShieldCheck size={11} /> {isEn ? 'Verified' : isZh ? '已核验' : 'Перевірено'}
          </span>
        </div>

        <h2>{product.name}</h2>
        <p>{product.shortDesc}</p>

        <div className="product-data">
          {product.energySpecs.nominalCapacity && (
            <span className="data-chip">{product.energySpecs.nominalCapacity}</span>
          )}
          {product.energySpecs.nominalVoltage && (
            <span className="data-chip">{product.energySpecs.nominalVoltage}</span>
          )}
          {product.thermalSpecs.coolingMethod && (
            <span className="data-chip">{product.thermalSpecs.coolingMethod}</span>
          )}
        </div>

        {/* Dynamic Price Display */}
        <div className="card-price-badge">
          {priceDisplay}
        </div>

        <div className="product-actions">
          <Link className="text-link" href={`/${locale}/products/${encodeURIComponent(product.id)}`}>
            {labels.more}
          </Link>
          <Link className="text-link" href={`/${locale}/compare?products=${encodeURIComponent(product.id)}`}>
            {labels.compare}
          </Link>
        </div>
      </div>
    </article>
  );
}
