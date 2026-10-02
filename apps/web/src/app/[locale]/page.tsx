import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BatteryCharging, BriefcaseBusiness, Factory, Gauge, Network, ShieldCheck, Sun, Zap } from 'lucide-react';
import { HeroBessIllustration } from '../../components/SiteShell';
import { pimRepository } from '../../lib/pim/pimRepository';
import type { KatlProduct } from '@katl/shared-types';

export const dynamic = 'force-dynamic';

const copy: Record<string, { kicker:string; title:string; summary:string; choose:string; catalog:string; systems:string; empty:string; emptyBody:string; designer:string; designerBody:string }> = {
  'uk-UA': { kicker:'CATL ENERGY STORAGE · УКРАЇНА', title:'Енергія під контролем. Сильніша Україна.', summary:'Дізнавайтеся про CATL ESS/BESS, підбирайте рішення й передавайте вихідні дані на інженерну оцінку.', choose:'Підібрати систему', catalog:'Переглянути продукцію', systems:'Системи CATL у каталозі', empty:'Опублікованих продуктів поки немає', emptyBody:'Картки з’являються після перевірки джерел і публікації запису в PIM. Ми не показуємо непідтверджені специфікації.', designer:'Від параметрів об’єкта — до інженерного запиту', designerBody:'Опишіть потрібну потужність, тривалість і сценарій роботи. Розрахунок покаже методику та припущення; остаточну конфігурацію підтверджує інженер.' },
  en: { kicker:'CATL ENERGY STORAGE · UKRAINE', title:'Energy storage systems for real project needs', summary:'Explore BESS technology, compare published data and prepare project inputs for an engineering assessment.', choose:'Configure a project', catalog:'Browse products', systems:'CATL systems in the catalog', empty:'No products are published yet', emptyBody:'Products appear after source review and PIM publication. Unverified specifications are not displayed.', designer:'From site requirements to an engineering request', designerBody:'Share power, duration and operating scenario. Calculations show their method and assumptions; an engineer confirms the final configuration.' },
  'zh-CN': { kicker:'CATL ENERGY STORAGE · 乌克兰', title:'面向实际项目需求的储能系统', summary:'了解 BESS 技术、比较已发布的数据，并准备项目工程评估所需参数。', choose:'配置项目', catalog:'浏览产品', systems:'目录中的 CATL 系统', empty:'目前暂无已发布产品', emptyBody:'产品需经过来源审核并在 PIM 中发布后才会展示。我们不会显示未经验证的规格。', designer:'从现场需求到工程咨询', designerBody:'提供功率、时长和运行场景。计算结果将说明方法和假设；最终配置由工程师确认。' },
};

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const {locale}=await params;
  const t=copy[locale] || copy['uk-UA'];
  return { title: locale === 'uk-UA' ? 'CATL Energy Storage в Україні' : t.title, description:t.summary, alternates:{canonical:`/${locale}`,languages:{'uk-UA':'/uk-UA',en:'/en','zh-CN':'/zh-CN'}} };
}

export default async function LocaleHome({ params }: { params: Promise<{locale:string}> }) {
  const {locale}=await params;
  const t=copy[locale] || copy['uk-UA'];
  let products: KatlProduct[] | null = null;
  try { products = await pimRepository.getAllProducts(locale); } catch { products = null; }
  return <main>
    <section className="hero home-hero"><div className="container hero-grid"><div className="home-hero-copy"><div className="eyebrow">{t.kicker}</div><h1 aria-label={locale==='uk-UA'?t.title:undefined}>{locale==='uk-UA'?<>Енергія <br/>під контролем. <br/>Сильніша <span>Україна.</span></>:t.title}</h1><p className="hero-copy">{t.summary}</p><div className="hero-actions"><Link className="button" href={`/${locale}/bess-designer`}>{t.choose}<ArrowRight size={16}/></Link><Link className="button button-secondary" href={`/${locale}/products`}>{t.catalog}</Link></div><div className="proof-row"><span>Технічні дані — лише з опублікованих джерел</span><span>Попередні розрахунки містять явні припущення</span></div></div><div className="hero-visual"><HeroBessIllustration/><div className="hero-image-label"><span>CATL ENERGY STORAGE</span><strong>Інженерний підхід<br/>до енергетичних систем</strong><Link href={`/${locale}/bess`}>Про технологію <ArrowRight size={14}/></Link></div></div></div><div className="container home-trust"><span><ShieldCheck size={19}/> Підтверджені джерела</span><span><BatteryCharging size={19}/> Utility та C&I BESS</span><span><Gauge size={19}/> Розрахунки з методикою</span><span><BriefcaseBusiness size={19}/> Інженерний супровід</span></div></section>
    <section className="section home-journey"><div className="container"><div className="section-head"><div><div className="eyebrow">Почніть із задачі</div><h2>Яке рішення вам потрібне?</h2></div><p>Оберіть напрямок — далі знайдете пояснення, інструмент або форму для проєкту.</p></div><div className="journey-grid">
      <Journey href={`/${locale}/industries/manufacturing`} icon={<Factory size={20}/>} title="Підприємство" text="Пікове навантаження, резерв або інтеграція з генерацією."/>
      <Journey href={`/${locale}/solutions/solar-bess`} icon={<Sun size={20}/>} title="Сонячна енергетика" text="Оцініть, як накопичення може працювати разом із СЕС."/>
      <Journey href={`/${locale}/bess`} icon={<BatteryCharging size={20}/>} title="Розібратися з BESS" text="Базові поняття, компоненти та інженерні обмеження."/>
      <Journey href={`/${locale}/rfq`} icon={<BriefcaseBusinessIcon/>} title="Маю проєкт" text="Надішліть вихідні дані для подальшої оцінки."/>
    </div></div></section>
    <section className="section section-soft home-products"><div className="container"><div className="section-head"><div><div className="eyebrow">Каталог із PIM</div><h2>{t.systems}</h2></div><Link className="text-link" href={`/${locale}/products`}>Відкрити каталог <ArrowUpRight size={14}/></Link></div>
      {products === null ? <div className="error-note">Каталог зараз недоступний. Спробуйте пізніше або надішліть інженерний запит.</div> : products.length ? <div className="product-grid">{products.slice(0,3).map(product=><ProductCard key={product.id} product={product} locale={locale}/>)}</div> : <div className="empty-state"><ShieldCheck color="#1769d2"/><div><h3>{t.empty}</h3><p>{t.emptyBody}</p></div></div>}
    </div></section>
    <section className="section home-designer"><div className="container"><div className="designer-band"><div><div className="eyebrow" style={{color:'#9dc5ff'}}>ІНЖЕНЕРНИЙ ІНСТРУМЕНТ</div><h2>{t.designer}</h2><p>{t.designerBody}</p><div className="designer-steps"><span><b>01</b> Параметри об’єкта</span><span><b>02</b> Сценарій роботи</span><span><b>03</b> Інженерний запит</span></div><Link className="button" href={`/${locale}/bess-designer`}>Відкрити BESS Designer <ArrowRight size={15}/></Link></div><div className="designer-scene"><HeroBessIllustration/><div className="designer-preview"><div className="preview-stat"><small>Потужність</small><strong>kW / MW</strong></div><div className="preview-stat"><small>Тривалість</small><strong>години</strong></div><div className="preview-stat"><small>Сценарій</small><strong>ваш об’єкт</strong></div></div><small className="demo-note">Параметри вводить користувач · результат не підмінюється демонстраційними цифрами</small></div></div></div></section>
    <section className="section section-soft home-solutions"><div className="container"><div className="section-head"><div><div className="eyebrow">Сценарії застосування</div><h2>Рішення для різних енергетичних задач</h2></div><p>Кожен майданчик потребує власного профілю навантаження, тарифів та технічних обмежень.</p></div><div className="tile-grid">
      <Solution href={`/${locale}/solutions/solar-bess`} icon={<Sun size={19}/>} title="Сонячна енергетика" text="Самоспоживання, часовий зсув, обмеження експорту."/>
      <Solution href={`/${locale}/solutions/peak-shaving`} icon={<Gauge size={19}/>} title="Peak shaving" text="Робота з піками потужності та графіком навантаження."/>
      <Solution href={`/${locale}/solutions/backup-power`} icon={<Zap size={19}/>} title="Резервне живлення" text="Визначення критичних навантажень і бажаного часу автономії."/>
      <Solution href={`/${locale}/solutions/microgrid`} icon={<Network size={19}/>} title="Мікромережі" text="Сценарії взаємодії генерації, накопичення та навантаження."/>
    </div></div></section>
    <section className="section home-ecosystem"><div className="container"><div className="section-head"><div><div className="eyebrow">Архітектура системи</div><h2>Компоненти BESS працюють як одна система</h2></div><p>Фактична схема та сумісність залежать від обраного продукту, мережі й вимог проєкту.</p></div><div className="ecosystem-flow"><span>СЕС / Мережа</span><b>→</b><span>PCS</span><b>→</b><span>Система накопичення</span><b>→</b><span>EMS / Навантаження</span></div><div className="ecosystem-caption">Схематичне подання. Конкретні компоненти та параметри підтверджуються для кожного проєкту.</div></div></section>
    <section className="section home-tools"><div className="container"><div className="section-head"><div><div className="eyebrow">Інженерія</div><h2>Оцініть параметри до розмови з постачальником</h2></div><p>Інструменти дають попередню оцінку. Це не проєктне рішення чи комерційна пропозиція.</p></div><div className="tool-grid">
      <Tool href={`/${locale}/engineering/bess-calculator`} icon={<BatteryCharging size={20}/>} title="BESS Calculator" text="Початкова оцінка енергії та потужності за заданим сценарієм."/>
      <Tool href={`/${locale}/engineering/lcos`} icon={<Gauge size={20}/>} title="LCOS" text="Розрахунок вартості відпущеної енергії з явними припущеннями."/>
      <Tool href={`/${locale}/engineering/solar-bess`} icon={<Sun size={20}/>} title="Solar + BESS" text="Параметри генерації, навантаження та потреби в накопиченні."/>
    </div></div></section>
    <section className="section section-soft"><div className="container"><div className="section-head"><div><div className="eyebrow">База знань</div><h2>Почніть із принципів, а не з припущень</h2></div><Link className="text-link" href={`/${locale}/resources`}>Усі матеріали <ArrowRight size={14}/></Link></div><div className="resource-grid">
      <Resource href={`/${locale}/bess`} label="ОСНОВИ BESS" title="Що таке система накопичення енергії" text="Поняття потужності, енергії, PCS, BMS та EMS."/>
      <Resource href={`/${locale}/resources/guides/how-to-choose-bess`} label="ЗАКУПІВЛЯ" title="Як підготувати вимоги до BESS" text="Які дані про майданчик зібрати для попереднього підбору."/>
      <Resource href={`/${locale}/resources/glossary`} label="ГЛОСАРІЙ" title="Технічні терміни та скорочення" text="BESS, SOC, SOH, C-rate, DoD, PCS та LCOS."/>
    </div></div></section>
    <section className="section"><div className="container"><div className="cta-panel"><div><h2>Розкажіть про ваш об’єкт</h2><p>Надішліть базові параметри — уточнимо дані, потрібні для наступного кроку.</p></div><Link className="button" href={`/${locale}/rfq`}>Створити RFQ <ArrowRight size={15}/></Link></div></div></section>
  </main>;
}

function Journey({href,icon,title,text}:{href:string;icon:React.ReactNode;title:string;text:string}){return <Link className="journey-card" href={href}><span className="icon-box">{icon}</span><h3>{title}</h3><p>{text}</p><span className="card-arrow">→</span></Link>}
function Solution({href,icon,title,text}:{href:string;icon:React.ReactNode;title:string;text:string}){return <Link className="solution-card" href={href}><span className="icon-box">{icon}</span><h3>{title}</h3><p>{text}</p><span className="text-link">Дізнатися більше →</span></Link>}
function Tool({href,icon,title,text}:{href:string;icon:React.ReactNode;title:string;text:string}){return <Link className="tool-card" href={href}><span className="icon-box">{icon}</span><h3>{title}</h3><p>{text}</p><span className="text-link">Відкрити інструмент →</span></Link>}
function Resource({href,label,title,text}:{href:string;label:string;title:string;text:string}){return <Link className="resource-card" href={href}><span className="eyebrow">{label}</span><h3>{title}</h3><p>{text}</p></Link>}
function ProductCard({product,locale}:{product:KatlProduct;locale:string}){return <article className="product-card"><div className="product-art"><BatteryCharging size={84} strokeWidth={1} color="#1769d2"/></div><div className="product-info"><div className="product-kicker">{product.family} · {product.category}</div><h3>{product.name}</h3><p>{product.shortDesc}</p><div className="product-data">{product.energySpecs.nominalCapacity&&<span className="data-chip">{product.energySpecs.nominalCapacity}</span>}{product.energySpecs.nominalVoltage&&<span className="data-chip">{product.energySpecs.nominalVoltage}</span>}</div><div className="product-actions"><Link className="text-link" href={`/${locale}/products/${product.id}`}>Деталі <ArrowRight size={13}/></Link><Link className="text-link" href={`/${locale}/compare?products=${encodeURIComponent(product.id)}`}>Порівняти</Link></div></div></article>}
function BriefcaseBusinessIcon(){return <BriefcaseBusiness size={20}/>}
