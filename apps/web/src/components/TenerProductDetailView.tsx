import Link from 'next/link';
import type { KatlProduct } from '@katl/shared-types';
import { ArrowRight, ArrowUpRight, FileText, ShieldCheck } from 'lucide-react';
import { HeroBessIllustration } from './SiteShell';

export function TenerProductDetailView({ product, locale = 'uk-UA' }: { product: KatlProduct; locale?: string }) {
  const root = `/${locale}`;
  const groups: Array<[string, object]> = [
    ['Енергетика та електрика', product.energySpecs],
    ['Акумуляторні комірки', product.cellSpecs],
    ['Тепловий режим', product.thermalSpecs],
    ['Механічні параметри', product.mechanicalSpecs],
    ['Безпека й сертифікації', product.safetySpecs],
    ['Сумісність', product.compatibility],
  ];
  return <main>
    <section className="page-hero product-page-hero"><div className="container">
      <div className="breadcrumbs"><Link href={root}>Головна</Link>　/　<Link href={`${root}/products`}>Продукція</Link>　/　{product.name}</div>
      <div className="hero-grid">
        <div><div className="eyebrow">{product.family} · {product.category}</div><h1>{product.name}</h1><p>{product.shortDesc}</p>
          <div className="hero-actions"><Link className="button" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>Запитати конфігурацію <ArrowRight size={16}/></Link><Link className="button button-secondary" href={`${root}/compare?products=${encodeURIComponent(product.id)}`}>Додати до порівняння</Link></div>
          {product.provenance.sourceUrl && <div className="proof-row"><span>Джерело в PIM</span><a className="text-link" href={product.provenance.sourceUrl} target="_blank" rel="noreferrer">Переглянути джерело <ArrowUpRight size={12}/></a>{product.provenance.verifiedAt && <span>Перевірено {new Date(product.provenance.verifiedAt).toLocaleDateString(locale)}</span>}</div>}
        </div>
        <div className="hero-visual product-page-art" aria-label="Схематична ілюстрація промислової системи накопичення"><HeroBessIllustration/><span className="illustration-disclosure">Схематична ілюстрація · не є фото продукту</span></div>
      </div>
    </div></section>
    <div className="container content-section" id="overview"><div className="section-head"><div><div className="eyebrow">Технічний профіль</div><h2>Характеристики з картки PIM</h2></div><p>Показано лише поля, які надійшли через каталог. Відсутні або не підтверджені дані не підміняються припущеннями.</p></div>
      {groups.some(([, values]) => Object.values(values || {}).some(Boolean)) ? <div className="tile-grid">{groups.map(([title, values]) => {
        const rows = Object.entries(values as Record<string, unknown>).filter(([, value]) => value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length));
        if (!rows.length) return null;
        return <section className="calc-card" key={title}><h2 style={{fontSize:17,marginTop:0}}>{title}</h2><table className="spec-table"><tbody>{rows.map(([key,value])=><tr key={key}><td>{key.replace(/([A-Z])/g,' $1').replace(/^./, s=>s.toUpperCase())}</td><td>{Array.isArray(value)?value.join(', '):typeof value==='object'?JSON.stringify(value):String(value)}</td></tr>)}</tbody></table></section>;
      })}</div> : <div className="empty-state"><ShieldCheck color="#1769d2"/><div><h3>Технічні дані ще не опубліковані</h3><p>Запитайте актуальну документацію для вашої конфігурації.</p></div></div>}
    </div>
    <section className="section section-soft"><div className="container"><div className="section-head"><div><div className="eyebrow">Документація</div><h2>Документи та сертифікати</h2></div><Link className="text-link" href={`${root}/documents?product=${encodeURIComponent(product.id)}`}>До бібліотеки документів →</Link></div><div className="empty-state"><FileText color="#1769d2"/><div><h3>Публічних файлів поки немає</h3><p>Зверніться до команди проєкту, щоб отримати доступні для вашої конфігурації документи.</p></div></div></div></section>
    <section className="section"><div className="container"><div className="cta-panel"><div><h2>Потрібна інженерна оцінка?</h2><p>Опишіть майданчик і сценарій використання — команда уточнить потрібні вихідні дані.</p></div><Link className="button" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>Створити запит <ArrowRight size={15}/></Link></div></div></section>
  </main>;
}
