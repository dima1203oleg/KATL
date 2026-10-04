import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BatteryCharging,
  ShieldCheck,
  Network,
  Wrench,
  Zap,
  Sun,
  Factory,
  Server,
  Plug,
  Layers,
  ChartNoAxesCombined,
  FileText,
  Home as HomeIcon,
  Building2,
  Cpu,
  Calculator,
  Sliders
} from 'lucide-react';
import { pimRepository } from '../../lib/pim/pimRepository';
import type { KatlProduct } from '@katl/shared-types';
import { LineupShowcase } from '../../components/LineupShowcase';
import { CatlCreativeStudio } from '../../components/CatlCreativeStudio';
import { SystemFinder } from '../../components/SystemFinder';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../components/AnimatedSection';

const dictionaries = {
  'uk-UA': {
    heroKicker: 'CATL ENERGY STORAGE SYSTEMS',
    heroTitle: 'Системи накопичення енергії для дому, бізнесу та енергетичної інфраструктури',
    heroDescription: 'Офіційна технологічна платформа стаціонарних систем накопичення енергії (BESS / ESS) CATL в Україні. Перевірені технічні дані, інженерний розрахунок та підбір конфігурацій.',
    btnCatalog: 'Переглянути каталог',
    btnCalculate: 'Розрахувати систему',
    btnQuote: 'Отримати пропозицію',
    categoriesTitle: 'Категорії обладнання',
    categoriesIntro: 'Оберіть сегмент потужності та призначення системи для вашого об’єкта.',
    categories: [
      { id: 'residential', title: 'Для дому', desc: '10–30 кВт·год домашні ESS', query: 'Домашні системи', icon: HomeIcon },
      { id: 'business', title: 'Для бізнесу', desc: 'Шафи EnerOne Plus 100–500 кВт', query: 'Батарейні шафи', icon: Building2 },
      { id: 'industrial', title: 'Для промисловості', desc: 'UniC та Microgrid 1–2 МВт', query: 'Комерційні та промислові ESS', icon: Factory },
      { id: 'utility', title: 'Великі BESS', desc: 'Контейнери TENER 6.25 МВт·год', query: 'Великі BESS', icon: Zap },
      { id: 'components', title: 'Компоненти', desc: 'Осередки 314Ah, BMS, PCS, EMS', query: 'Компоненти', icon: Cpu },
      { id: 'engineering', title: 'Інженерні рішення', desc: 'BESS, LCOS та однолінійні схеми', href: '/engineering', icon: Calculator },
    ],
    trust: [
      'Стаціонарні ESS / BESS',
      'Комплексна інтеграція',
      'Офіційні дані CATL',
      'Супровід проєкту в Україні'
    ],
    solutions: 'Рішення для ключових завдань',
    solutionsBody: 'Оберіть технологічний сценарій, що відповідає профілю споживання вашого підприємства.',
    allSolutions: 'Усі рішення',
    solutionTitles: ['Резервне живлення', 'Зниження пікових навантажень', 'СЕС + накопичення', 'Дата-центри', 'Зарядна інфраструктура', 'Мікромережі'],
    solutionBodies: ['Енергія для критичних навантажень', 'Керування піками та оптимізація тарифів', 'Більше власної сонячної генерації', 'Безперервність серверних та IT-процесів', 'Потужні буфери для швидких EV-зарядок', 'Повна автономія: генератор + СЕС + BESS'],
    ecosystem: 'Архітектура системи та безпека',
    ecosystemBody: 'Накопичувач, перетворення потужності, керування та інженерний захист у єдиному комплексі.',
    parts: ['СЕС та мережа 0.4/10/35 кВ', 'Двонаправлені PCS 1500V', 'Батарейний контейнер CATL', 'Smart EMS / BMS / SCADA'],
    support: ['Пожежогасіння Novec 1230', 'Рідинне охолодження Liquid Cooling', 'Інтеграція з Укренерго'],
    knowledge: 'Інженерні інструменти платформи',
    knowledgeBody: 'Приймайте обґрунтовані інженерні рішення на основі перевірених розрахункових моделей.',
    tools: ['Калькулятор BESS', 'Калькулятор LCOS', 'Технічна документація'],
    toolBodies: ['Точна оцінка необхідної потужності та корисної ємності', 'Розрахунок LCOE / LCOS вартості збереження кіловат-години', 'Офіційні технічні паспорти (Datasheets) та сертифікати'],
    cta: 'Готові реалізувати ваш енергетичний проєкт?',
    ctaBody: 'Отримайте інженерну консультацію, детальний розрахунок та офіційну комерційну пропозицію.',
    request: 'Отримати комерційну пропозицію'
  },
  en: {
    heroKicker: 'CATL ENERGY STORAGE SYSTEMS',
    heroTitle: 'Energy Storage Systems for Home, Business, and Power Infrastructure',
    heroDescription: 'The official technology platform for CATL stationary energy storage systems (BESS / ESS) in Ukraine. Verified engineering data, system sizing, and quotation management.',
    btnCatalog: 'Explore Catalog',
    btnCalculate: 'Calculate System',
    btnQuote: 'Get Quotation',
    categoriesTitle: 'Equipment Categories',
    categoriesIntro: 'Select power segment and application for your facility requirements.',
    categories: [
      { id: 'residential', title: 'Residential', desc: '10–30 kWh modular home ESS', query: 'Домашні системи', icon: HomeIcon },
      { id: 'business', title: 'Commercial', desc: 'EnerOne Plus cabinets 100–500 kW', query: 'Батарейні шафи', icon: Building2 },
      { id: 'industrial', title: 'Industrial', desc: 'UniC & Microgrid 1–2 MW', query: 'Комерційні та промислові ESS', icon: Factory },
      { id: 'utility', title: 'Utility BESS', desc: 'TENER 6.25 MWh containers', query: 'Великі BESS', icon: Zap },
      { id: 'components', title: 'Components', desc: '314Ah cells, BMS, PCS, EMS', query: 'Компоненти', icon: Cpu },
      { id: 'engineering', title: 'Engineering Solutions', desc: 'BESS, LCOS & Single Line Diagrams', href: '/engineering', icon: Calculator },
    ],
    trust: [
      'Stationary ESS / BESS',
      'Turnkey Integration',
      'Official CATL Data',
      'Project Support in Ukraine'
    ],
    solutions: 'Solutions for Energy Challenges',
    solutionsBody: 'Choose the operational scenario tailored to your facility consumption profile.',
    allSolutions: 'All Solutions',
    solutionTitles: ['Backup Power', 'Peak Shaving', 'Solar + Storage', 'Data Centers', 'EV Charging Hubs', 'Microgrids'],
    solutionBodies: ['Uninterrupted power for critical loads', 'Peak demand and tariff charge reduction', 'Maximize self-consumption of solar PV', 'Zero downtime for IT infrastructure', 'High-power buffers for EV rapid charging', 'Full islanding: Diesel + Solar + BESS'],
    ecosystem: 'System Architecture & Safety',
    ecosystemBody: 'Battery storage, power conversion, intelligent controls and safety in unified architecture.',
    parts: ['Grid & Solar PV 0.4/10/35 kV', '1500V Bi-Directional PCS', 'CATL Battery Container', 'Smart EMS / BMS / SCADA'],
    support: ['Novec 1230 Fire Suppression', 'Intelligent Liquid Cooling', 'Grid Operator SCADA Integration'],
    knowledge: 'Engineering Tools & Analytics',
    knowledgeBody: 'Make data-driven capital expenditure decisions using verified engineering calculation models.',
    tools: ['BESS Calculator', 'LCOS Levelized Cost', 'Technical Documentation'],
    toolBodies: ['Precise sizing of required power and usable capacity', 'LCOS evaluation per delivered kWh over lifetime', 'Official manufacturer datasheets and compliance certificates'],
    cta: 'Ready to build your energy resilience?',
    ctaBody: 'Submit site parameters to receive technical sizing and formal commercial proposal.',
    request: 'Request Commercial Proposal'
  },
  'zh-CN': {
    heroKicker: 'CATL 储能系统',
    heroTitle: '面向家庭、工商业与电力基础设施的储能系统',
    heroDescription: 'CATL 乌克兰固定式储能系统 (BESS / ESS) 官方技术平台。提供经过审核的技术数据、系统选型与工程报价服务。',
    btnCatalog: '浏览产品目录',
    btnCalculate: '计算配置',
    btnQuote: '获取方案报价',
    categoriesTitle: '产品与解决方案分类',
    categoriesIntro: '选择适合您设施需求的功率等级与应用场景。',
    categories: [
      { id: 'residential', title: '户用储能', desc: '10–30 kWh 模块化家庭储能', query: 'Домашні системи', icon: HomeIcon },
      { id: 'business', title: '工商业储能', desc: 'EnerOne Plus 户外柜 100–500 kW', query: 'Батарейні шафи', icon: Building2 },
      { id: 'industrial', title: '工业级储能', desc: 'UniC 与微电网 1–2 MW', query: 'Комерційні та промислові ESS', icon: Factory },
      { id: 'utility', title: '电网级大储', desc: '天恒 (TENER) 6.25 MWh 集装箱', query: 'Великі BESS', icon: Zap },
      { id: 'components', title: '核心部件', desc: '314Ah 电芯、BMS、PCS、EMS', query: 'Компоненти', icon: Cpu },
      { id: 'engineering', title: '工程方案', desc: 'BESS 测算、LCOS 与主接线图', href: '/engineering', icon: Calculator },
    ],
    trust: [
      '固定式 ESS / BESS',
      '系统交钥匙集成',
      'CATL 官方技术数据',
      '乌克兰本土工程支持'
    ],
    solutions: '核心应用场景',
    solutionsBody: '根据您企业的用电特性与负荷曲线选择适宜方案。',
    allSolutions: '全部解决方案',
    solutionTitles: ['备用电源', '削峰填谷', '光伏 + 储能', '数据中心', '充电基础设施', '微电网系统'],
    solutionBodies: ['保障重要负载不间断供能', '降低峰值需量电费支出', '提升分布式光伏自发自用率', '保障服务器与 IT 设施连续运行', '为电动车快充站提供高功率电网缓冲', '柴油机+光伏+储能多能互补微网'],
    ecosystem: '系统架构与安全防护',
    ecosystemBody: '储能电池、双向变流、智能调度与安全防护融为一体。',
    parts: ['电网接入与光伏 0.4/10/35 kV', '1500V 级双向 PCS 变流器', 'CATL 液冷电池集装箱', 'Smart EMS / BMS / SCADA'],
    support: ['Novec 1230 气体灭火系统', '智能液冷精确温控', '电网调度自动化对接'],
    knowledge: '工程工具与数据分析',
    knowledgeBody: '基于经过严谨验证的工程计算模型做出投资决策。',
    tools: ['BESS 容量测算器', 'LCOS 平准化储能成本', '技术资料中心'],
    toolBodies: ['精确测算所需连续放电功率与有效储能容量', '全生命周期度电储能成本 (LCOS) 测算', '原厂技术规格书 (Datasheets) 与合规证书'],
    cta: '准备好实施您的储能项目了吗？',
    ctaBody: '提交现场需求，获得专业工程师选型支持与正式商业报价方案。',
    request: '获取正式商业报价'
  }
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionaries[locale as keyof typeof dictionaries] || dictionaries['uk-UA'];
  const title = locale === 'en' 
    ? 'CATL Energy Storage Systems Ukraine | Official BESS Platform' 
    : locale === 'zh-CN' 
    ? 'CATL 乌克兰储能系统平台 | 官方 ESS / BESS' 
    : 'CATL Energy Storage Systems Україна | Платформа BESS / ESS';
  return {
    title,
    description: t.heroDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { 'uk-UA': '/uk-UA', en: '/en', 'zh-CN': '/zh-CN' }
    }
  };
}

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = dictionaries[locale as keyof typeof dictionaries] || dictionaries['uk-UA'];
  const root = `/${locale}`;

  const solutions = [
    ['backup', 'backup-power', Zap],
    ['industry', 'peak-shaving', Factory],
    ['solar', 'solar-bess', Sun],
    ['data', 'backup-power', Server],
    ['charging', 'ev-charging', Plug],
    ['microgrid', 'microgrid', Network]
  ] as const;

  let products: KatlProduct[] = [];
  let catalogUnavailable = false;
  try {
    products = await pimRepository.getAllProducts(locale);
  } catch {
    catalogUnavailable = true;
  }

  return (
    <main className="energy-home">
      {/* 1. Master Spec First Screen (Hero) */}
      <section className="energy-masthead">
        <div className="container energy-masthead-main">
          <AnimatedSection className="energy-hero-copy" direction="left" delay={0.05}>
            <span className="energy-kicker">{t.heroKicker}</span>
            <h1 aria-label={t.heroTitle}>{t.heroTitle}</h1>
            <p>{t.heroDescription}</p>
            <div className="hero-actions">
              <Link className="button" href={`${root}/products`}>
                {t.btnCatalog}
                <ArrowRight size={17} />
              </Link>
              <Link className="button button-secondary" href="#system-finder">
                <Sliders size={16} />
                {t.btnCalculate}
              </Link>
              <Link className="button button-secondary" href={`${root}/rfq`}>
                {t.btnQuote}
              </Link>
            </div>
          </AnimatedSection>

          <Link href={`${root}/products/catl-tener-6250`} className="energy-featured">
            <span>FLAGSHIP BESS</span>
            <h2>CATL TENER 6.25 MWh</h2>
            <p>5 років 0% деградації. 6.25 МВт·год у 20-ft контейнері TEU з рідинним охолодженням.</p>
            <div className="energy-feature-icon">
              <BatteryCharging size={34} />
              <span>Стаціонарна<br />енергетика</span>
            </div>
            <strong>До каталогу<ArrowRight size={19} /></strong>
          </Link>
        </div>

        <div className="energy-trust">
          <div className="container">
            {[ShieldCheck, Network, Layers, Wrench].map((Icon, i) => (
              <span key={t.trust[i]}>
                <Icon size={24} />
                {t.trust[i]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Equipment Categories Grid (Master Spec Section 4) */}
      <AnimatedSection className="container categories-section">
        <div className="energy-section-head">
          <div>
            <span className="energy-kicker">CATL SEGMENTS</span>
            <h2>{t.categoriesTitle}</h2>
            <p>{t.categoriesIntro}</p>
          </div>
          <Link className="energy-text-link" href={`${root}/products`}>
            {t.btnCatalog} <ArrowRight size={16} />
          </Link>
        </div>

        <AnimatedStaggerGroup className="categories-grid" delay={0.1}>
          {t.categories.map((cat) => {
            const Icon = cat.icon;
            const targetHref = 'href' in cat && cat.href
              ? `${root}${cat.href}`
              : `${root}/products?category=${encodeURIComponent('query' in cat ? (cat as any).query : '')}`;
            return (
              <AnimatedStaggerItem key={cat.id}>
                <Link href={targetHref} className="category-card">
                  <div className="cat-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                </Link>
              </AnimatedStaggerItem>
            );
          })}
        </AnimatedStaggerGroup>
      </AnimatedSection>

      {/* 3. Interactive System Finder (Master Spec Section 4 & 7) */}
      <div className="container">
        <SystemFinder locale={locale} />
      </div>

      {/* 4. Verified PIM Product Lineup Showcase */}
      <div className="container energy-section">
        <LineupShowcase locale={locale} products={products} unavailable={catalogUnavailable} />
      </div>

      {/* 5. Interactive Visual Studio / Educational Demonstrations */}
      <CatlCreativeStudio locale={locale} />

      {/* 6. Applications & Scenarios (Master Spec Section 11) */}
      <AnimatedSection className="energy-solutions energy-section">
        <div className="container">
          <div className="energy-section-head">
            <div>
              <span className="energy-kicker">APPLICATIONS</span>
              <h2>{t.solutions}</h2>
              <p>{t.solutionsBody}</p>
            </div>
            <Link className="energy-text-link" href={`${root}/solutions`}>
              {t.allSolutions}<ArrowRight size={16} />
            </Link>
          </div>
          <AnimatedStaggerGroup className="energy-solution-grid">
            {solutions.map(([image, slug, Icon], i) => (
              <AnimatedStaggerItem key={image}>
                <Link className="energy-solution" href={`${root}/solutions/${slug}`}>
                  <img src={`/design/solution-${image}.webp`} alt="" width="260" height="170" loading="lazy" />
                  <div>
                    <Icon size={21} />
                    <h3>{t.solutionTitles[i]}</h3>
                    <p>{t.solutionBodies[i]}</p>
                    <span><ArrowRight size={18} /></span>
                  </div>
                </Link>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerGroup>
        </div>
      </AnimatedSection>

      {/* 7. Engineering & Architecture Ecosystem (Master Spec Section 12) */}
      <section className="container energy-section energy-ecosystem">
        <div className="energy-section-head">
          <div>
            <span className="energy-kicker">SYSTEM ARCHITECTURE</span>
            <h2>{t.ecosystem}</h2>
            <p>{t.ecosystemBody}</p>
          </div>
        </div>
        <div className="energy-ecosystem-grid">
          <div className="energy-component-list">
            {[Sun, Zap, BatteryCharging, Network].map((Icon, i) => (
              <Link href={`${root}/rfq?component=${encodeURIComponent(t.parts[i])}`} key={t.parts[i]}>
                <Icon size={23} />
                <span>{t.parts[i]}</span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
          <figure>
            <img src="/design/ecosystem.webp" width="528" height="159" alt={t.ecosystem} loading="lazy" />
            <figcaption>Концептуальна схема інтеграції стаціонарного BESS CATL</figcaption>
          </figure>
          <div className="energy-component-list">
            {[ShieldCheck, Layers, Wrench].map((Icon, i) => (
              <Link href={`${root}/rfq`} key={t.support[i]}>
                <Icon size={23} />
                <span>{t.support[i]}</span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Engineering Tools (Master Spec Section 12) */}
      <AnimatedSection className="energy-knowledge energy-section">
        <div className="container">
          <div className="energy-section-head">
            <div>
              <span className="energy-kicker">ENGINEERING & INSIGHTS</span>
              <h2>{t.knowledge}</h2>
              <p>{t.knowledgeBody}</p>
            </div>
          </div>
          <AnimatedStaggerGroup className="energy-tools">
            {[BatteryCharging, ChartNoAxesCombined, FileText].map((Icon, i) => (
              <AnimatedStaggerItem key={t.tools[i]}>
                <Link href={`${root}/${['engineering/bess-calculator', 'engineering/lcos', 'documents'][i]}`} className="energy-tool-card">
                  <span className="energy-tool-number">0{i + 1}</span>
                  <Icon size={26} />
                  <h3>{t.tools[i]}</h3>
                  <p>{t.toolBodies[i]}</p>
                  <ArrowRight className="energy-tool-arrow" size={20} />
                </Link>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerGroup>
        </div>
      </AnimatedSection>

      {/* 9. Final Call to Action */}
      <section className="energy-final-cta">
        <div className="container">
          <div>
            <span className="energy-kicker">LET’S BUILD YOUR ENERGY FUTURE</span>
            <h2>{t.cta}</h2>
            <p>{t.ctaBody}</p>
          </div>
          <Link className="button" href={`${root}/rfq`}>
            {t.request}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
