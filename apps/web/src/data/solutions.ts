/**
 * Solution (use-case) pages content, trilingual. Engineering explanations only — no product
 * claims or promised returns. Economic outcomes are always tied to site data.
 */
type Tri = { uk: string; en: string; zh: string };
type TriList = { uk: string[]; en: string[]; zh: string[] };

export interface SolutionContent {
  slug: string;
  title: Tri;
  summary: Tri;
  how: Tri;
  drivers: TriList;
  inputs: TriList;
  architecture: Tri;
  terms: string[];
  tools: Array<'designer' | 'calculator' | 'lcos' | 'sld' | 'compare' | 'rfq'>;
}

export const solutions: SolutionContent[] = [
  {
    slug: 'peak-shaving',
    title: { uk: 'Зрізання пікових навантажень (peak shaving)', en: 'Peak shaving for industrial sites', zh: '工商业削峰' },
    summary: {
      uk: 'BESS віддає енергію в моменти пікового споживання й утримує потужність з мережі нижче заданого ліміту — щоб зменшити плату за потужність або вкластися в дозволену потужність приєднання.',
      en: 'The BESS discharges during demand peaks and holds grid draw below a set limit — to cut demand charges or stay within the permitted connection capacity.',
      zh: '储能在负荷高峰时放电，将电网取电功率控制在设定上限以下，以降低需量电费或满足核准接入容量。',
    },
    how: {
      uk: 'EMS постійно порівнює поточне навантаження з лімітом. Коли навантаження його перевищує, PCS розряджає батарею на різницю; у години низького навантаження батарея заряджається, не порушуючи ліміт. Потужність системи визначає, який пік можна перекрити, ємність — як довго.',
      en: 'The EMS continuously compares site demand with the limit. When demand exceeds it, the PCS discharges the battery by the difference; in low-load hours the battery recharges without breaching the limit. Power sets how high a peak can be covered, energy sets for how long.',
      zh: 'EMS 持续比较实时负荷与上限。负荷超限时，PCS 按差值放电；低负荷时段在不超限的前提下充电。功率决定可覆盖的峰值高度，容量决定可持续的时长。',
    },
    drivers: {
      uk: ['Структура тарифу: чи є окрема плата за потужність і як вона розраховується', 'Тривалість і частота пікових подій', 'Резерв дозволеної потужності приєднання', 'Можливість поєднати з резервом або СЕС'],
      en: ['Tariff structure: whether there is a separate demand charge and how it is measured', 'Duration and frequency of peak events', 'Headroom in the permitted connection capacity', 'Whether it can be stacked with backup or PV'],
      zh: ['电价结构：是否有单独的需量电费及其计量方式', '峰值事件的持续时间与频率', '核准接入容量的余量', '能否与备用电源或光伏叠加'],
    },
    inputs: {
      uk: ['Інтервальні дані лічильника (15–30 хв) щонайменше за кілька місяців', 'Тарифи та правила розрахунку плати за потужність', 'Дозволена потужність приєднання та її фактичне використання', 'Перелік технологічних процесів, що формують піки', 'Плани розширення виробництва'],
      en: ['Interval meter data (15–30 min) for at least several months', 'Tariffs and demand-charge rules', 'Permitted connection capacity and its actual use', 'Processes that create the peaks', 'Plans for production growth'],
      zh: ['至少数月的电表间隔数据（15–30 分钟）', '电价及需量电费规则', '核准接入容量及实际使用情况', '形成峰值的生产工艺', '扩产计划'],
    },
    architecture: {
      uk: 'Типово — AC-підключення BESS на шині 0.4 кВ або через трансформатор на 6/10 кВ, з вимірюванням потужності в точці приєднання для EMS. Схема захистів і облік погоджуються в проєкті.',
      en: 'Typically an AC-coupled BESS on the 0.4 kV bus or through a transformer at 6/10 kV, with power metering at the point of connection feeding the EMS. Protection and metering are agreed in the design.',
      zh: '通常为交流耦合，接入 0.4 kV 母线或经变压器接入 6/10 kV，并在并网点计量功率供 EMS 使用。保护与计量方案在设计中确定。',
    },
    terms: ['peak-shaving', 'load-profile', 'c-rate', 'duration', 'ems'],
    tools: ['designer', 'calculator', 'lcos', 'rfq'],
  },
  {
    slug: 'solar-bess',
    title: { uk: 'СЕС + накопичення енергії', en: 'Solar + storage', zh: '光伏 + 储能' },
    summary: {
      uk: 'Накопичувач зберігає денний надлишок сонячної генерації і віддає його ввечері — зменшуючи обмеження експорту та підвищуючи частку власного споживання.',
      en: 'Storage captures midday PV surplus and delivers it in the evening — reducing export curtailment and raising self-consumption.',
      zh: '储能储存午间光伏余电并在傍晚释放，减少弃光并提高自用率。',
    },
    how: {
      uk: 'Коли генерація СЕС перевищує споживання, EMS спрямовує надлишок у батарею замість експорту або обмеження інверторів. Після заходу сонця батарея покриває вечірнє навантаження. Ефект залежить від того, наскільки профіль генерації не збігається з профілем споживання.',
      en: 'When PV output exceeds demand, the EMS routes the surplus into the battery instead of exporting or curtailing inverters. After sunset the battery covers evening demand. The effect depends on how much the generation and demand profiles diverge.',
      zh: '当光伏出力超过负荷时，EMS 将余电充入电池，而非上网或限发。日落后由电池供应傍晚负荷。效果取决于发电曲线与负荷曲线的错位程度。',
    },
    drivers: {
      uk: ['Обсяг надлишку генерації, який зараз експортується або обмежується', 'Різниця між вартістю купованої енергії та ціною експорту', 'Обмеження експорту в точці приєднання', 'Сезонність генерації'],
      en: ['The volume of surplus currently exported or curtailed', 'The gap between purchase cost and export price', 'Export limits at the connection point', 'Seasonality of generation'],
      zh: ['目前上网或被限发的余电量', '购电成本与上网电价的差额', '并网点的上网限制', '发电的季节性'],
    },
    inputs: {
      uk: ['Погодинна генерація СЕС (фактична або модельна)', 'Погодинне споживання об’єкта', 'Умови приєднання та обмеження експорту', 'Тип інверторів СЕС і точка можливого підключення BESS'],
      en: ['Hourly PV generation (measured or modelled)', 'Hourly site consumption', 'Connection terms and export limits', 'PV inverter type and possible BESS connection point'],
      zh: ['逐时光伏发电量（实测或模拟）', '逐时用电量', '并网条件与上网限制', '光伏逆变器类型及储能可接入点'],
    },
    architecture: {
      uk: 'AC-coupled — BESS з власним PCS на шині змінного струму (зручно для наявних СЕС); DC-coupled — батарея на DC-шині гібридного інвертора (менше перетворень, але залежить від обладнання СЕС).',
      en: 'AC-coupled — a BESS with its own PCS on the AC bus (convenient for existing PV); DC-coupled — the battery on the DC bus of a hybrid inverter (fewer conversions, but tied to the PV equipment).',
      zh: '交流耦合：储能配独立 PCS 接入交流母线（适合已有光伏）；直流耦合：电池接入混合逆变器直流母线（转换环节少，但依赖光伏设备）。',
    },
    terms: ['solar-plus-storage', 'rte', 'pcs', 'duration'],
    tools: ['designer', 'lcos', 'sld', 'rfq'],
  },
  {
    slug: 'backup-power',
    title: { uk: 'Резервне живлення на базі BESS', en: 'Backup power with BESS', zh: '储能备用电源' },
    summary: {
      uk: 'BESS підтримує критичні навантаження під час відключень мережі — самостійно, разом із СЕС або як міст до запуску генератора.',
      en: 'A BESS keeps critical loads running during grid outages — on its own, with PV, or as a bridge until a generator starts.',
      zh: '电网停电时，储能独立或与光伏配合为重要负荷供电，或在发电机启动前提供过渡。',
    },
    how: {
      uk: 'При зникненні мережі система переходить в острівний режим: PCS у режимі формування мережі (grid-forming) задає напругу й частоту для критичної секції. Час перемикання, пускові струми двигунів і селективність захистів визначають, які навантаження можна підтримати.',
      en: 'On grid loss the system goes into island mode: the PCS, in grid-forming mode, sets voltage and frequency for the critical section. Transfer time, motor inrush currents and protection selectivity determine which loads can be supported.',
      zh: '电网失电时系统转入孤岛运行：PCS 以构网模式为重要负荷段建立电压与频率。切换时间、电机启动电流与保护选择性决定可支撑的负荷。',
    },
    drivers: {
      uk: ['Вартість простою для бізнесу на годину', 'Потрібний час автономії', 'Наявність і стан генераторів', 'Можливість у звичайний час використовувати BESS для піків або СЕС'],
      en: ['Cost of downtime per hour', 'Required autonomy', 'Availability and condition of generators', 'Whether the BESS can earn on peaks or PV in normal times'],
      zh: ['每小时停工损失', '所需自主运行时间', '发电机的配置与状况', '平时能否用于削峰或光伏'],
    },
    inputs: {
      uk: ['Перелік критичних споживачів, їх потужність і пускові струми', 'Бажаний час автономії', 'Допустимий час перерви живлення', 'Наявні UPS, генератори та АВР', 'Однолінійна схема з виділенням критичної секції'],
      en: ['Critical loads, their power and inrush currents', 'Target autonomy', 'Acceptable interruption time', 'Existing UPS, generators and transfer switches', 'Single-line diagram with the critical section marked'],
      zh: ['重要负荷清单、功率与启动电流', '目标自主时长', '可接受的断电时间', '现有 UPS、发电机与自动切换装置', '标明重要负荷段的单线图'],
    },
    architecture: {
      uk: 'Потрібні PCS з функцією острівної роботи, комутаційний апарат відокремлення від мережі та узгоджена схема захистів. Для коротких перерв BESS часто поєднують з UPS; для довгих — з генератором.',
      en: 'It requires a PCS capable of island operation, a disconnection device from the grid and a coordinated protection scheme. For short interruptions a BESS is often paired with a UPS; for long ones, with a generator.',
      zh: '需具备孤岛运行能力的 PCS、并离网切换装置以及协调的保护方案。短时中断常与 UPS 配合；长时停电则与发电机配合。',
    },
    terms: ['grid-forming', 'microgrid', 'soc', 'usable-energy'],
    tools: ['calculator', 'sld', 'designer', 'rfq'],
  },
  {
    slug: 'energy-arbitrage',
    title: { uk: 'Енергетичний арбітраж на РДН', en: 'Energy arbitrage on the day-ahead market', zh: '日前市场电能套利' },
    summary: {
      uk: 'Заряд у години низьких цін і продаж або власне споживання в години високих. Для utility-scale систем арбітраж часто поєднують із допоміжними послугами.',
      en: 'Charge in low-price hours, sell or self-consume in high-price hours. Utility-scale systems often stack arbitrage with ancillary services.',
      zh: '低价时段充电，高价时段售电或自用。大型储能常将套利与辅助服务叠加。',
    },
    how: {
      uk: 'EMS або торговий оператор планує графік заряду/розряду на основі прогнозу погодинних цін. Дохід за цикл — це спред між ціною продажу та ціною купівлі з поправкою на ККД, мінус вартість деградації.',
      en: 'The EMS or a trading operator schedules charging and discharging from an hourly price forecast. Revenue per cycle is the spread between selling and buying price, adjusted for efficiency, minus the cost of degradation.',
      zh: 'EMS 或交易方根据分时电价预测安排充放电计划。单次循环收益为卖出价与买入价之差（按效率修正）减去衰减成本。',
    },
    drivers: {
      uk: ['Добовий ціновий спред і його стабільність', 'ККД повного циклу', 'Кількість циклів на добу та їх вплив на деградацію', 'Правила доступу до ринку та балансування'],
      en: ['Daily price spread and its stability', 'Round-trip efficiency', 'Cycles per day and their effect on degradation', 'Market access and balancing rules'],
      zh: ['日内价差及其稳定性', '往返效率', '每日循环次数及其对衰减的影响', '市场准入与平衡规则'],
    },
    inputs: {
      uk: ['Історія погодинних цін за обраний період', 'Модель участі в ринку (самостійно чи через трейдера)', 'Потужність приєднання для заряду й видачі', 'Вимоги до прогнозування та балансування'],
      en: ['Historical hourly prices for the chosen period', 'Market participation model (direct or via a trader)', 'Connection capacity for charging and export', 'Forecasting and balancing requirements'],
      zh: ['选定期间的历史分时电价', '参与市场模式（直接或经交易商）', '充电与放电的接入容量', '预测与平衡要求'],
    },
    architecture: {
      uk: 'Зазвичай — контейнерні BESS на середній напрузі з власною трансформаторною підстанцією, комерційним обліком і телемеханікою для оператора системи.',
      en: 'Usually containerised BESS at medium voltage with its own transformer substation, revenue metering and telemetry to the system operator.',
      zh: '通常为中压接入的集装箱储能，配独立变电站、关口计量及向系统运营商的远动通信。',
    },
    terms: ['arbitrage', 'dam', 'rte', 'degradation', 'ancillary-services', 'lcos'],
    tools: ['lcos', 'compare', 'designer', 'rfq'],
  },
  {
    slug: 'microgrid',
    title: { uk: 'BESS для мікромережі', en: 'BESS for microgrids', zh: '微电网储能' },
    summary: {
      uk: 'Накопичувач стабілізує локальну систему з кількома джерелами — СЕС, генератором, мережею — і дозволяє острівну роботу.',
      en: 'Storage stabilises a local system with several sources — PV, generator, grid — and enables island operation.',
      zh: '储能稳定由光伏、发电机、电网等多电源组成的局部系统，并实现孤岛运行。',
    },
    how: {
      uk: 'BESS у режимі grid-forming стає «опорою» острівної мережі: тримає напругу й частоту, компенсує коливання генерації СЕС і дозволяє генератору працювати в ефективній зоні або не запускатися взагалі.',
      en: 'A grid-forming BESS becomes the backbone of the island grid: it holds voltage and frequency, absorbs PV fluctuations and lets the generator run in its efficient range or not start at all.',
      zh: '构网型储能成为孤岛电网的支撑：维持电压与频率，平抑光伏波动，使发电机在高效区间运行或无需启动。',
    },
    drivers: {
      uk: ['Витрати палива генератора та їх зменшення', 'Надійність живлення критичних процесів', 'Частка відновлюваної генерації', 'Складність керування та захистів'],
      en: ['Generator fuel cost and its reduction', 'Supply reliability for critical processes', 'Share of renewable generation', 'Control and protection complexity'],
      zh: ['发电机燃料成本及其降低', '关键工艺的供电可靠性', '可再生能源比例', '控制与保护的复杂度'],
    },
    inputs: {
      uk: ['Однолінійна схема майданчика', 'Джерела генерації, їх потужність і режими', 'Профіль навантаження та критичні споживачі', 'Вимоги до переходу в острів і синхронізації'],
      en: ['Site single-line diagram', 'Generation sources, their ratings and modes', 'Load profile and critical consumers', 'Island transition and synchronisation requirements'],
      zh: ['现场单线图', '电源类型、容量与运行模式', '负荷曲线与重要负荷', '孤岛切换与同步要求'],
    },
    architecture: {
      uk: 'Ключове — контролер мікромережі, що координує BESS, генератори та СЕС, і схема захистів, коректна і в мережевому, і в острівному режимі (струми КЗ у цих режимах суттєво відрізняються).',
      en: 'The key elements are a microgrid controller that coordinates BESS, generators and PV, and a protection scheme that works in both grid-connected and island modes (fault currents differ substantially between them).',
      zh: '关键在于协调储能、发电机与光伏的微电网控制器，以及在并网与孤岛两种模式下均有效的保护方案（两种模式下的短路电流差异很大）。',
    },
    terms: ['microgrid', 'grid-forming', 'ems', 'solar-plus-storage'],
    tools: ['sld', 'designer', 'calculator', 'rfq'],
  },
  {
    slug: 'ev-charging',
    title: { uk: 'BESS для зарядної інфраструктури', en: 'BESS for EV charging hubs', zh: '充电站储能' },
    summary: {
      uk: 'Батарейний буфер дозволяє встановити потужні швидкі зарядні станції там, де потужності мережі недостатньо, і згладжує піки одночасних сесій.',
      en: 'A battery buffer allows high-power fast chargers where grid capacity is insufficient and smooths the peaks of simultaneous sessions.',
      zh: '电池缓冲可在电网容量不足处部署大功率快充，并平滑同时充电产生的峰值。',
    },
    how: {
      uk: 'Між сесіями BESS повільно заряджається від мережі в межах ліміту приєднання, а під час одночасного заряджання кількох авто додає потужність до мережевої. Ефект визначається одночасністю сесій і їх тривалістю.',
      en: 'Between sessions the BESS recharges slowly within the connection limit; when several vehicles charge at once it adds power on top of the grid supply. The effect is driven by session simultaneity and duration.',
      zh: '充电间隙储能在接入限值内缓慢充电；多车同时充电时，储能在电网供电基础上补充功率。效果取决于充电同时率与时长。',
    },
    drivers: {
      uk: ['Вартість і строки збільшення потужності приєднання', 'Кількість і потужність зарядних точок', 'Профіль сесій і одночасність', 'Можливість додати СЕС на навісах'],
      en: ['Cost and lead time of a connection upgrade', 'Number and rating of charge points', 'Session profile and simultaneity', 'Option to add PV canopies'],
      zh: ['扩容接入的成本与周期', '充电桩数量与功率', '充电曲线与同时率', '增设光伏车棚的可能性'],
    },
    inputs: {
      uk: ['Кількість і потужність зарядних точок', 'Очікуваний профіль сесій', 'Підтверджена доступна потужність мережі', 'План розвитку локації'],
      en: ['Number and rating of charge points', 'Expected session profile', 'Confirmed available grid capacity', 'Site development plan'],
      zh: ['充电桩数量与功率', '预期充电曲线', '已确认的可用电网容量', '场站发展规划'],
    },
    architecture: {
      uk: 'AC-підключення BESS до шини зарядного хабу або DC-підключення до спільної DC-шини зарядних станцій, залежно від обладнання.',
      en: 'AC coupling of the BESS to the charging hub bus, or DC coupling to a shared DC bus of the chargers, depending on equipment.',
      zh: '根据设备情况，储能可交流耦合至充电站母线，或直流耦合至充电桩共用直流母线。',
    },
    terms: ['peak-shaving', 'c-rate', 'duration', 'load-profile'],
    tools: ['calculator', 'designer', 'compare', 'rfq'],
  },
];

export const toolLinks: Record<SolutionContent['tools'][number], { path: string; uk: string; en: string; zh: string }> = {
  designer: { path: '/bess-designer', uk: 'BESS Designer', en: 'BESS Designer', zh: 'BESS 设计器' },
  calculator: { path: '/engineering/bess-calculator', uk: 'Калькулятор BESS', en: 'BESS calculator', zh: 'BESS 计算器' },
  lcos: { path: '/engineering/lcos', uk: 'Калькулятор LCOS', en: 'LCOS calculator', zh: 'LCOS 计算器' },
  sld: { path: '/engineering/single-line-diagram', uk: 'Однолінійна схема', en: 'Single-line diagram', zh: '单线图' },
  compare: { path: '/compare', uk: 'Порівняння систем', en: 'Compare systems', zh: '系统对比' },
  rfq: { path: '/rfq', uk: 'Запит ТКП', en: 'Request a proposal', zh: '获取方案' },
};
