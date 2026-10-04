import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, BatteryCharging, BookOpen, Building2, Cable, Calculator, ChartNoAxesCombined,
  Factory, FileSearch, FileText, GitCompareArrows, Globe2, HardHat, Landmark, Network, Ship, Wallet, Wrench,
} from 'lucide-react';
import type { KatlProduct } from '@katl/shared-types';
import { pimRepository } from '../../lib/pim/pimRepository';
import { asLocale, BRAND, languageAlternates, pick, type Locale } from '../../lib/brand';
import { LineupShowcase } from '../../components/LineupShowcase';
import { EnergyFlowHero } from '../../components/home/EnergyFlowHero';
import { PeakShavingLab } from '../../components/home/PeakShavingLab';
import { JsonLd, faqLd } from '../../components/seo/JsonLd';

/* ------------------------------------------------------------------------------------------------
 * Copy. Every statement is a process description, a definition, or an explicit pointer to where a
 * number will be confirmed (proposal / datasheet). No unverifiable figures on the homepage.
 * ---------------------------------------------------------------------------------------------- */
const C = {
  'uk-UA': {
    metaTitle: 'Системи накопичення енергії (BESS) для бізнесу та енергетики України',
    metaDesc: 'Інженерний підбір BESS/ESS на технологіях CATL: аналіз профілю навантаження, сайзинг, фінансова модель LCOS, логістика з Китаю, митне оформлення, монтаж та O&M в Україні.',
    kicker: 'ENERGY STORAGE PLATFORM · УКРАЇНА',
    h1a: 'Системи накопичення енергії,',
    h1b: 'спроєктовані під ваш об’єкт',
    lead: 'Від профілю навантаження до введення в експлуатацію: інженерний підбір BESS на технологіях CATL, прозора фінансова модель, логістика з Китаю та митне оформлення — в одному керованому процесі.',
    ctaDesign: 'Спроєктувати систему', ctaRfq: 'Запросити ТКП',
    pillars: [
      ['Інженерія', 'Профіль навантаження, сайзинг, SLD, сумісність PCS/EMS'],
      ['Фінанси', 'LCOS, TCO, грошові потоки — з відкритими припущеннями'],
      ['Логістика', 'Китай → Україна: доставка, митниця, склад'],
      ['Сервіс', 'Монтаж, пусконалагодження, моніторинг, O&M'],
    ],
    rolesKicker: '02 · ПОЧНІТЬ ЗІ СВОЄЇ РОЛІ',
    rolesTitle: 'Одна платформа — різні питання',
    rolesBody: 'Власник рахує окупність, енергетик — кіловати, EPC — сумісність. Оберіть свій маршрут.',
    roles: [
      ['Власник / CEO', 'Чи окупиться накопичувач і що буде під час відключень?', 'Оцінка ефекту', '/engineering/lcos'],
      ['Фінансовий директор', 'LCOS, TCO, грошові потоки та чутливість до тарифів.', 'Калькулятор LCOS', '/engineering/lcos'],
      ['Головний енергетик', 'Яка потужність і ємність потрібні саме для нашого графіка?', 'BESS Designer', '/bess-designer'],
      ['EPC / девелопер СЕС', 'Специфікації, однолінійні схеми, порівняння систем.', 'Порівняти системи', '/compare'],
      ['Інвестор / utility', 'Utility-scale контейнери, арбітраж РДН, допоміжні послуги.', 'Рішення для мережі', '/solutions/energy-arbitrage'],
      ['Виробник з Китаю', 'Вихід на ринок України: логістика, митниця, EPC, сервіс.', '中文版本', '/zh-CN'],
    ],
    labKicker: '03 · ЕНЕРГІЯ В ДІЇ',
    labTitle: 'Подивіться, як BESS зрізає пік',
    labBody: 'Оберіть тип об’єкта, задайте ліміт з мережі й параметри накопичувача — модель перемалює графік і покаже, чого бракує: потужності чи ємності.',
    lineupKicker: '04 · ТЕХНОЛОГІЇ CATL',
    pathKicker: '05 · ВІД ЗАДАЧІ ДО O&M',
    pathTitle: 'Ми ведемо проєкт до кінця, а не продаємо контейнер',
    pathBody: 'Кожен етап має вхідні дані, результат і відповідального. Ви бачите, на якому кроці проєкт і що потрібно для наступного.',
    steps: [
      ['Задача', 'Бізнес-ціль: резерв, піки, СЕС, арбітраж'],
      ['Дані', 'Інтервальні дані лічильника, тарифи, приєднання'],
      ['Профіль', 'Аналіз піків, сезонності, критичних навантажень'],
      ['Сайзинг', 'Потужність (кВт), ємність (кВт·год), тривалість'],
      ['Технологія', 'Хімія, архітектура, охолодження, безпека'],
      ['Фінмодель', 'CAPEX, OPEX, деградація, LCOS, NPV/IRR'],
      ['ТКП', 'Специфікація, умови, графік, гарантії виробника'],
      ['Закупівля', 'Контракт, виробництво, приймання'],
      ['Логістика', 'Міжнародна доставка та страхування'],
      ['Митниця', 'Оформлення, сертифікати, склад'],
      ['Монтаж і ПНР', 'Будівельна частина, підключення, випробування'],
      ['O&M', 'Моніторинг, сервіс, аналіз деградації'],
    ],
    corridorTitle: 'Коридор поставки',
    corridor: ['Виробник', 'Порт відвантаження', 'Морський / залізничний транзит', 'Митне оформлення', 'Склад в Україні', 'Майданчик'],
    corridorNote: 'Схема процесу, а не маршрут конкретної поставки. Маршрут, строки та умови фіксуються в ТКП.',
    toolsKicker: '06 · ІНСТРУМЕНТИ',
    toolsTitle: 'Інженерні інструменти на детермінованих формулах',
    toolsBody: 'Розрахунки не генерує мовна модель. Кожен результат показує припущення й версію алгоритму.',
    tools: [
      ['BESS Designer', 'Сайзинг системи під ваш профіль навантаження', '/bess-designer'],
      ['Калькулятор BESS', 'Потужність і корисна ємність за вимогами', '/engineering/bess-calculator'],
      ['LCOS', 'Вартість збереженої кВт·год з урахуванням деградації', '/engineering/lcos'],
      ['Однолінійна схема', 'Топологія підключення: PCS, трансформатор, захист', '/engineering/single-line-diagram'],
      ['Порівняння', 'Характеристики систем поруч', '/compare'],
      ['Документи', 'Паспорти, інструкції, документи відповідності', '/documents'],
    ],
    knowKicker: '07 · БАЗА ЗНАНЬ',
    knowTitle: 'Говоримо мовою інженерів — і пояснюємо її',
    knowBody: 'Глосарій ключових термінів BESS: від C-rate і DoD до LCOS та SOH. Без маркетингу, з формулами там, де вони потрібні.',
    terms: [['BESS', 'bess'], ['C-rate', 'c-rate'], ['DoD', 'dod'], ['SOC', 'soc'], ['SOH', 'soh'], ['RTE', 'rte'], ['LCOS', 'lcos'], ['PCS', 'pcs'], ['EMS', 'ems'], ['Peak shaving', 'peak-shaving'], ['Арбітраж', 'arbitrage'], ['LFP', 'lfp']],
    glossary: 'Відкрити глосарій', guide: 'Як обрати BESS для підприємства',
    faqTitle: 'Часті запитання',
    faq: [
      { q: 'Що таке BESS і чим вона відрізняється від ESS?', a: 'ESS (energy storage system) — загальна назва будь-якої системи накопичення енергії. BESS (battery energy storage system) — система на акумуляторних батареях: батарейні модулі з BMS, перетворювач потужності (PCS), система керування енергією (EMS), а також охолодження, пожежний захист і комутація.' },
      { q: 'Як визначити потрібну потужність і ємність накопичувача?', a: 'Потужність (кВт) визначається тим, скільки навантаження BESS має перекрити в моменті: перевищення над лімітом мережі або критичні споживачі. Ємність (кВт·год) — тим, як довго: тривалістю пікових подій або потрібним часом автономії з урахуванням робочого вікна заряду та ККД. Надійна оцінка потребує інтервальних даних лічильника (15–30 хв) щонайменше за кілька місяців.' },
      { q: 'Скільки служить літій-залізо-фосфатний (LFP) накопичувач?', a: 'Ресурс залежить від кількості циклів на добу, глибини розряду, температурного режиму та C-rate. Виробник вказує ресурс і гарантійні умови в документації на конкретну модель; ми закладаємо деградацію у фінансову модель явно і показуємо, як вона впливає на результат.' },
      { q: 'Що потрібно, щоб отримати техніко-комерційну пропозицію (ТКП)?', a: 'Мінімум: інтервальні дані споживання, тарифи та структура плати за потужність, дозволена потужність приєднання, наявна або запланована генерація, перелік критичних навантажень і бажаний строк реалізації. Однолінійна схема майданчика суттєво пришвидшує оцінку.' },
      { q: 'Чи є KATL офіційним дистриб’ютором CATL?', a: 'Ні. KATL — незалежна інженерна платформа, що працює з технологіями CATL та обладнанням за специфікаціями виробника. Будь-який партнерський статус буде опубліковано лише після документального підтвердження.' },
      { q: 'Хто відповідає за логістику та митне оформлення?', a: 'Ми супроводжуємо поставку від виробника до майданчика: міжнародну доставку, митне оформлення, складування та доставку на об’єкт. Маршрут, строки, податкові умови та відповідальність сторін фіксуються в ТКП і договорі для конкретного проєкту.' },
    ],
    finalKicker: 'НАСТУПНИЙ КРОК',
    finalTitle: 'Надішліть профіль навантаження — отримайте інженерну оцінку',
    finalList: ['Рекомендовані потужність і ємність з обґрунтуванням', 'Варіанти технології та архітектури системи', 'Попередня фінансова модель з припущеннями', 'План реалізації: поставка, митниця, монтаж'],
    finalCta: 'Створити запит', finalCta2: 'Спершу розрахувати самостійно',
  },
  en: {
    metaTitle: 'Battery Energy Storage (BESS) for Business and Utilities in Ukraine',
    metaDesc: 'Engineering-led BESS/ESS selection on CATL technology: load-profile analysis, sizing, LCOS financial model, logistics from China, customs clearance, installation and O&M in Ukraine.',
    kicker: 'ENERGY STORAGE PLATFORM · UKRAINE',
    h1a: 'Energy storage systems,',
    h1b: 'engineered for your site',
    lead: 'From load profile to commissioning: engineering-led BESS selection on CATL technology, a transparent financial model, logistics from China and customs clearance — in one managed process.',
    ctaDesign: 'Design a system', ctaRfq: 'Request a proposal',
    pillars: [
      ['Engineering', 'Load profile, sizing, SLD, PCS/EMS compatibility'],
      ['Finance', 'LCOS, TCO, cash flows — with open assumptions'],
      ['Logistics', 'China → Ukraine: freight, customs, warehousing'],
      ['Service', 'Installation, commissioning, monitoring, O&M'],
    ],
    rolesKicker: '02 · START WITH YOUR ROLE',
    rolesTitle: 'One platform, different questions',
    rolesBody: 'Owners look at payback, energy managers at kilowatts, EPCs at compatibility. Pick your route.',
    roles: [
      ['Owner / CEO', 'Will storage pay back, and what happens during outages?', 'Estimate the effect', '/engineering/lcos'],
      ['CFO', 'LCOS, TCO, cash flows and tariff sensitivity.', 'LCOS calculator', '/engineering/lcos'],
      ['Energy manager', 'What power and energy does our load curve need?', 'BESS Designer', '/bess-designer'],
      ['EPC / solar developer', 'Specifications, single-line diagrams, system comparison.', 'Compare systems', '/compare'],
      ['Investor / utility', 'Utility-scale containers, day-ahead arbitrage, ancillary services.', 'Grid solutions', '/solutions/energy-arbitrage'],
      ['Manufacturer from China', 'Entering Ukraine: logistics, customs, EPC, service.', '中文版本', '/zh-CN'],
    ],
    labKicker: '03 · ENERGY IN MOTION',
    labTitle: 'See how a BESS clips the peak',
    labBody: 'Pick a facility type, set the grid limit and storage parameters — the model redraws the demand curve and tells you whether power or energy is missing.',
    lineupKicker: '04 · CATL TECHNOLOGY',
    pathKicker: '05 · FROM PROBLEM TO O&M',
    pathTitle: 'We carry the project to the end — not just ship a container',
    pathBody: 'Every stage has inputs, an output and an owner. You always see where the project is and what the next step needs.',
    steps: [
      ['Problem', 'Business goal: backup, peaks, PV, arbitrage'],
      ['Data', 'Interval meter data, tariffs, grid connection'],
      ['Profile', 'Peaks, seasonality, critical loads'],
      ['Sizing', 'Power (kW), energy (kWh), duration'],
      ['Technology', 'Chemistry, architecture, cooling, safety'],
      ['Financials', 'CAPEX, OPEX, degradation, LCOS, NPV/IRR'],
      ['Proposal', 'Specification, terms, schedule, manufacturer warranty'],
      ['Procurement', 'Contract, production, factory acceptance'],
      ['Logistics', 'International freight and insurance'],
      ['Customs', 'Clearance, certificates, warehousing'],
      ['Install & commission', 'Civil works, connection, testing'],
      ['O&M', 'Monitoring, service, degradation analytics'],
    ],
    corridorTitle: 'Supply corridor',
    corridor: ['Manufacturer', 'Port of loading', 'Sea / rail transit', 'Customs clearance', 'Warehouse in Ukraine', 'Project site'],
    corridorNote: 'A process diagram, not the route of a specific shipment. Route, lead time and terms are fixed in the proposal.',
    toolsKicker: '06 · TOOLS',
    toolsTitle: 'Engineering tools built on deterministic formulas',
    toolsBody: 'Results are never generated by a language model. Each one shows its assumptions and algorithm version.',
    tools: [
      ['BESS Designer', 'Size a system for your load profile', '/bess-designer'],
      ['BESS calculator', 'Power and usable energy from requirements', '/engineering/bess-calculator'],
      ['LCOS', 'Cost per stored kWh including degradation', '/engineering/lcos'],
      ['Single-line diagram', 'Connection topology: PCS, transformer, protection', '/engineering/single-line-diagram'],
      ['Compare', 'System specifications side by side', '/compare'],
      ['Documents', 'Datasheets, manuals, compliance documents', '/documents'],
    ],
    knowKicker: '07 · KNOWLEDGE',
    knowTitle: 'We speak engineering — and explain it',
    knowBody: 'A glossary of key BESS terms, from C-rate and DoD to LCOS and SOH. No marketing, formulas where they matter.',
    terms: [['BESS', 'bess'], ['C-rate', 'c-rate'], ['DoD', 'dod'], ['SOC', 'soc'], ['SOH', 'soh'], ['RTE', 'rte'], ['LCOS', 'lcos'], ['PCS', 'pcs'], ['EMS', 'ems'], ['Peak shaving', 'peak-shaving'], ['Arbitrage', 'arbitrage'], ['LFP', 'lfp']],
    glossary: 'Open the glossary', guide: 'How to choose a BESS for a facility',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'What is a BESS and how is it different from an ESS?', a: 'ESS (energy storage system) is the general term for any system that stores energy. A BESS (battery energy storage system) uses batteries: battery modules with a BMS, a power conversion system (PCS), an energy management system (EMS), plus cooling, fire protection and switchgear.' },
      { q: 'How do I determine the required power and energy?', a: 'Power (kW) is set by how much load the BESS must cover at once: the excess above the grid limit or the critical loads. Energy (kWh) is set by how long: the duration of peak events or the required autonomy, adjusted for the usable state-of-charge window and efficiency. A reliable estimate needs interval meter data (15–30 min) for at least several months.' },
      { q: 'How long does an LFP battery system last?', a: 'Service life depends on cycles per day, depth of discharge, temperature and C-rate. The manufacturer states cycle life and warranty terms in the documentation for each model; we model degradation explicitly in the financials and show its effect on the result.' },
      { q: 'What do you need to prepare a commercial proposal?', a: 'At minimum: interval consumption data, tariffs and demand-charge structure, the permitted grid connection capacity, existing or planned generation, the list of critical loads and the target timeline. A single-line diagram of the site speeds up the assessment considerably.' },
      { q: 'Is KATL an official CATL distributor?', a: 'No. KATL is an independent engineering platform working with CATL technology and equipment to the manufacturer’s specifications. Any partnership status will be published only once documented.' },
      { q: 'Who handles logistics and customs?', a: 'We manage delivery from the manufacturer to the site: international freight, customs clearance, warehousing and delivery to site. Route, lead time, tax treatment and the parties’ responsibilities are fixed in the proposal and contract for each project.' },
    ],
    finalKicker: 'NEXT STEP',
    finalTitle: 'Send your load profile — get an engineering assessment',
    finalList: ['Recommended power and energy with rationale', 'Technology and system architecture options', 'Preliminary financial model with assumptions', 'Delivery plan: supply, customs, installation'],
    finalCta: 'Create a request', finalCta2: 'Calculate on my own first',
  },
  'zh-CN': {
    metaTitle: '乌克兰工商业与电网储能系统 (BESS) 项目平台',
    metaDesc: '基于 CATL 技术的储能工程选型：负荷曲线分析、容量配置、LCOS 财务模型、中国至乌克兰物流、清关、安装与运维。',
    kicker: '储能项目平台 · 乌克兰',
    h1a: '储能系统，',
    h1b: '为您的项目量身设计',
    lead: '从负荷曲线到投运：基于 CATL 技术的工程选型、透明的财务模型、中国至乌克兰的物流与清关——在一个可控流程中完成。',
    ctaDesign: '设计系统', ctaRfq: '获取方案',
    pillars: [
      ['工程', '负荷曲线、容量配置、单线图、PCS/EMS 兼容性'],
      ['财务', 'LCOS、TCO、现金流——假设条件公开'],
      ['物流', '中国 → 乌克兰：运输、清关、仓储'],
      ['服务', '安装、调试、监控、运维'],
    ],
    rolesKicker: '02 · 按角色开始',
    rolesTitle: '同一平台，不同问题',
    rolesBody: '业主关注回报，能源经理关注千瓦，EPC 关注兼容性。请选择您的路径。',
    roles: [
      ['业主 / CEO', '储能能否回本？停电时会怎样？', '评估效果', '/engineering/lcos'],
      ['财务总监', 'LCOS、TCO、现金流及电价敏感性。', 'LCOS 计算器', '/engineering/lcos'],
      ['能源经理', '我们的负荷曲线需要多大功率和容量？', 'BESS 设计器', '/bess-designer'],
      ['EPC / 光伏开发商', '技术规格、单线图、系统对比。', '系统对比', '/compare'],
      ['投资者 / 电网', '大型储能集装箱、日前市场套利、辅助服务。', '电网解决方案', '/solutions/energy-arbitrage'],
      ['中国制造商', '进入乌克兰市场：物流、清关、EPC、服务。', '合作方式', '/partner'],
    ],
    labKicker: '03 · 能量流动',
    labTitle: '看看储能如何削减峰值',
    labBody: '选择设施类型，设定电网上限与储能参数——模型将重绘负荷曲线，并指出缺少的是功率还是容量。',
    lineupKicker: '04 · CATL 技术',
    pathKicker: '05 · 从需求到运维',
    pathTitle: '我们负责项目全过程，而不只是交付一个集装箱',
    pathBody: '每个阶段都有输入、输出和责任人。您随时了解项目进度以及下一步所需条件。',
    steps: [
      ['需求', '业务目标：备用、削峰、光伏、套利'],
      ['数据', '电表间隔数据、电价、接入条件'],
      ['负荷', '峰值、季节性、重要负荷分析'],
      ['配置', '功率 (kW)、容量 (kWh)、时长'],
      ['技术', '化学体系、架构、冷却、安全'],
      ['财务', 'CAPEX、OPEX、衰减、LCOS、NPV/IRR'],
      ['方案', '规格、条款、计划、制造商质保'],
      ['采购', '合同、生产、出厂验收'],
      ['物流', '国际运输与保险'],
      ['清关', '报关、认证、仓储'],
      ['安装调试', '土建、并网、测试'],
      ['运维', '监控、服务、衰减分析'],
    ],
    corridorTitle: '供应通道',
    corridor: ['制造商', '装运港', '海运 / 铁路运输', '清关', '乌克兰仓库', '项目现场'],
    corridorNote: '流程示意，并非某一批次的实际路线。路线、交期与条款在正式方案中确定。',
    toolsKicker: '06 · 工具',
    toolsTitle: '基于确定性公式的工程工具',
    toolsBody: '计算结果不由语言模型生成。每个结果都会显示假设条件与算法版本。',
    tools: [
      ['BESS 设计器', '根据负荷曲线配置系统', '/bess-designer'],
      ['BESS 计算器', '按需求计算功率与可用容量', '/engineering/bess-calculator'],
      ['LCOS', '考虑衰减的度电储能成本', '/engineering/lcos'],
      ['单线图', '接入拓扑：PCS、变压器、保护', '/engineering/single-line-diagram'],
      ['对比', '系统参数并列对比', '/compare'],
      ['文档', '规格书、手册、合规文件', '/documents'],
    ],
    knowKicker: '07 · 知识库',
    knowTitle: '用工程语言沟通，并把它讲清楚',
    knowBody: '储能核心术语表：从 C-rate、DoD 到 LCOS、SOH。不做营销，需要时给出公式。',
    terms: [['BESS', 'bess'], ['C-rate', 'c-rate'], ['DoD', 'dod'], ['SOC', 'soc'], ['SOH', 'soh'], ['RTE', 'rte'], ['LCOS', 'lcos'], ['PCS', 'pcs'], ['EMS', 'ems'], ['削峰', 'peak-shaving'], ['套利', 'arbitrage'], ['LFP', 'lfp']],
    glossary: '打开术语表', guide: '如何为工厂选择储能系统',
    faqTitle: '常见问题',
    faq: [
      { q: '什么是 BESS？它与 ESS 有何区别？', a: 'ESS（储能系统）是所有储能系统的统称。BESS（电池储能系统）以电池为基础：包含带 BMS 的电池模组、储能变流器 (PCS)、能量管理系统 (EMS)，以及冷却、消防与开关设备。' },
      { q: '如何确定储能所需的功率与容量？', a: '功率 (kW) 取决于储能需要同时覆盖多少负荷：超出电网上限的部分或重要负荷。容量 (kWh) 取决于持续多久：峰值事件的时长或所需的自主运行时间，并考虑可用 SOC 区间和效率。可靠的评估需要至少数月的电表间隔数据（15–30 分钟）。' },
      { q: '磷酸铁锂 (LFP) 储能系统的寿命有多长？', a: '寿命取决于每日循环次数、放电深度、温度与倍率。制造商在各型号的文件中给出循环寿命与质保条款；我们在财务模型中明确计入衰减并展示其影响。' },
      { q: '编制技术商务方案需要哪些资料？', a: '至少需要：用电间隔数据、电价及需量电费结构、允许接入容量、现有或规划的发电设施、重要负荷清单以及目标工期。现场单线图可显著加快评估。' },
      { q: 'KATL 是 CATL 官方经销商吗？', a: '不是。KATL 是独立的工程平台，基于 CATL 技术并按制造商规格开展工作。任何合作状态仅在书面确认后发布。' },
      { q: '谁负责物流与清关？', a: '我们负责从制造商到项目现场的交付：国际运输、清关、仓储与送达现场。路线、交期、税务处理及各方责任在具体项目的方案与合同中确定。' },
    ],
    finalKicker: '下一步',
    finalTitle: '发送负荷曲线，获取工程评估',
    finalList: ['推荐功率与容量及依据', '技术与系统架构选项', '含假设条件的初步财务模型', '实施计划：供货、清关、安装'],
    finalCta: '提交需求', finalCta2: '先自行计算',
  },
} as const;

/** Homepage shows complete storage systems first (families), not components. */
const FEATURED = ['catl-tener-6250', 'catl-enerd-5000', 'catl-enerc-plus', 'catl-enerone-plus'];
function featureSystems(products: KatlProduct[]) {
  const rank = (p: KatlProduct) => { const i = FEATURED.indexOf(p.id); return i === -1 ? FEATURED.length : i; };
  return [...products].sort((a, b) => rank(a) - rank(b));
}

const roleIcons = [Building2, Wallet, Factory, HardHat, Landmark, Globe2];
const toolIcons = [Calculator, BatteryCharging, ChartNoAxesCombined, Cable, GitCompareArrows, FileText];
const pillarIcons = [Calculator, ChartNoAxesCombined, Ship, Wrench];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = C[locale];
  const alt = languageAlternates('/');
  return {
    title: { absolute: `${t.metaTitle} | ${BRAND.name}` },
    description: t.metaDesc,
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
    openGraph: { title: t.metaTitle, description: t.metaDesc, type: 'website', locale },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const t = C[locale];
  const root = `/${locale}`;

  let products: KatlProduct[] = [];
  let catalogUnavailable = false;
  try {
    products = await pimRepository.getAllProducts(locale);
  } catch {
    catalogUnavailable = true;
  }

  return (
    <main className="kx">
      <JsonLd data={faqLd(t.faq.map((f) => ({ q: f.q, a: f.a })))} />

      {/* 01 — HERO */}
      <section className="kx-hero" aria-labelledby="kx-hero-title">
        <div className="kx-wrap kx-hero-grid">
          <div className="kx-hero-copy">
            <span className="kx-kicker">{t.kicker}</span>
            <h1 id="kx-hero-title">
              {t.h1a} <span className="kx-h1-accent">{t.h1b}</span>
            </h1>
            <p className="kx-lead">{t.lead}</p>
            <div className="kx-actions">
              <Link className="kx-btn kx-btn-primary" href={`${root}/bess-designer`}>{t.ctaDesign}<ArrowRight size={17} /></Link>
              <Link className="kx-btn kx-btn-ghost" href={`${root}/rfq`}>{t.ctaRfq}</Link>
            </div>
          </div>
          <EnergyFlowHero locale={locale} />
        </div>
        <div className="kx-wrap">
          <ul className="kx-pillars">
            {t.pillars.map(([title, body], i) => {
              const Icon = pillarIcons[i];
              return (
                <li key={title}>
                  <Icon size={18} aria-hidden="true" />
                  <div><strong>{title}</strong><span>{body}</span></div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 02 — ROLES */}
      <section className="kx-section" aria-labelledby="kx-roles">
        <div className="kx-wrap">
          <header className="kx-head">
            <span className="kx-kicker kx-kicker-dark">{t.rolesKicker}</span>
            <h2 id="kx-roles">{t.rolesTitle}</h2>
            <p>{t.rolesBody}</p>
          </header>
          <div className="kx-roles">
            {t.roles.map(([role, question, action, href], i) => {
              const Icon = roleIcons[i];
              const target = href.startsWith('/zh-CN') ? href : `${root}${href}`;
              return (
                <Link key={role} href={target} className="kx-role">
                  <span className="kx-role-icon"><Icon size={20} aria-hidden="true" /></span>
                  <span className="kx-role-name">{role}</span>
                  <span className="kx-role-q">{question}</span>
                  <span className="kx-role-cta">{action}<ArrowUpRight size={15} aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03 — PEAK SHAVING LAB */}
      <section className="kx-section kx-section-paper" aria-labelledby="kx-lab">
        <div className="kx-wrap">
          <header className="kx-head">
            <span className="kx-kicker kx-kicker-dark">{t.labKicker}</span>
            <h2 id="kx-lab">{t.labTitle}</h2>
            <p>{t.labBody}</p>
          </header>
          <PeakShavingLab locale={locale} />
        </div>
      </section>

      {/* 04 — LINEUP (from PIM) */}
      <section className="kx-section" aria-label={t.lineupKicker}>
        <div className="kx-wrap kx-lineup">
          <span className="kx-kicker kx-kicker-dark">{t.lineupKicker}</span>
          <LineupShowcase locale={locale} products={featureSystems(products)} unavailable={catalogUnavailable} limit={4} />
        </div>
      </section>

      {/* 05 — PROJECT PATH + SUPPLY CORRIDOR */}
      <section className="kx-section kx-section-ink" aria-labelledby="kx-path">
        <div className="kx-wrap">
          <header className="kx-head kx-head-light">
            <span className="kx-kicker">{t.pathKicker}</span>
            <h2 id="kx-path">{t.pathTitle}</h2>
            <p>{t.pathBody}</p>
          </header>
          <ol className="kx-steps">
            {t.steps.map(([title, body], i) => (
              <li key={title} className={i === 8 || i === 9 ? 'is-highlight' : ''}>
                <span className="kx-mono kx-step-n">{String(i + 1).padStart(2, '0')}</span>
                <strong>{title}</strong>
                <span>{body}</span>
              </li>
            ))}
          </ol>
          <div className="kx-corridor" aria-labelledby="kx-corridor-title">
            <h3 id="kx-corridor-title"><Ship size={18} aria-hidden="true" /> {t.corridorTitle}</h3>
            <ol className="kx-corridor-line">
              {t.corridor.map((stop, i) => (
                <li key={stop}><span className="kx-dot" aria-hidden="true" /><span className="kx-mono kx-dim">{String(i + 1).padStart(2, '0')}</span>{stop}</li>
              ))}
            </ol>
            <p className="kx-fine kx-fine-light">{t.corridorNote}</p>
          </div>
        </div>
      </section>

      {/* 06 — TOOLS */}
      <section className="kx-section" aria-labelledby="kx-tools">
        <div className="kx-wrap">
          <header className="kx-head">
            <span className="kx-kicker kx-kicker-dark">{t.toolsKicker}</span>
            <h2 id="kx-tools">{t.toolsTitle}</h2>
            <p>{t.toolsBody}</p>
          </header>
          <div className="kx-tools">
            {t.tools.map(([name, body, href], i) => {
              const Icon = toolIcons[i];
              return (
                <Link key={name} href={`${root}${href}`} className="kx-tool">
                  <span className="kx-mono kx-dim">{String(i + 1).padStart(2, '0')}</span>
                  <Icon size={22} aria-hidden="true" />
                  <strong>{name}</strong>
                  <span>{body}</span>
                  <ArrowRight className="kx-tool-arrow" size={18} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 — KNOWLEDGE + FAQ */}
      <section className="kx-section kx-section-paper" aria-labelledby="kx-know">
        <div className="kx-wrap kx-know">
          <div>
            <span className="kx-kicker kx-kicker-dark">{t.knowKicker}</span>
            <h2 id="kx-know">{t.knowTitle}</h2>
            <p className="kx-muted">{t.knowBody}</p>
            <ul className="kx-terms">
              {t.terms.map(([label, slug]) => (
                <li key={slug}><Link href={`${root}/resources/glossary#${slug}`}>{label}</Link></li>
              ))}
            </ul>
            <div className="kx-actions">
              <Link className="kx-btn kx-btn-dark" href={`${root}/resources/glossary`}><BookOpen size={16} />{t.glossary}</Link>
              <Link className="kx-link" href={`${root}/resources/guides/how-to-choose-bess`}><FileSearch size={15} />{t.guide}</Link>
            </div>
          </div>
          <div className="kx-faq">
            <h3>{t.faqTitle}</h3>
            {t.faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — FINAL CTA */}
      <section className="kx-final" aria-labelledby="kx-final">
        <div className="kx-wrap kx-final-grid">
          <div>
            <span className="kx-kicker">{t.finalKicker}</span>
            <h2 id="kx-final">{t.finalTitle}</h2>
            <div className="kx-actions">
              <Link className="kx-btn kx-btn-primary" href={`${root}/rfq`}>{t.finalCta}<ArrowRight size={17} /></Link>
              <Link className="kx-btn kx-btn-ghost" href={`${root}/bess-designer`}><Network size={16} />{t.finalCta2}</Link>
            </div>
          </div>
          <ul className="kx-final-list">
            {t.finalList.map((item, i) => (
              <li key={item}><span className="kx-mono">{String(i + 1).padStart(2, '0')}</span>{item}</li>
            ))}
          </ul>
        </div>
        <p className="kx-wrap kx-fine kx-fine-light kx-disclosure">{pick(BRAND.disclosure, locale)}</p>
      </section>
    </main>
  );
}
