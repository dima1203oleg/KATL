import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Building2, FileText, ShieldCheck } from 'lucide-react';
import { LoginForm } from '../../../components/LoginForm';
import { LocalizedUnavailable } from '../../../components/LocalizedUnavailable';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

type PageInfo = {
  title: string;
  intro: string;
  items?: string[];
  links?: [string, string][];
  note?: string;
};

const pagesUk: Record<string, PageInfo> = {
  'login': { title: 'Вхід до кабінету', intro: 'Захищений доступ для клієнтів, партнерів та команди.' },
  'catl-ukraine': {
    title: 'CATL Energy Storage в Україні',
    intro: 'Інформаційна та інженерна платформа стаціонарних систем накопичення енергії CATL ESS в Україні.',
    items: [
      'Офіційні технічні каталоги та паспорти сертифікованих BESS CATL.',
      'Розрахунок техніко-економічного обґрунтування (ТЕО) під тарифи ринку електроенергії України.',
      'Пряма взаємодія з проектними інститутами, EPC-інтеграторами та операторами систем розподілу (ОСР).',
    ],
    note: 'Усі технічні дані верифікуються згідно з європейськими стандартами EN 62619 та вимогами НЕК «Укренерго».',
  },
  'energy-storage-ukraine': {
    title: 'Системи накопичення енергії (BESS) в Україні',
    intro: 'Впровадження промислових акумуляторних накопичувачів для підтримки стійкості бізнесу та енергосистеми України.',
    items: [
      'Зниження витрат на пікову потужність (Peak Shaving) у вечірні пікові зони тарифу.',
      'Миттєвий перехід на автономне живлення (UPS) виробництв при аварійних відключеннях мережі.',
      'Участь на ринку допоміжних послуг: надання резервів підтримки частоти (РПЧ) та відновлення частоти (РВЧ).',
      'Інтеграція з промисловими СЕС та ВЕС для нівелювання небалансів генерації.',
    ],
    note: 'Проєктування здійснюється з урахуванням правил приєднання до електричних мереж та Кодексу системи передачі.',
  },
  'about': {
    title: 'Про платформу CATL ESS Україна',
    intro: 'Спеціалізований інженерно-комерційний центр для впровадження рішень зберігання енергії світового лідера CATL.',
    items: [
      'Інженерний підбір обладнання CATL для промисловості, агросектору, сонячних електростанцій та дата-центрів.',
      'Адаптація однолінійних схем (SLD), релейного захисту та АСКОЕ під вимоги українських стандартів.',
      'Прямі консультації сертифікованих інженерів із досвідом впровадження масштабних енергетичних проєктів.',
    ],
    note: 'Мета платформи — забезпечення стабільності енергозабезпечення українських підприємств за допомогою передових рішень зберігання енергії.',
  },
  'partners': {
    title: 'Партнерська програма для EPC та інсталяторів',
    intro: 'Співпраця для генпідрядних організацій, проєктувальників та інтеграторів сонячних та промислових об’єктів.',
    items: [
      'Проєктні знижки та захист реєстрації об’єктів (Deal Registration).',
      'Навчання сервісних фахівців та технічна підтримка на всіх стадіях проєкту.',
      'Спільна розробка техніко-комерційних пропозицій та графіків окупності для кінцевих замовників.',
    ],
    links: [
      ['Партнерський портал', '/uk-UA/partner'],
      ['Створити запит ТКП', '/uk-UA/rfq'],
    ],
  },
  'contact': {
    title: 'Контактна інформація',
    intro: 'Зв’яжіться з нашою інженерною групою для розрахунку параметрів BESS або партнерства.',
    links: [
      ['Запит на комерційну пропозицію (ТКП)', '/uk-UA/rfq'],
      ['Партнерська програма', '/uk-UA/partner'],
    ],
    note: 'Запити на ТЕО та специфікацію обладнання опрацьовуються протягом 24 робочих годин.',
  },
  'resources': {
    title: 'База знань BESS',
    intro: 'Інженерні посібники, методика підбору систем та глосарій термінів промислового накопичення енергії.',
    links: [
      ['BESS Designer (Конфігуратор)', '/uk-UA/bess-designer'],
      ['Калькулятор ємності BESS', '/uk-UA/engineering/bess-calculator'],
      ['LCOS аналіз окупності', '/uk-UA/engineering/lcos'],
      ['Технічна документація', '/uk-UA/documents'],
    ],
  },
  'resources/guides/how-to-choose-bess': {
    title: 'Як обрати систему BESS для підприємства',
    intro: 'Покроковий посібник інженера з вибору оптимальної конфігурації акумуляторного накопичувача.',
    items: [
      'Крок 1: Збір 15-хвилинного графіка навантаження об’єкта за характерний зимовий та літній періоди.',
      'Крок 2: Визначення цілей: аварійний резерв (Back-up), зрізання піків (Peak Shaving) або оптимізація під зелений тариф.',
      'Крок 3: Розрахунок необхідної потужності PCS (кВт) та ємності акумуляторів (кВт·год) з урахуванням C-rate.',
      'Крок 4: Вибір системи охолодження (рідинна для високих навантажень або повітряна для резерву).',
      'Крок 5: Оцінка вимог безпеки: протипожежна система, датчики витоку газів та вибухові клапани.',
    ],
    links: [
      ['BESS Calculator', '/uk-UA/engineering/bess-calculator'],
      ['Створити RFQ', '/uk-UA/rfq'],
    ],
  },
  'privacy': {
    title: 'Політика конфіденційності',
    intro: 'Політика обробки персональних та технічних даних користувачів платформи CATL ESS Україна.',
    items: [
      'Ми використовуємо надані технічні дані виключно для підготовки інженерних розрахунків та комерційних пропозицій.',
      'Контактні дані не передаються третім особам без попередньої письмової згоди замовника.',
      'Користувач має право в будь-який момент вимагати видалення своїх контактних даних із нашої бази.',
    ],
  },
  'terms': {
    title: 'Умови використання сервісу',
    intro: 'Правила користування онлайн-інструментами, калькуляторами та каталогом платформи.',
    items: [
      'Усі розрахунки калькуляторів є попередньою інженерною оцінкою і потребують перевірки головним інженером перед закупівлею.',
      'Інформаційні матеріали, схеми та CAD-моделі захищені авторським правом.',
      'Остаточна специфікація та вартість обладнання фіксуються в офіційному договорі поставки.',
    ],
  },
};

const pagesEn: Record<string, PageInfo> = {
  'login': { title: 'Account Login', intro: 'Secure access for verified clients, EPC partners, and engineering team.' },
  'catl-ukraine': {
    title: 'CATL Energy Storage in Ukraine',
    intro: 'Official technical and information gateway for stationary CATL battery energy storage systems.',
    items: [
      'Verified product datasheets and specifications for utility and C&I BESS.',
      'Custom techno-economic modeling aligned with Ukraine electricity market tariffs.',
      'Direct technical interface for grid operators, EPC contractors, and project developers.',
    ],
    note: 'All technical data is verified according to European standards EN 62619 and national grid requirements.',
  },
  'energy-storage-ukraine': {
    title: 'Energy Storage Systems (BESS) in Ukraine',
    intro: 'Deploying industrial battery storage to ensure enterprise resilience and stabilize Ukraine’s electric grid.',
    items: [
      'Peak Shaving to minimize transmission tariffs during peak demand periods.',
      'Instantaneous UPS backup power for continuous manufacturing lines during outages.',
      'Ancillary services participation: frequency containment reserves (FCR) and restoration reserves (FRR).',
      'Integration with commercial solar PV and wind assets to balance generation profiles.',
    ],
  },
  'about': {
    title: 'About CATL ESS Ukraine Platform',
    intro: 'Engineering and commercial competence center dedicated to deploying world-leading CATL storage systems.',
    items: [
      'Turnkey equipment sizing for manufacturing plants, agribusiness, solar parks, and data centers.',
      'Engineering adaptation of single-line diagrams, relay protection, and SCADA systems.',
      'Direct support from experienced high-voltage power engineers.',
    ],
  },
  'partners': {
    title: 'Partner Program for EPC & System Integrators',
    intro: 'Collaboration framework for engineering contractors, solar developers, and electrical installers.',
    items: [
      'Project deal registration and exclusive pricing protection.',
      'Comprehensive engineer training and technical commissioning support.',
      'Joint techno-economic proposals and financial feasibility modeling.',
    ],
    links: [
      ['Partner Portal', '/en/partner'],
      ['Request TKP Proposal', '/en/rfq'],
    ],
  },
  'contact': {
    title: 'Contact Engineering Team',
    intro: 'Get in touch with our engineering team for BESS sizing, technical consultation, or partnership.',
    links: [
      ['Request Commercial Proposal (RFQ)', '/en/rfq'],
      ['Partner Program', '/en/partner'],
    ],
  },
  'resources': {
    title: 'BESS Engineering Knowledge Base',
    intro: 'Technical sizing guides, storage fundamentals, and industry glossary for energy storage systems.',
    links: [
      ['BESS Designer (Visual Sizing)', '/en/bess-designer'],
      ['BESS Capacity Calculator', '/en/engineering/bess-calculator'],
      ['LCOS Payback Calculator', '/en/engineering/lcos'],
      ['Technical Documents & Datasheets', '/en/documents'],
    ],
  },
  'privacy': {
    title: 'Privacy Policy',
    intro: 'Guidelines governing the processing of personal and technical data on the CATL ESS platform.',
    items: [
      'Submitted technical facility data is utilized solely for sizing calculations and formal proposals.',
      'Contact information is never shared with third parties without prior consent.',
    ],
  },
  'terms': {
    title: 'Terms of Use',
    intro: 'Terms and conditions for utilizing online tools, calculators, and catalog resources.',
    items: [
      'Calculator outputs represent preliminary engineering estimates subject to site verification.',
      'Final equipment configuration and commercial pricing are formalized in contract documents.',
    ],
  },
};

const pagesZh: Record<string, PageInfo> = {
  'login': { title: '客户与伙伴登录', intro: '为注册客户、EPC 合作伙伴及技术团队提供安全访问。' },
  'catl-ukraine': {
    title: 'CATL 储能系统在乌克兰',
    intro: '宁德时代 (CATL) 固定式储能系统在乌克兰的官方技术服务与工程咨询平台。',
    items: [
      '全系列原厂核验技术规格表及资质认证。',
      '结合乌克兰本地峰谷电价政策的可行性研究与经济效益评估。',
      '针对电网运营商与总承包商 (EPC) 的专业工程对接。',
    ],
  },
  'energy-storage-ukraine': {
    title: '乌克兰工商业及电网级储能解决方案',
    intro: '部署工业级电池储能系统，保障企业用电安全并助力乌克兰电力系统韧性恢复。',
    items: [
      '高峰负荷削峰填谷，降低高额尖峰容量电费。',
      '电网断电时毫秒级切换为备用电源，保障关键生产线不间断运行。',
      '配套新能源电站平滑出力波动，提升清洁能源自发自用率。',
    ],
  },
  'about': {
    title: '关于 CATL ESS 乌克兰平台',
    intro: '致力于推广全球领先的 CATL 储能系统及全生命周期工程解决方案的专业平台。',
    items: [
      '为重工业、农业、光伏电站及数据中心提供量身定制的储能配置。',
      '完成电气接线图、继电保护及后台 EMS 系统与本地电网标准的无缝对接。',
    ],
  },
  'partners': {
    title: 'EPC 合作伙伴计划',
    intro: '面向新能源 EPC 总承包商、电气安装公司及设计院的合作共赢计划。',
    items: [
      '项目报备保护制度与专属阶梯价格支持。',
      '原厂工程师技术培训及现场调试支持。',
    ],
    links: [
      ['合作伙伴门户', '/zh-CN/partner'],
      ['申请商业方案 (RFQ)', '/zh-CN/rfq'],
    ],
  },
  'contact': {
    title: '联系工程团队',
    intro: '联系乌克兰本地储能工程专家，获取系统选型或项目合作支持。',
    links: [
      ['获取正式商业与技术方案', '/zh-CN/rfq'],
      ['合作伙伴专区', '/zh-CN/partner'],
    ],
  },
  'resources': {
    title: 'BESS 储能技术知识库',
    intro: '储能工程设计指南、基础理论以及度电成本分析工具。',
    links: [
      ['BESS 交互式设计器', '/zh-CN/bess-designer'],
      ['BESS 容量计算器', '/zh-CN/engineering/bess-calculator'],
      ['LCOS 度电成本分析', '/zh-CN/engineering/lcos'],
      ['技术文档中心', '/zh-CN/documents'],
    ],
  },
  'privacy': {
    title: '隐私政策',
    intro: '关于保护用户技术资料与个人信息的政策说明。',
  },
  'terms': {
    title: '使用条款',
    intro: '在线计算器、选型工具及技术资料使用协议。',
  },
};

function getPages(locale: string) {
  if (locale === 'en') return pagesEn;
  if (locale === 'zh-CN') return pagesZh;
  return pagesUk;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; segments?: string[] }>;
}): Promise<Metadata> {
  const { locale, segments = [] } = await params;
  const path = segments.join('/');
  const pages = getPages(locale);
  const item = pages[path] || pagesUk[path];

  if (!item) {
    return { title: 'Сторінку не знайдено', robots: { index: false, follow: false } };
  }

  return {
    title: `${item.title} | CATL ESS`,
    description: item.intro,
    alternates: { canonical: `/${locale}/${path}` },
    ...(path === 'login' ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ContentRoute({
  params,
}: {
  params: Promise<{ locale: string; segments?: string[] }>;
}) {
  const { locale, segments = [] } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();

  const path = segments.join('/');
  const pages = getPages(locale);
  const item = pages[path] || pagesUk[path];

  if (!item) notFound();

  if (path === 'login') {
    return (
      <main>
        <AnimatedSection className="page-hero" direction="none">
          <div className="container">
            <div className="eyebrow">
              {locale === 'en' ? 'CLIENT PORTAL' : locale === 'zh-CN' ? '客户门户' : 'ОСОБИСТИЙ КАБІНЕТ'}
            </div>
            <h1>{item.title}</h1>
            <p>{item.intro}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection className="content-section">
          <LoginForm />
        </AnimatedSection>
      </main>
    );
  }

  const eyebrow = path.startsWith('resources')
    ? (locale === 'en' ? 'KNOWLEDGE BASE' : locale === 'zh-CN' ? '技术知识库' : 'БАЗА ЗНАНЬ')
    : path.startsWith('engineering')
    ? (locale === 'en' ? 'ENGINEERING SUITE' : locale === 'zh-CN' ? '工程工具' : 'ІНЖЕНЕРІЯ')
    : 'CATL · ENERGY STORAGE';

  const homeLabel = locale === 'en' ? 'Home' : locale === 'zh-CN' ? '首页' : 'Головна';
  const rfqCta = locale === 'en' ? 'Submit Project RFQ' : locale === 'zh-CN' ? '提交技术方案咨询' : 'Отримати комерційну пропозицію (ТКП)';
  const needConsult = locale === 'en' ? 'Need customized project sizing?' : locale === 'zh-CN' ? '需要针对您项目的专属测算？' : 'Потрібне індивідуальне ТЕО для вашого підприємства?';
  const needSub = locale === 'en' ? 'Submit your facility parameters for detailed financial payback and equipment selection.' : locale === 'zh-CN' ? '提交您的负载参数，我们的工程师将为您提供投资回报分析。' : 'Надішліть параметри навантаження, і наша інженерна команда підготує розрахунок окупності.';

  return (
    <main>
      <AnimatedSection className="page-hero" direction="none">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{homeLabel}</Link> / {segments.join(' / ')}
          </div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{item.title}</h1>
          <p>{item.intro}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="content-section">
        <div className="container" style={{ maxWidth: 900 }}>
          {item.items && (
            <div className="calc-card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, color: '#091d34', marginTop: 0 }}>
                {locale === 'en' ? 'Key Technical Highlights' : locale === 'zh-CN' ? '核心要点' : 'Ключові інженерні аспекти'}
              </h2>
              <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, color: '#334155', fontSize: 14 }}>
                {item.items.map((text) => (
                  <li key={text} style={{ lineHeight: 1.55 }}>{text}</li>
                ))}
              </ul>
            </div>
          )}

          {item.links && (
            <AnimatedStaggerGroup className="journey-grid" style={{ marginTop: 20 }}>
              {item.links.map(([label, href]) => (
                <AnimatedStaggerItem key={label}>
                  <Link className="journey-card" href={href.replace('/uk-UA', `/${locale}`)}>
                    <span className="icon-box"><BookOpen size={20} /></span>
                    <h3 style={{ fontSize: 16, margin: '8px 0 4px', color: '#091d34' }}>{label}</h3>
                    <p style={{ fontSize: 12, color: '#64748b' }}>
                      {locale === 'en' ? 'Explore dedicated tools and docs.' : locale === 'zh-CN' ? '访问对应功能与技术文档。' : 'Перейти до інструмента або документації.'}
                    </p>
                    <span className="card-arrow" style={{ marginTop: 'auto', paddingTop: 12 }}>→</span>
                  </Link>
                </AnimatedStaggerItem>
              ))}
            </AnimatedStaggerGroup>
          )}

          {item.note && (
            <div className="status-note" style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={18} style={{ color: '#0066ff', flexShrink: 0 }} />
              <span style={{ fontSize: 13 }}>{item.note}</span>
            </div>
          )}

          {/* Bottom Fast RFQ Callout */}
          <div className="cta-panel" style={{ marginTop: 32 }}>
            <div>
              <h2 style={{ fontSize: 22, color: '#091d34', margin: 0 }}>{needConsult}</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0' }}>{needSub}</p>
            </div>
            <Link className="button" href={`/${locale}/rfq`}>
              <span>{rfqCta}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
