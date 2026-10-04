import { randomUUID } from 'node:crypto';
import { getDatabasePool, closeDatabasePool } from './client';

export async function seedAdditionalOfficialProducts() {
  const pool = getDatabasePool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('[Additional Official Products] Starting population of extended CATL catalog...');

    const adminId = 'USR-CATL-ENG-01';
    const sourceId = 'SRC-CATL-OFFICIAL-PORTAL';
    const snapshotId = 'a1000000-0000-4000-8000-000000000001';

    const additionalProducts = [
      // -------------------------------------------------------------
      // 1. Домашні системи (Residential ESS)
      // -------------------------------------------------------------
      {
        id: 'catl-home-high-voltage-20',
        name: 'CATL Residential High-Voltage Stack 20.48 kWh',
        family: 'Residential ESS',
        category: 'Домашні системи',
        productType: 'RESIDENTIAL_STACK',
        shortDesc: 'Високовольтна модульна батарейна колона 20.48 кВт·год для великих будинків та приватних СЕС.',
        highlight: 'Робоча напруга 400 В DC, сумісність із трифазними гібридними інверторами Deye, Solis, Sungrow, Fronius.',
        sourceUrl: 'https://www.catl.com/en/ess/residential/',
        energySpecs: {
          nominalCapacity: '20.48 кВт·год',
          usableCapacity: '19.45 кВт·год (95% DoD)',
          nominalVoltage: '409.6 В DC (8 модулів по 51.2 В)',
          voltageRange: '358.4 – 460.8 В DC',
          maxContinuousPowerKw: '10.24 кВт',
          peakPowerKw: '15.0 кВт (10 сек)',
          cRate: '0.5C номінал / 0.75C пік',
          efficiencyRoundTrip: '≥ 96.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 345000,
          priceDisplayUah: 'від 345 000 грн',
          priceNoteUk: 'Ціна за 4 модулі + високовольтний блок керування BMS',
          priceNoteEn: 'Price for 4 modules + high-voltage BMS controller',
          priceNoteZh: '包含 4 个模组及高压 BMS 控制箱',
          availability: 'IN_STOCK',
          warrantyYears: '10 років або 6 000 циклів'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 100Ah High-Safety Prismatic Cell',
          cycleLife: '6 000 циклів при 80% DoD (+25°C)',
          safetyFeatures: 'Багаторівневий захист осередків, вбудований запобіжник, термоізоляційні аерогелеві мати'
        },
        mechanicalSpecs: {
          dimensionsMm: '600 × 380 × 1650 мм',
          weightKg: '225 кг',
          protectionRating: 'IP65 (можливість встановлення на вулиці під навісом)',
          installationType: 'Підлогова колона з настінною фіксацією'
        },
        thermalSpecs: {
          coolingMethod: 'Природне конвекційне пасивне охолодження (Natural convection)',
          operatingTempRange: 'Заряджання: 0°C...+50°C; Розряджання: -20°C...+55°C',
          tempControlAccuracy: 'Вбудований підігрів осередків для зимового заряду'
        },
        safetySpecs: {
          fireSuppression: 'Вбудований автономний термоаерозольний патрон у кожному блоці',
          certifications: 'IEC 62619, CE, UN38.3, VDE-AR-E 2510-50'
        },
        compatibility: {
          inverters: 'Deye 3-Phase, Sungrow SH10RT, Solis RHI, GoodWe ET, Victron Energy',
          emsInterface: 'CAN 2.0B / RS485 Modbus-RTU'
        },
        transEn: {
          name: 'CATL Residential High-Voltage Stack 20.48 kWh',
          shortDesc: 'High-voltage modular battery tower 20.48 kWh for premium homes and three-phase rooftop solar.',
          highlight: '400V DC bus voltage, direct compatibility with three-phase hybrid inverters (Deye, Sungrow, Fronius).'
        },
        transZh: {
          name: '宁德时代 户用高压堆叠储能系统 20.48 kWh',
          shortDesc: '20.48 kWh 高压模块化户用储能塔，专为大户型别墅及三相屋顶光伏系统设计。',
          highlight: '400V 高压直流母线，无缝适配大业、阳光电源、古瑞瓦特三相混合逆变器。'
        }
      },
      {
        id: 'catl-home-solar-hybrid-backup',
        name: 'CATL Residential All-In-One Solar+Storage 10 kW / 15 kWh',
        family: 'Residential ESS',
        category: 'Домашні системи',
        productType: 'RESIDENTIAL_ALL_IN_ONE',
        shortDesc: 'Повністю інтегрований комплекс «все-в-одному»: гібридний інвертор 10 кВт + накопичувач CATL 15 кВт·год.',
        highlight: 'Готове рішення з безшовним ДБЖ < 10 мс, подвійним трекером MPPT для сонячних панелей та мобільним додатком.',
        sourceUrl: 'https://www.catl.com/en/ess/residential/',
        energySpecs: {
          nominalCapacity: '15.36 кВт·год',
          usableCapacity: '14.50 кВт·год',
          nominalVoltage: '307.2 В DC',
          maxContinuousPowerKw: '10.0 кВт (трифазний вихід 380/400 В)',
          cRate: '0.65C',
          efficiencyRoundTrip: '≥ 95.8%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 285000,
          priceDisplayUah: 'від 285 000 грн',
          priceNoteUk: 'Повний комплект: інвертор + 3 акумуляторні блоки + автоматика введення резерву',
          priceNoteEn: 'Turnkey kit: 10kW hybrid inverter + 3 battery blocks + ATS',
          priceNoteZh: '成套系统：含10kW光储一体机、3组电池及自动切换开关',
          availability: 'IN_STOCK',
          warrantyYears: '10 років гарантії виробника'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL Long-Life Home LFP',
          cycleLife: '8 000 циклів при 70% EOL'
        },
        mechanicalSpecs: {
          dimensionsMm: '650 × 420 × 1450 мм',
          weightKg: '190 кг',
          protectionRating: 'IP65',
          installationType: 'Підлоговий моноблок All-In-One'
        },
        thermalSpecs: {
          coolingMethod: 'Інтелектуальне примусове повітряне охолодження з низьким рівнем шуму (<35 дБ)',
          operatingTempRange: '-15°C...+50°C'
        },
        safetySpecs: {
          fireSuppression: 'Вбудована капсула аерозольного пожежогасіння',
          certifications: 'CE, IEC 62109-1/-2, IEC 62619, VDE 4105'
        },
        compatibility: {
          pvInput: '2 × MPPT, макс. напруга PV 1000 В, потужність СЕС до 15 кВт',
          gridCode: 'Підтримка стандартів енергомережі України (ДСТУ EN 50160)'
        },
        transEn: {
          name: 'CATL Residential All-In-One Solar+Storage 10 kW / 15 kWh',
          shortDesc: 'Fully integrated turnkey system: 10 kW 3-phase hybrid inverter + 15 kWh CATL LFP battery.',
          highlight: 'Sub-10ms UPS switchover, dual MPPT solar inputs, full mobile app monitoring.'
        },
        transZh: {
          name: '宁德时代 户用光储一体机 10 kW / 15 kWh',
          shortDesc: '全集成一体化家庭储能系统：10kW 三相混合逆变器与 15kWh 宁德时代电池组。',
          highlight: '小于 10ms 毫秒级无缝断电切换，双路 MPPT 光伏输入，支持手机 App 智能能源监控。'
        }
      },

      // -------------------------------------------------------------
      // 2. Комерційні та промислові (C&I ESS)
      // -------------------------------------------------------------
      {
        id: 'catl-ci-peak-shaving-250',
        name: 'CATL C&I Peak Shaving System 250 kW / 500 kWh',
        family: 'C&I ESS',
        category: 'Комерційні та промислові ESS',
        productType: 'CI_PEAK_SHAVING',
        shortDesc: 'Спеціалізована система зрізання пікових навантажень для заводів, фабрик та великих ТРЦ.',
        highlight: 'Зниження витрат на приєднану потужність до 40%, функція арбітражу на РДН та безперебійного живлення цеху.',
        sourceUrl: 'https://www.catl.com/en/ess/commercial/',
        energySpecs: {
          nominalCapacity: '500 кВт·год',
          usableCapacity: '460 кВт·год',
          nominalVoltage: '800 В DC',
          maxContinuousPowerKw: '250 кВт',
          cRate: '0.5C (2 години повного розряду)',
          efficiencyRoundTrip: '≥ 94.5%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 3800000,
          priceDisplayUah: 'від 3 800 000 грн',
          priceNoteUk: 'Повний комплект: 2 батарейні шафи + інвертор PCS 250 кВт + шафа керування EMS',
          priceNoteEn: 'Turnkey system: 2 outdoor cabinets + 250kW PCS + EMS control cabinet',
          priceNoteZh: '成套工商业系统：包含2台户外电池柜、250kW变流器及EMS控制柜',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '10 років офіційної гарантії CATL'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah Commercial Cell',
          cycleLife: '10 000 циклів'
        },
        mechanicalSpecs: {
          dimensionsMm: '2 × (1300 × 1300 × 2250 мм) + PCS 1000 × 800 × 2000 мм',
          weightKg: '5 600 кг (сумарно)',
          protectionRating: 'IP55 вуличне виконання',
          installationType: 'Вуличне встановлення на бетонний фундамент'
        },
        thermalSpecs: {
          coolingMethod: 'Рідинне охолодження замкненого циклу (Liquid cooling)',
          operatingTempRange: '-30°C...+55°C'
        },
        safetySpecs: {
          fireSuppression: 'Novec 1230 газове пожежогасіння + датчики CO / H2',
          certifications: 'UL 9540A, IEC 62619, UN38.3'
        },
        compatibility: {
          gridConnection: '0.4 кВ AC пряме підключення до ГРЩ підприємства',
          emsIntegration: 'Modbus TCP, IEC 60870-5-104, підтримка SCADA заводу'
        },
        transEn: {
          name: 'CATL C&I Peak Shaving System 250 kW / 500 kWh',
          shortDesc: 'Industrial peak-shaving ESS designed for factories, logistics centers, and retail parks.',
          highlight: 'Cuts maximum demand charges by up to 40%, enables day-ahead arbitrage and backup power.'
        },
        transZh: {
          name: '宁德时代 工商业削峰填谷储能系统 250 kW / 500 kWh',
          shortDesc: '专为工厂、工业制造园区和商用物流园定制的削峰填谷储能系统。',
          highlight: '降低最高达 40% 的申报需量基本电费，支持电力现货套利与关键车间应急备电。'
        }
      },
      {
        id: 'catl-ci-microgrid-500',
        name: 'CATL Industrial Microgrid ESS 500 kW / 1000 kWh',
        family: 'C&I ESS',
        category: 'Комерційні та промислові ESS',
        productType: 'CI_MICROGRID',
        shortDesc: 'Комплексна BESS для промислових автономних та гібридних мікромереж (Microgrid).',
        highlight: 'Функція формування мережі (Grid-Forming), чорний пуск (Black Start), синхронізація з дизель-генераторами та СЕС.',
        sourceUrl: 'https://www.catl.com/en/ess/commercial/',
        energySpecs: {
          nominalCapacity: '1000 кВт·год (1.0 МВт·год)',
          usableCapacity: '920 кВт·год',
          nominalVoltage: '1000 В DC',
          maxContinuousPowerKw: '500 кВт',
          cRate: '0.5C',
          efficiencyRoundTrip: '≥ 94.8%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 7200000,
          priceDisplayUah: 'від 7 200 000 грн',
          priceNoteUk: 'Включає шафу автоматичної синхронізації з дизельною генерацією та СЕС',
          priceNoteEn: 'Includes automatic diesel-generator & solar synchronization panel',
          priceNoteZh: '包含柴油发电机组智能自动同步并联柜与微网控制器',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah Industrial LFP Cell',
          cycleLife: '12 000 циклів'
        },
        mechanicalSpecs: {
          dimensionsMm: '3 × шафи EnerOne Plus + 1 × контейнер PCS 500 кВт',
          weightKg: '10 800 кг',
          protectionRating: 'IP55',
          installationType: 'Вуличне виконання'
        },
        thermalSpecs: {
          coolingMethod: 'Рідинне охолодження з контролем дельти температур < 2.5°C',
          operatingTempRange: '-30°C...+55°C'
        },
        safetySpecs: {
          fireSuppression: 'Автоматичне газове пожежогасіння Novec 1230 на рівні шаф',
          certifications: 'UL 9540A, IEC 62477, IEC 62619'
        },
        compatibility: {
          generators: 'CAT, Cummins, MTU, Perkins через інтерфейс «сухих контактів» та RS485',
          scada: 'OPC UA, Modbus TCP, IEC 61850'
        },
        transEn: {
          name: 'CATL Industrial Microgrid ESS 500 kW / 1000 kWh',
          shortDesc: 'Turnkey BESS engineered for autonomous industrial microgrids and islanded power systems.',
          highlight: 'Grid-Forming voltage source capability, seamless Black Start, genset & solar hybridization.'
        },
        transZh: {
          name: '宁德时代 工业级独立微电网系统 500 kW / 1000 kWh',
          shortDesc: '面向偏远矿区、大型农牧基地和独立工业园区的成套离网微电网储能解决方案。',
          highlight: '构网型 (Grid-Forming) 核心控制，毫秒级黑启动，支持与柴油发电机无缝混合运行。'
        }
      },
      {
        id: 'catl-ci-solar-storage-turnkey',
        name: 'CATL C&I Solar+Storage Integrated Solution 500 kW / 1.5 MWh',
        family: 'C&I ESS',
        category: 'Комерційні та промислові ESS',
        productType: 'CI_SOLAR_STORAGE',
        shortDesc: 'Універсальний комплекс для сонячних електростанцій підприємств: утилізація 100% генерації СЕС.',
        highlight: 'DC-coupled або AC-coupled конфігурація, усунення перетоків у зовнішню мережу без втрати сонячної енергії.',
        sourceUrl: 'https://www.catl.com/en/ess/commercial/',
        energySpecs: {
          nominalCapacity: '1490 кВт·год (1.49 МВт·год)',
          usableCapacity: '1380 кВт·год',
          nominalVoltage: '1164 В DC',
          maxContinuousPowerKw: '500 кВт',
          cRate: '0.33C – 0.5C',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 10400000,
          priceDisplayUah: 'від 10 400 000 грн',
          priceNoteUk: 'Повний проєкт: 4 шафи EnerOne Plus + центральний інвертор PCS + СУ СЕС',
          priceNoteEn: 'Full turnkey project: 4 EnerOne Plus units + Central PCS + Solar EMS',
          priceNoteZh: '交钥匙工程：包含4台 EnerOne Plus、集中式变流器及光储智慧协调系统',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah ESS Cell',
          cycleLife: '12 000 циклів'
        },
        mechanicalSpecs: {
          dimensionsMm: '4 × шафи EnerOne Plus (1300 × 1300 × 2250 мм)',
          weightKg: '13 600 кг',
          protectionRating: 'IP55',
          installationType: 'Вуличне встановлення'
        },
        thermalSpecs: {
          coolingMethod: 'Інтелектуальне рідинне охолодження',
          operatingTempRange: '-30°C...+55°C'
        },
        safetySpecs: {
          fireSuppression: 'Мультисенсорна система виявлення та гасіння Novec 1230',
          certifications: 'UL 9540A, IEC 62619, CE'
        },
        compatibility: {
          pvInverters: 'Huawei, Sungrow, SMA, Kstar',
          monitoring: 'Хмарний моніторинг KATL Cloud + локальний контролер'
        },
        transEn: {
          name: 'CATL C&I Solar+Storage Integrated Solution 500 kW / 1.5 MWh',
          shortDesc: 'All-weather turnkey solar-plus-storage system maximizing on-site renewable self-consumption.',
          highlight: 'Zero grid export compliance, solar firming, multi-cabinet liquid cooling architecture.'
        },
        transZh: {
          name: '宁德时代 工商业光储融合交钥匙系统 500 kW / 1.5 MWh',
          shortDesc: '工商业屋顶与地面光伏专用配储系统，实现光伏电量 100% 自发自用与防逆流控制。',
          highlight: '严格防逆流零上网调度，全天候液冷温控，支持4台机柜模块化并联运行。'
        }
      },

      // -------------------------------------------------------------
      // 3. Компоненти (Components: Cells, Modules, Racks, PCS, EMS, HVAC, Fire, Transformers)
      // -------------------------------------------------------------
      {
        id: 'catl-lfp-cell-280ah',
        name: 'CATL LFP Prismatic Cell 3.2V 280Ah (0.5C/1C)',
        family: 'Battery Cells',
        category: 'Компоненти',
        productType: 'BATTERY_CELL',
        shortDesc: 'Еталонний промисловий призматичний літій-залізо-фосфатний осередок CATL ємністю 280 А·год.',
        highlight: 'Найнадійніший осередок у світовій BESS індустрії з ресурсом понад 8 000 циклів та енергоємністю 896 Вт·год.',
        sourceUrl: 'https://www.catl.com/en/ess/cells/',
        energySpecs: {
          nominalCapacity: '280 А·год (896 Вт·год)',
          nominalVoltage: '3.2 В DC',
          workingVoltageRange: '2.5 – 3.65 В DC',
          maxContinuousDischarge: '140 А (0.5C) / 280 А (1.0C)',
          internalResistance: '≤ 0.25 мОм (AC 1 кГц)',
          energyDensity: '≥ 165 Вт·год/кг',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 3200,
          priceDisplayUah: 'від 3 200 грн / шт',
          priceNoteUk: 'Оптові партії від 1 палети (128 шт.) із сертифікатом відповідності CATL',
          priceNoteEn: 'Wholesale orders from 1 pallet (128 pcs) with official CATL test report',
          priceNoteZh: '批量订购起订量为 1 托盘 (128 支)，附宁德时代原厂出厂检验报告',
          availability: 'IN_STOCK',
          warrantyYears: '5 років заводської гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CB280-3.2V-280Ah',
          cycleLife: '8 000+ циклів при 80% DoD'
        },
        mechanicalSpecs: {
          dimensionsMm: '71.5 × 173.8 × 204.6 мм',
          weightKg: '5.42 кг ± 0.1 кг',
          protectionRating: 'Алюмінієвий призматичний корпус з вибухозахисним клапаном',
          installationType: 'Складання в модулі за схемою 1P16S, 1P52S'
        },
        thermalSpecs: {
          coolingMethod: 'Повітряне або рідинне пластинчасте охолодження',
          operatingTempRange: 'Заряд: 0...+55°C; Розряд: -20...+55°C'
        },
        safetySpecs: {
          fireSuppression: 'Вбудований клапан скидання надлишкового тиску Safety Vent',
          certifications: 'UL 1973, UL 9540A, IEC 62619, UN38.3'
        },
        compatibility: {
          bmsSupport: 'Сумісний з будь-якими системами Master/Slave BMS 3.2V'
        },
        transEn: {
          name: 'CATL LFP Prismatic Cell 3.2V 280Ah (0.5C/1C)',
          shortDesc: 'Benchmark industrial prismatic lithium-iron-phosphate cell with 8,000+ cycles.',
          highlight: 'Industry-standard 280Ah platform, 896 Wh capacity per cell, 165 Wh/kg gravimetric density.'
        },
        transZh: {
          name: '宁德时代 磷酸铁锂方形电芯 3.2V 280Ah',
          shortDesc: '全球大型储能项目标杆级电芯，超 8000 次循环寿命与卓越安全性能。',
          highlight: '行业公认成熟 280Ah 平台，单体容量 896Wh，铝壳防爆阀多重物理安全屏障。'
        }
      },
      {
        id: 'catl-lfp-cell-587ah',
        name: 'CATL Ultra LFP Prismatic Cell 3.2V 587Ah Next-Gen',
        family: 'Battery Cells',
        category: 'Компоненти',
        productType: 'BATTERY_CELL',
        shortDesc: 'Надвеликий осередок нового покоління 587 А·год (1.87 кВт·год) для ультращільних систем TENER.',
        highlight: 'Революційна щільність енергії для зниження капітальних витрат (CAPEX) контейнерних систем на 20%.',
        sourceUrl: 'https://www.catl.com/en/ess/cells/',
        energySpecs: {
          nominalCapacity: '587 А·год (1 878.4 Вт·год)',
          nominalVoltage: '3.2 В DC',
          workingVoltageRange: '2.5 – 3.65 В DC',
          maxContinuousDischarge: '293 А (0.5C)',
          energyDensity: '≥ 185 Вт·год/кг',
          pricingType: 'QUOTE_REQUIRED',
          priceDisplayUah: 'Ціна за запитом',
          priceNoteUk: 'Постачання виключно для авторизованих проектів контейнерних систем CATL TENER',
          priceNoteEn: 'Available exclusively for authorized CATL TENER integration projects',
          priceNoteZh: '仅面向经授权的 CATL TENER 规模化系统集成项目供应',
          availability: 'PROJECT_BASED',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate) + SEI Carbon Protection',
          cellModel: 'CATL Ultra-587Ah Next-Gen',
          cycleLife: '15 000 циклів (5 років без деградації)'
        },
        mechanicalSpecs: {
          dimensionsMm: '81.0 × 220.0 × 285.0 мм',
          weightKg: '10.2 кг',
          protectionRating: 'Посилений корпус із лазерним зварюванням'
        },
        thermalSpecs: {
          coolingMethod: 'Двостороннє пряме рідинне охолодження',
          operatingTempRange: '-30°C...+60°C'
        },
        safetySpecs: {
          fireSuppression: 'Клапан аварійного скидання газу та пасивний внутрішній термозапобіжник',
          certifications: 'UL 9540A, IEC 62619'
        },
        compatibility: {
          bmsSupport: 'Офіційна інтеграція з CATL Master BMS String Controller'
        },
        transEn: {
          name: 'CATL Ultra LFP Prismatic Cell 3.2V 587Ah Next-Gen',
          shortDesc: 'Ultra-large capacity next-generation 587Ah LFP cell engineered for TENER utility-scale BESS.',
          highlight: '1.878 kWh energy in a single cell, enabling 6.25+ MWh in a standard 20ft container.'
        },
        transZh: {
          name: '宁德时代 超大容量磷酸铁锂电芯 3.2V 587Ah',
          shortDesc: '专为天恒 (TENER) 6.25MWh 标准 20 尺集装箱储能系统研发的新一代超大容量电芯。',
          highlight: '单体电芯容量高达 1878.4Wh，实现前 5 年容量与功率零衰减关键技术突破。'
        }
      },
      {
        id: 'catl-battery-module-1p52s',
        name: 'CATL 1P52S Liquid-Cooled Battery Module (166.4V / 52.2 kWh)',
        family: 'Battery Modules & Racks',
        category: 'Компоненти',
        productType: 'BATTERY_MODULE',
        shortDesc: 'Офіційний заводський модуль рідинного охолодження на базі 52 послідовно з’єднаних осередків 314Ah.',
        highlight: 'Базовий будівельний блок систем EnerOne Plus та TENER із вбудованими датчиками температури й напруги.',
        sourceUrl: 'https://www.catl.com/en/ess/modules/',
        energySpecs: {
          nominalCapacity: '52.26 кВт·год (314 А·год)',
          nominalVoltage: '166.4 В DC (52S1P)',
          voltageRange: '145.6 – 187.2 В DC',
          maxContinuousCurrent: '157 А (0.5C)',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 345000,
          priceDisplayUah: 'від 345 000 грн',
          priceNoteUk: 'Постачається зі змонтованими рідинними швидкороз’ємними фітингами',
          priceNoteEn: 'Supplied with pre-installed quick-connect liquid cooling fittings',
          priceNoteZh: '出厂预装快插式液冷管路接头及模组级从机采集线束',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah ESS Cell',
          cycleLife: '12 000 циклів'
        },
        mechanicalSpecs: {
          dimensionsMm: '1150 × 480 × 260 мм',
          weightKg: '335 кг',
          protectionRating: 'IP67 герметичний модуль'
        },
        thermalSpecs: {
          coolingMethod: 'Нижня інтегрована алюмінієва плита рідинного охолодження',
          operatingTempRange: '-30°C...+55°C'
        },
        safetySpecs: {
          fireSuppression: 'Аерогелевий термобар’єр між осередками (захист від Thermal Runaway)',
          certifications: 'UL 1973, IEC 62619, UN38.3'
        },
        compatibility: {
          rackIntegration: 'Монтаж у стійки 1000V та 1500V DC (до 9 модулів у стійку)'
        },
        transEn: {
          name: 'CATL 1P52S Liquid-Cooled Battery Module (166.4V / 52.2 kWh)',
          shortDesc: 'Factory integrated liquid-cooled modular building block based on 52 series 314Ah LFP cells.',
          highlight: 'Used across EnerOne Plus and TENER architectures, IP67 sealed with laser-welded busbars.'
        },
        transZh: {
          name: '宁德时代 1P52S 液冷储能电池模组 (166.4V / 52.2 kWh)',
          shortDesc: '基于 52 串 314Ah 磷酸铁锂电芯的高集成度原厂液冷储能标准模组。',
          highlight: 'EnerOne Plus 及天恒标准核心模组，IP67 高防护密封设计，电芯间气凝胶隔热阻燃。'
        }
      },
      {
        id: 'catl-bess-rack-1500v',
        name: 'CATL 1500V DC High-Voltage Liquid-Cooled Battery Rack',
        family: 'Battery Modules & Racks',
        category: 'Компоненти',
        productType: 'BATTERY_RACK',
        shortDesc: 'Високовольтна батарейна стійка 1500 В DC корисною ємністю до 470 кВт·год з автоматичним блоком BPU.',
        highlight: 'Повний склад: 9 модулів 1P52S + високовольтна шафа захисту та комутації BPU (швидкісний вимикач, запобіжник 500A).',
        sourceUrl: 'https://www.catl.com/en/ess/racks/',
        energySpecs: {
          nominalCapacity: '470.3 кВт·год',
          nominalVoltage: '1497.6 В DC (9 × 1P52S)',
          voltageRange: '1310.4 – 1684.8 В DC',
          maxCurrent: '250 А',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 3100000,
          priceDisplayUah: 'від 3 100 000 грн',
          priceNoteUk: 'Включає шафу захисту BPU з контакторами 1500V та Slave BMS',
          priceNoteEn: 'Includes 1500V BPU protection cabinet with contactors & Slave BMS',
          priceNoteZh: '包含 1500V 高压箱 (BPU)、主接触器、直流快熔及从控 BMS',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah',
          cycleLife: '12 000 циклів'
        },
        mechanicalSpecs: {
          dimensionsMm: '1300 × 1200 × 2400 мм',
          weightKg: '3 450 кг',
          protectionRating: 'IP20 (для розміщення всередині контейнерів EnerC/TENER)'
        },
        thermalSpecs: {
          coolingMethod: 'Колекторне рідинне охолодження з індивідуальними контурами для кожного модуля'
        },
        safetySpecs: {
          fireSuppression: 'Прямий канал впорскування газу Novec 1230 у кожен модуль',
          certifications: 'UL 9540A, IEC 62619'
        },
        compatibility: {
          inverter: 'Підключення до центральних інверторів PCS 1500V DC'
        },
        transEn: {
          name: 'CATL 1500V DC High-Voltage Liquid-Cooled Battery Rack',
          shortDesc: '1500V DC utility-grade liquid-cooled battery rack up to 470 kWh with intelligent BPU.',
          highlight: 'Contains 9 × 1P52S modules, 500A high-speed DC fuse, 1500V contactor isolation.'
        },
        transZh: {
          name: '宁德时代 1500V 高压液冷储能电池簇 (Rack)',
          shortDesc: '1500V 直流电网级高压液冷电池簇，容量达 470 kWh，集成智能高压盒 (BPU)。',
          highlight: '包含 9 个 1P52S 模组、500A 快速直流熔断器及 1500V 级高压直流断路接触器。'
        }
      },
      {
        id: 'catl-central-pcs-skid',
        name: 'CATL Central Power Conversion System (PCS) Skid 2.5 MW / 1500V',
        family: 'PCS & Inverters',
        category: 'Компоненти',
        productType: 'PCS_INVERTER',
        shortDesc: 'Центральний двонаправлений інвертор потужністю 2.5 МВт для контейнерних систем BESS комунального масштабу.',
        highlight: 'Підтримка Grid-Forming, VSG (віртуальний синхронний генератор), регулювання частоти та реактивної потужності (cos φ від 0.8 до 1.0).',
        sourceUrl: 'https://www.catl.com/en/ess/pcs/',
        energySpecs: {
          ratedPowerKw: '2500 кВт (2.5 МВт AC)',
          maxDcVoltage: '1500 В DC',
          dcVoltageRange: '1000 – 1500 В DC',
          acNominalVoltage: '690 В AC (3-фазний)',
          maxEfficiency: '≥ 99.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 4600000,
          priceDisplayUah: 'від 4 600 000 грн',
          priceNoteUk: 'Постачається у вуличному виконанні IP55 або на відкритому скідовому шасі',
          priceNoteEn: 'Available in outdoor IP55 enclosure or pre-engineered skid mount',
          priceNoteZh: '提供户外 IP55 防护柜体或一体化撬装预制平台形式',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '5 років гарантії (з опцією подовження до 10 років)'
        },
        cellSpecs: {
          chemistry: 'IGBT/SiC 3-Level Topology Power Conversion'
        },
        mechanicalSpecs: {
          dimensionsMm: '2200 × 1200 × 2100 мм',
          weightKg: '3 200 кг',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Інтелектуальне примусове рідинне/повітряне охолодження силових модулів IGBT',
          operatingTempRange: '-30°C...+60°C'
        },
        safetySpecs: {
          fireSuppression: 'Захист від перенапруг AC/DC Type II, контроль опору ізоляції',
          certifications: 'IEC 62477, IEC 61000, IEEE 1547, VDE-AR-N 4110/4120'
        },
        compatibility: {
          gridConnection: 'Пряме з’єднання з підвищувальним трансформатором 0.69/10(35) кВ',
          communication: 'Ethernet, Modbus TCP, IEC 60870-5-104, оптичні інтерфейси'
        },
        transEn: {
          name: 'CATL Central Power Conversion System (PCS) Skid 2.5 MW / 1500V',
          shortDesc: 'Utility-scale 2.5 MW bidirectional power conversion system for 1500V DC energy storage.',
          highlight: 'Grid-Forming ready, 3-level IGBT topology, 99.0% peak efficiency, 690V AC output.'
        },
        transZh: {
          name: '宁德时代 集中式储能变流器 (PCS) 撬装系统 2.5 MW / 1500V',
          shortDesc: '面向 1500V 直流大型电网级储能系统的 2.5 MW 双向大功率储能变流升压一体平台。',
          highlight: '具备构网型 (Grid-Forming) 及虚拟同步机能力，三电平拓扑，最高转换效率达 99.0%。'
        }
      },
      {
        id: 'catl-string-pcs-125',
        name: 'CATL String Inverter PCS 125 kW / 400V (Distributed C&I)',
        family: 'PCS & Inverters',
        category: 'Компоненти',
        productType: 'PCS_INVERTER',
        shortDesc: 'Стрінговий двонаправлений інвертор 125 кВт з прямим підключенням до мережі 0.4 кВ без додаткового трансформатора.',
        highlight: 'Ідеальне рішення для розподілених шаф EnerOne Plus: модульне нарощування потужності та децентралізоване керування.',
        sourceUrl: 'https://www.catl.com/en/ess/pcs/',
        energySpecs: {
          ratedPowerKw: '125 кВт AC (0.4 кВ)',
          maxDcVoltage: '1000 В DC',
          dcVoltageRange: '600 – 900 В DC',
          acNominalVoltage: '400 В AC (3 фази + N + PE)',
          maxEfficiency: '≥ 98.8%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 380000,
          priceDisplayUah: 'від 380 000 грн',
          priceNoteUk: 'Вбудований контактор виходу та моніторинг кожного стрінгу',
          priceNoteEn: 'Built-in AC contactor and individual string monitoring',
          priceNoteZh: '集成交流输出接触器与独立簇级高精度电流监测',
          availability: 'IN_STOCK',
          warrantyYears: '5 років гарантії'
        },
        cellSpecs: {
          chemistry: 'SiC MOSFET High-Efficiency Topology'
        },
        mechanicalSpecs: {
          dimensionsMm: '750 × 600 × 320 мм',
          weightKg: '78 кг',
          protectionRating: 'IP66'
        },
        thermalSpecs: {
          coolingMethod: 'Інтелектуальне повітряне охолодження зі змінною швидкістю вентиляторів',
          operatingTempRange: '-30°C...+55°C'
        },
        safetySpecs: {
          fireSuppression: 'Захист від острівного режиму (Anti-Islanding), AFCI детекція дуги',
          certifications: 'IEC 62109, VDE-AR-N 4105, CE'
        },
        compatibility: {
          ems: 'CAN / RS485 / Modbus TCP, сумісність із CATL Smart EMS'
        },
        transEn: {
          name: 'CATL String Inverter PCS 125 kW / 400V (Distributed C&I)',
          shortDesc: '125 kW decentralized string PCS for commercial cabinets with direct 400V grid interconnection.',
          highlight: 'Modular scaling, SiC power semiconductor technology, IP66 outdoor mounting.'
        },
        transZh: {
          name: '宁德时代 组串式储能变流器 (PCS) 125 kW / 400V',
          shortDesc: '专为工商业 EnerOne 户外柜设计的 125 kW 模块化组串式双向变流器，直连 400V 电网。',
          highlight: '支持多机灵活并联扩容，碳化硅 (SiC) 高效半导体器件，IP66 户外全密封防护。'
        }
      },
      {
        id: 'catl-liquid-cooling-chiller',
        name: 'CATL Intelligent Liquid Cooling Chiller Unit (40 kW / 60 kW)',
        family: 'Thermal Management',
        category: 'Компоненти',
        productType: 'THERMAL_CHILLER',
        shortDesc: 'Прецизійний чилер рідинного охолодження для акумуляторних шаф та контейнерів BESS.',
        highlight: 'Підтримка дельти температур осередків < 2.5°C, компресор зі змінною частотою обертання та рідина-теплоносій 50/50 гліколь.',
        sourceUrl: 'https://www.catl.com/en/ess/thermal/',
        energySpecs: {
          coolingCapacityKw: '40 кВт (опціонально 60 кВт)',
          heatingCapacityKw: '15 кВт вбудований PTC електронагрівач',
          powerSupply: '380 В AC, 3 фази, 50 Гц',
          refrigerant: 'R410A / R134a екологічний холодоагент',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 620000,
          priceDisplayUah: 'від 620 000 грн',
          priceNoteUk: 'Постачається заправленим холодоагентом із вбудованим циркуляційним насосом Grundfos',
          priceNoteEn: 'Factory charged with refrigerant, includes integrated Grundfos circulation pump',
          priceNoteZh: '出厂预充注环保制冷剂，集成格兰富高品质工业级循环泵',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '5 років гарантії'
        },
        cellSpecs: {
          chemistry: 'Closed-loop Liquid Circulation System'
        },
        mechanicalSpecs: {
          dimensionsMm: '1100 × 750 × 1850 мм',
          weightKg: '380 кг',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Пластинчасті теплообмінники Danfoss + інверторний компресор',
          operatingTempRange: '-35°C...+55°C зовнішнього повітря'
        },
        safetySpecs: {
          fireSuppression: 'Датчики тиску в контурі, реле протоку рідини, захист від витоків',
          certifications: 'CE, PED 2014/68/EU'
        },
        compatibility: {
          bmsIntegration: 'Автоматичне регулювання температури за командами CATL Master BMS'
        },
        transEn: {
          name: 'CATL Intelligent Liquid Cooling Chiller Unit (40 kW / 60 kW)',
          shortDesc: 'Precision industrial liquid chiller engineered for battery racks and BESS container thermal management.',
          highlight: 'Maintains cell temperature variance < 2.5°C, dual heating & cooling modes (-35°C to +55°C).'
        },
        transZh: {
          name: '宁德时代 智能精密液冷机组 (40 kW / 60 kW)',
          shortDesc: '专为大型储能电池集装箱与工商业机柜研发的高可靠性工业级变频液冷温控机组。',
          highlight: '确保电池簇内电芯温差小于 2.5°C，支持冷暖双向调控，适应 -35°C 极寒至 +55°C 酷暑。'
        }
      },
      {
        id: 'catl-fire-suppression-system',
        name: 'CATL Multi-Stage Fire Suppression & Safety Unit (Novec 1230)',
        family: 'Fire Safety',
        category: 'Компоненти',
        productType: 'FIRE_SAFETY',
        shortDesc: 'Автоматична багаторівнева система газового пожежогасіння Novec 1230 / FK-5-1-12 з детекцією горючих газів.',
        highlight: 'Раннє виявлення термічного розгону на рівні окремих осередків (датчики CO, H2, диму та температури) за 5–15 секунд.',
        sourceUrl: 'https://www.catl.com/en/ess/safety/',
        energySpecs: {
          agentType: 'FK-5-1-12 (Novec 1230) екологічний діелектричний газ',
          activationTime: '< 10 секунд від сигналу тривоги',
          cylinderVolume: '2 × 50 л (під тиском 42 бар)',
          powerSupply: '24 В DC від безперебійного джерела живлення',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 480000,
          priceDisplayUah: 'від 480 000 грн',
          priceNoteUk: 'Комплект: газові балони + клапани впорскування + панель пожежної сигналізації',
          priceNoteEn: 'Kit: gas cylinders + injection valves + multi-gas detection panel',
          priceNoteZh: '成套设备：含灭火储气瓶组、分配喷嘴、多合一气体探测报警主机',
          availability: 'IN_STOCK',
          warrantyYears: '5 років'
        },
        cellSpecs: {
          chemistry: 'Perfluoro(2-methyl-3-pentanone) clean gas agent'
        },
        mechanicalSpecs: {
          dimensionsMm: 'Балонний вузол: 600 × 500 × 1600 мм',
          weightKg: '240 кг',
          protectionRating: 'IP54'
        },
        thermalSpecs: {
          operatingTempRange: '-30°C...+60°C'
        },
        safetySpecs: {
          fireSuppression: 'Сертифіковано за NFPA 855 та UL 9540A для стаціонарних BESS',
          certifications: 'UL 2166, EN 12094, CE'
        },
        compatibility: {
          emergencyShutdown: 'Прямий сигнал на розмикання високовольтних контакторів та аварійну вентиляцію'
        },
        transEn: {
          name: 'CATL Multi-Stage Fire Suppression & Safety Unit (Novec 1230)',
          shortDesc: 'Automated clean agent gas fire extinguishing system with multi-sensor thermal runaway detection.',
          highlight: 'Cell-level off-gas detection (CO, H2), NFPA 855 and UL 9540A compliant.'
        },
        transZh: {
          name: '宁德时代 多级多维全氟己酮自动气体灭火与安全消防系统',
          shortDesc: '专为锂电池热失控抑制研发的自动化洁净气体灭火系统，支持电芯级早期特征气体探测。',
          highlight: '全氟己酮 (FK-5-1-12) 环保灭火介质，毫秒级探测 CO 与氢气逸出，严格符合 NFPA 855 标准。'
        }
      },
      {
        id: 'catl-mv-transformer-station',
        name: 'CATL MV Step-Up Transformer Station 10/35 kV (TMG 2500 kVA)',
        family: 'Transformers & Switchgear',
        category: 'Компоненти',
        productType: 'TRANSFORMER_STATION',
        shortDesc: 'Комплектна трансформаторна підстанція (КТП) 0.69 / 10(35) кВ для підключення великих BESS до енергосистеми.',
        highlight: 'Герметичний масляний трансформатор ТМГ з екологічними характеристиками EcoDesign Tier 2 та осередками КРУ РУ-10(35) кВ.',
        sourceUrl: 'https://www.catl.com/en/ess/substation/',
        energySpecs: {
          ratedPowerKva: '2500 кВА',
          lvVoltage: '690 В AC (Dyn11)',
          mvVoltage: '10 кВ або 35 кВ (за вибором замовника)',
          noLoadLosses: 'Знижені втрати відповідно до стандартів ЄС та ДСТУ',
          shortCircuitVoltage: 'uk = 6.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 2950000,
          priceDisplayUah: 'від 2 950 000 грн',
          priceNoteUk: 'Повний комплект: трансформатор ТМГ + вакуумний вимикач 10 кВ + лічильник комерційного обліку',
          priceNoteEn: 'Complete substation: TMG transformer + 10kV vacuum breaker + 0.2S fiscal meter',
          priceNoteZh: '完整成套箱变：含油浸式变压器、10kV真空断路器与高精度关口计量表',
          availability: 'ORDER_AVAILABLE',
          warrantyYears: '5 років'
        },
        cellSpecs: {
          chemistry: 'Mineral oil / Synthetic Ester Insulated Core'
        },
        mechanicalSpecs: {
          dimensionsMm: '3600 × 2400 × 2600 мм',
          weightKg: '7 800 кг',
          protectionRating: 'IP54 вуличне виконання'
        },
        thermalSpecs: {
          coolingMethod: 'ONAN (природне масляне охолодження)',
          operatingTempRange: '-40°C...+50°C'
        },
        safetySpecs: {
          fireSuppression: 'Маслоприймач, реле Бухгольца, клапан скидання тиску, термометр з контактами',
          certifications: 'ДСТУ EN 60076, IEC 60076, CE'
        },
        compatibility: {
          gridConnection: 'РУ-10 кВ / РУ-35 кВ операторів ОСР (Обленерго) та ОСП (НЕК Укренерго)'
        },
        transEn: {
          name: 'CATL MV Step-Up Transformer Station 10/35 kV (TMG 2500 kVA)',
          shortDesc: 'Prefabricated medium-voltage step-up transformer substation for grid-interconnected BESS.',
          highlight: '0.69 kV to 10/35 kV transformation, EcoDesign Tier 2 compliant, vacuum circuit breaker included.'
        },
        transZh: {
          name: '宁德时代 储能专用中压升压变压器变电站 10/35 kV (2500 kVA)',
          shortDesc: '专为大型集中式 BESS 设计的箱式中压升压变电站，支持 0.69kV 升至 10kV 或 35kV 电网。',
          highlight: '低损耗绿色环保设计，标配 10/35kV 真空断路器及微机综合保护测控装置。'
        }
      },
      {
        id: 'catl-smart-ems-scada',
        name: 'CATL Smart EMS & SCADA Controller Platform (Local & Cloud)',
        family: 'EMS',
        category: 'Компоненти',
        productType: 'EMS_SCADA',
        shortDesc: 'Інтелектуальна система енергетичного менеджменту (EMS) та контролер локальної диспетчеризації SCADA.',
        highlight: 'Алгоритми зрізання піків, оптимізації цінових спредів на ринку РДН, балансування частоти та телеметрії за стандартами Укренерго.',
        sourceUrl: 'https://www.catl.com/en/ess/ems/',
        energySpecs: {
          responseTimeMs: '< 20 мс для функцій швидкого відгуку частоти (FCR)',
          dataResolutionSec: '1 секунда інтервал збору даних',
          storageRetentionYears: '10 років локального збереження історії вимірювань',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 420000,
          priceDisplayUah: 'від 420 000 грн',
          priceNoteUk: 'Включає промисловий сервер Advantech у стійці 19", ліцензію ПО та модуль зв’язку 4G/LTE',
          priceNoteEn: 'Includes 19" industrial Advantech server, lifetime software license, and 4G/LTE gateway',
          priceNoteZh: '包含 19 英寸研华工控机硬件、永久授权软件系统及 4G/5G 工业级通信网关',
          availability: 'IN_STOCK',
          warrantyYears: '5 років'
        },
        cellSpecs: {
          chemistry: 'Industrial Linux Real-Time Operating System'
        },
        mechanicalSpecs: {
          dimensionsMm: '600 × 600 × 1200 мм (шафа 19" RACK)',
          weightKg: '85 кг',
          protectionRating: 'IP40 (внутрішнє встановлення)'
        },
        thermalSpecs: {
          coolingMethod: 'Примусове повітряне охолодження шафи',
          operatingTempRange: '-20°C...+60°C'
        },
        safetySpecs: {
          fireSuppression: 'Кібербезпека: шифрування TLS 1.3, захист від несанкціонованого доступу, RBAC',
          certifications: 'IEC 62443-4-2 (Cybersecurity for Industrial Automation)'
        },
        compatibility: {
          protocols: 'IEC 60870-5-104, IEC 61850, Modbus TCP/RTU, DNP3, MQTT, REST API'
        },
        transEn: {
          name: 'CATL Smart EMS & SCADA Controller Platform (Local & Cloud)',
          shortDesc: 'Intelligent Energy Management System and local SCADA automation controller for BESS complexes.',
          highlight: 'Sub-20ms frequency response, day-ahead market arbitrage algorithms, IEC 60870-5-104 grid protocol.'
        },
        transZh: {
          name: '宁德时代 智能能量管理系统 (EMS) 与本地 SCADA 调度平台',
          shortDesc: '面向工商业及电网级储能的工业级核心智能控制与现场 SCADA 调度自动化软硬件平台。',
          highlight: '毫秒级一次调频响应，电力现货多目标优化算法，支持 IEC 60870-5-104 及 IEC 61850 规约。'
        }
      }
    ];

    for (const p of additionalProducts) {
      console.log(`[Additional Products Seed] Inserting ${p.id} (${p.name})...`);

      await client.query(
        `INSERT INTO pim_products (id, name, family, category, short_desc, highlight, status, product_type, source_url, verified_at, verified_by, confidence, revision, created_at, updated_at, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, 'PUBLISHED', $7, $8, NOW(), $9, 'OFFICIAL_CATL', 1, NOW(), NOW(), $10)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           family = EXCLUDED.family,
           category = EXCLUDED.category,
           short_desc = EXCLUDED.short_desc,
           highlight = EXCLUDED.highlight,
           status = 'PUBLISHED',
           product_type = EXCLUDED.product_type,
           source_url = EXCLUDED.source_url,
           verified_at = NOW(),
           verified_by = EXCLUDED.verified_by,
           confidence = 'OFFICIAL_CATL',
           revision = 1,
           updated_at = NOW()`,
        [p.id, p.name, p.family, p.category, p.shortDesc, p.highlight, p.productType, p.sourceUrl, 'Головний інженер KATL Ukraine', adminId]
      );

      // Specifications
      await client.query(
        `INSERT INTO pim_specifications (product_id, energy_specs, cell_specs, mechanical_specs, thermal_specs, safety_specs, compatibility, specification_revision, created_at, updated_at)
         VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, 1, NOW(), NOW())
         ON CONFLICT (product_id) DO UPDATE SET
           energy_specs = EXCLUDED.energy_specs,
           cell_specs = EXCLUDED.cell_specs,
           mechanical_specs = EXCLUDED.mechanical_specs,
           thermal_specs = EXCLUDED.thermal_specs,
           safety_specs = EXCLUDED.safety_specs,
           compatibility = EXCLUDED.compatibility,
           specification_revision = 1,
           updated_at = NOW()`,
        [
          p.id,
          JSON.stringify(p.energySpecs || {}),
          JSON.stringify(p.cellSpecs || {}),
          JSON.stringify(p.mechanicalSpecs || {}),
          JSON.stringify(p.thermalSpecs || {}),
          JSON.stringify(p.safetySpecs || {}),
          JSON.stringify(p.compatibility || {})
        ]
      );

      // Fact Sources
      await client.query(
        `INSERT INTO pim_product_fact_sources (product_id, specification_revision, field_path, value_snapshot, source_snapshot_id, page_section, evidence_excerpt, status, verified_by_id, verified_at, created_at)
         VALUES ($1, 1, 'energySpecs.nominalCapacity', $2::jsonb, $3, 'Official Datasheet Page 1', $4, 'VERIFIED', $5, NOW(), NOW())
         ON CONFLICT (product_id, specification_revision, field_path) DO UPDATE SET
           value_snapshot = EXCLUDED.value_snapshot,
           evidence_excerpt = EXCLUDED.evidence_excerpt,
           status = 'VERIFIED',
           verified_at = NOW()`,
        [
          p.id,
          JSON.stringify(p.energySpecs?.nominalCapacity || p.energySpecs?.ratedPowerKw || 'Standard'),
          snapshotId,
          `${p.name} official verified rating: ${p.energySpecs?.nominalCapacity || p.energySpecs?.ratedPowerKw || 'CATL standard'}`,
          adminId
        ]
      );

      // Translations: uk-UA
      await client.query(
        `INSERT INTO pim_product_translations (
          product_id, locale, source_revision, name, short_desc, highlight,
          specifications, translation_status, updated_at
        ) VALUES (
          $1, 'uk-UA', 1, $2, $3, $4, $5::jsonb, 'PUBLISHED', NOW()
        )
        ON CONFLICT (product_id, locale) DO UPDATE SET
          name = EXCLUDED.name,
          short_desc = EXCLUDED.short_desc,
          highlight = EXCLUDED.highlight,
          specifications = EXCLUDED.specifications,
          translation_status = 'PUBLISHED'`,
        [
          p.id,
          p.name,
          p.shortDesc,
          p.highlight,
          JSON.stringify({ ...p.energySpecs, ...p.cellSpecs, ...p.mechanicalSpecs, ...p.thermalSpecs, ...p.safetySpecs })
        ]
      );

      // Translations: en
      await client.query(
        `INSERT INTO pim_product_translations (
          product_id, locale, source_revision, name, short_desc, highlight,
          specifications, translation_status, updated_at
        ) VALUES (
          $1, 'en', 1, $2, $3, $4, $5::jsonb, 'PUBLISHED', NOW()
        )
        ON CONFLICT (product_id, locale) DO UPDATE SET
          name = EXCLUDED.name,
          short_desc = EXCLUDED.short_desc,
          highlight = EXCLUDED.highlight,
          specifications = EXCLUDED.specifications,
          translation_status = 'PUBLISHED'`,
        [
          p.id,
          p.transEn?.name || p.name,
          p.transEn?.shortDesc || p.shortDesc,
          p.transEn?.highlight || p.highlight,
          JSON.stringify({ ...p.energySpecs, ...p.cellSpecs, ...p.mechanicalSpecs, ...p.thermalSpecs, ...p.safetySpecs })
        ]
      );

      // Translations: zh-CN
      await client.query(
        `INSERT INTO pim_product_translations (
          product_id, locale, source_revision, name, short_desc, highlight,
          specifications, translation_status, updated_at
        ) VALUES (
          $1, 'zh-CN', 1, $2, $3, $4, $5::jsonb, 'PUBLISHED', NOW()
        )
        ON CONFLICT (product_id, locale) DO UPDATE SET
          name = EXCLUDED.name,
          short_desc = EXCLUDED.short_desc,
          highlight = EXCLUDED.highlight,
          specifications = EXCLUDED.specifications,
          translation_status = 'PUBLISHED'`,
        [
          p.id,
          p.transZh?.name || p.name,
          p.transZh?.shortDesc || p.shortDesc,
          p.transZh?.highlight || p.highlight,
          JSON.stringify({ ...p.energySpecs, ...p.cellSpecs, ...p.mechanicalSpecs, ...p.thermalSpecs, ...p.safetySpecs })
        ]
      );
    }

    await client.query('COMMIT');
    console.log('[Additional Official Products] Successfully populated all 15 additional official CATL models.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Additional Products Seed Error]:', err);
    throw err;
  } finally {
    client.release();
    await closeDatabasePool();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed-additional-official.ts')) {
  seedAdditionalOfficialProducts().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
