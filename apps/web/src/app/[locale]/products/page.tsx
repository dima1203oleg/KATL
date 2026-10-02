import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BatteryCharging, Search, ShieldCheck } from 'lucide-react';
import { pimRepository } from '../../../lib/pim/pimRepository';
import type { KatlProduct } from '@katl/shared-types';

export const dynamic='force-dynamic';
export async function generateMetadata({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<Record<string,string|undefined>>}):Promise<Metadata>{
 const [{locale},query]=await Promise.all([params,searchParams]);
 let hasPublishedProducts=false;try{hasPublishedProducts=(await pimRepository.getAllProducts(locale)).length>0;}catch{}
 const hasFilters=Object.values(query).some(Boolean);
 return {title:'Промислові системи накопичення енергії CATL',description:'Каталог систем накопичення енергії CATL із підтвердженими та опублікованими характеристиками.',alternates:{canonical:`/${locale}/products`},...(!hasPublishedProducts||hasFilters?{robots:{index:false,follow:true}}:{})};
}

export default async function ProductsPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{category?:string}>}){
 const [{locale},{category}]=await Promise.all([params,searchParams]);
 if(!['uk-UA','en','zh-CN'].includes(locale)) notFound();
 let products:KatlProduct[]|null=null;
 try{products=await pimRepository.getAllProducts(locale,category?{category}:{});}catch{products=null;}
 const categories=[...new Set((products||[]).map(product=>product.category).filter(Boolean))].sort();
 return <main className="catalog-page"><section className="page-hero catalog-hero"><div className="container"><div className="breadcrumbs"><Link href={`/${locale}`}>Головна</Link>　/　Продукція</div><div className="eyebrow">КАТАЛОГ PIM</div><h1>Системи накопичення енергії CATL</h1><p>Каталог відображає продукти, які пройшли внутрішню перевірку та опубліковані в PIM. Підтверджені характеристики й документи показуються в картці продукту.</p><form action={`/${locale}/search`} className="search-box" style={{maxWidth:680,marginTop:22}}><label className="sr-only" htmlFor="catalog-search">Пошук у каталозі</label><input id="catalog-search" name="q" placeholder="Пошук за моделлю, застосуванням або документом"/><button className="button" aria-label="Шукати"><Search size={16}/> Шукати</button></form></div></section>
 <section className="content-section catalog-content"><div className="container"><div className="catalog-tabs"><Link className={`catalog-tab ${!category?'is-active':''}`} href={`/${locale}/products`}>Усі опубліковані</Link>{categories.map(value=><Link className={`catalog-tab ${category===value?'is-active':''}`} key={value} href={`/${locale}/products?category=${encodeURIComponent(value)}`}>{value}</Link>)}</div>
 {products===null?<div className="error-note" role="status">Не вдалося завантажити каталог. API тимчасово недоступний.</div>:products.length?<div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product} locale={locale}/>)}</div>:<div className="empty-state"><ShieldCheck color="#1769d2"/><div><h3>Для цього фільтра немає опублікованих продуктів</h3><p>Ми не показуємо неперевірені записи. Надішліть параметри проєкту, якщо потрібна допомога з підбором.</p><Link className="text-link" href={`/${locale}/rfq`}>Створити інженерний запит →</Link></div></div>}</div></section>
 </main>;
}

function ProductCard({product,locale}:{product:KatlProduct;locale:string}){return <article className="product-card"><div className="product-art"><BatteryCharging size={78} strokeWidth={1} color="#1769d2"/></div><div className="product-info"><div className="product-kicker">{product.family} · {product.category}</div><h2>{product.name}</h2><p>{product.shortDesc}</p><div className="product-data">{product.energySpecs.nominalCapacity&&<span className="data-chip">{product.energySpecs.nominalCapacity}</span>}{product.energySpecs.nominalVoltage&&<span className="data-chip">{product.energySpecs.nominalVoltage}</span>}{product.thermalSpecs.coolingMethod&&<span className="data-chip">{product.thermalSpecs.coolingMethod}</span>}</div><div className="product-actions"><Link className="text-link" href={`/${locale}/products/${product.id}`}>Детальніше →</Link><Link className="text-link" href={`/${locale}/compare?products=${encodeURIComponent(product.id)}`}>Порівняти</Link></div></div></article>}
