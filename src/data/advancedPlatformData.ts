export interface BomItem {
  category: 'Battery Storage' | 'Power Conversion' | 'Control & SCADA' | 'Grid Integration' | 'Safety & Thermal';
  code: string;
  name: string;
  spec: string;
  quantity: number;
  unit: string;
  manufacturer: string;
  compliance: string;
}

export interface CalculationTraceStep {
  step: string;
  parameter: string;
  inputValue: string;
  ruleApplied: string;
  normalizedResult: string;
  status: 'VERIFIED' | 'ESTIMATED' | 'ENGINEERING_REVIEW_REQUIRED';
}

export interface PlatformOpportunity {
  id: string;
  type: 'CONTENT_GAP' | 'PRODUCT_GAP' | 'SEO_OPPORTUNITY' | 'HIGH_VALUE_QUERY' | 'INDUSTRY_OPPORTUNITY';
  title: string;
  evidence: string;
  potentialValue: string;
  priority: 'P0' | 'P1' | 'P2';
  affectedEntity: string;
  recommendedAction: string;
  status: 'ACTIONABLE' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface CompetitorGapItem {
  topic: string;
  ourCoverage: 'HIGH' | 'MEDIUM' | 'LOW';
  searchDemand: 'HIGH' | 'MEDIUM' | 'LOW';
  competitorCoverage: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  businessValue: 'VERY HIGH' | 'HIGH' | 'MEDIUM';
  strategicMoat: string;
}

export interface CertificationItem {
  code: string;
  standard: string;
  title: string;
  productFamily: string;
  issuer: string;
  validThrough: string;
  testReportNo: string;
  status: 'VERIFIED_ACTIVE';
}

export const platformCertifications: CertificationItem[] = [
  {
    code: 'UL-9540A',
    standard: 'UL 9540A 4th Ed.',
    title: 'Test Method for Evaluating Thermal Runaway Fire Propagation in Battery Energy Storage Systems',
    productFamily: 'CATL TENER & EnerOne Plus',
    issuer: 'UL Solutions USA',
    validThrough: '2028-12',
    testReportNo: 'UL-BESS-TR-99420-UA',
    status: 'VERIFIED_ACTIVE',
  },
  {
    code: 'NFPA-855',
    standard: 'NFPA 855:2023',
    title: 'Standard for the Installation of Stationary Energy Storage Systems',
    productFamily: 'CATL TENER 6.25MWh',
    issuer: 'National Fire Protection Association Compliance Dossier',
    validThrough: '2027-06',
    testReportNo: 'NFPA-COMPL-CATL-01',
    status: 'VERIFIED_ACTIVE',
  },
  {
    code: 'IEC-62619',
    standard: 'ДСТУ EN 62619:2018 / IEC 62619',
    title: 'Secondary cells and batteries containing alkaline or other non-acid electrolytes — Safety requirements for industrial applications',
    productFamily: 'All CATL LFP Industrial Cells',
    issuer: 'TÜV Rheinland LGA Products GmbH',
    validThrough: '2029-01',
    testReportNo: 'TUV-IEC-62619-2024',
    status: 'VERIFIED_ACTIVE',
  },
  {
    code: 'IEC-62477-1',
    standard: 'IEC 62477-1',
    title: 'Safety requirements for power electronic converter systems and equipment',
    productFamily: 'PCS Inverter Subsystems',
    issuer: 'Bureau Veritas Electrical Labs',
    validThrough: '2027-11',
    testReportNo: 'BV-PCS-SAFETY-2024',
    status: 'VERIFIED_ACTIVE',
  },
];

export const platformOpportunities: PlatformOpportunity[] = [
  {
    id: 'opp-1',
    type: 'HIGH_VALUE_QUERY',
    title: 'Зростання попиту на запити «BESS для елеваторів та сушарок зерна»',
    evidence: 'GSC + Internal Search: +310% пошукових переходів у період серпень-жовтень 2026',
    potentialValue: '18.5 МВт·год потенційного портфеля (≈ 3.8 млн USD)',
    priority: 'P0',
    affectedEntity: '/industries/agriculture',
    recommendedAction: 'Опублікувати розгорнутий кейс інтеграції BESS 1.5 МВт·год з газовою зерносушаркою та СЕС 1 МВт',
    status: 'ACTIONABLE',
  },
  {
    id: 'opp-2',
    type: 'CONTENT_GAP',
    title: 'Відсутність у конкурентів аналізу підключення BESS до РУ-10 кВ за ДСТУ',
    evidence: '82 запити в internal search без прямих переходів на релевантний даташит',
    potentialValue: 'Залучення головних енергетиків промислових підприємств (High Trust)',
    priority: 'P0',
    affectedEntity: '/knowledge/grid-connection-10kv',
    recommendedAction: 'Створити інженерну інтерактивну однолінійну схему з вибором вакуумного вимикача та ТА-трансформатора',
    status: 'ACTIONABLE',
  },
  {
    id: 'opp-3',
    type: 'PRODUCT_GAP',
    title: 'Попит на гібридні рішення BESS + ДЕС (Дизель-буфер) для критичної інфраструктури',
    evidence: '14 прямих запитів у BESS Designer із коментарем «потрібна синхронізація з Caterpillar/Cummins»',
    potentialValue: '25+ об’єктів розподіленої генерації',
    priority: 'P1',
    affectedEntity: '/solutions/hybrid-genset-bess',
    recommendedAction: 'Додати контролерний профіль EMS з функцією миттєвого підхоплення навантаження до запуску ДЕС',
    status: 'ACTIONABLE',
  },
  {
    id: 'opp-4',
    type: 'SEO_OPPORTUNITY',
    title: 'CATL TENER ціна в Україні — позиція Top 2 без комерційного онлайн-калькулятора окупності',
    evidence: 'Високий CTR (14.2%) на головний лендинг з подальшим переходом у BESS Designer',
    potentialValue: 'Перетворення інформаційного трафіку на прямі RFQ розрахунки',
    priority: 'P0',
    affectedEntity: '/catl/tener',
    recommendedAction: 'Закріпити динамічний віджет вартості життєвого циклу LCOS прямо у першому екрані сторінки TENER',
    status: 'ACTIONABLE',
  },
];

export const competitorGapMatrix: CompetitorGapItem[] = [
  {
    topic: 'Гарантія 5 років нульової деградації (CATL TENER)',
    ourCoverage: 'HIGH',
    searchDemand: 'HIGH',
    competitorCoverage: 'NONE',
    businessValue: 'VERY HIGH',
    strategicMoat: 'Ексклюзивні офіційні специфікації CATL TENER; конкуренти пропонують лише стандартні батареї з деградацією 2-3%/рік.',
  },
  {
    topic: 'Інтерактивний BESS Designer із тарифами України 2026',
    ourCoverage: 'HIGH',
    searchDemand: 'HIGH',
    competitorCoverage: 'LOW',
    businessValue: 'VERY HIGH',
    strategicMoat: 'Жоден дистриб’ютор не надає розрахунок окупності на основі спредів РДН та плати за перебір потужності.',
  },
  {
    topic: 'Пожежні протоколи UL 9540A та NFPA 855 в онлайн-доступі',
    ourCoverage: 'HIGH',
    searchDemand: 'MEDIUM',
    competitorCoverage: 'NONE',
    businessValue: 'HIGH',
    strategicMoat: 'Конкуренти приховують сертифікати; наша відкрита бібліотека забезпечує довіру служб пожежного нагляду.',
  },
  {
    topic: 'Рішення BESS для ЦОД (заміна свинцевих ДБЖ на LFP)',
    ourCoverage: 'MEDIUM',
    searchDemand: 'MEDIUM',
    competitorCoverage: 'LOW',
    businessValue: 'HIGH',
    strategicMoat: 'Високий C-rate (1C) модульної шафи CATL EnerOne Plus дозволяє розміщувати накопичувач на мінімальній площі.',
  },
];

export const demandIntelligenceData = {
  totalRequestedMwh: 148.6,
  totalActiveProjects: 42,
  totalPipelineValueUah: '1,420,000,000 ₴',
  byIndustry: [
    { industry: 'Промисловість та важке машинобудування', mwh: 64.2, sharePercent: 43 },
    { industry: 'Агропромислові комплекси та елеватори', mwh: 38.5, sharePercent: 26 },
    { industry: 'СЕС / ВЕС (Усунення небалансів генерації)', mwh: 29.1, sharePercent: 20 },
    { industry: 'ЦОД та Логістичні комплекси', mwh: 16.8, sharePercent: 11 },
  ],
  byApplication: [
    { app: 'Peak Shaving (Зрізання піків)', mwh: 58.4, percent: 39 },
    { app: 'Енергетичний арбітраж на РДН', mwh: 45.2, percent: 30 },
    { app: 'СЕС + BESS (100% самоспоживання)', mwh: 27.5, percent: 19 },
    { app: 'Резервне живлення (Seamless UPS)', mwh: 17.5, percent: 12 },
  ],
};

export function generateBom(powerKw: number, capacityKwh: number, recommendedProduct: string): BomItem[] {
  const isTener = capacityKwh >= 5000;
  const isEnerC = !isTener && capacityKwh >= 2000;

  const batterySystemName = isTener
    ? 'CATL TENER 6.25 MWh Utility-Scale Battery Container'
    : isEnerC
    ? 'CATL EnerC Plus 3.72 MWh High-Cube BESS Container'
    : 'CATL EnerOne Plus 372.7 kWh Modular Outdoor Cabinet';

  const batteryQty = isTener
    ? Math.ceil(capacityKwh / 6250)
    : isEnerC
    ? Math.ceil(capacityKwh / 3727)
    : Math.ceil(capacityKwh / 372.7);

  const pcsKw = Math.round(powerKw * 1.05);

  return [
    {
      category: 'Battery Storage',
      code: isTener ? 'CATL-TENER-6250' : isEnerC ? 'CATL-ENERC-3727' : 'CATL-ENERONE-372',
      name: batterySystemName,
      spec: `LFP Cell-to-Pack, Liquid Cooled (ΔT ≤ 2.5°C), 15 000 циклів, IP55`,
      quantity: batteryQty,
      unit: isTener || isEnerC ? 'контейнер' : 'шафа',
      manufacturer: 'Contemporary Amperex Technology Co., Ltd. (CATL)',
      compliance: 'UL 9540A, NFPA 855, IEC 62619',
    },
    {
      category: 'Power Conversion',
      code: `PCS-${pcsKw}KW-4Q`,
      name: `Двонаправлений перетворювач напруги (PCS) ${pcsKw} кВт`,
      spec: `4-квадрантне керування (P/Q), Grid-Forming, Black Start, ККД 98.8%`,
      quantity: 1,
      unit: 'комплект',
      manufacturer: 'Sinexcel / Kehua Tech / SMA',
      compliance: 'IEC 62477-1, ДСТУ EN 50549',
    },
    {
      category: 'Control & SCADA',
      code: 'EMS-PRO-CATL-UA',
      name: 'Шафа локальної та хмарної EMS диспетчеризації',
      spec: 'Промисловий контролер з підтримкою IEC 60870-5-104, Modbus TCP, алгоритми Peak Shaving та зв’язок із ринком РДН',
      quantity: 1,
      unit: 'шафа',
      manufacturer: 'CATL Energy Intelligence / Schneider',
      compliance: 'ISO 27001, IEC 61850',
    },
    {
      category: 'Grid Integration',
      code: `TMG-${pcsKw}KVA-10/0.4`,
      name: `Трансформатор силовий масляний герметичний ${pcsKw} кВА (10/0.4 кВ)`,
      spec: 'Підвищувальний блоковий трансформатор для прямого включення в мережу 10 кВ підприємства',
      quantity: 1,
      unit: 'шт',
      manufacturer: 'Укрелектроапарат / ABB',
      compliance: 'ДСТУ 21021, IEC 60076',
    },
    {
      category: 'Safety & Thermal',
      code: 'FIRE-NOVEC-BESS-01',
      name: 'Автоматична система раннього газового пожежогасіння Novec 1230',
      spec: 'Датчики раннього виявлення водню (H2) та чадного газу (CO) за 15 хв до термічного розгону, балони з діелектричним газом',
      quantity: batteryQty,
      unit: 'комплект',
      manufacturer: 'Kidde Fire Systems / Minimax',
      compliance: 'NFPA 855, ДСТУ EN 15004',
    },
  ];
}

export function generateCalculationTrace(
  powerKw: number,
  durationHours: number,
  application: string,
  tariffUah: number
): CalculationTraceStep[] {
  const rawCapacity = powerKw * durationHours;
  const dodLimit = 0.85; // 85% recommended depth of discharge
  const requiredInstalledCapacity = Math.round(rawCapacity / dodLimit);

  return [
    {
      step: '01. Нормалізація вхідних вимог',
      parameter: 'Безперервна потужність навантаження',
      inputValue: `${powerKw} кВт`,
      ruleApplied: 'RULE-S1: Номінальна потужність з коефіцієнтом перевантаження 1.05',
      normalizedResult: `${Math.round(powerKw * 1.05)} кВт (AC)`,
      status: 'VERIFIED',
    },
    {
      step: '02. Розрахунок енергетичної ємності',
      parameter: 'Корисна ємність розряду',
      inputValue: `${durationHours} годин при ${powerKw} кВт`,
      ruleApplied: 'RULE-CAP-1: E_usable = P_req × t_storage',
      normalizedResult: `${rawCapacity.toLocaleString()} кВт·год (Net)`,
      status: 'VERIFIED',
    },
    {
      step: '03. Врахування глибини розряду (DoD)',
      parameter: 'Встановлена валова ємність',
      inputValue: `DoD = 85%, RTE = 95.8%`,
      ruleApplied: 'RULE-DOD-MAX: E_installed = E_usable / (DoD × RTE)',
      normalizedResult: `${requiredInstalledCapacity.toLocaleString()} кВт·год (Gross Nameplate)`,
      status: 'VERIFIED',
    },
    {
      step: '04. Архітектурне структурування',
      parameter: 'Підбір модульних блоків CATL',
      inputValue: requiredInstalledCapacity >= 5000 ? 'Utility-Scale' : 'C&I Modular',
      ruleApplied: 'RULE-MATCH-CATL: Мінімізація вартості $/кВт·год та займаної площі',
      normalizedResult: requiredInstalledCapacity >= 5000 ? 'CATL TENER 6.25 MWh' : 'CATL EnerOne Plus',
      status: 'VERIFIED',
    },
    {
      step: '05. Економічне моделювання',
      parameter: 'Добовий грошовий потік',
      inputValue: `Тариф ${tariffUah} ₴/кВт·год`,
      ruleApplied: 'RULE-FIN-UA: Розрахунок арбітражного спреду РДН + уникнення перебору потужності',
      normalizedResult: `Повна окупність CAPEX за 2.8 – 3.8 роки`,
      status: 'ESTIMATED',
    },
  ];
}
