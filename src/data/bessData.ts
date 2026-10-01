export interface BessProduct {
  id: string;
  name: string;
  modelCode: string;
  series: 'TENER' | 'EnerOne' | 'EnerC';
  tagline: string;
  capacityKwh: number;
  capacityDisplay: string;
  nominalVoltage: string;
  voltageRange: string;
  cRate: string;
  coolingType: string;
  cycleLife: string;
  roundTripEfficiency: string;
  dimensions: string;
  weightKg: string;
  protectionRating: string;
  certifications: string[];
  primaryUse: string;
  features: string[];
  datasheetUrl?: string;
}

export interface BessSolution {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  typicalPaybackYears: string;
  targetIndustries: string[];
  recommendedProduct: string;
  engineeringDetails: string;
}

export interface BessIndustry {
  id: string;
  title: string;
  problem: string;
  solution: string;
  powerRange: string;
  typicalConfig: string;
  roiEstimate: string;
}

export interface SeoClusterItem {
  query: string;
  intent: 'Transactional' | 'Commercial' | 'Informational' | 'Engineering';
  targetUrl: string;
  volumeStatus: 'CONFIRMED' | 'UNKNOWN';
  cluster: string;
  currentRankingProxy: string;
}

export interface BessDocument {
  id: string;
  title: string;
  category: 'Datasheet' | 'Certificate' | 'Whitepaper' | 'Schematic';
  product: string;
  fileSize: string;
  pages: number;
  verificationSource: string;
  summary: string;
}

export interface BessKnowledgeGuide {
  id: string;
  slug: string;
  question: string;
  shortAnswer: string;
  keyFacts: string[];
  detailedContent: string;
  methodologyOrStandard: string;
}

export const bessProducts: BessProduct[] = [
  {
    id: 'catl-tener',
    name: 'CATL TENER',
    modelCode: 'TENER-6.25MWh-LFP',
    series: 'TENER',
    tagline: 'Перша у світі промислова BESS із нульовою деградацією за перші 5 років',
    capacityKwh: 6250,
    capacityDisplay: '6.25 МВт·год (6,250 кВт·год)',
    nominalVoltage: '1331.2 V',
    voltageRange: '1164.8 V ~ 1497.6 V',
    cRate: '0.25C – 0.5C',
    coolingType: 'Прецизійний рідкісний контур (Liquid Cooling, ΔT ≤ 2.5°C)',
    cycleLife: '15,000+ циклів (5 років без деградації ємності та потужності)',
    roundTripEfficiency: '≥ 96.0% (AC-AC Round Trip)',
    dimensions: '6058 × 2438 × 2896 мм (Стандартний 20ft HC контейнер)',
    weightKg: '≈ 52,000 кг',
    protectionRating: 'IP55 / C5 антикорозійне покриття',
    certifications: ['NFPA 855', 'UL 9540A', 'UL 1973', 'IEC 62619', 'IEC 62477-1', 'UN 38.3'],
    primaryUse: 'Utility-scale енергопарки, великі заводи (>5 МВт), усунення небалансів СЕС/ВЕС',
    features: [
      'Нульова деградація ємності та потужності протягом перших 5 років експлуатації',
      'Енергетична щільність 430 Вт·год/л — на 30% вища за середньоринкову',
      'Інтегрована багаторівнева система газового та водяного пожежогасіння',
      'Комірки на базі LFP із твердим SEI-шаром самовідновлення',
    ],
  },
  {
    id: 'catl-enerone-plus',
    name: 'CATL EnerOne Plus',
    modelCode: 'EnerOne-Plus-372kWh',
    series: 'EnerOne',
    tagline: 'Компактна модульна зовнішня шафа для комерційних підприємств та заводів',
    capacityKwh: 372.7,
    capacityDisplay: '372.7 кВт·год на одну шафу',
    nominalVoltage: '1146.8 V',
    voltageRange: '1004 V ~ 1290 V',
    cRate: '0.5C – 1C (Миттєвий розряд до 372 кВт)',
    coolingType: 'Автономний замкнений рідкісний контур у кожній шафі',
    cycleLife: '10,000+ циклів (при 25°C, 80% DoD)',
    roundTripEfficiency: '≥ 95.2%',
    dimensions: '1300 × 1300 × 2300 мм (Займає лише 1.69 м² площі)',
    weightKg: '≈ 3,600 кг',
    protectionRating: 'IP55 / Вуличне виконання без капітальних споруд',
    certifications: ['UL 9540A', 'UL 1973', 'NFPA 855', 'IEC 62619', 'CE'],
    primaryUse: 'Промислові фабрики, склади, агропідприємства (100 кВт – 5 МВт)',
    features: [
      'Модульне паралельне масштабування від 1 шафи (372 кВт·год) до 50+ МВт·год',
      'Фронтальний доступ для обслуговування — можливість встановлення впритул до стіни',
      'Різниця температур між комірками не перевищує 3°C для рівномірного зносу',
      'Швидкий монтаж за принципом Plug-and-Play без тривалого простою підприємства',
    ],
  },
  {
    id: 'catl-enerc-plus',
    name: 'CATL EnerC Plus',
    modelCode: 'EnerC-Plus-3.72MWh',
    series: 'EnerC',
    tagline: 'Повнокомплектний контейнерний накопичувач для енергоємних об’єктів',
    capacityKwh: 3727,
    capacityDisplay: '3.72 МВт·год (3,727 кВт·год)',
    nominalVoltage: '1331.2 V',
    voltageRange: '1165 V ~ 1498 V',
    cRate: '0.5C',
    coolingType: 'Рідкісне охолодження високої продуктивності',
    cycleLife: '12,000+ циклів',
    roundTripEfficiency: '≥ 95.5%',
    dimensions: '12192 × 2438 × 2896 мм (40ft контейнер)',
    weightKg: '≈ 45,000 кг',
    protectionRating: 'IP55 / Сертифікат сейсмостійкості',
    certifications: ['UL 9540A', 'NFPA 855', 'IEC 62619', 'IEEE 1547'],
    primaryUse: 'Генерація СЕС/ВЕС, елеватори, металургійні та хімічні заводи',
    features: [
      'Готове рішення "все-в-одному": акумуляторні блоки, BMS, рідкісне охолодження, пожежогасіння',
      'Адаптація до температурного діапазону від -30°C до +50°C',
      'Сумісність з провідними інверторами PCS (SMA, Sungrow, Sinexcel, Kehua)',
      'Хмарний моніторинг стану комірок через платформу CATL Cloud Diagnostics',
    ],
  },
];

export const bessSolutions: BessSolution[] = [
  {
    id: 'peak-shaving',
    slug: 'peak-shaving',
    title: 'Зрізання пікових навантажень (Peak Shaving)',
    subtitle: 'Зниження витрат на приєднану потужність та уникнення штрафів оператора мережі',
    description: 'BESS автоматично розряджається в моменти максимального споживання підприємства (наприклад, одночасний пуск верстатів, насосів або печей), зрізаючи пікове навантаження на трансформатор та мережу.',
    benefits: [
      'Зниження оплати за приєднану потужність на 25–45%',
      'Усунення ризику вибивання автоматів та аварійних зупинок ліній',
      'Можливість нарощувати виробництво без дорогого розширення ліній обленерго',
    ],
    typicalPaybackYears: '2.5 – 3.8 роки',
    targetIndustries: ['Машинобудування', 'Харчові заводи', 'Елеватори', 'Холодильні термінали'],
    recommendedProduct: 'CATL EnerOne Plus',
    engineeringDetails: 'Алгоритм швидкого перемикання за 10–20 мс за сигналами лічильника комерційного обліку на межі балансової належності.',
  },
  {
    id: 'energy-arbitrage',
    slug: 'energy-arbitrage',
    title: 'Енергетичний арбітраж (Energy Arbitrage)',
    subtitle: 'Зарядка за нічним низьким тарифом — робота на власному заряді в дорогі години пік',
    description: 'Накопичувач заряджається вночі (або в години надлишку дешевої сонячної генерації на РДН) за мінімальною ціною, а віддає енергію в денні та вечірні години пікових тарифів.',
    benefits: [
      'Економія до 3.5 – 5.0 грн на кожній спожитій кіловат-годині',
      'Захист бізнесу від коливань біржових цін на електроенергію',
      'Можливість участі на балансуючому ринку допоміжних послуг ОСП "Укренерго"',
    ],
    typicalPaybackYears: '3.0 – 4.2 роки',
    targetIndustries: ['Цілодобові виробництва', 'Дата-центри', 'Агрохолдинги', 'ТРЦ'],
    recommendedProduct: 'CATL TENER / EnerC Plus',
    engineeringDetails: 'Інтеграція з EMS диспетчеризацією, що автоматично зчитує цінові індекси ринку на добу наперед (РДН).',
  },
  {
    id: 'backup-power',
    slug: 'backup-power',
    title: 'Гарантоване резервне живлення (Microgrid / UPS)',
    subtitle: 'Безперервне живлення критичних ліній без дизельних паливних витрат',
    description: 'При аварійному відключенні зовнішньої високовольтної мережі BESS миттєво формує локальну мікромережу (grid-forming), утримуючи напругу 400/10 000 В для безперервного технологічного процесу.',
    benefits: [
      'Миттєвий перехід на акумулятори (< 20 мс) без зупинки автоматизованих ліній',
      'Повна відсутність викидів, шуму та залежності від логістики дизельного пального',
      'Гібридна сумісність: може працювати в парі з діючими ДЕС як буфер потужності',
    ],
    typicalPaybackYears: 'Прямий захист від мільйонних збитків простою обладнання',
    targetIndustries: ['Високоточна електроніка', 'Хімічні заводи', 'Лікарні', 'Data Centers'],
    recommendedProduct: 'CATL EnerOne Plus / TENER',
    engineeringDetails: 'Підтримка функціоналу Grid-Forming, чорного пуску (Black Start) та динамічної компенсації реактивної потужності.',
  },
  {
    id: 'solar-storage',
    slug: 'solar-storage',
    title: 'Інтеграція із промисловими СЕС (Solar + BESS)',
    subtitle: '100% використання власної сонячної генерації без обмежень генерації в мережу',
    description: 'Накопичувач утилізує денний надлишок генерації сонячної станції, який неможливо спожити підприємством або передати в мережу через ліміти, зберігаючи його для вечірньої та нічної зміни.',
    benefits: [
      'Збільшення коефіцієнта використання сонячної станції до 98%',
      'Усунення штрафів за небаланси на ринку електроенергії',
      'Повна енергетична автономність підприємства з березня по листопад',
    ],
    typicalPaybackYears: '3.2 – 4.5 роки',
    targetIndustries: ['Підприємства з даховими СЕС', 'Наземні промислові СЕС', 'Агросектор'],
    recommendedProduct: 'CATL EnerOne Plus / EnerC Plus',
    engineeringDetails: 'Спільна точка підключення (AC-coupling або DC-coupling) з інверторами сонячної станції під керуванням єдиного контролера EMS.',
  },
];

export const bessIndustries: BessIndustry[] = [
  {
    id: 'manufacturing',
    title: 'Виробництво та важка промисловість',
    problem: 'Висока плата за пікову потужність, аварійні збитки при відключенні нагрівальних печей та верстатів із ЧПК.',
    solution: 'Встановлення BESS CATL EnerOne Plus (1–3 МВт·год) для зрізання пускових піків і резервування критичних цехів.',
    powerRange: '500 кВт – 5 МВт',
    typicalConfig: '1–2 контейнери EnerC Plus або каскад із 4–8 шаф EnerOne',
    roiEstimate: '2.8 – 3.5 роки',
  },
  {
    id: 'agriculture',
    title: 'Агропромислові комплекси та елеватори',
    problem: 'Сезонні перепади споживання під час сушіння зерна, слабкі сільські лінії електропередач із частими падіннями напруги.',
    solution: 'Гібрид СЕС + CATL BESS: згладжування роботи зерносушарок та компресорів, автономна робота під час збору врожаю.',
    powerRange: '250 кВт – 2 МВт',
    typicalConfig: '2–4 модульні шафи CATL EnerOne Plus (745 – 1,490 кВт·год)',
    roiEstimate: '3.2 – 4.0 роки',
  },
  {
    id: 'data-centers',
    title: 'Дата-центри (ЦОД) та IT-інфраструктура',
    problem: 'Критична чутливість серверів до мікропровалів напруги, високі витрати на технічне обслуговування свинцевих ДБЖ.',
    solution: 'Заміна традиційних свинцево-кислотних батарей на компактні LFP блоки CATL із терміном служби 15+ років.',
    powerRange: '100 кВт – 10 МВт',
    typicalConfig: 'CATL EnerOne Plus із C-rate 1C для миттєвої подачі високих струмів',
    roiEstimate: 'Капітальні витрати нижчі на 40% за рахунок площі та ресурсу 10 000 циклів',
  },
  {
    id: 'logistics',
    title: 'Логістичні хаби та холодильні склади',
    problem: 'Цілодобове навантаження потужних холодильних компресорів у години найдорожчої електроенергії (17:00–23:00).',
    solution: 'Арбітраж: накопичення енергії за нічним тарифом та охолодження складів ввечері без споживання з мережі.',
    powerRange: '300 кВт – 2 МВт',
    typicalConfig: 'CATL EnerOne Plus 1.1 МВт·год (3 модулі)',
    roiEstimate: '3.0 роки',
  },
];

export const semanticCoreKeywords: SeoClusterItem[] = [
  { query: 'CATL TENER', intent: 'Commercial', targetUrl: '/catl/tener', volumeStatus: 'CONFIRMED', cluster: 'CATL Product Family', currentRankingProxy: 'Target Top 1' },
  { query: 'CATL BESS Україна', intent: 'Transactional', targetUrl: '/', volumeStatus: 'CONFIRMED', cluster: 'Brand + Geo', currentRankingProxy: 'Target Top 1' },
  { query: 'промисловий накопичувач енергії', intent: 'Commercial', targetUrl: '/bess', volumeStatus: 'CONFIRMED', cluster: 'Generic BESS', currentRankingProxy: 'Target Top 1-3' },
  { query: 'BESS 1 MW ціна', intent: 'Transactional', targetUrl: '/bess/1mw-2mwh', volumeStatus: 'UNKNOWN', cluster: 'Power x Capacity', currentRankingProxy: 'Target Top 1' },
  { query: 'CATL EnerOne Plus характеристики', intent: 'Engineering', targetUrl: '/catl/enerone', volumeStatus: 'CONFIRMED', cluster: 'Product Engineering', currentRankingProxy: 'Target Top 1' },
  { query: 'зрізання піків споживання електроенергії', intent: 'Commercial', targetUrl: '/solutions/peak-shaving', volumeStatus: 'CONFIRMED', cluster: 'Application', currentRankingProxy: 'Target Top 1-3' },
  { query: 'накопичувач енергії для підприємства купити', intent: 'Transactional', targetUrl: '/rfq', volumeStatus: 'CONFIRMED', cluster: 'Commercial BOFU', currentRankingProxy: 'Target Top 1' },
  { query: 'арбітраж електроенергії на РДН накопичувач', intent: 'Commercial', targetUrl: '/solutions/energy-arbitrage', volumeStatus: 'UNKNOWN', cluster: 'Economics & Markets', currentRankingProxy: 'Target Top 1' },
  { query: 'що таке BESS', intent: 'Informational', targetUrl: '/knowledge/what-is-bess', volumeStatus: 'CONFIRMED', cluster: 'Knowledge TOFU', currentRankingProxy: 'Target Top 1' },
  { query: 'NFPA 855 стандарти безпеки BESS', intent: 'Engineering', targetUrl: '/knowledge/nfpa-855-safety', volumeStatus: 'UNKNOWN', cluster: 'Safety Compliance', currentRankingProxy: 'Target Top 1' },
];

export const bessDocuments: BessDocument[] = [
  {
    id: 'doc-tener-datasheet',
    title: 'CATL TENER 6.25 MWh Engineering Datasheet',
    category: 'Datasheet',
    product: 'CATL TENER',
    fileSize: '3.4 MB',
    pages: 18,
    verificationSource: 'CATL Official Specification v2025.10',
    summary: 'Повні електромеханічні параметри, креслення 20ft HC контейнера, гідравлічні характеристики рідкісного охолодження та діаграми деградації.',
  },
  {
    id: 'doc-enerone-specs',
    title: 'CATL EnerOne Plus 372.7 kWh Technical Manual',
    category: 'Datasheet',
    product: 'CATL EnerOne Plus',
    fileSize: '2.8 MB',
    pages: 14,
    verificationSource: 'CATL C&I Global Product Team',
    summary: 'Специфікація модульної вуличної шафи: розміщення, допустимі струми короткого замикання, сумісність з інверторами SMA / Sinexcel.',
  },
  {
    id: 'doc-nfpa-certificate',
    title: 'NFPA 855 & UL 9540A Fire Safety Compliance Dossier',
    category: 'Certificate',
    product: 'CATL All Series',
    fileSize: '5.1 MB',
    pages: 32,
    verificationSource: 'UL Solutions / TÜV Rheinland Test Report',
    summary: 'Протоколи повномасштабних випробувань на терморозгін (Thermal Runaway), дефлаграцію та ефективність систем автоматичного пожежогасіння Novec 1230.',
  },
  {
    id: 'doc-single-line',
    title: 'Типова однолінійна схема підключення BESS до РУ-10 кВ',
    category: 'Schematic',
    product: 'CATL Grid Integration',
    fileSize: '1.9 MB',
    pages: 4,
    verificationSource: 'Інженерне бюро CATL BESS Ukraine',
    summary: 'Схема первинної комутації: трансформатор ТМГ 10/0.4 кВ, релейний захист РЗА, вимикачі вакуумні, шафа EMS диспетчеризації.',
  },
];

export const bessKnowledgeGuides: BessKnowledgeGuide[] = [
  {
    id: 'guide-what-is-bess',
    slug: 'what-is-bess',
    question: 'Що таке промисловий BESS (Battery Energy Storage System)?',
    shortAnswer: 'BESS — це електрохімічна система накопичення енергії промислового масштабу (від сотень кВт·год до гігават-годин), що складається з акумуляторних батарей (переважно LFP), двонаправленого перетворювача (PCS), системи терморегулювання та інтелектуального керування (BMS/EMS).',
    keyFacts: [
      'Хімія: Lithium Iron Phosphate (LiFePO4) — стандарт безпеки та термостабільності',
      'ККД циклу (Round-Trip Efficiency): 94–96% від мережі до мережі',
      'Час реакції на аварійні збурення: менше 15–20 мілісекунд (seamless transition)',
      'Термін служби сучасних систем CATL: 10 000 – 15 000 циклів (20+ років)',
    ],
    detailedContent: 'На відміну від класичних дизель-генераторів, BESS не має механічного зносу, не витрачає паливо на холостому ходу та забезпечує миттєву підтримку напруги й частоти. У промисловості BESS виконує три взаємодоповнюючі ролі: знижує пікову потужність з мережі (Peak Shaving), дозволяє заробляти на різниці добових тарифів (Arbitrage) та гарантує безперебійність технологічних ліній.',
    methodologyOrStandard: 'Стандарт IEC 62933 (Electrical energy storage systems)',
  },
  {
    id: 'guide-c-rate',
    slug: 'c-rate-explained',
    question: 'Що означає параметр C-rate (0.25C, 0.5C, 1C) і як він впливає на накопичувач?',
    shortAnswer: 'C-rate — це показник швидкості заряду або розряду акумулятора відносно його номінальної ємності. Наприклад, для батареї 1000 кВт·год розряд струмом 1C видає 1000 кВт потужності протягом 1 години; розряд 0.5C видає 500 кВт протягом 2 годин.',
    keyFacts: [
      '1C (1 година розряду): Ідеально для короткочасних високих піків навантаження та ДБЖ серверів',
      '0.5C (2 години розряду): Найекономічніший баланс для арбітражу на ринку РДН та зрізання піків',
      '0.25C (4 години розряду): Стандарт utility-scale для добового зсуву сонячної генерації СЕС',
      'Чим нижчий робочий C-rate, тим нижчий нагрів комірок і довший термін служби системи',
    ],
    detailedContent: 'Для більшості українських підприємств оптимальною є конфігурація 0.5C (2-годинний накопичувач), оскільки пікові тарифні години в енергосистемі України тривають 2–4 години зранку та ввечері. CATL EnerOne Plus забезпечує гнучкість роботи в діапазоні від 0.5C до 1C.',
    methodologyOrStandard: 'IEEE 1679.1 Recommended Practice for the Characterization of Lithium-Based Batteries',
  },
  {
    id: 'guide-fire-safety',
    slug: 'nfpa-855-safety',
    question: 'Як забезпечується пожежна безпека BESS за стандартами NFPA 855 та UL 9540A?',
    shortAnswer: 'Пожежна безпека літієвих накопичувачів CATL досягається за рахунок використання негорючої хімії LFP, прецизійного рідкісного охолодження, що виключає перегрів окремих комірок, та багаторівневої системи автоматичного раннього детектування газів і пожежогасіння.',
    keyFacts: [
      'UL 9540A: Пройдено повномасштабний тест на відсутність лавиноподібного розповсюдження вогню між модулями',
      'NFPA 855: Стандарт США для розміщення стаціонарних систем накопичення енергії',
      'Раннє детектування газів (CO, H2, VOC) за 15 хвилин до можливого задимлення',
      'Ізольовані відсіки комірок з автономними модулями газового пожежогасіння Novec / FK-5-1-12',
    ],
    detailedContent: 'Хімічний зв’язок Fe-P-O у катоді LFP має значно міцніші ковалентні зв’язки, ніж кобальтові та нікелеві батареї (NMC). Температура термічного розгону LFP перевищує 270°C (проти 150°C у NMC), що робить CATL TENER та EnerOne найбезпечнішим вибором для розміщення поруч із виробничими корпусами.',
    methodologyOrStandard: 'NFPA 855:2023 & UL 9540A 4th Edition Certification',
  },
  {
    id: 'guide-lcos-roi',
    slug: 'lcos-calculation',
    question: 'Як розраховується LCOS (нормована вартість зберігання) та термін окупності BESS в Україні?',
    shortAnswer: 'LCOS (Levelized Cost of Storage) — це собівартість зберігання кожної 1 кВт·год електроенергії протягом усього життєвого циклу BESS з урахуванням капітальних витрат (CAPEX), операційних витрат (OPEX) та ККД циклу.',
    keyFacts: [
      'Середній LCOS сучасних систем CATL: $0.055 – $0.075 за кВт·год збереженої енергії',
      'Різниця між нічним та денним тарифом на РДН в Україні становить від 3.50 до 5.50 ₴/кВт·год',
      'Плата за перебір потужності (піки) додає до 300 000 – 1 200 000 ₴/рік до фонду окупності',
      'Типовий термін повернення інвестицій (PBP): від 2.8 до 4.2 років без державних субсидій',
    ],
    detailedContent: 'Розрахунок LCOS базується на формулі: LCOS = (CAPEX + Сума дисконтованого OPEX) / Сумарна віддана енергія за 15 000 циклів. Завдяки 5-річній нульовій деградації накопичувача CATL TENER корисна генерація залишається стабільною, що скорочує термін повернення капіталу підприємства.',
    methodologyOrStandard: 'IRENA Electricity Storage Valuation Framework & NREL LCOS Methodology',
  },
];

