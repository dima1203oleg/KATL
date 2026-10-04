import Link from 'next/link';
import { ArrowRight, BatteryCharging, ShieldCheck } from 'lucide-react';
import type { KatlProduct } from '@katl/shared-types';

const copy = {
  'uk-UA': {
    eyebrow: 'CATL · ESS / BESS', title: 'Системи CATL у каталозі',
    intro: 'Показуємо лише картки, перевірені й опубліковані в PIM.',
    catalog: 'Увесь каталог', details: 'Детальніше', compare: 'Порівняти',
    empty: 'Перевірені картки продуктів з’являться тут після погодження в PIM.',
    unavailable: 'Каталог тимчасово недоступний.', imageNote: 'Концептуальна ілюстрація; не фото конкретної моделі.',
  },
  en: {
    eyebrow: 'CATL · ESS / BESS', title: 'CATL systems in the catalog',
    intro: 'Only products reviewed and published in PIM appear here.',
    catalog: 'Full catalog', details: 'Details', compare: 'Compare',
    empty: 'Reviewed product records will appear here after PIM approval.',
    unavailable: 'The catalog is temporarily unavailable.', imageNote: 'Concept illustration, not a photograph of this model.',
  },
  'zh-CN': {
    eyebrow: 'CATL · ESS / BESS', title: 'CATL 储能产品目录',
    intro: '此处仅展示经过审核并在 PIM 发布的产品。',
    catalog: '查看完整目录', details: '详情', compare: '比较',
    empty: '产品经 PIM 审核发布后将在此显示。',
    unavailable: '产品目录暂时无法访问。', imageNote: '概念插图，并非该型号的实物照片。',
  },
} as const;

export function LineupShowcase({
  products,
  locale = 'uk-UA',
  unavailable = false,
  limit = 6,
}: {
  products: KatlProduct[];
  locale?: string;
  unavailable?: boolean;
  limit?: number;
}) {
  const t = copy[locale as keyof typeof copy] ?? copy['uk-UA'];
  const visibleProducts = products.slice(0, limit);

  return (
    <section className="energy-lineup" aria-labelledby="energy-lineup-title">
      <div className="energy-section-head">
        <div>
          <span className="energy-kicker">{t.eyebrow}</span>
          <h2 id="energy-lineup-title">{t.title}</h2>
          <p>{t.intro}</p>
        </div>
        <Link href={`/${locale}/products`} className="energy-text-link">
          {t.catalog}<ArrowRight size={16} />
        </Link>
      </div>

      {unavailable ? (
        <div className="empty-state" role="status"><BatteryCharging aria-hidden="true"/><p>{t.unavailable}</p></div>
      ) : visibleProducts.length ? (
        <div className="energy-lineup-grid">
          {visibleProducts.map((product) => (
            <article key={product.id} className="energy-model-card">
              <Link className="energy-model-image" href={`/${locale}/products/${encodeURIComponent(product.id)}`} aria-label={`${t.details}: ${product.name}`}>
                <img
                  src={`/design/products/${product.id}.webp`}
                  alt={product.name}
                  width="180"
                  height="110"
                  loading="lazy"
                />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 4px' }}>
                <span className="energy-model-tag">{product.category}</span>
                <span className="provenance-tag"><ShieldCheck size={11}/> {locale === 'en' ? 'Verified CATL' : locale === 'zh-CN' ? '官方核实' : 'Перевірено'}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.shortDesc}</p>
              <div className="product-data">
                {product.energySpecs.nominalCapacity && <span className="data-chip">{product.energySpecs.nominalCapacity}</span>}
                {product.energySpecs.nominalVoltage && <span className="data-chip">{product.energySpecs.nominalVoltage}</span>}
                {product.thermalSpecs.coolingMethod && <span className="data-chip">{product.thermalSpecs.coolingMethod}</span>}
              </div>
              <div className="card-price-badge">
                {((product.energySpecs as any)?.priceDisplayUah) || (locale === 'en' ? 'Price on request' : locale === 'zh-CN' ? '价格电议' : 'Ціна за запитом')}
              </div>
              <div className="product-actions">
                <Link className="text-link" href={`/${locale}/products/${encodeURIComponent(product.id)}`}>{t.details}<ArrowRight size={14}/></Link>
                <Link className="text-link" href={`/${locale}/compare?products=${encodeURIComponent(product.id)}`}>{t.compare}</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state"><ShieldCheck aria-hidden="true"/><p>{t.empty}</p></div>
      )}
      {visibleProducts.length > 0 && <p className="energy-art-note">{t.imageNote}</p>}
    </section>
  );
}
