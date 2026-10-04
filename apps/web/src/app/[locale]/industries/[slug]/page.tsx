import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { asLocale, languageAlternates, LOCALES, type Locale } from '../../../../lib/brand';
import { JsonLd, breadcrumbLd } from '../../../../components/seo/JsonLd';

type Tri<T> = { uk: T; en: T; zh: T };
interface Industry { name: Tri<string>; intro: Tri<string>; issues: Tri<string[]>; questions: Tri<string[]>; solutions: string[] }

const industries: Record<string, Industry> = {
  manufacturing: {
    name: { uk: 'Виробництво', en: 'Manufacturing', zh: '制造业' },
    intro: {
      uk: 'BESS для промислових майданчиків оцінюють за фактичним профілем навантаження, графіком виробництва та наслідками перебоїв живлення.',
      en: 'A BESS for an industrial site is assessed against the actual load profile, the production schedule and the consequences of supply interruptions.',
      zh: '工业现场的储能需结合实际负荷曲线、生产计划及停电后果进行评估。',
    },
    issues: {
      uk: ['Короткочасні піки та доступна потужність приєднання', 'Критичні лінії й допустимий час перерви', 'Наявна або запланована сонячна генерація', 'Якість електроенергії та координація захистів'],
      en: ['Short peaks and available connection capacity', 'Critical lines and acceptable interruption time', 'Existing or planned solar generation', 'Power quality and protection coordination'],
      zh: ['短时峰值与可用接入容量', '关键产线与可接受的断电时间', '现有或规划的光伏', '电能质量与保护配合'],
    },
    questions: {
      uk: ['Які інтервали вимірювання доступні?', 'Які споживачі мають залишатися під час аварії?', 'Які обмеження має точка приєднання?'],
      en: ['Which metering intervals are available?', 'Which loads must stay on during an outage?', 'What are the limits of the connection point?'],
      zh: ['可获取哪种计量间隔数据？', '停电时哪些负荷必须保持供电？', '并网点有哪些限制？'],
    },
    solutions: ['peak-shaving', 'backup-power', 'solar-bess'],
  },
  agriculture: {
    name: { uk: 'Агросектор', en: 'Agriculture', zh: '农业' },
    intro: {
      uk: 'Сезонні графіки елеваторів, холодильного обладнання, насосів і зрошення потребують окремого аналізу в сезон і поза ним.',
      en: 'Seasonal schedules of grain elevators, refrigeration, pumps and irrigation need separate analysis in and out of season.',
      zh: '粮食烘干、冷藏、水泵与灌溉的季节性运行需分别分析旺季与淡季。',
    },
    issues: {
      uk: ['Сезонність і змінні графіки роботи', 'Пускові навантаження двигунів', 'Холодильні зони та вимоги до безперервності', 'Поєднання із СЕС або генератором'],
      en: ['Seasonality and variable schedules', 'Motor starting loads', 'Cold zones and continuity requirements', 'Combination with PV or a generator'],
      zh: ['季节性与多变的作业时间', '电机启动负荷', '冷藏区与连续供电要求', '与光伏或发电机结合'],
    },
    questions: {
      uk: ['Який сезонний профіль потужності?', 'Які технологічні процеси критичні?', 'Чи доступні погодинні дані за різні сезони?'],
      en: ['What is the seasonal power profile?', 'Which processes are critical?', 'Are hourly data available for different seasons?'],
      zh: ['季节性功率曲线如何？', '哪些工艺是关键的？', '是否有不同季节的逐时数据？'],
    },
    solutions: ['solar-bess', 'peak-shaving', 'microgrid'],
  },
  logistics: {
    name: { uk: 'Логістика та склади', en: 'Logistics and warehousing', zh: '物流与仓储' },
    intro: {
      uk: 'Склади, холодильна логістика та заряджання транспорту можуть мати різні режими попиту та вимоги до резерву.',
      en: 'Warehouses, cold-chain logistics and fleet charging can have different demand patterns and backup requirements.',
      zh: '仓库、冷链物流与车队充电的用电模式和备用要求各不相同。',
    },
    issues: {
      uk: ['Одночасність роботи холодильних і навантажувальних систем', 'Планування зарядних сесій електротранспорту', 'Доступна потужність мережі', 'Вимоги до резерву й перемикання'],
      en: ['Simultaneous refrigeration and handling equipment', 'Scheduling EV fleet charging sessions', 'Available grid capacity', 'Backup and transfer requirements'],
      zh: ['冷藏与装卸设备同时运行', '电动车队充电安排', '可用电网容量', '备用与切换要求'],
    },
    questions: {
      uk: ['Які зони мають критичне навантаження?', 'Як змінюється навантаження протягом доби?', 'Чи передбачене розширення зарядної інфраструктури?'],
      en: ['Which zones carry critical load?', 'How does demand change over the day?', 'Is charging infrastructure expansion planned?'],
      zh: ['哪些区域为重要负荷？', '负荷在一天中如何变化？', '是否计划扩建充电设施？'],
    },
    solutions: ['peak-shaving', 'ev-charging', 'backup-power'],
  },
  'data-centres': {
    name: { uk: 'Центри обробки даних', en: 'Data centres', zh: '数据中心' },
    intro: {
      uk: 'Для дата-центрів BESS розглядають у взаємодії з UPS, генераторами, системою перемикання та вимогами доступності. Роль кожного рівня резерву визначає проєкт.',
      en: 'In data centres a BESS is considered together with UPS, generators, transfer systems and availability requirements. The design defines the role of each backup layer.',
      zh: '数据中心储能需与 UPS、发电机、切换系统及可用性要求统筹考虑，各级备用的角色由设计确定。',
    },
    issues: {
      uk: ['Рівень резервування та топологія UPS', 'Критичні навантаження й час перемикання', 'Робота генераторів і паливна автономність', 'Схема захисту, селективність і якість живлення'],
      en: ['Redundancy level and UPS topology', 'Critical loads and transfer time', 'Generator operation and fuel autonomy', 'Protection scheme, selectivity and power quality'],
      zh: ['冗余等级与 UPS 拓扑', '重要负荷与切换时间', '发电机运行与燃料续航', '保护方案、选择性与电能质量'],
    },
    questions: {
      uk: ['Яка роль BESS відносно UPS і генератора?', 'Який час автономії потрібен для кожного режиму?', 'Чи є затверджена однолінійна схема?'],
      en: ['What is the BESS role relative to UPS and generator?', 'What autonomy is needed in each mode?', 'Is there an approved single-line diagram?'],
      zh: ['储能相对 UPS 与发电机承担什么角色？', '各模式需要多长自主时间？', '是否有已批准的单线图？'],
    },
    solutions: ['backup-power', 'peak-shaving', 'microgrid'],
  },
  retail: {
    name: { uk: 'Ритейл', en: 'Retail', zh: '零售' },
    intro: {
      uk: 'Для торгових об’єктів важливі робочі графіки, холодильне обладнання, піки попиту та розподілена структура локацій.',
      en: 'For retail sites, opening hours, refrigeration, demand peaks and a distributed portfolio of locations all matter.',
      zh: '零售场所需关注营业时间、冷藏设备、需量峰值及多门店分布。',
    },
    issues: {
      uk: ['Профіль HVAC і холодильного обладнання', 'Години пікової роботи', 'Наявність локальної генерації', 'Вимоги до безперервності окремих зон'],
      en: ['HVAC and refrigeration profile', 'Peak trading hours', 'Local generation', 'Continuity requirements for specific zones'],
      zh: ['暖通与冷藏负荷曲线', '营业高峰时段', '本地发电情况', '特定区域的连续供电要求'],
    },
    questions: {
      uk: ['Які навантаження створюють піки?', 'Чи доступні інтервальні дані лічильника?', 'Які об’єкти мають пріоритет?'],
      en: ['Which loads create the peaks?', 'Is interval meter data available?', 'Which sites have priority?'],
      zh: ['哪些负荷形成峰值？', '是否有电表间隔数据？', '哪些门店优先？'],
    },
    solutions: ['peak-shaving', 'solar-bess', 'backup-power'],
  },
  'ev-charging': {
    name: { uk: 'Зарядна інфраструктура', en: 'EV charging', zh: '电动汽车充电' },
    intro: {
      uk: 'Накопичення оцінюють як буфер між піковим попитом зарядних точок і доступною потужністю приєднання.',
      en: 'Storage is assessed as a buffer between the peak demand of charge points and the available connection capacity.',
      zh: '储能被视为充电桩峰值需求与可用接入容量之间的缓冲。',
    },
    issues: {
      uk: ['Потужність і кількість зарядних точок', 'Профіль сесій та одночасність', 'Очікуване зростання локації', 'Обмеження мережі та режим керування'],
      en: ['Rating and number of charge points', 'Session profile and simultaneity', 'Expected site growth', 'Grid limits and control mode'],
      zh: ['充电桩功率与数量', '充电曲线与同时率', '场站预期增长', '电网限制与控制模式'],
    },
    questions: {
      uk: ['Які типи зарядних станцій плануються?', 'Який типовий графік сесій?', 'Яку доступну потужність підтверджено оператором мережі?'],
      en: ['Which charger types are planned?', 'What is the typical session schedule?', 'What capacity has the network operator confirmed?'],
      zh: ['计划采用哪类充电桩？', '典型充电时段如何？', '电网运营商确认的可用容量是多少？'],
    },
    solutions: ['ev-charging', 'peak-shaving', 'solar-bess'],
  },
  hotels: {
    name: { uk: 'Готелі та комерційна нерухомість', en: 'Hotels and commercial real estate', zh: '酒店与商业地产' },
    intro: {
      uk: 'Комерційні об’єкти поєднують базові, сезонні та критичні навантаження, які треба аналізувати окремо.',
      en: 'Commercial buildings combine base, seasonal and critical loads that need to be analysed separately.',
      zh: '商业建筑包含基础、季节性与重要负荷，需分别分析。',
    },
    issues: {
      uk: ['HVAC та сезонність', 'Критичні системи об’єкта', 'Резервне живлення й наявний генератор', 'Локальна сонячна генерація'],
      en: ['HVAC and seasonality', 'Critical building systems', 'Backup power and existing generator', 'Local solar generation'],
      zh: ['暖通空调与季节性', '建筑关键系统', '备用电源与现有发电机', '本地光伏'],
    },
    questions: {
      uk: ['Які зони мають пріоритет при відключенні?', 'Які сезонні профілі доступні?', 'Які існуючі джерела резерву?'],
      en: ['Which zones have priority during an outage?', 'Which seasonal profiles are available?', 'What backup sources exist?'],
      zh: ['停电时哪些区域优先？', '有哪些季节性负荷数据？', '现有哪些备用电源？'],
    },
    solutions: ['backup-power', 'solar-bess', 'peak-shaving'],
  },
};

const solutionNames: Record<string, Tri<string>> = {
  'peak-shaving': { uk: 'Зрізання піків', en: 'Peak shaving', zh: '削峰' },
  'backup-power': { uk: 'Резервне живлення', en: 'Backup power', zh: '备用电源' },
  'solar-bess': { uk: 'СЕС + накопичення', en: 'Solar + storage', zh: '光伏 + 储能' },
  microgrid: { uk: 'Мікромережа', en: 'Microgrid', zh: '微电网' },
  'ev-charging': { uk: 'Зарядні хаби', en: 'EV charging hubs', zh: '充电站' },
  'energy-arbitrage': { uk: 'Арбітраж', en: 'Arbitrage', zh: '套利' },
};

const L: Record<Locale, { home: string; inds: string; kicker: string; h1: (n: string) => string; issues: string; questions: string; sols: string; start: string; rfq: string; note: string }> = {
  'uk-UA': { home: 'Головна', inds: 'Галузі', kicker: 'ГАЛУЗЕВИЙ СЦЕНАРІЙ', h1: (n) => `BESS для галузі: ${n}`, issues: 'Що варто врахувати', questions: 'Питання для першої розмови', sols: 'Релевантні рішення', start: 'Оцінити параметри', rfq: 'Запитати інженерну оцінку', note: 'Рекомендації щодо конкретної системи, резервування або сумісності не формуються без даних майданчика та підтвердженої документації.' },
  en: { home: 'Home', inds: 'Industries', kicker: 'INDUSTRY', h1: (n) => `BESS for ${n.toLowerCase()}`, issues: 'What to consider', questions: 'Questions for the first conversation', sols: 'Relevant solutions', start: 'Estimate parameters', rfq: 'Request an engineering review', note: 'Recommendations on a specific system, redundancy or compatibility are not made without site data and confirmed documentation.' },
  'zh-CN': { home: '首页', inds: '行业', kicker: '行业场景', h1: (n) => `${n}储能`, issues: '需考虑的因素', questions: '首次沟通的问题', sols: '相关方案', start: '估算参数', rfq: '申请工程评估', note: '在缺少现场数据与确认文件的情况下，不提供具体系统、冗余或兼容性的建议。' },
};
const k = (l: Locale) => (l === 'en' ? 'en' : l === 'zh-CN' ? 'zh' : 'uk') as 'uk' | 'en' | 'zh';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => Object.keys(industries).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const data = industries[slug];
  if (!data) return {};
  const alt = languageAlternates(`/industries/${slug}`);
  const title = L[locale].h1(data.name[k(locale)]);
  return {
    title,
    description: data.intro[k(locale)],
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
    openGraph: { title, description: data.intro[k(locale)], type: 'article', locale },
  };
}

export default async function IndustryDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!(LOCALES as string[]).includes(raw)) notFound();
  const locale = asLocale(raw);
  const data = industries[slug];
  if (!data) notFound();
  const t = L[locale];
  const key = k(locale);
  const root = `/${locale}`;
  const title = t.h1(data.name[key]);

  return (
    <main className="kx kx-doc">
      <JsonLd data={breadcrumbLd([[t.home, root], [t.inds, `${root}/industries`], [data.name[key], `${root}/industries/${slug}`]])} />
      <section className="kx-doc-hero">
        <div className="kx-wrap">
          <nav className="kx-crumbs" aria-label="Breadcrumb">
            <Link href={root}>{t.home}</Link><span aria-hidden="true">/</span>
            <Link href={`${root}/industries`}>{t.inds}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{data.name[key]}</span>
          </nav>
          <span className="kx-kicker" style={{ marginTop: 28 }}>{t.kicker}</span>
          <h1>{title}</h1>
          <p className="kx-lead">{data.intro[key]}</p>
          <div className="kx-actions">
            <Link className="kx-btn kx-btn-primary" href={`${root}/bess-designer`}>{t.start}<ArrowRight size={16} /></Link>
            <Link className="kx-btn kx-btn-ghost" href={`${root}/rfq`}>{t.rfq}</Link>
          </div>
        </div>
      </section>
      <div className="kx-wrap kx-doc-grid">
        <article className="kx-prose">
          <h2>{t.issues}</h2>
          <ul>{data.issues[key].map((v) => <li key={v}>{v}</li>)}</ul>
          <h2>{t.questions}</h2>
          <ol className="kx-checklist">
            {data.questions[key].map((v, i) => <li key={v}><span>{String(i + 1).padStart(2, '0')}</span><span>{v}</span></li>)}
          </ol>
          <p className="kx-note">{t.note}</p>
        </article>
        <aside className="kx-side">
          <div className="kx-side-card">
            <h3>{t.sols}</h3>
            {data.solutions.map((s) => (
              <Link key={s} href={`${root}/solutions/${s}`}>{solutionNames[s]?.[key] ?? s}<ArrowRight size={15} /></Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
