/**
 * BESS glossary — the topical-authority backbone of the knowledge base.
 * Definitions are general engineering knowledge (no product-specific numbers).
 * Each term has a stable slug used as an anchor (#slug) across the site.
 */
export type GlossaryGroup = 'system' | 'metrics' | 'economics' | 'applications' | 'technology' | 'safety';

export interface GlossaryTerm {
  slug: string;
  term: string;
  aka?: string;
  group: GlossaryGroup;
  uk: string;
  en: string;
  zh: string;
  formula?: string;
  related?: string[];
}

export const groupLabels: Record<GlossaryGroup, { uk: string; en: string; zh: string }> = {
  system: { uk: 'Архітектура системи', en: 'System architecture', zh: '系统架构' },
  metrics: { uk: 'Технічні показники', en: 'Technical metrics', zh: '技术指标' },
  economics: { uk: 'Економіка', en: 'Economics', zh: '经济性' },
  applications: { uk: 'Застосування', en: 'Applications', zh: '应用场景' },
  technology: { uk: 'Технології та хімія', en: 'Technology and chemistry', zh: '技术与化学体系' },
  safety: { uk: 'Безпека та стандарти', en: 'Safety and standards', zh: '安全与标准' },
};

export const glossary: GlossaryTerm[] = [
  {
    slug: 'bess', term: 'BESS', aka: 'Battery Energy Storage System', group: 'system',
    uk: 'Система накопичення енергії на акумуляторних батареях. Складається з батарейних модулів і стійок з BMS, перетворювача потужності (PCS), системи керування енергією (EMS), а також систем охолодження, пожежного захисту, комутації та, за потреби, трансформатора.',
    en: 'A battery energy storage system: battery modules and racks with a BMS, a power conversion system (PCS), an energy management system (EMS), plus cooling, fire protection, switchgear and, where needed, a transformer.',
    zh: '电池储能系统：由带 BMS 的电池模组和电池簇、储能变流器 (PCS)、能量管理系统 (EMS) 以及冷却、消防、开关设备和（必要时）变压器组成。',
    related: ['ess', 'pcs', 'bms', 'ems'],
  },
  {
    slug: 'ess', term: 'ESS', aka: 'Energy Storage System', group: 'system',
    uk: 'Загальна назва будь-якої системи накопичення енергії — батарейної, теплової, механічної чи водневої. BESS є найпоширенішим підвидом ESS у комерційних і мережевих проєктах.',
    en: 'The general term for any energy storage system — battery, thermal, mechanical or hydrogen. BESS is the most common type of ESS in commercial and grid projects.',
    zh: '储能系统的统称，包括电池、热、机械或氢储能。BESS 是工商业与电网项目中最常见的 ESS 类型。',
    related: ['bess'],
  },
  {
    slug: 'pcs', term: 'PCS', aka: 'Power Conversion System', group: 'system',
    uk: 'Двонаправлений перетворювач, що з’єднує батарею постійного струму з мережею змінного струму: заряджає батарею з мережі або СЕС і віддає енергію назад. Номінальна потужність PCS обмежує потужність заряду/розряду всієї системи.',
    en: 'A bidirectional converter linking the DC battery to the AC grid: it charges the battery from the grid or PV and exports energy back. The PCS rating caps the charge/discharge power of the whole system.',
    zh: '双向变流器，连接直流电池与交流电网：从电网或光伏为电池充电并向外放电。PCS 额定功率决定整个系统的充放电功率上限。',
    related: ['bess', 'grid-forming'],
  },
  {
    slug: 'bms', term: 'BMS', aka: 'Battery Management System', group: 'system',
    uk: 'Система керування батареєю: вимірює напруги, струми й температури комірок, оцінює SOC та SOH, балансує комірки та відключає батарею при виході параметрів за безпечні межі.',
    en: 'The battery management system measures cell voltages, currents and temperatures, estimates SOC and SOH, balances cells and disconnects the battery when parameters leave safe limits.',
    zh: '电池管理系统：监测电芯电压、电流和温度，估算 SOC 与 SOH，进行均衡，并在参数超出安全范围时断开电池。',
    related: ['soc', 'soh', 'thermal-runaway'],
  },
  {
    slug: 'ems', term: 'EMS', aka: 'Energy Management System', group: 'system',
    uk: 'Система керування енергією, що вирішує, коли й з якою потужністю заряджати чи розряджати BESS: за графіком навантаження, тарифами, генерацією СЕС, лімітом приєднання або командами оператора. Саме EMS реалізує режими peak shaving, арбітражу та резерву.',
    en: 'The energy management system decides when and at what power to charge or discharge the BESS, based on load, tariffs, PV output, connection limits or operator commands. The EMS is what implements peak shaving, arbitrage and backup modes.',
    zh: '能量管理系统：根据负荷、电价、光伏出力、接入限值或调度指令，决定储能何时以多大功率充放电。削峰、套利与备用模式均由 EMS 实现。',
    related: ['peak-shaving', 'arbitrage'],
  },
  {
    slug: 'c-rate', term: 'C-rate', group: 'metrics',
    uk: 'Відношення потужності заряду/розряду до номінальної енергоємності. 1C означає повний розряд приблизно за 1 годину, 0.5C — за 2 години, 0.25C — за 4 години.',
    en: 'The ratio of charge/discharge power to nominal energy capacity. 1C means a full discharge in about one hour, 0.5C in two hours, 0.25C in four hours.',
    zh: '充放电功率与额定容量之比。1C 约 1 小时放完，0.5C 约 2 小时，0.25C 约 4 小时。',
    formula: 'C = P / E   (P — кВт / kW, E — кВт·год / kWh)',
    related: ['duration'],
  },
  {
    slug: 'duration', term: 'Тривалість (Duration)', aka: 'Duration', group: 'metrics',
    uk: 'Скільки годин система може віддавати номінальну потужність. Системи з тривалістю 1–2 год частіше застосовують для піків і допоміжних послуг, 2–4 год — для зсуву генерації СЕС та арбітражу.',
    en: 'How many hours the system can deliver its rated power. 1–2 h systems are typical for peaks and ancillary services, 2–4 h for PV shifting and arbitrage.',
    zh: '系统以额定功率持续放电的小时数。1–2 小时系统多用于削峰与辅助服务，2–4 小时多用于光伏时移与套利。',
    formula: 't = E_usable / P',
    related: ['c-rate', 'usable-energy'],
  },
  {
    slug: 'usable-energy', term: 'Корисна ємність', aka: 'Usable energy', group: 'metrics',
    uk: 'Частина номінальної енергоємності, яку дозволено використовувати з урахуванням робочого вікна SOC, резервів і втрат. Саме корисна, а не номінальна ємність має закладатися в розрахунок проєкту.',
    en: 'The share of nominal energy that may actually be used given the SOC window, reserves and losses. Project calculations should use usable, not nominal, energy.',
    zh: '在 SOC 区间、预留和损耗约束下实际可用的能量。项目计算应采用可用容量而非额定容量。',
    related: ['dod', 'soc'],
  },
  {
    slug: 'dod', term: 'DoD', aka: 'Depth of Discharge', group: 'metrics',
    uk: 'Глибина розряду — частка ємності, використана за цикл. Вищий DoD дає більше енергії за цикл, але, як правило, пришвидшує деградацію; допустимі значення вказує виробник.',
    en: 'Depth of discharge — the share of capacity used in a cycle. A higher DoD yields more energy per cycle but generally accelerates degradation; permitted values are set by the manufacturer.',
    zh: '放电深度：单次循环使用的容量比例。DoD 越高，单次可用能量越多，但通常会加速衰减；允许值由制造商规定。',
    formula: 'DoD = 1 − SOC_min (для циклу від 100 %)',
    related: ['soc', 'degradation'],
  },
  {
    slug: 'soc', term: 'SOC', aka: 'State of Charge', group: 'metrics',
    uk: 'Рівень заряду батареї у відсотках від доступної ємності. EMS тримає SOC у робочому вікні, щоб мати резерв для аварійних режимів і обмежити деградацію.',
    en: 'State of charge — the battery’s charge level as a percentage of available capacity. The EMS keeps SOC within an operating window to hold a reserve and limit degradation.',
    zh: '荷电状态：电池电量占可用容量的百分比。EMS 将 SOC 控制在运行区间内，以保留备用并减缓衰减。',
    related: ['dod', 'ems'],
  },
  {
    slug: 'soh', term: 'SOH', aka: 'State of Health', group: 'metrics',
    uk: 'Стан здоров’я батареї — поточна ємність відносно початкової. Кінцем ресурсу зазвичай вважають падіння SOH до порогу, визначеного в гарантійних умовах виробника.',
    en: 'State of health — current capacity relative to initial capacity. End of life is usually defined as SOH falling to a threshold set in the manufacturer’s warranty terms.',
    zh: '健康状态：当前容量相对初始容量的比例。寿命终止通常定义为 SOH 降至制造商质保条款规定的阈值。',
    related: ['degradation', 'cycle-life'],
  },
  {
    slug: 'rte', term: 'RTE', aka: 'Round-Trip Efficiency', group: 'metrics',
    uk: 'ККД повного циклу: яка частка енергії, спожитої на заряд, повертається при розряді. Важливо, в якій точці виміряно — на клемах DC батареї чи на стороні AC з урахуванням PCS, трансформатора та власних потреб (охолодження).',
    en: 'Round-trip efficiency — the share of charging energy returned on discharge. It matters where it is measured: at the DC battery terminals or on the AC side including PCS, transformer and auxiliary loads such as cooling.',
    zh: '往返效率：放电能量与充电能量之比。需注意测量边界：直流电池端还是包含 PCS、变压器及辅助负荷（如冷却）的交流侧。',
    formula: 'RTE = E_out / E_in',
    related: ['lcos'],
  },
  {
    slug: 'cycle-life', term: 'Циклічний ресурс', aka: 'Cycle life', group: 'metrics',
    uk: 'Кількість циклів заряд-розряд до досягнення порогового SOH за визначених умов (DoD, C-rate, температура). Значення без умов випробування порівнювати некоректно.',
    en: 'The number of charge–discharge cycles until a threshold SOH is reached under stated conditions (DoD, C-rate, temperature). Figures quoted without test conditions cannot be compared.',
    zh: '在规定条件（DoD、倍率、温度）下达到 SOH 阈值前的充放电循环次数。未注明测试条件的数据不可直接比较。',
    related: ['soh', 'degradation'],
  },
  {
    slug: 'degradation', term: 'Деградація', aka: 'Degradation', group: 'metrics',
    uk: 'Поступова втрата ємності та зростання внутрішнього опору. Складається з календарного старіння (час, температура, SOC зберігання) і циклічного (кількість і глибина циклів). Має бути закладена у фінансову модель.',
    en: 'Gradual loss of capacity and rise in internal resistance, made up of calendar ageing (time, temperature, storage SOC) and cycle ageing (number and depth of cycles). It belongs in the financial model.',
    zh: '容量逐渐下降、内阻上升，包括日历老化（时间、温度、存储 SOC）与循环老化（循环次数与深度）。应计入财务模型。',
    related: ['soh', 'augmentation', 'lcos'],
  },
  {
    slug: 'augmentation', term: 'Аугментація', aka: 'Augmentation', group: 'economics',
    uk: 'Плановане додавання батарейної ємності протягом експлуатації, щоб компенсувати деградацію й зберегти гарантовану енергію на виході. Альтернатива — початковий запас ємності (overbuild).',
    en: 'Planned addition of battery capacity during operation to offset degradation and maintain contracted energy output. The alternative is an initial capacity overbuild.',
    zh: '在运行期内按计划增补电池容量，以抵消衰减并维持约定的输出能量。替代方案是初始超配容量。',
    related: ['degradation', 'tco'],
  },
  {
    slug: 'lcos', term: 'LCOS', aka: 'Levelized Cost of Storage', group: 'economics',
    uk: 'Приведена вартість зберігання — дисконтовані сукупні витрати за життєвий цикл, поділені на дисконтовану енергію, віддану системою. Дозволяє порівнювати рішення з різними CAPEX, ККД і ресурсом.',
    en: 'Levelized cost of storage — discounted lifetime costs divided by discounted energy delivered. It allows comparison of options with different CAPEX, efficiency and lifetime.',
    zh: '平准化储能成本：全生命周期折现成本除以折现放电量，用于比较不同 CAPEX、效率与寿命的方案。',
    formula: 'LCOS = (CAPEX + Σ (OPEX_t + C_charge,t) / (1+r)^t) / Σ E_out,t / (1+r)^t',
    related: ['tco', 'npv', 'rte'],
  },
  {
    slug: 'tco', term: 'TCO', aka: 'Total Cost of Ownership', group: 'economics',
    uk: 'Сукупна вартість володіння: CAPEX, монтаж і підключення, обслуговування, енергія на заряд і власні потреби, аугментація, страхування та утилізація за весь строк.',
    en: 'Total cost of ownership: CAPEX, installation and connection, maintenance, charging and auxiliary energy, augmentation, insurance and end-of-life over the whole term.',
    zh: '总拥有成本：在整个周期内的 CAPEX、安装并网、运维、充电与辅助用电、增容、保险及退役处置。',
    related: ['lcos', 'augmentation'],
  },
  {
    slug: 'npv', term: 'NPV / IRR', aka: 'Net Present Value / Internal Rate of Return', group: 'economics',
    uk: 'NPV — сума дисконтованих грошових потоків проєкту мінус інвестиції; IRR — ставка дисконтування, за якої NPV дорівнює нулю. Обидва показники чутливі до тарифів, деградації та припущень щодо циклів.',
    en: 'NPV is the sum of discounted project cash flows minus the investment; IRR is the discount rate at which NPV equals zero. Both are sensitive to tariffs, degradation and cycling assumptions.',
    zh: 'NPV 为项目折现现金流之和减去投资；IRR 为使 NPV 为零的折现率。两者均对电价、衰减与循环假设敏感。',
    formula: 'NPV = Σ CF_t / (1+r)^t − I₀',
    related: ['lcos', 'tco'],
  },
  {
    slug: 'peak-shaving', term: 'Peak shaving', aka: 'Зрізання піків', group: 'applications',
    uk: 'Режим, у якому BESS розряджається в моменти пікового споживання, тримаючи потужність з мережі нижче заданого ліміту, і заряджається в періоди низького навантаження. Знижує плату за потужність і дозволяє працювати в межах дозволеної потужності приєднання.',
    en: 'A mode in which the BESS discharges during demand peaks to keep grid draw below a set limit and recharges during low load. It reduces demand charges and keeps a site within its permitted connection capacity.',
    zh: '储能在负荷高峰时放电，使电网取电功率低于设定上限，并在低负荷时充电。可降低需量电费，并使用电保持在核准接入容量内。',
    related: ['load-profile', 'ems'],
  },
  {
    slug: 'arbitrage', term: 'Енергетичний арбітраж', aka: 'Energy arbitrage', group: 'applications',
    uk: 'Заряд у години низьких цін і розряд у години високих — наприклад, на ринку «на добу наперед» (РДН). Результат залежить від цінового спреду, ККД, деградації та правил доступу до ринку.',
    en: 'Charging in low-price hours and discharging in high-price hours, e.g. on the day-ahead market. The result depends on the price spread, efficiency, degradation and market access rules.',
    zh: '在低价时段充电、高价时段放电，例如在日前市场。收益取决于价差、效率、衰减与市场准入规则。',
    related: ['dam', 'rte'],
  },
  {
    slug: 'dam', term: 'РДН', aka: 'Day-ahead market', group: 'applications',
    uk: 'Ринок «на добу наперед» — сегмент ринку електроенергії, де ціни визначаються погодинно на наступну добу. Погодинна структура цін є ключовим входом для моделювання арбітражу.',
    en: 'The day-ahead market, where electricity prices are set hour by hour for the next day. Its hourly price structure is a key input to arbitrage modelling.',
    zh: '日前市场：逐小时确定次日电价的电力市场环节。其分时价格结构是套利建模的关键输入。',
    related: ['arbitrage'],
  },
  {
    slug: 'load-profile', term: 'Профіль навантаження', aka: 'Load profile', group: 'applications',
    uk: 'Часовий ряд потужності споживання об’єкта, зазвичай з кроком 15 або 30 хвилин. Показує піки, їх тривалість, добову й сезонну структуру — головне джерело даних для сайзингу BESS.',
    en: 'A time series of a site’s power demand, usually at 15- or 30-minute intervals. It reveals peaks, their duration and daily and seasonal patterns — the primary input for BESS sizing.',
    zh: '设施用电功率的时间序列，通常为 15 或 30 分钟间隔。可显示峰值及其持续时间、日内与季节规律，是储能容量配置的主要依据。',
    related: ['peak-shaving', 'duration'],
  },
  {
    slug: 'solar-plus-storage', term: 'СЕС + накопичення', aka: 'Solar + storage', group: 'applications',
    uk: 'Поєднання сонячної електростанції з BESS для збереження денного надлишку генерації та його використання ввечері, зменшення обмежень експорту і підвищення частки власного споживання. Архітектура може бути AC- або DC-coupled.',
    en: 'Combining a PV plant with a BESS to store midday surplus for evening use, reduce export curtailment and raise self-consumption. The architecture can be AC- or DC-coupled.',
    zh: '光伏电站与储能结合，储存午间余电供傍晚使用，减少弃光并提高自用率。可采用交流耦合或直流耦合架构。',
    related: ['peak-shaving', 'pcs'],
  },
  {
    slug: 'microgrid', term: 'Мікромережа', aka: 'Microgrid', group: 'applications',
    uk: 'Локальна енергосистема з власними джерелами, накопиченням і навантаженням, здатна працювати як паралельно з мережею, так і в острівному режимі. Потребує узгодженої схеми захистів і керування.',
    en: 'A local energy system with its own sources, storage and loads, able to operate in parallel with the grid or in island mode. It requires coordinated protection and control.',
    zh: '具备自有电源、储能与负荷的局部能源系统，可并网运行或孤岛运行，需要协调的保护与控制方案。',
    related: ['grid-forming', 'ems'],
  },
  {
    slug: 'ancillary-services', term: 'Допоміжні послуги', aka: 'Ancillary services', group: 'applications',
    uk: 'Послуги з підтримки частоти та балансування енергосистеми, наприклад резерви підтримки та відновлення частоти. Швидкий відгук BESS добре підходить для них; участь вимагає кваліфікації за правилами оператора системи передачі.',
    en: 'Services that support grid frequency and balancing, such as frequency containment and restoration reserves. A BESS’s fast response suits them well; participation requires qualification under the transmission system operator’s rules.',
    zh: '用于电网调频与平衡的服务，如频率控制与恢复备用。储能响应快速，十分适合；参与需按输电系统运营商规则取得资质。',
    related: ['grid-forming'],
  },
  {
    slug: 'grid-forming', term: 'Grid-forming / grid-following', group: 'technology',
    uk: 'Режими керування інвертором. Grid-following синхронізується з наявною напругою мережі; grid-forming сам формує напругу й частоту, що потрібно для острівної роботи, слабких мереж і чорного старту.',
    en: 'Inverter control modes. Grid-following synchronises to an existing grid voltage; grid-forming establishes voltage and frequency itself, which is needed for island operation, weak grids and black start.',
    zh: '逆变器控制模式。跟网型与现有电网电压同步；构网型自行建立电压与频率，适用于孤岛运行、弱电网与黑启动。',
    related: ['pcs', 'microgrid'],
  },
  {
    slug: 'lfp', term: 'LFP', aka: 'Lithium Iron Phosphate', group: 'technology',
    uk: 'Літій-залізо-фосфатна хімія катода — домінуючий вибір для стаціонарних BESS завдяки термічній стабільності, довгому циклічному ресурсу та відсутності кобальту й нікелю.',
    en: 'Lithium iron phosphate cathode chemistry — the dominant choice for stationary BESS thanks to thermal stability, long cycle life and the absence of cobalt and nickel.',
    zh: '磷酸铁锂正极化学体系：凭借热稳定性、长循环寿命及不含钴镍，成为固定式储能的主流选择。',
    related: ['sodium-ion', 'cycle-life'],
  },
  {
    slug: 'sodium-ion', term: 'Натрій-іонні батареї', aka: 'Sodium-ion', group: 'technology',
    uk: 'Батареї, в яких носієм заряду є іони натрію. Не потребують літію, зазвичай краще працюють при низьких температурах; питома енергоємність, як правило, нижча за LFP. Технологія швидко комерціалізується.',
    en: 'Batteries in which sodium ions carry the charge. They need no lithium and typically perform better at low temperatures; energy density is generally lower than LFP. The technology is commercialising quickly.',
    zh: '以钠离子为电荷载体的电池，无需锂，低温性能通常更好；能量密度一般低于磷酸铁锂。该技术正快速商业化。',
    related: ['lfp'],
  },
  {
    slug: 'liquid-cooling', term: 'Рідинне охолодження', aka: 'Liquid cooling', group: 'technology',
    uk: 'Терморегулювання батареї теплоносієм через холодильні пластини. Порівняно з повітряним забезпечує рівномірнішу температуру комірок, що впливає на деградацію, і дозволяє щільніше компонування.',
    en: 'Battery thermal management using coolant through cold plates. Compared with air cooling it keeps cell temperatures more uniform, which affects degradation, and allows denser packaging.',
    zh: '通过液冷板循环冷却液进行电池热管理。与风冷相比，电芯温度更均匀（影响衰减），并可实现更高的集成密度。',
    related: ['degradation', 'thermal-runaway'],
  },
  {
    slug: 'thermal-runaway', term: 'Тепловий розгін', aka: 'Thermal runaway', group: 'safety',
    uk: 'Неконтрольоване самонагрівання комірки з виділенням газів і тепла. Безпека BESS оцінюється за тим, чи поширюється розгін на сусідні комірки, модулі та стійки, і як система це виявляє й локалізує.',
    en: 'Uncontrolled self-heating of a cell that releases gas and heat. BESS safety is judged by whether runaway propagates to neighbouring cells, modules and racks, and how the system detects and contains it.',
    zh: '电芯失控自热并释放气体与热量。储能安全性取决于热失控是否向相邻电芯、模组和电池簇蔓延，以及系统如何探测与抑制。',
    related: ['ul-9540a', 'bms'],
  },
  {
    slug: 'ul-9540a', term: 'UL 9540A', group: 'safety',
    uk: 'Методика випробувань для оцінки поширення теплового розгону в системах накопичення на рівнях комірки, модуля, установки та монтажу. Це метод випробування, а не сертифікат «пройдено/не пройдено»; важливий звіт за результатами.',
    en: 'A test method for evaluating thermal runaway fire propagation in energy storage systems at cell, module, unit and installation levels. It is a test method rather than a pass/fail certificate; the test report is what matters.',
    zh: '评估储能系统在电芯、模组、单元及安装层级热失控火灾蔓延的测试方法。它是测试方法而非“通过/不通过”证书，关键在于测试报告。',
    related: ['thermal-runaway', 'iec-62619'],
  },
  {
    slug: 'iec-62619', term: 'IEC 62619', group: 'safety',
    uk: 'Міжнародний стандарт вимог безпеки до вторинних літієвих комірок і батарей для промислового застосування, включно зі стаціонарними системами накопичення.',
    en: 'The international standard for safety requirements of secondary lithium cells and batteries for industrial applications, including stationary storage.',
    zh: '工业用途（包括固定式储能）二次锂电芯与电池的国际安全要求标准。',
    related: ['ul-9540a'],
  },
];
