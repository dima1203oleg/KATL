import Link from 'next/link';
import type { KatlProduct } from '@katl/shared-types';
import { ArrowRight, ArrowUpRight, FileText, Layers, ShieldCheck, Zap } from 'lucide-react';
import { ProductMedia } from './ProductMedia';

const copy = {
  'uk-UA': { home:'Головна', products:'Каталог', quote:'Запросити пропозицію', compare:'Порівняти', verified:'Дані картки PIM', source:'Джерело', checked:'Перевірено', answer:'Про продукт', specs:'Технічні характеристики', specIntro:'Відображаємо лише значення з картки PIM. Для підтверджених фактів доступне посилання на джерело.', noSpecs:'Опублікованих технічних даних поки немає. Запитайте актуальну документацію.', concept:'Концептуальна ілюстрація — не фотографія конкретної моделі.', architecture:'Місце системи в BESS', architectureBody:'Типова структура проєкту залежить від конфігурації. Наведена схема є пояснювальною, а не специфікацією цього продукту.', stages:['Мережа / генерація','PCS','Система накопичення','EMS / BMS','Навантаження'], applications:'Інженерна оцінка', applicationsBody:'Підбір залежить від профілю навантаження, вимог до резерву, мережевих умов і підтвердженої сумісності компонентів.', docs:'Документи', docsBody:'Наявність файлів залежить від моделі та погодженої конфігурації.', openDocs:'Відкрити бібліотеку', cta:'Потрібна конфігурація для вашого об’єкта?', ctaBody:'Передайте вимоги до майданчика — інженер уточнить вихідні дані та доступні варіанти.', request:'Створити запит', unknown:'Не вказано' },
  en: { home:'Home', products:'Catalog', quote:'Request a proposal', compare:'Compare', verified:'PIM record data', source:'Source', checked:'Verified', answer:'About this product', specs:'Technical specifications', specIntro:'Only values present in the PIM record are shown. Verified facts include a link to their source.', noSpecs:'No technical specifications are published yet. Request current documentation.', concept:'Concept illustration — not a photograph of this specific model.', architecture:'How it fits into a BESS', architectureBody:'Project architecture depends on the configuration. This is an explanatory diagram, not a specification for this product.', stages:['Grid / generation','PCS','Energy storage','EMS / BMS','Loads'], applications:'Engineering assessment', applicationsBody:'Selection depends on the load profile, backup requirements, grid conditions and confirmed component compatibility.', docs:'Documents', docsBody:'Available files depend on the model and agreed configuration.', openDocs:'Open document library', cta:'Need a configuration for your site?', ctaBody:'Share your site requirements. An engineer will confirm the inputs and available options.', request:'Create a request', unknown:'Not specified' },
  'zh-CN': { home:'首页', products:'产品目录', quote:'询价', compare:'对比', verified:'PIM 记录数据', source:'来源', checked:'核验时间', answer:'产品概览', specs:'技术参数', specIntro:'仅显示 PIM 记录中的数值。已核验事实附有来源链接。', noSpecs:'尚未发布技术参数。请索取最新文档。', concept:'概念示意图，并非该具体型号的实物照片。', architecture:'在 BESS 中的系统位置', architectureBody:'项目架构取决于具体配置。以下为说明性示意，并非该产品规格。', stages:['电网 / 发电','PCS','储能系统','EMS / BMS','负载'], applications:'工程评估', applicationsBody:'方案选择取决于负载曲线、备用要求、电网条件以及已确认的组件兼容性。', docs:'文档', docsBody:'可用文件取决于型号和双方确认的配置。', openDocs:'打开文档库', cta:'需要为您的项目配置系统？', ctaBody:'提交现场需求，工程师将确认必要数据与可选方案。', request:'创建项目请求', unknown:'未提供' },
} as const;

const labels: Record<string, [string,string,string]> = {
  nominalCapacity:['Номінальна ємність','Nominal capacity','额定容量'], usableCapacity:['Корисна ємність','Usable capacity','可用容量'], nominalVoltage:['Номінальна напруга','Nominal voltage','额定电压'], voltageRange:['Діапазон напруги','Voltage range','电压范围'], cRate:['C-rate','C-rate','倍率'], efficiencyRoundTrip:['ККД повного циклу','Round-trip efficiency','往返效率'], chemistry:['Хімічний склад','Chemistry','化学体系'], cellModel:['Модель комірки','Cell model','电芯型号'], cellCapacity:['Ємність комірки','Cell capacity','电芯容量'], cycleLife:['Циклічний ресурс','Cycle life','循环寿命'], degradationFirstYears:['Деградація на початку строку','Early-life degradation','初期衰减'], dimensions:['Габарити','Dimensions','尺寸'], weight:['Маса','Weight','重量'], containerStandard:['Формат контейнера','Container format','集装箱规格'], protectionRating:['Ступінь захисту','Protection rating','防护等级'], coolingMethod:['Охолодження','Cooling','冷却方式'], tempControlAccuracy:['Точність термоконтролю','Temperature control accuracy','温控精度'], operatingTempRange:['Робоча температура','Operating temperature','工作温度'], fireSuppression:['Пожежогасіння','Fire suppression','消防系统'], deflagrationProtection:['Захист від дефлаграції','Deflagration protection','防爆保护'], gasDetection:['Виявлення газу','Gas detection','气体探测'], certifications:['Сертифікації','Certifications','认证'], pcs:['PCS','PCS','PCS'], ems:['EMS','EMS','EMS'], transformer:['Трансформатор','Transformer','变压器'],
};
const groups: Array<[string,string, keyof KatlProduct]> = [
  ['Електричні параметри','energy_specs','energySpecs'],
  ['Акумуляторні комірки','cell_specs','cellSpecs'],
  ['Тепловий режим','thermal_specs','thermalSpecs'],
  ['Механічні параметри','mechanical_specs','mechanicalSpecs'],
  ['Безпека та сертифікації','safety_specs','safetySpecs'],
  ['Сумісність','compatibility','compatibility'],
];

export function TenerProductDetailView({ product, locale='uk-UA', preview=false }: { product: KatlProduct; locale?: string; preview?: boolean }) {
  const lang = (locale in copy ? locale : 'uk-UA') as keyof typeof copy;
  const t = copy[lang];
  const index = lang === 'en' ? 1 : lang === 'zh-CN' ? 2 : 0;
  const root = `/${locale}`;
  const facts = product.provenance.facts ?? {};
  const hasSpecifications = groups.some(([, , key]) => Object.values((product[key] ?? {}) as Record<string, unknown>).some(Boolean));
  const factPath = (group:string,key:string) => `/${group}/${key.replace(/~/g,'~0').replace(/\//g,'~1')}`;

  return <main className="tener-reference">
    {preview&&<div className="design-preview-note">{lang==='en'?'Design preview · no product specifications are asserted.':lang==='zh-CN'?'设计预览 · 不代表任何产品参数。':'Перегляд дизайну · характеристики продукту тут не заявляються.'}</div>}
    <section className="reference-product-hero"><div className="container">
      <div className="breadcrumbs"><Link href={root}>{t.home}</Link> / <Link href={`${root}/products`}>{t.products}</Link> / {product.name}</div>
      <div className="reference-hero-layout">
        <div className="reference-hero-copy"><div className="eyebrow">CATL · {product.type || product.category}</div><h1>{product.name}</h1><p>{product.shortDesc || t.noSpecs}</p>
          <div className="hero-actions"><Link className="button" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>{t.quote}<ArrowRight size={16}/></Link><Link className="button button-secondary" href={`${root}/compare?products=${encodeURIComponent(product.id)}`}>{t.compare}</Link></div>
          {product.provenance.sourceUrl && <div className="proof-row"><span>{t.verified}</span><a className="text-link" href={product.provenance.sourceUrl} target="_blank" rel="noreferrer">{t.source}<ArrowUpRight size={12}/></a>{product.provenance.verifiedAt && <span>{t.checked}: {new Date(product.provenance.verifiedAt).toLocaleDateString(locale)}</span>}</div>}
        </div>
        <div className="reference-facts">{[[Zap,product.energySpecs.nominalCapacity],[ShieldCheck,product.cellSpecs.chemistry],[Layers,product.thermalSpecs.coolingMethod]].map(([Icon,value],i)=>{const C=Icon as typeof Zap;return value?<div key={i}><C size={25}/><span>{String(value)}</span></div>:null})}<ProductMedia label={t.concept}/></div>
      </div>
      <div className="reference-trust"><span><ShieldCheck size={21}/>{t.verified}</span><span><FileText size={21}/>{product.provenance.confidence || t.unknown}</span></div>
    </div></section>

    <div className="container reference-product-content">
      <section className="reference-overview" id="overview"><div className="reference-intro"><div className="eyebrow">{product.family || product.category}</div><h2>{t.answer}: {product.name}</h2><p>{product.shortDesc || t.noSpecs}</p>{product.highlight&&<ul><li><ShieldCheck size={17}/>{product.highlight}</li></ul>}</div>
        <section className="reference-spec-panel" id="specifications"><h2>{t.specs}</h2><p>{t.specIntro}</p>
          {hasSpecifications ? <div className="tile-grid">{groups.map(([title,group,key])=>{const values=(product[key]??{}) as Record<string,unknown>;const rows=Object.entries(values).filter(([,v])=>v!==null&&v!==undefined&&v!==''&&(!Array.isArray(v)||v.length));if(!rows.length)return null;return <section className="calc-card" key={group}><h3>{lang==='uk-UA'?title:lang==='en'?['Electrical parameters','Battery cells','Thermal management','Mechanical parameters','Safety and certifications','Compatibility'][groups.findIndex(g=>g[1]===group)]:['电气参数','电芯','热管理','机械参数','安全与认证','兼容性'][groups.findIndex(g=>g[1]===group)]}</h3><table className="spec-table"><tbody>{rows.map(([key,value])=>{const prefix=factPath(group,key);const sources=Object.entries(facts).filter(([path])=>path===prefix||path.startsWith(`${prefix}/`)).map(([,source])=>source);return <tr key={key}><th scope="row">{labels[key]?.[index]??key}</th><td>{Array.isArray(value)?value.join(', '):typeof value==='object'?JSON.stringify(value):String(value)}{sources.map((source,n)=><small className="fact-citation" key={`${source.sourceUrl}-${n}`}><a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.pageSection || t.source}</a><span>{source.excerpt}</span></small>)}</td></tr>})}</tbody></table></section>})}</div> : <div className="empty-state"><ShieldCheck color="#1769d2"/><div><h3>{t.noSpecs}</h3><p>{t.specIntro}</p></div></div>}
        </section>
      </section>

      <section className="reference-architecture"><h2>{t.architecture}</h2><p>{t.architectureBody}</p><div className="architecture-strip">{t.stages.map((stage,i)=><div key={stage}><span className="architecture-node"><Layers size={20}/></span><strong>{stage}</strong>{i<t.stages.length-1&&<span aria-hidden="true">→</span>}</div>)}</div></section>
      <section className="reference-service"><h2>{t.applications}</h2><p>{t.applicationsBody}</p><Link className="button button-secondary" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>{t.request}<ArrowRight size={15}/></Link></section>
      <section id="documents" className="reference-docs"><FileText size={24}/><div><h2>{t.docs}</h2><p>{t.docsBody}</p></div><Link className="button button-secondary" href={`${root}/documents?product=${encodeURIComponent(product.id)}`}>{t.openDocs}</Link></section>
    </div>
    <section className="reference-project-cta"><div className="container"><div><h2>{t.cta}</h2><p>{t.ctaBody}</p></div><Link className="button" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>{t.request}<ArrowRight size={16}/></Link></div></section>
  </main>;
}
