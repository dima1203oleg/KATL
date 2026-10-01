/**
 * TITAN Platform Master Data Repository
 * Source-of-truth for PIM, Solutions, Industries, Engineering, Safety, Logistics, Admin & SEO.
 */

export interface TitanProduct {
  id: string;
  name: string;
  family: string;
  category: 'Utility Scale' | 'Commercial & Industrial' | 'Residential' | 'Sodium-ion' | 'Components';
  shortDesc: string;
  highlight: string;
  status: 'AVAILABLE' | 'PRE_ORDER' | 'COMMERCIAL_2027';
  type: 'tener-h' | 'tener-s' | 'stack' | 'enerone' | 'sodium' | 'pcs' | 'ems';
  energySpecs: {
    nominalCapacity: string;
    usableCapacity: string;
    nominalVoltage: string;
    voltageRange: string;
    cRate: string;
    efficiencyRoundTrip: string;
  };
  cellSpecs: {
    chemistry: string;
    cellModel: string;
    cellCapacity: string;
    cycleLife: string;
    degradationFirstYears: string;
  };
  mechanicalSpecs: {
    dimensions: string;
    weight: string;
    containerStandard: string;
    protectionRating: string;
  };
  thermalSpecs: {
    coolingMethod: string;
    tempControlAccuracy: string;
    operatingTempRange: string;
  };
  safetySpecs: {
    fireSuppression: string;
    deflagrationProtection: string;
    gasDetection: string;
    certifications: string[];
  };
  compatibility: {
    pcs: string[];
    ems: string[];
    transformer: string;
  };
}

export const titanProductsList: TitanProduct[] = [
  {
    id: 'catl-tener-h',
    name: 'CATL TENER H',
    family: 'TENER Series',
    category: 'Utility Scale',
    shortDesc: 'Флагманська utility-scale система накопичення енергії надвисокої щільності.',
    highlight: 'До 9.008 МВт·год у стандартному 20-футовому контейнері',
    status: 'AVAILABLE',
    type: 'tener-h',
    energySpecs: {
      nominalCapacity: '9.008 МВт·год',
      usableCapacity: '8.85 МВт·год (DoD 98%)',
      nominalVoltage: '1500 V DC',
      voltageRange: '1250 ~ 1700 V DC',
      cRate: '0.5C (2-годинний розряд) / опціонально 1C',
      efficiencyRoundTrip: '≥ 95.5% (DC-DC)',
    },
    cellSpecs: {
      chemistry: 'LFP (Lithium Iron Phosphate)',
      cellModel: 'CATL Ultra-Dense 575 Ah',
      cellCapacity: '575 Ah',
      cycleLife: '15 000+ циклів (20 років)',
      degradationFirstYears: '0% деградація перші 5 років',
    },
    mechanicalSpecs: {
      dimensions: '6058 × 2438 × 2896 мм (20ft High Cube)',
      weight: '≤ 48 000 кг (повністю споряджений)',
      containerStandard: 'ISO 668 1CC',
      protectionRating: 'IP55 / C5-M антикорозійне покриття',
    },
    thermalSpecs: {
      coolingMethod: 'Прецизійне двоконтурне рідинне охолодження (Liquid Cooling)',
      tempControlAccuracy: 'Різниця температур між комірками ΔT ≤ 2.5°C',
      operatingTempRange: '-30°C ... +55°C',
    },
    safetySpecs: {
      fireSuppression: 'Novec 1230 / FK-5-1-12 автоматична система + водяний сплінкерний ввід',
      deflagrationProtection: 'Дефлаграційні вибухорозвантажувальні панелі NFPA 68',
      gasDetection: 'Багатоканальні сенсори CO, H2, диму та температури',
      certifications: ['NFPA 855', 'UL 9540A', 'UL 1973', 'IEC 62619', 'ДСТУ EN 62619', 'CE'],
    },
    compatibility: {
      pcs: ['SMA Sunny Central Storage', 'Ingeteam Ingecon Sun Storage', 'Sineng 2.5MW'],
      ems: ['CATL Native AI EMS', 'Siemens Spectrum Power', 'DNV GEMS'],
      transformer: '10/35 кВ блочний двообмотковий',
    },
  },
  {
    id: 'catl-tener-s',
    name: 'CATL TENER S',
    family: 'TENER Series',
    category: 'Utility Scale',
    shortDesc: 'Еталонна масова система накопичення енергії для масштабних сонячних та вітрових парків.',
    highlight: '6.25 МВт·год, 0% деградація, 15 000 циклів',
    status: 'AVAILABLE',
    type: 'tener-s',
    energySpecs: {
      nominalCapacity: '6.25 МВт·год',
      usableCapacity: '6.12 МВт·год',
      nominalVoltage: '1500 V DC',
      voltageRange: '1200 ~ 1680 V DC',
      cRate: '0.5C / 1C',
      efficiencyRoundTrip: '≥ 95.0%',
    },
    cellSpecs: {
      chemistry: 'LFP',
      cellModel: 'CATL 314 Ah LFP Gen 2',
      cellCapacity: '314 Ah',
      cycleLife: '15 000 циклів',
      degradationFirstYears: '0% втрат ємності за перші 5 років',
    },
    mechanicalSpecs: {
      dimensions: '6058 × 2438 × 2896 мм',
      weight: '43 500 кг',
      containerStandard: '20ft ISO',
      protectionRating: 'IP55',
    },
    thermalSpecs: {
      coolingMethod: 'Рідинне охолодження',
      tempControlAccuracy: 'ΔT ≤ 3.0°C',
      operatingTempRange: '-30°C ... +50°C',
    },
    safetySpecs: {
      fireSuppression: 'Газове пожежогасіння + аерозоль',
      deflagrationProtection: 'NFPA 68 дефлаграційні вікна',
      gasDetection: '4-рівневий сенсорний моніторинг газів',
      certifications: ['NFPA 855', 'UL 9540A', 'IEC 62619', 'CE'],
    },
    compatibility: {
      pcs: ['Ingeteam', 'SMA', 'Sungrow'],
      ems: ['CATL EMS', 'EcoStruxure'],
      transformer: '0.69 / 10(35) кВ',
    },
  },
  {
    id: 'catl-enerone-plus',
    name: 'CATL EnerOne Plus',
    family: 'EnerOne Series',
    category: 'Commercial & Industrial',
    shortDesc: 'Компактна зовнішня кабінетна система для промислових підприємств та комерційних об’єктів.',
    highlight: '372.7 кВт·год на 1.3 м² площі, All-in-One Outdoor',
    status: 'AVAILABLE',
    type: 'enerone',
    energySpecs: {
      nominalCapacity: '372.7 кВт·год',
      usableCapacity: '365 кВт·год',
      nominalVoltage: '1146 V DC',
      voltageRange: '920 ~ 1310 V DC',
      cRate: '0.5C - 1C',
      efficiencyRoundTrip: '≥ 94.5%',
    },
    cellSpecs: {
      chemistry: 'LFP',
      cellModel: 'CATL 280 / 314 Ah',
      cellCapacity: '314 Ah',
      cycleLife: '10 000+ циклів',
      degradationFirstYears: '< 1.5% на рік',
    },
    mechanicalSpecs: {
      dimensions: '1300 × 1300 × 2250 мм',
      weight: '3 600 кг',
      containerStandard: 'Шафа зовнішнього монтажу',
      protectionRating: 'IP55',
    },
    thermalSpecs: {
      coolingMethod: 'Вбудоване рідинне охолодження',
      tempControlAccuracy: 'ΔT ≤ 2.5°C',
      operatingTempRange: '-30°C ... +55°C',
    },
    safetySpecs: {
      fireSuppression: 'Вбудована автономна аерозольна система + датчики',
      deflagrationProtection: 'Вентиляційні клапани тиску',
      gasDetection: 'Вбудований газоаналізатор',
      certifications: ['UL 9540', 'UL 1973', 'IEC 62619', 'ДСТУ EN 62619'],
    },
    compatibility: {
      pcs: ['ATESS 100/250kW', 'Sinexcel', 'Deye Hybrid'],
      ems: ['Local SCADA', 'Web Cloud EMS'],
      transformer: '0.4 / 10 кВ',
    },
  },
  {
    id: 'catl-tener-sodium',
    name: 'CATL TENER Sodium (Na-ion)',
    family: 'TENER Series',
    category: 'Sodium-ion',
    shortDesc: 'Натрій-іонна система накопичення енергії нового покоління для екстремальних умов.',
    highlight: 'Робота при -40°C без підігріву, надшвидкий відгук, глобальний реліз 2027',
    status: 'COMMERCIAL_2027',
    type: 'sodium',
    energySpecs: {
      nominalCapacity: '4.5 МВт·год',
      usableCapacity: '4.4 МВт·год',
      nominalVoltage: '1500 V DC',
      voltageRange: '1000 ~ 1600 V DC',
      cRate: '1C - 4C (миттєвий відгук)',
      efficiencyRoundTrip: '≥ 92.0%',
    },
    cellSpecs: {
      chemistry: 'Sodium-ion (Натрій-іон CATL Gen 2)',
      cellModel: 'CATL Na-Cell 200 Ah',
      cellCapacity: '200 Ah',
      cycleLife: '8 000+ циклів',
      degradationFirstYears: 'Стабільна ємність',
    },
    mechanicalSpecs: {
      dimensions: '6058 × 2438 × 2896 мм',
      weight: '44 000 кг',
      containerStandard: '20ft ISO',
      protectionRating: 'IP55',
    },
    thermalSpecs: {
      coolingMethod: 'Рідинне охолодження з антифризом',
      tempControlAccuracy: 'ΔT ≤ 3.5°C',
      operatingTempRange: '-40°C ... +60°C',
    },
    safetySpecs: {
      fireSuppression: 'NFPA 855 сумісна система',
      deflagrationProtection: 'Вибухозахист',
      gasDetection: 'Повний моніторинг',
      certifications: ['IEC 62619 (pre-cert)', 'UN 38.3'],
    },
    compatibility: {
      pcs: ['Ingeteam Fast-Response PCS', 'SMA'],
      ems: ['Multi-chemistry EMS'],
      transformer: '0.69 / 10(35) кВ',
    },
  },
  {
    id: 'catl-tener-stack',
    name: 'CATL TENER Stack',
    family: 'TENER Series',
    category: 'Utility Scale',
    shortDesc: 'Модульна блокова вертикальна система накопичення енергії підвищеної компонувальної гнучкості.',
    highlight: 'До 9 МВт·год, пошарове нарощування, швидкий шеф-монтаж',
    status: 'AVAILABLE',
    type: 'stack',
    energySpecs: {
      nominalCapacity: 'До 9.0 МВт·год',
      usableCapacity: '8.8 МВт·год',
      nominalVoltage: '1500 V DC',
      voltageRange: '1200 ~ 1700 V DC',
      cRate: '0.5C / 1C',
      efficiencyRoundTrip: '≥ 95.2%',
    },
    cellSpecs: {
      chemistry: 'LFP (LiFePO4)',
      cellModel: 'CATL 314 Ah / 575 Ah',
      cellCapacity: '314 / 575 Ah',
      cycleLife: '12 000 циклів',
      degradationFirstYears: '< 1.2% на рік',
    },
    mechanicalSpecs: {
      dimensions: 'Модульні шафи N × (1300 × 1400 × 2400 мм)',
      weight: 'До 46 000 кг (комплект 9 МВт·год)',
      containerStandard: 'Модульний масив / CTP',
      protectionRating: 'IP55 / C4-C5',
    },
    thermalSpecs: {
      coolingMethod: 'Рідинне охолодження стійок (Rack-level)',
      tempControlAccuracy: 'ΔT ≤ 2.8°C',
      operatingTempRange: '-30°C ... +55°C',
    },
    safetySpecs: {
      fireSuppression: 'Пошаровий аерозольний та газовий захист шаф',
      deflagrationProtection: 'Вибухозахисні клапани скидання тиску',
      gasDetection: 'Локальні газоаналізатори на кожній стійці',
      certifications: ['NFPA 855', 'UL 9540A', 'IEC 62619', 'CE'],
    },
    compatibility: {
      pcs: ['SMA', 'Ingeteam', 'Sungrow'],
      ems: ['CATL Native AI EMS', 'SCADA'],
      transformer: '10/35 кВ',
    },
  },
];

export const getTitanProductById = (id?: string): TitanProduct => {
  if (!id) return titanProductsList[0];
  const found = titanProductsList.find((p) => p.id.toLowerCase() === id.toLowerCase());
  if (found) return found;
  // Loose matching for aliases
  if (id.includes('tener-s')) return titanProductsList.find((p) => p.id === 'catl-tener-s') || titanProductsList[0];
  if (id.includes('stack')) return titanProductsList.find((p) => p.id === 'catl-tener-stack') || titanProductsList[0];
  if (id.includes('enerone') || id.includes('ci')) return titanProductsList.find((p) => p.id === 'catl-enerone-plus') || titanProductsList[0];
  if (id.includes('sodium') || id.includes('na-ion')) return titanProductsList.find((p) => p.id === 'catl-tener-sodium') || titanProductsList[0];
  return titanProductsList[0];
};

export interface TitanSolution {
  slug: string;
  title: string;
  category: string;
  iconName: string;
  shortDesc: string;
  problem: string;
  solutionMechanism: string;
  economicsSummary: string;
  recommendedProducts: string[];
  beforeProfile: string;
  afterProfile: string;
}

export const titanSolutionsList: TitanSolution[] = [
  {
    slug: 'peak-shaving',
    title: 'Зрізання пікових навантажень (Peak Shaving)',
    category: 'Економічна оптимізація',
    iconName: 'TrendingDown',
    shortDesc: 'Зниження пікового споживання підприємства для уникнення штрафів та високих тарифів.',
    problem: 'Підприємства сплачують підвищену плату за приєднану потужність та дорогі пікові кіловат-години у години максимуму (08:00–11:00 та 17:00–21:00).',
    solutionMechanism: 'BESS накопичує дешеву електроенергію вночі та віддає її у години пікового навантаження, знижуючи споживання з мережі нижче встановленого ліміту.',
    economicsSummary: 'Зниження витрат на електроенергію до 35–45%. Окупність проекту 3.2–4.5 роки.',
    recommendedProducts: ['CATL EnerOne Plus', 'CATL TENER S'],
    beforeProfile: 'Пікові сплески до 2.5 МВт у денні та вечірні години',
    afterProfile: 'Рівний профіль не більше 1.2 МВт завдяки розряду BESS',
  },
  {
    slug: 'solar-storage',
    title: 'СЕС + Накопичення (Solar PV + BESS)',
    category: 'Відновлювана генерація',
    iconName: 'Sun',
    shortDesc: 'Максимізація власного споживання сонячної енергії та усунення дисбалансів.',
    problem: 'Сонячна генерація вдень перевищує споживання об’єкта, що призводить до скидання надлишків або продажів за мінімальними цінами.',
    solutionMechanism: 'BESS поглинає 100% денного профіциту генерації СЕС та живить об’єкт або віддає в мережу у вечірній пік найвищих тарифів.',
    economicsSummary: 'Підвищення корисності СЕС до 95%. Усунення витрат на балансування.',
    recommendedProducts: ['CATL TENER H', 'CATL TENER S'],
    beforeProfile: 'Надлишок 3 МВт опівдні та дефіцит енергії ввечері',
    afterProfile: 'Згладжений добовий графік із покриттям вечірніх потреб',
  },
  {
    slug: 'backup-power',
    title: 'Резервне та безперебійне живлення (UPS / Backup)',
    category: 'Енергетична безпека',
    iconName: 'Zap',
    shortDesc: 'Миттєве перемикання на BESS при знеструмленні для захисту технологічних процесів.',
    problem: 'Аварійні та планові відключення мережі зупиняють виробництво, призводять до браку продукції та поломки верстатів.',
    solutionMechanism: 'BESS з інвертором формує автономну мережу (Grid-Forming) з часом перемикання < 20 мс, забезпечуючи безперебійну роботу.',
    economicsSummary: 'Усунення 100% збитків від зупинки виробничих ліній. Заміна дизель-генераторів.',
    recommendedProducts: ['CATL EnerOne Plus', 'CATL TENER S'],
    beforeProfile: 'Раптові провали напруги та повні відключення 4–8 год',
    afterProfile: 'Безперервне живлення 24/7 у стабільному діапазоні 400/10000 В',
  },
  {
    slug: 'energy-arbitrage',
    title: 'Енергетичний арбітраж на ринку РДН/ВДР',
    category: 'Торгівля електроенергією',
    iconName: 'Coins',
    shortDesc: 'Купівля енергії за нічними мінімальними цінами та продаж у періоди пікових спотових цін.',
    problem: 'Волатильність цін на ринку «на добу наперед» сягає різниці у 3–5 разів між ніччю та вечором.',
    solutionMechanism: 'Інтелектуальний алгоритм EMS заряджає BESS за мінімальною ціною та експортує енергію в моменти максимальних цінових прайс-кепів.',
    economicsSummary: 'Маржа від 3.5 до 6.5 грн на кожному збереженому кВт·год. IRR понад 22%.',
    recommendedProducts: ['CATL TENER H', 'CATL TENER S'],
    beforeProfile: 'Пасивне споживання або продаж генерації за фіксованим тарифом',
    afterProfile: 'Активна участь у диспетчеризації з максимізацією маржі',
  },
  {
    slug: 'datacenter',
    title: 'BESS для Дата-центрів та AI-інфраструктури',
    category: 'Критична інфраструктура',
    iconName: 'Server',
    shortDesc: 'Висока якість напруги, захист серверів та зрізання піків енергоспоживання AI-кластерів.',
    problem: 'Дата-центри споживають гігантську потужність, де навіть мілісекундний збій виводить з ладу хмарні сервери.',
    solutionMechanism: 'CATL LFP системи забезпечують Tier III / Tier IV надійність живлення із системою нульової деградації.',
    economicsSummary: 'Скорочення споживання дизельного палива на 80%, відповідність ESG вимогам.',
    recommendedProducts: ['CATL TENER H', 'CATL EnerOne Plus'],
    beforeProfile: 'Високі імпульсні навантаження обчислювальних серверів',
    afterProfile: 'Ідеальна синусоїда та гарантований резерв понад 4 години',
  },
];

export interface TitanIndustry {
  slug: string;
  name: string;
  typicalPower: string;
  typicalCapacity: string;
  painPoints: string[];
  recommendedSetup: string;
  caseReference: string;
}

export const titanIndustriesList: TitanIndustry[] = [
  {
    slug: 'manufacturing',
    name: 'Важка та переробна промисловість',
    typicalPower: '1.0 – 5.0 МВт',
    typicalCapacity: '2.0 – 10.0 МВт·год',
    painPoints: ['Зупинка екструдерів та печей при знеструмленні', 'Високі пікові тарифи', 'Штрафи за переліміт'],
    recommendedSetup: 'CATL TENER S (6.25 МВт·год) + PCS 2 МВт з Grid-forming',
    caseReference: 'Завод будівельних матеріалів, Київська обл.',
  },
  {
    slug: 'agriculture',
    name: 'Агрохолдинги, елеватори та овочесховища',
    typicalPower: '0.5 – 2.0 МВт',
    typicalCapacity: '1.0 – 4.0 МВт·год',
    painPoints: ['Сезонні піки при сушінні зерна', 'Псування продукції в холодильниках', 'Віддаленість підстанцій'],
    recommendedSetup: 'CATL EnerOne Plus (4 шафи = 1.5 МВт·год) + СЕС 1 МВт',
    caseReference: 'Зерновий елеватор, Вінницька обл.',
  },
  {
    slug: 'logistics',
    name: 'Логістичні хаби та розподільчі центри',
    typicalPower: '0.3 – 1.5 МВт',
    typicalCapacity: '0.7 – 3.0 МВт·год',
    painPoints: ['Неможливість заряджати електровантажівки через брак потужності', 'Холодильні склади'],
    recommendedSetup: 'CATL EnerOne Plus (2 шафи = 745 кВт·год) + швидкісні зарядні станції 300 кВт',
    caseReference: 'Логістичний центр класу А, Львівська обл.',
  },
  {
    slug: 'commercial',
    name: 'ТРЦ, бізнес-центри та гіпермаркети',
    typicalPower: '0.4 – 1.2 МВт',
    typicalCapacity: '0.8 – 2.4 МВт·год',
    painPoints: ['Евакуаційне освітлення та вентиляція', 'Шум та дим від старих дизельних генераторів'],
    recommendedSetup: 'CATL EnerOne Plus (2–3 шафи) з інтеграцією в систему будівлі BMS',
    caseReference: 'Торгово-розважальний центр, м. Дніпро',
  },
  {
    slug: 'datacenters',
    name: 'Дата-центри та телеком-оператори',
    typicalPower: '1.0 – 10.0 МВт',
    typicalCapacity: '2.5 – 25.0 МВт·год',
    painPoints: ['Вимоги Tier III+ за безперервністю', 'Пікове тепловиділення серверів AI'],
    recommendedSetup: 'CATL TENER H (9.008 МВт·год) з резервуванням N+1',
    caseReference: 'Хмарний дата-центр, Київ',
  },
];

export interface TitanComponentItem {
  category: 'PCS' | 'EMS' | 'BMS' | 'SCADA' | 'Transformer' | 'Switchgear' | 'Cooling' | 'Fire Safety';
  name: string;
  role: string;
  manufacturer: string;
  spec: string;
}

export const titanComponentsList: TitanComponentItem[] = [
  {
    category: 'PCS',
    name: 'Двонаправлений перетворювач потужності (PCS 1500V)',
    role: 'Перетворення постійного струму DC батареї у трифазний змінний струм AC 0.69 кВ з функціями Grid-Forming/Following.',
    manufacturer: 'Ingeteam / SMA / Sineng',
    spec: 'Потужність 1.25 – 2.5 МВт, ККД 98.8%, час відгуку < 20 мс',
  },
  {
    category: 'EMS',
    name: 'Система енергетичного менеджменту CATL Native EMS',
    role: 'Інтелектуальне диспетчерське керування зарядом/розрядом, прогнозування генерації СЕС та оптимізація ринкових графіків.',
    manufacturer: 'CATL Engineering Suite',
    spec: 'Алгоритми машинного навчання, протоколи Modbus TCP, IEC 60870-5-104, DNP3',
  },
  {
    category: 'BMS',
    name: 'Трирівнева система моніторингу батарей (BMS Gen 3)',
    role: 'Покомірковий контроль напруги, температури, балансування, розрахунок SOC/SOH та протиаварійний захист за 10 мс.',
    manufacturer: 'CATL Automotive Grade',
    spec: 'Точність вимірювання напруги ±1.5 мВ, ізоляція до 3000 V DC',
  },
  {
    category: 'SCADA',
    name: 'Диспетчерський комплекс SCADA & АСКОЕ',
    role: 'Комерційний облік електроенергії для НЕК «Укренерго» та централізований інтерфейс диспетчера енергопарку.',
    manufacturer: 'Schneider Electric / Siemens',
    spec: 'Резервовані сервери, хмарне дублювання, сертифіковані лічильники класу 0.2S',
  },
  {
    category: 'Transformer',
    name: 'Блочний підвищувальний трансформатор ТСЗП',
    role: 'Підвищення вихідної напруги PCS з 0.69 кВ до напруги розподільчої мережі 10 кВ або 35 кВ.',
    manufacturer: 'Siemens / Schneider / Електрощит',
    spec: 'Сухий або масляний, потужність 1600 – 6300 кВА, клас ізоляції 35 кВ',
  },
  {
    category: 'Fire Safety',
    name: 'Автоматична газова система пожежогасіння Novec 1230',
    role: 'Раннє виявлення теплового розгону за газами CO/H2 та миттєве пригнічення займання діелектричним газом.',
    manufacturer: '3M / Kidde Fire Systems',
    spec: 'Відповідність NFPA 855 та UL 9540A, безпечно для електрообладнання під напругою',
  },
];

export interface PageRegistryItem {
  id: string;
  route: string;
  name: string;
  category: 'Public' | 'Engineering' | 'Commercial' | 'Portals' | 'Admin' | 'SEO';
  purpose: string;
  dataSource: string;
  seoIntent: string;
  analyticsEvent: string;
  authRequired: boolean;
  status: 'IMPLEMENTED' | 'PARTIAL' | 'BLOCKED';
}

export const titanPageRegistry: PageRegistryItem[] = [
  { id: 'P-01', route: '/', name: 'Головна сторінка (Home)', category: 'Public', purpose: 'Головна презентація рішень, BESS Designer, лінійки CATL', dataSource: 'PIM + CMS', seoIntent: 'Commercial / Brand', analyticsEvent: 'home_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-02', route: '/products', name: 'Каталог систем (Products Hub)', category: 'Public', purpose: 'Фільтрація та вибір промислових BESS CATL', dataSource: 'titanProductsList', seoIntent: 'Commercial', analyticsEvent: 'catalog_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-03', route: '/products/catl-tener-h', name: 'Сторінка продукту TENER H', category: 'Public', purpose: 'Повні технічні характеристики, креслення, сертифікати флагмана', dataSource: 'titanProductsList[0]', seoIntent: 'Product', analyticsEvent: 'product_view_tener_h', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-04', route: '/compare', name: 'Порівняння систем BESS', category: 'Public', purpose: 'Пліч-о-пліч порівняння параметрів до 4 моделей CATL', dataSource: 'titanProductsList', seoIntent: 'Commercial Investigation', analyticsEvent: 'product_compare', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-05', route: '/solutions', name: 'Хаб рішень (Solutions)', category: 'Public', purpose: 'Підбір BESS за бізнес-задачею (Solar, Peak Shaving, Backup)', dataSource: 'titanSolutionsList', seoIntent: 'Commercial', analyticsEvent: 'solutions_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-06', route: '/industries', name: 'Галузеві рішення (Industries)', category: 'Public', purpose: 'Енергетичні кейси для заводів, агро, логістики, дата-центрів', dataSource: 'titanIndustriesList', seoIntent: 'Commercial', analyticsEvent: 'industries_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-07', route: '/engineering', name: 'Інженерний хаб & Однолінійна схема (SLD)', category: 'Engineering', purpose: 'Схема РУ-10 кВ, симулятор 24h навантаження, LCOS калькулятор', dataSource: 'bessData + advancedPlatformData', seoIntent: 'Engineering', analyticsEvent: 'engineering_hub_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-08', route: '/designer', name: 'BESS Designer (Майстер розрахунку)', category: 'Engineering', purpose: 'Інтерактивний онлайн-підбір потужності MW / ємності MWh / окупності', dataSource: 'BessDesigner Engine', seoIntent: 'Transactional / Engineering', analyticsEvent: 'designer_calculate', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-09', route: '/technology-safety', name: 'Технології та Безпека (Safety Center)', category: 'Public', purpose: 'LFP/Na-ion комірки, 5-рівнева безпека, рідинне охолодження', dataSource: 'titanProductsList + standards', seoIntent: 'Informational / Trust', analyticsEvent: 'safety_center_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-10', route: '/projects', name: 'Проекти та референси (Case Studies)', category: 'Public', purpose: 'Перевірені кейси впровадження BESS в Україні та світі', dataSource: 'bessCaseStudies', seoIntent: 'Social Proof', analyticsEvent: 'projects_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-11', route: '/knowledge', name: 'База знань та технічні стандарти', category: 'Public', purpose: 'Експертні гайди по NFPA 855, IEC 62619, підключенню до мережі', dataSource: 'bessKnowledgeGuides', seoIntent: 'Informational / SEO TOFU', analyticsEvent: 'knowledge_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-12', route: '/documents', name: 'Бібліотека специфікацій та паспортів', category: 'Public', purpose: 'Завантаження офіційних даташитів та сертифікатів CATL', dataSource: 'bessDocuments', seoIntent: 'Technical', analyticsEvent: 'document_download', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-13', route: '/rfq', name: 'Форма запиту комерційної пропозиції (RFQ)', category: 'Commercial', purpose: 'Подача заявки на підбір та постачання BESS в Україні', dataSource: 'RFQ Workflow', seoIntent: 'Transactional', analyticsEvent: 'rfq_submit', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-14', route: '/partners', name: 'Партнерський портал (EPC / Інтегратори)', category: 'Portals', purpose: 'Реєстрація проектів, партнерські ціни, навчання, саппорт', dataSource: 'Partner DB', seoIntent: 'B2B Partnership', analyticsEvent: 'partner_portal_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-15', route: '/customer-workspace', name: 'Кабінет замовника (Saved Projects)', category: 'Portals', purpose: 'Історія розрахунків BESS, згенеровані ТКП (PDF), статус поставок', dataSource: 'Customer Workspace DB', seoIntent: 'Client Portal', analyticsEvent: 'customer_portal_view', authRequired: false, status: 'IMPLEMENTED' },
  { id: 'P-16', route: '/admin', name: 'Admin Shell & Governance Portal', category: 'Admin', purpose: 'PIM каталог, CATL Sync diff, SEO аудит, ліди, заявки, здоров’я системи', dataSource: 'Admin State DB', seoIntent: 'Internal', analyticsEvent: 'admin_action', authRequired: true, status: 'IMPLEMENTED' },
  { id: 'P-17', route: '/seo-center', name: 'SEO Command Center & Semantic Graph', category: 'SEO', purpose: 'Моніторинг 12-вимірного семантичного ядра, hreflang, Core Web Vitals', dataSource: 'semanticCoreKeywords', seoIntent: 'Audit', analyticsEvent: 'seo_audit_run', authRequired: false, status: 'IMPLEMENTED' },
];
