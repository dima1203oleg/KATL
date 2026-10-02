import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search, ShieldCheck } from 'lucide-react';
import { pimRepository } from '../../../lib/pim/pimRepository';
import type { KatlProduct } from '@katl/shared-types';

export const dynamic='force-dynamic';
const ui={
 'uk-UA':{title:'Промислові системи накопичення енергії CATL',description:'Каталог систем накопичення енергії CATL із опублікованими характеристиками.',home:'Головна',catalog:'Каталог',heading:'Системи накопичення енергії CATL',intro:'Стаціонарні системи накопичення та компоненти для вашого енергетичного проєкту.',searchLabel:'Пошук у каталозі',placeholder:'Пошук за моделлю, застосуванням або документом',search:'Шукати',datasheets:'Технічні картки',unavailable:'Доступність і комплектацію уточнюємо під ваш проєкт. Детальні картки каталогу зараз недоступні.',empty:'Для цього фільтра немає опублікованих продуктів',emptyText:'Ми не показуємо неперевірені записи. Надішліть параметри проєкту, якщо потрібна допомога з підбором.',rfq:'Створити інженерний запит →',more:'Детальніше →',compare:'Порівняти'},
 en:{title:'CATL industrial energy storage systems',description:'CATL energy storage systems catalog with published specifications.',home:'Home',catalog:'Catalog',heading:'CATL energy storage systems',intro:'Stationary storage systems and components for your energy project.',searchLabel:'Search catalog',placeholder:'Search by model, application, or document',search:'Search',datasheets:'Technical datasheets',unavailable:'Availability and configuration depend on your project. Detailed catalog records are temporarily unavailable.',empty:'No published products for this filter',emptyText:'We do not show unverified entries. Send your project requirements if you need help selecting a system.',rfq:'Submit an engineering request →',more:'Learn more →',compare:'Compare'},
 'zh-CN':{title:'CATL 工业储能系统',description:'CATL 储能系统目录及已发布的技术参数。',home:'首页',catalog:'产品目录',heading:'CATL 储能系统',intro:'适用于能源项目的固定式储能系统及组件。',searchLabel:'搜索目录',placeholder:'按型号、应用或文档搜索',search:'搜索',datasheets:'技术资料',unavailable:'产品可用性和配置需根据项目确认。详细目录暂时无法使用。',empty:'此筛选条件下没有已发布的产品',emptyText:'我们不展示未经核实的信息。如需选型帮助，请提交项目需求。',rfq:'提交工程咨询 →',more:'了解详情 →',compare:'比较'}
} as const;
export async function generateMetadata({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<Record<string,string|undefined>>}):Promise<Metadata>{
 const [{locale},query]=await Promise.all([params,searchParams]);
 let hasPublishedProducts=false;try{hasPublishedProducts=(await pimRepository.getAllProducts(locale)).length>0;}catch{}
 const hasFilters=Object.values(query).some(Boolean);
 const t=ui[locale as keyof typeof ui]??ui['uk-UA'];return {title:t.title,description:t.description,alternates:{canonical:`/${locale}/products`},...(!hasPublishedProducts||hasFilters?{robots:{index:false,follow:true}}:{})};
}

export default async function ProductsPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{category?:string}>}){
 const [{locale},{category}]=await Promise.all([params,searchParams]);
 if(!['uk-UA','en','zh-CN'].includes(locale)) notFound();
 const t=ui[locale as keyof typeof ui];
 let products:KatlProduct[]|null=null;
 try{products=await pimRepository.getAllProducts(locale,category?{category}:{});}catch{products=null;}
 const categories=[...new Set((products||[]).map(product=>product.category).filter(Boolean))].sort();
 return <main className="catalog-page"><section className="page-hero catalog-hero"><div className="container"><div className="breadcrumbs"><Link href={`/${locale}`}>{t.home}</Link>　/　{t.catalog}</div><div className="eyebrow">CATL ENERGY STORAGE</div><h1>{t.heading}</h1><p>{t.intro}</p><form action={`/${locale}/search`} className="search-box" style={{maxWidth:680,marginTop:22}}><label className="sr-only" htmlFor="catalog-search">{t.searchLabel}</label><input id="catalog-search" name="q" placeholder={t.placeholder}/><button className="button" aria-label={t.search}><Search size={16}/> {t.search}</button></form></div></section>
 <section className="content-section catalog-content"><div className="container"><div className="catalog-tabs"><Link className={`catalog-tab ${!category?'is-active':''}`} href={`/${locale}/products`}>{t.datasheets}</Link>{categories.map(value=><Link className={`catalog-tab ${category===value?'is-active':''}`} key={value} href={`/${locale}/products?category=${encodeURIComponent(value)}`}>{value}</Link>)}</div>
 {products===null?<div className="error-note" role="status">{t.unavailable}</div>:products.length?<div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product} locale={locale} labels={t}/>)}</div>:<div className="empty-state"><ShieldCheck color="#1769d2"/><div><h3>{t.empty}</h3><p>{t.emptyText}</p><Link className="text-link" href={`/${locale}/rfq`}>{t.rfq}</Link></div></div>}</div></section>
 </main>;
}

function ProductCard({product,locale,labels}:{product:KatlProduct;locale:string;labels:typeof ui[keyof typeof ui]}){const imageNote=locale==='en'?'Concept illustration':locale==='zh-CN'?'概念插图':'Концептуальна ілюстрація';return <article className="product-card"><figure className="product-art"><img src="/design/tener-container.webp" alt="" width="180" height="110" loading="lazy"/><figcaption>{imageNote}</figcaption></figure><div className="product-info"><div className="product-kicker">{product.family} · {product.category}</div><h2>{product.name}</h2><p>{product.shortDesc}</p><div className="product-data">{product.energySpecs.nominalCapacity&&<span className="data-chip">{product.energySpecs.nominalCapacity}</span>}{product.energySpecs.nominalVoltage&&<span className="data-chip">{product.energySpecs.nominalVoltage}</span>}{product.thermalSpecs.coolingMethod&&<span className="data-chip">{product.thermalSpecs.coolingMethod}</span>}</div><div className="product-actions"><Link className="text-link" href={`/${locale}/products/${product.id}`}>{labels.more}</Link><Link className="text-link" href={`/${locale}/compare?products=${encodeURIComponent(product.id)}`}>{labels.compare}</Link></div></div></article>}
