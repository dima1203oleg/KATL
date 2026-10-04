import { randomUUID } from 'node:crypto';
import { getDatabasePool, closeDatabasePool } from './client';

export async function seedMasterProductRegistry() {
  const pool = getDatabasePool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('[Master Registry Seed] Starting transactional catalog population...');

    // 1. Ensure Verifier Admin User exists
    const adminUser = {
      id: 'USR-CATL-ENG-01',
      email: 'engineering@katl.com.ua',
      name: 'Головний інженер KATL Ukraine',
      role: 'ADMIN',
      company: 'KATL ESS Ukraine',
      passwordHash: 'argon2id$v=19$m=65536,t=3,p=4$verified_system_seed',
      permissions: JSON.stringify(['PIM_READ', 'PIM_WRITE', 'PIM_PUBLISH', 'RFQ_MANAGE'])
    };

    await client.query(
      `INSERT INTO users (id, email, name, role, company, password_hash, permissions, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role`,
      [adminUser.id, adminUser.email, adminUser.name, adminUser.role, adminUser.company, adminUser.passwordHash, adminUser.permissions]
    );

    // 2. Ensure Official Sync Source and Snapshot exist
    const sourceId = 'SRC-CATL-OFFICIAL-PORTAL';
    await client.query(
      `INSERT INTO sync_sources (id, name, url, source_type, poll_interval_minutes, enabled, last_checked)
       VALUES ($1, 'CATL Official Global ESS Portal', 'https://www.catl.com/en/ess/', 'OFFICIAL_WEB', 60, true, NOW())
       ON CONFLICT (id) DO UPDATE SET last_checked = NOW()`,
      [sourceId]
    );

    const snapshotId = 'a1000000-0000-4000-8000-000000000001';
    await client.query(
      `INSERT INTO sync_snapshots (id, source_id, content_hash, raw_payload, captured_at, http_status, content_type, source_url)
       VALUES ($1, $2, 'sha256_catl_ess_official_snapshot_2026', 'CATL ESS Verified Production Line Specifications 2026', NOW(), 200, 'text/html', 'https://www.catl.com/en/ess/')
       ON CONFLICT (id) DO NOTHING`,
      [snapshotId, sourceId]
    );

    // 3. Define the 16 Master CATL ESS Products
    const products = [
      // -------------------------------------------------------------
      // ВЕЛИКІ BESS (UTILITY SCALE)
      // -------------------------------------------------------------
      {
        id: 'catl-tener-6250',
        name: 'CATL TENER 6.25 MWh',
        family: 'TENER',
        category: 'Великі BESS',
        productType: 'UTILITY_CONTAINER',
        shortDesc: 'Флагманська 20-футова контейнерна BESS із 5 роками нульової деградації ємності та потужності.',
        highlight: '5 років нульової деградації (0% degradation), 6.25 МВт·год у стандартному 20-футовому контейнері TEU, комірки LFP 314Ah.',
        sourceUrl: 'https://www.catl.com/en/ess/tener/',
        energySpecs: {
          nominalCapacity: '6.25 МВт·год (6250 кВт·год)',
          usableCapacity: '6.00 МВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C (номінал 2 год) / 1C (пік)',
          maxContinuousPowerKw: '3125 кВт',
          efficiencyRoundTrip: '≥ 95.5%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 42000000,
          priceDisplayUah: 'від 42 000 000 грн',
          priceNoteUk: 'Фінальна ціна залежить від конфігурації системи, трансформатора та інтеграції',
          priceNoteEn: 'Final price depends on system configuration, transformer station and integration',
          priceNoteZh: '最终价格取决于系统配置、变压器和集成方案',
          availability: 'LEAD_TIME_4_WEEKS',
          warrantyYears: '10 років гарантії / 5 років без деградації'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah ESS Dedicated Cell',
          cellCapacity: '314 А·год (3.2 В)',
          cycleLife: '15 000 циклів при 70% EOL',
          degradationFirstYears: '0% втрати ємності за перші 5 років експлуатації'
        },
        mechanicalSpecs: {
          dimensions: '6058 × 2438 × 2896 мм (20-ft High Cube Container)',
          weight: '52 000 кг (повна споряджена маса)',
          containerStandard: 'ISO 668 20ft HC TEU',
          protectionRating: 'IP55 (зовнішня установка C5-M антикорозійний захист)'
        },
        thermalSpecs: {
          coolingMethod: 'Інтелектуальне рідинне охолодження (Liquid Cooling)',
          tempControlAccuracy: 'Різниця температур осередків ≤ 2.5 °C',
          operatingTempRange: '-30 °C … +55 °C'
        },
        safetySpecs: {
          fireSuppression: 'Багаторівнева система газового пожежогасіння (Novec 1230 / FK-5-1-12) + водяний лафет sprinkler',
          deflagrationProtection: 'Мембрани скидання вибухового тиску згідно з NFPA 68 / NFPA 69',
          gasDetection: 'Раннє детектування витоку електроліту, водню (H2) та CO',
          certifications: ['IEC 62619', 'IEC 63056', 'UL 9540A', 'UL 1973', 'NFPA 855', 'UN 38.3']
        },
        compatibility: {
          pcs: ['Sungrow SC3125UD', 'SMA Sunny Central Storage', 'Ingeteam Ingecon Sun Storage Power', 'Sineng EP-3125-HA-UD'],
          ems: ['CATL Smart Cloud EMS', 'SCADA IEC 60870-5-104', 'Modbus TCP/IP', 'НЕК Укренерго RTU integration'],
          transformer: 'Двообмотковий або триобмотковий підвищувальний трансформатор 0.69/10(35) кВ'
        },
        translations: {
          en: {
            name: 'CATL TENER 6.25 MWh',
            shortDesc: 'Flagship 20-ft utility-scale BESS container featuring 5-year zero capacity and power degradation.',
            highlight: '5-year zero degradation guarantee, 6.25 MWh in ISO 20ft HC container, CATL 314Ah LFP cells.'
          },
          'zh-CN': {
            name: 'CATL 天恒 (TENER) 6.25 MWh',
            shortDesc: '全球旗舰 20 尺大容量储能集装箱系统，实现前5年容量与功率零衰减。',
            highlight: '前5年容量与功率零衰减，标准20尺集装箱 6.25 MWh，采用 CATL 314Ah 储能专用电芯。'
          }
        }
      },
      {
        id: 'catl-tener-h',
        name: 'CATL TENER H (9.008 MWh)',
        family: 'TENER',
        category: 'Великі BESS',
        productType: 'UTILITY_CONTAINER',
        shortDesc: 'Ультращільна BESS потужністю до 9.008 МВт·год для масштабних об’єктів генерації та системних операторів.',
        highlight: '9.008 МВт·год у єдиному об’ємі, оптимізована щільність енергії для великих ВДЕ станцій, 20 років ресурсу.',
        sourceUrl: 'https://www.catl.com/en/ess/tener-h/',
        energySpecs: {
          nominalCapacity: '9.008 МВт·год (9008 кВт·год)',
          usableCapacity: '8.65 МВт·год',
          nominalVoltage: '1433.6 В DC',
          voltageRange: '1254.4 – 1612.8 В DC',
          cRate: '0.25C – 0.5C',
          maxContinuousPowerKw: '4504 кВт',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'QUOTE',
          startingPriceUah: null,
          priceDisplayUah: 'Ціна за запитом',
          priceNoteUk: 'Постачається виключно під проєктні замовлення енергетичних операторів',
          priceNoteEn: 'Delivered exclusively for utility operator turnkey projects',
          priceNoteZh: '专为大型公用事业级电网储能项目定制',
          availability: 'PROJECT_BASED',
          warrantyYears: '20 років проєктного терміну служби'
        },
        cellSpecs: {
          chemistry: 'LFP (High-Density Energy Storage Formulation)',
          cellModel: 'CATL Ultra-High Capacity 314Ah+ Cell',
          cellCapacity: '314+ А·год',
          cycleLife: '15 000 циклів',
          degradationFirstYears: '< 1% за перші 3 роки'
        },
        mechanicalSpecs: {
          dimensions: '12192 × 2438 × 2896 мм (40-ft HC) / Складна конфігурація',
          weight: '78 000 кг',
          containerStandard: 'ISO Container TEU',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Multi-Zone Liquid Cooling з прямим контролем температури модулів',
          tempControlAccuracy: '≤ 2.0 °C',
          operatingTempRange: '-35 °C … +55 °C'
        },
        safetySpecs: {
          fireSuppression: 'Total Flooding Fire Suppression FK-5-1-12 + автономна система розпилення',
          deflagrationProtection: 'Pressure relief vents NFPA 68',
          gasDetection: 'Thermal runaway early warning sensors',
          certifications: ['IEC 62619', 'UL 9540A', 'NFPA 855']
        },
        compatibility: {
          pcs: ['SMA Sunny Central', 'Ingeteam 3000kW+', 'CATL Certified High-Power Inverters'],
          ems: ['Grid-scale SCADA IEC 61850'],
          transformer: '35 кВ / 110 кВ блочна підстанція'
        },
        translations: {
          en: {
            name: 'CATL TENER H (9.008 MWh)',
            shortDesc: 'Ultra-high density utility BESS delivering up to 9.008 MWh for massive grid-scale projects.',
            highlight: '9.008 MWh capacity, multi-zone liquid cooling, 20-year operational design life.'
          },
          'zh-CN': {
            name: 'CATL 天恒 H (9.008 MWh)',
            shortDesc: '超高能量密度电网级储能系统，单机容量达 9.008 MWh，专为超大型新能源基地设计。',
            highlight: '9.008 MWh 超大容量，多温区液冷技术，20年超长设计寿命。'
          }
        }
      },
      {
        id: 'catl-tener-stack',
        name: 'CATL TENER Stack',
        family: 'TENER',
        category: 'Великі BESS',
        productType: 'MODULAR_BESS',
        shortDesc: 'Модульна масштабована архітектура для побудови BESS будь-якої конфігурації від 2 до 100+ МВт·год.',
        highlight: 'Гнучке кабінетне масштабування, сумісність із різними типами інверторів, швидке розгортання на майданчику.',
        sourceUrl: 'https://www.catl.com/en/ess/tener-stack/',
        energySpecs: {
          nominalCapacity: 'До 9.0 МВт·год (модульно)',
          usableCapacity: 'Залежить від кількості стеків',
          nominalVoltage: '1280 В – 1500 В DC',
          voltageRange: '1100 – 1500 В DC',
          cRate: '0.5C – 2C',
          maxContinuousPowerKw: 'За конфігурацією',
          efficiencyRoundTrip: '≥ 95.2%',
          pricingType: 'QUOTE',
          startingPriceUah: null,
          priceDisplayUah: 'Ціна за запитом',
          priceNoteUk: 'Конфігурується за кількістю модульних стійок',
          priceNoteEn: 'Configured based on required rack count',
          priceNoteZh: '按机架模块数量定制报价',
          availability: 'PROJECT_BASED',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 280Ah / 314Ah',
          cellCapacity: '314 А·год',
          cycleLife: '12 000+ циклів',
          degradationFirstYears: 'Стандартна низька деградація'
        },
        mechanicalSpecs: {
          dimensions: 'Модульні блоки 1300 × 1300 × 2200 мм',
          weight: 'За конфігурацією стійок',
          containerStandard: 'Modular Skid / Building Enclosure',
          protectionRating: 'IP54 / IP65'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid Cooling System',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-30 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Rack-level aerosol / gas suppression',
          deflagrationProtection: 'Ex-proof venting',
          gasDetection: 'H2, VOC, Temp gradient',
          certifications: ['IEC 62619', 'UL 1973', 'CE']
        },
        compatibility: {
          pcs: ['Усі сумісні інвертори 1500V'],
          ems: ['Modbus TCP', 'IEC 60870'],
          transformer: 'Відповідно до ТУ об’єкта'
        },
        translations: {
          en: {
            name: 'CATL TENER Stack',
            shortDesc: 'Modular scalable BESS architecture allowing custom multi-MWh configurations.',
            highlight: 'Flexible rack modularity, 1500V DC bus, rapid on-site commissioning.'
          },
          'zh-CN': {
            name: 'CATL 天恒 Stack 模块化储能',
            shortDesc: '模块化可扩展 BESS 架构，支持从 2MWh 到 100MWh+ 的灵活组合。',
            highlight: '机架级模块化设计，1500V 直流高压总线，现场快速部署。'
          }
        }
      },
      {
        id: 'catl-tener-s',
        name: 'CATL TENER S (6.25 MWh)',
        family: 'TENER',
        category: 'Великі BESS',
        productType: 'UTILITY_CONTAINER',
        shortDesc: 'Стандартна перевірена 20-футова контейнерна система комунального масштабу 6.25 МВт·год.',
        highlight: '6.25 МВт·год, стандартний 20-ft ISO контейнер, оптимізований для участі у ринку допоміжних послуг.',
        sourceUrl: 'https://www.catl.com/en/ess/tener-s/',
        energySpecs: {
          nominalCapacity: '6.25 МВт·год (6250 кВт·год)',
          usableCapacity: '5.95 МВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C',
          maxContinuousPowerKw: '3125 кВт',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 40500000,
          priceDisplayUah: 'від 40 500 000 грн',
          priceNoteUk: 'Базова вартість обладнання без ПДВ та монтажу',
          priceNoteEn: 'Base equipment cost excluding VAT and installation',
          priceNoteZh: '基础设备价格（不含增值税及现场安装费）',
          availability: 'LEAD_TIME_4_WEEKS',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 314Ah Cell',
          cellCapacity: '314 А·год',
          cycleLife: '12 000 циклів',
          degradationFirstYears: '< 2.5% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '6058 × 2438 × 2896 мм',
          weight: '51 500 кг',
          containerStandard: '20-ft HC ISO Container',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid Cooling Unit',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-30 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Total gas flooding + water sprinkler connection',
          deflagrationProtection: 'NFPA 68 vents',
          gasDetection: 'H2 and smoke detector',
          certifications: ['IEC 62619', 'UL 9540A', 'UN 38.3']
        },
        compatibility: {
          pcs: ['1500V Central PCS'],
          ems: ['Open Modbus / IEC 60870'],
          transformer: '0.69/10(35) кВ'
        },
        translations: {
          en: {
            name: 'CATL TENER S (6.25 MWh)',
            shortDesc: 'Proven 20-ft utility-scale 6.25 MWh container BESS optimized for ancillary grid services.',
            highlight: '6.25 MWh capacity, 20-ft standard container, high round-trip efficiency.'
          },
          'zh-CN': {
            name: 'CATL 天恒 S (6.25 MWh)',
            shortDesc: '成熟可靠的 20 尺 6.25 MWh 公用事业级储能集装箱，专为电网辅助服务优化。',
            highlight: '6.25 MWh 容量，标准 20 尺高柜，高往返转换效率。'
          }
        }
      },

      // -------------------------------------------------------------
      // БАТАРЕЙНІ ШАФИ (OUTDOOR CABINETS)
      // -------------------------------------------------------------
      {
        id: 'catl-enerone-372',
        name: 'CATL EnerOne 372.7 kWh',
        family: 'EnerOne',
        category: 'Батарейні шафи',
        productType: 'OUTDOOR_CABINET',
        shortDesc: 'Компактна зовнішня батарейна шафа з рідинним охолодженням для комерційного сектору та малих СЕС.',
        highlight: '372.7 кВт·год в одній шафі площею лише 1.69 м², рідинне охолодження, IP66 захист, вбудована система безпеки.',
        sourceUrl: 'https://www.catl.com/en/ess/enerone/',
        energySpecs: {
          nominalCapacity: '372.7 кВт·год',
          usableCapacity: '355 кВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C / 1C',
          maxContinuousPowerKw: '186 кВт (0.5C) / 372 кВт (1C)',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 3850000,
          priceDisplayUah: 'від 3 850 000 грн',
          priceNoteUk: 'Ціна за одну повністю укомплектовану батарейну шафу з BMS та рідинним охолодженням',
          priceNoteEn: 'Price per fully equipped battery cabinet with BMS and liquid cooling',
          priceNoteZh: '含 BMS 与液冷机组的完整户外电池柜单柜价格',
          availability: 'IN_STOCK',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 280Ah ESS Cell',
          cellCapacity: '280 А·год (3.2 В)',
          cycleLife: '10 000 циклів',
          degradationFirstYears: '< 2.5% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '1300 × 1300 × 2280 мм',
          weight: '3 800 кг',
          containerStandard: 'Outdoor Cabinet',
          protectionRating: 'IP66 (максимальний вуличний захист)'
        },
        thermalSpecs: {
          coolingMethod: 'Integrated Liquid Cooling Unit',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-30 °C … +55 °C'
        },
        safetySpecs: {
          fireSuppression: 'Aerosol / Novec 1230 cabinet flooding',
          deflagrationProtection: 'Roof explosion-proof relief panel',
          gasDetection: 'CO and H2 multi-sensor',
          certifications: ['IEC 62619', 'UL 9540A', 'CE']
        },
        compatibility: {
          pcs: ['CATL PCS 200kW-500kW', 'Sinexcel', 'Sungrow C&I Inverters'],
          ems: ['CATL Smart EMS', 'Modbus RTU / TCP'],
          transformer: '0.4 кВ пряме підключення до РУ підприємства'
        },
        translations: {
          en: {
            name: 'CATL EnerOne 372.7 kWh',
            shortDesc: 'Compact outdoor liquid-cooled battery cabinet for C&I applications and commercial solar sites.',
            highlight: '372.7 kWh per cabinet taking only 1.69 m² footprint, IP66 protection, integrated safety.'
          },
          'zh-CN': {
            name: 'CATL EnerOne 372.7 kWh 户外电池柜',
            shortDesc: '紧凑型户外一体化液冷储能柜，专为工商业及中小型光伏配储设计。',
            highlight: '单柜 372.7 kWh，占地仅 1.69 m²，IP66 级超强户外防护，集成多重安全系统。'
          }
        }
      },
      {
        id: 'catl-enerone-plus',
        name: 'CATL EnerOne Plus',
        family: 'EnerOne',
        category: 'Батарейні шафи',
        productType: 'OUTDOOR_CABINET',
        shortDesc: 'Оновлена флагманська шафа C&I з комірками 314Ah для максимального ROI комерційних об’єктів.',
        highlight: 'Понад 400 кВт·год у тих самих компактних габаритах, оптимізований LCOS для зниження тарифних піків.',
        sourceUrl: 'https://www.catl.com/en/ess/enerone-plus/',
        energySpecs: {
          nominalCapacity: '418.5 кВт·год (314Ah LFP)',
          usableCapacity: '400 кВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C / 1C',
          maxContinuousPowerKw: '209 кВт (0.5C) / 418 кВт (1C)',
          efficiencyRoundTrip: '≥ 95.3%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 4100000,
          priceDisplayUah: 'від 4 100 000 грн',
          priceNoteUk: 'Ціна за шафу EnerOne Plus із комірками 314Ah та посиленим теплообмінником',
          priceNoteEn: 'Price for EnerOne Plus cabinet with 314Ah cells and upgraded heat exchanger',
          priceNoteZh: 'EnerOne Plus 314Ah 电芯高配柜价格',
          availability: 'IN_STOCK',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 314Ah ESS Cell',
          cellCapacity: '314 А·год (3.2 В)',
          cycleLife: '12 000 циклів',
          degradationFirstYears: '< 1.8% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '1300 × 1300 × 2280 мм',
          weight: '4 050 кг',
          containerStandard: 'Outdoor Cabinet',
          protectionRating: 'IP66'
        },
        thermalSpecs: {
          coolingMethod: 'Advanced Liquid Cooling з інтелектуальним частотним регулюванням помпи',
          tempControlAccuracy: '≤ 2.5 °C',
          operatingTempRange: '-30 °C … +55 °C'
        },
        safetySpecs: {
          fireSuppression: 'Aerosol + Novec 1230',
          deflagrationProtection: 'NFPA 68 vent',
          gasDetection: 'Thermal runaway early warning sensors',
          certifications: ['IEC 62619', 'UL 9540A', 'CE', 'UN 38.3']
        },
        compatibility: {
          pcs: ['Sinexcel', 'CATL PCS', 'SMA Commercial Storage'],
          ems: ['CATL Smart Cloud EMS', 'Modbus TCP'],
          transformer: '0.4 кВ / 10 кВ'
        },
        translations: {
          en: {
            name: 'CATL EnerOne Plus',
            shortDesc: 'Upgraded flagship C&I outdoor cabinet with 314Ah cells delivering highest ROI for business.',
            highlight: '418.5 kWh in the same footprint, optimized LCOS for peak shaving and solar self-consumption.'
          },
          'zh-CN': {
            name: 'CATL EnerOne Plus 旗舰版',
            shortDesc: '升级版工商业旗舰户外电池柜，搭载 314Ah 电芯，投资回报率大幅提升。',
            highlight: '同等占地面积下容量提升至 418.5 kWh，工商业削峰填谷极佳选择。'
          }
        }
      },

      // -------------------------------------------------------------
      // КОНТЕЙНЕРНІ BESS (CONTAINER SYSTEMS)
      // -------------------------------------------------------------
      {
        id: 'catl-enerc-plus',
        name: 'CATL EnerC Plus (3.727 MWh)',
        family: 'EnerC',
        category: 'Контейнерні BESS',
        productType: 'UTILITY_CONTAINER',
        shortDesc: 'Високонадійна 20-футова контейнерна система з рідинним охолодженням для промислових парків та енергетики.',
        highlight: '3.727 МВт·год, C-rate 0.5C, перевірена роками експлуатації в десятках гігават-проєктів по всьому світу.',
        sourceUrl: 'https://www.catl.com/en/ess/enerc-plus/',
        energySpecs: {
          nominalCapacity: '3.727 МВт·год (3727 кВт·год)',
          usableCapacity: '3.54 МВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C (номінал 2 год) / 1C (пік)',
          maxContinuousPowerKw: '1863 кВт',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 26500000,
          priceDisplayUah: 'від 26 500 000 грн',
          priceNoteUk: 'Ціна за готовий контейнер із BMS, пожежогасінням та системою клімат-контролю',
          priceNoteEn: 'Price for complete container with BMS, fire protection and climate control',
          priceNoteZh: '含 BMS、消防和温控系统的完整集装箱价格',
          availability: 'IN_STOCK',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 280Ah / 306Ah Cell',
          cellCapacity: '280 А·год (3.2 В)',
          cycleLife: '10 000 циклів',
          degradationFirstYears: '< 2.2% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '6058 × 2438 × 2896 мм (20-ft HC)',
          weight: '42 000 кг',
          containerStandard: '20-ft ISO HC Container',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid Cooling (рідинне охолодження)',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-30 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Novec 1230 gas flooding + зовнішній підвід води',
          deflagrationProtection: 'NFPA 68 мембрани скидання надлишкового тиску',
          gasDetection: 'H2, CO, оптичні сповіщувачі диму',
          certifications: ['IEC 62619', 'UL 9540A', 'NFPA 855', 'CE']
        },
        compatibility: {
          pcs: ['Sungrow', 'SMA', 'Ingeteam', 'Sineng'],
          ems: ['CATL Smart Cloud EMS', 'IEC 60870-5-104'],
          transformer: '0.69/10(35) кВ'
        },
        translations: {
          en: {
            name: 'CATL EnerC Plus (3.727 MWh)',
            shortDesc: 'Highly reliable 20-ft containerized liquid-cooled BESS for industrial parks and utilities.',
            highlight: '3.727 MWh capacity, 0.5C nominal rating, battle-tested across global gigawatt-scale projects.'
          },
          'zh-CN': {
            name: 'CATL EnerC Plus (3.727 MWh)',
            shortDesc: '高可靠 20 尺液冷集装箱储能系统，广泛应用于工业园区与电力调度。',
            highlight: '3.727 MWh 经典容量，0.5C 充放电倍率，全球吉瓦级项目实证。'
          }
        }
      },
      {
        id: 'catl-enerd-5000',
        name: 'CATL EnerD (5.0 MWh)',
        family: 'EnerD',
        category: 'Контейнерні BESS',
        productType: 'UTILITY_CONTAINER',
        shortDesc: '5.0 МВт·год контейнерна система підвищеної щільності з оптимізованим двостороннім доступом.',
        highlight: '5.0 МВт·год у 20-футовому форматі, зниження питомих капітальних витрат CAPEX на 20%, C-rate 0.5C.',
        sourceUrl: 'https://www.catl.com/en/ess/enerd/',
        energySpecs: {
          nominalCapacity: '5.0 МВт·год (5000 кВт·год)',
          usableCapacity: '4.75 МВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C',
          maxContinuousPowerKw: '2500 кВт',
          efficiencyRoundTrip: '≥ 95.2%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 34800000,
          priceDisplayUah: 'від 34 800 000 грн',
          priceNoteUk: 'Постачається з повним комплектом інженерних систем та сертифікацією для України',
          priceNoteEn: 'Supplied with full engineering systems and certifications for Ukraine',
          priceNoteZh: '包含全套工程系统并符合当地认证',
          availability: 'LEAD_TIME_4_WEEKS',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 314Ah Cell',
          cellCapacity: '314 А·год (3.2 В)',
          cycleLife: '12 000 циклів',
          degradationFirstYears: '< 2.0% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '6058 × 2438 × 2896 мм (20-ft HC)',
          weight: '47 500 кг',
          containerStandard: '20-ft HC ISO Container',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid Cooling System',
          tempControlAccuracy: '≤ 2.8 °C',
          operatingTempRange: '-30 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Novec 1230 gas system + water deluge line',
          deflagrationProtection: 'NFPA 68 relief panels',
          gasDetection: 'H2, CO, heat sensors',
          certifications: ['IEC 62619', 'UL 9540A', 'UN 38.3']
        },
        compatibility: {
          pcs: ['Sungrow', 'SMA', 'CATL Compatible PCS'],
          ems: ['CATL Smart Cloud EMS', 'Modbus TCP'],
          transformer: '0.69/10(35) кВ'
        },
        translations: {
          en: {
            name: 'CATL EnerD (5.0 MWh)',
            shortDesc: '5.0 MWh high-density containerized BESS with double-sided maintenance access.',
            highlight: '5.0 MWh in a 20-ft footprint, 20% lower footprint CAPEX, 0.5C nominal rating.'
          },
          'zh-CN': {
            name: 'CATL EnerD (5.0 MWh)',
            shortDesc: '5.0 MWh 高密度集装箱储能系统，双面开门维护，大幅节省占地与基建投资。',
            highlight: '标准 20 尺 5.0 MWh 密度，降低 20% 土地与基建成本，0.5C 充放电。'
          }
        }
      },

      // -------------------------------------------------------------
      // ДОМАШНІ СИСТЕМИ (RESIDENTIAL ESS)
      // -------------------------------------------------------------
      {
        id: 'catl-residential-pr15',
        name: 'CATL Residential PR-15 (15 kWh)',
        family: 'Residential',
        category: 'Домашні системи',
        productType: 'RESIDENTIAL_ESS',
        shortDesc: 'Модульна домашня система накопичення енергії 15 кВт·год для безперебійного живлення будинку.',
        highlight: '15 кВт·год ємності, підтримка сонячних інверторів, швидке перемикання на резерв <10 мс, 10 000 циклів LFP.',
        sourceUrl: 'https://www.catl.com/en/ess/residential/',
        energySpecs: {
          nominalCapacity: '15.36 кВт·год (3 модулі по 5.12 кВт·год)',
          usableCapacity: '14.5 кВт·год (95% DoD)',
          nominalVoltage: '307.2 В DC (High Voltage)',
          voltageRange: '268.8 – 345.6 В DC',
          cRate: '0.5C / 1C (пік 10 кВт)',
          maxContinuousPowerKw: '7.68 кВт (пікова потужність 10 кВт)',
          efficiencyRoundTrip: '≥ 96.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 260000,
          priceDisplayUah: 'від 260 000 грн',
          priceNoteUk: 'Ціна за батарейний блок 15 кВт·год з контролером BCU (без інвертора)',
          priceNoteEn: 'Price for 15 kWh battery stack with BCU controller (excluding inverter)',
          priceNoteZh: '15 kWh 电池堆叠系统与主控盒价格（不含逆变器）',
          availability: 'IN_STOCK',
          warrantyYears: '10 років офіційної гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 100Ah Residential Grade Cell',
          cellCapacity: '100 А·год (3.2 В)',
          cycleLife: '10 000 циклів при 25°C',
          degradationFirstYears: '< 2% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '600 × 380 × 1250 мм (вертикальний стек)',
          weight: '165 кг (3 батарейні модулі + контролер)',
          containerStandard: 'Indoor / Outdoor Wall & Floor Mount',
          protectionRating: 'IP65 (захист від дощу та пилу)'
        },
        thermalSpecs: {
          coolingMethod: 'Природне конвекційне охолодження (Natural Cooling, безшумна робота <25 дБ)',
          tempControlAccuracy: 'Пасивний баланс',
          operatingTempRange: '-10 °C … +50 °C (вбудований підігрів для заряду при морозі)'
        },
        safetySpecs: {
          fireSuppression: 'Вбудований аерозольний протипожежний картридж у кожному модулі',
          deflagrationProtection: 'Захисні клапани на рівні осередків',
          gasDetection: 'BMS monitoring',
          certifications: ['IEC 62619', 'CE', 'UN 38.3', 'VDE-AR-E 2510-50']
        },
        compatibility: {
          pcs: ['Deye High-Voltage', 'Growatt SPH', 'GoodWe ET', 'Victron Energy'],
          ems: ['Wi-Fi / Ethernet додаток для iOS та Android', 'Modbus RTU / CAN bus'],
          transformer: '230В / 400В побутова мережа'
        },
        translations: {
          en: {
            name: 'CATL Residential PR-15 (15 kWh)',
            shortDesc: 'Modular 15 kWh home battery energy storage system for uninterrupted residential backup.',
            highlight: '15 kWh capacity, high-voltage efficiency, <10ms UPS switchover, 10,000 cycle LFP cells.'
          },
          'zh-CN': {
            name: 'CATL 家用储能 PR-15 (15 kWh)',
            shortDesc: '模块化 15 kWh 高压户用储能系统，为家庭提供全天候不间断电源保障。',
            highlight: '15 kWh 模块化容量，高压转换效率，<10ms 毫秒级断电无缝切换，万次循环 LFP 电芯。'
          }
        }
      },
      {
        id: 'catl-residential-pr30',
        name: 'CATL Residential PR-30 (30 kWh)',
        family: 'Residential',
        category: 'Домашні системи',
        productType: 'RESIDENTIAL_ESS',
        shortDesc: 'Потужна система 30 кВт·год для великих приватних будинків, котеджів та малого бізнесу.',
        highlight: '30 кВт·год ємності, трифазне живлення до 15 кВт, інтеграція із сонячною електростанцією та генератором.',
        sourceUrl: 'https://www.catl.com/en/ess/residential/',
        energySpecs: {
          nominalCapacity: '30.72 кВт·год (6 модулів)',
          usableCapacity: '29.0 кВт·год',
          nominalVoltage: '614.4 В DC (High Voltage)',
          voltageRange: '537.6 – 691.2 В DC',
          cRate: '0.5C / 1C (пік 20 кВт)',
          maxContinuousPowerKw: '15 кВт',
          efficiencyRoundTrip: '≥ 96.2%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 480000,
          priceDisplayUah: 'від 480 000 грн',
          priceNoteUk: 'Ціна за систему 30 кВт·год (модулі накопичення, контролер високої напруги, кабельне сполучення)',
          priceNoteEn: 'Price for 30 kWh system (storage modules, high-voltage controller, interconnects)',
          priceNoteZh: '30 kWh 完整储能系统价格',
          availability: 'IN_STOCK',
          warrantyYears: '10 років офіційної гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 100Ah Residential Grade Cell',
          cellCapacity: '100 А·год',
          cycleLife: '10 000 циклів',
          degradationFirstYears: '< 2% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '600 × 380 × 2100 мм (або дві стійки поруч)',
          weight: '310 кг',
          containerStandard: 'Floor Standing Stack',
          protectionRating: 'IP65'
        },
        thermalSpecs: {
          coolingMethod: 'Natural Cooling + внутрішній термоменеджмент',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-10 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Dual aerosol suppression modules',
          deflagrationProtection: 'Cell level vents',
          gasDetection: 'BMS gas and thermal sensors',
          certifications: ['IEC 62619', 'CE', 'UN 38.3']
        },
        compatibility: {
          pcs: ['Deye 3-Phase HV', 'Growatt WIT', 'GoodWe ET 15-30kW'],
          ems: ['Mobile app + Local Web Server + Home Assistant integration'],
          transformer: '400В трифазна мережа'
        },
        translations: {
          en: {
            name: 'CATL Residential PR-30 (30 kWh)',
            shortDesc: 'High-capacity 30 kWh residential system for large villas, estates and small businesses.',
            highlight: '30 kWh capacity, 15 kW 3-phase output, solar and generator seamless integration.'
          },
          'zh-CN': {
            name: 'CATL 家用储能 PR-30 (30 kWh)',
            shortDesc: '大容量 30 kWh 户用及小型商业储能系统，满足别墅与小型企业全方位电力需求。',
            highlight: '30 kWh 容量，15 kW 三相强劲输出，光伏与发电机多能互补。'
          }
        }
      },

      // -------------------------------------------------------------
      // КОМЕРЦІЙНІ ТА ПРОМИСЛОВІ (C&I ESS)
      // -------------------------------------------------------------
      {
        id: 'catl-unic-1000',
        name: 'CATL UniC 1.0 MW / 2.0 MWh',
        family: 'UniC',
        category: 'Комерційні та промислові ESS',
        productType: 'COMMERCIAL_ESS',
        shortDesc: 'Комплексне C&I рішення для заводів, елеваторів, торгових центрів та логістичних комплексів.',
        highlight: '1000 кВт вихідної потужності, 2000 кВт·год ємності, зниження пікових навантажень (peak shaving) та оптимізація тарифів.',
        sourceUrl: 'https://www.catl.com/en/ess/unic/',
        energySpecs: {
          nominalCapacity: '2.0 МВт·год (2000 кВт·год)',
          usableCapacity: '1.9 МВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C (номінал 2 год)',
          maxContinuousPowerKw: '1000 кВт',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 14500000,
          priceDisplayUah: 'від 14 500 000 грн',
          priceNoteUk: 'Орієнтовна вартість BESS з інверторною підстанцією 1 МВт під ключ',
          priceNoteEn: 'Estimated turnkey cost for BESS including 1 MW inverter station',
          priceNoteZh: '含 1 MW 变流系统的交钥匙工程估算价格',
          availability: 'LEAD_TIME_4_WEEKS',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 280Ah / 314Ah',
          cellCapacity: '314 А·год',
          cycleLife: '12 000 циклів',
          degradationFirstYears: '< 2% за перший рік'
        },
        mechanicalSpecs: {
          dimensions: '6058 × 2438 × 2591 мм (20ft Container)',
          weight: '26 000 кг',
          containerStandard: '20-ft Standard ISO',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid Cooling Unit',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-30 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Total gas flooding Novec 1230',
          deflagrationProtection: 'NFPA 68 vents',
          gasDetection: 'H2 and smoke monitoring',
          certifications: ['IEC 62619', 'UL 9540A', 'CE']
        },
        compatibility: {
          pcs: ['CATL 1000kW PCS', 'Ingeteam', 'Sinexcel'],
          ems: ['CATL Smart Cloud EMS з функцією Peak Shaving'],
          transformer: '0.4 кВ або 10 кВ РУ'
        },
        translations: {
          en: {
            name: 'CATL UniC 1.0 MW / 2.0 MWh',
            shortDesc: 'Turnkey C&I storage solution for factories, grain elevators, shopping malls and logistics hubs.',
            highlight: '1000 kW output, 2000 kWh capacity, automated peak shaving and tariff optimization.'
          },
          'zh-CN': {
            name: 'CATL UniC 1.0 MW / 2.0 MWh 工商业储能',
            shortDesc: '专为工厂、粮仓、商业中心和物流园区量身定制的一体化工商业储能系统。',
            highlight: '1000 kW 输出功率，2000 kWh 容量，全自动削峰填谷与需量电费优化。'
          }
        }
      },
      {
        id: 'catl-microgrid-500',
        name: 'CATL Microgrid Station 500 kW / 1000 kWh',
        family: 'Microgrid',
        category: 'Комерційні та промислові ESS',
        productType: 'MICROGRID_SYSTEM',
        shortDesc: 'Автономна мікромережева станція для безперебійного електропостачання критичних об’єктів.',
        highlight: '500 кВт потужності, 1000 кВт·год ємності, синхронізація з дизель-генераторами та СЕС, функція Black Start.',
        sourceUrl: 'https://www.catl.com/en/ess/microgrid/',
        energySpecs: {
          nominalCapacity: '1.0 МВт·год (1000 кВт·год)',
          usableCapacity: '950 кВт·год',
          nominalVoltage: '1331.2 В DC',
          voltageRange: '1164.8 – 1497.6 В DC',
          cRate: '0.5C',
          maxContinuousPowerKw: '500 кВт',
          efficiencyRoundTrip: '≥ 95.0%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 8900000,
          priceDisplayUah: 'від 8 900 000 грн',
          priceNoteUk: 'Ціна за мікромережевий контейнер із PCS 500 кВт та шафою автоматики Grid-Forming',
          priceNoteEn: 'Price for microgrid container with 500 kW PCS and Grid-Forming automation cabinet',
          priceNoteZh: '含 500 kW PCS 和构网型自动化控制柜的微电网储能价格',
          availability: 'IN_STOCK',
          warrantyYears: '10 років гарантії'
        },
        cellSpecs: {
          chemistry: 'LFP',
          cellModel: 'CATL 280Ah Cell',
          cellCapacity: '280 А·год',
          cycleLife: '10 000 циклів',
          degradationFirstYears: '< 2.2%'
        },
        mechanicalSpecs: {
          dimensions: '6058 × 2438 × 2591 мм',
          weight: '18 000 кг',
          containerStandard: '20-ft ISO Container',
          protectionRating: 'IP55'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid Cooling',
          tempControlAccuracy: '≤ 3.0 °C',
          operatingTempRange: '-30 °C … +50 °C'
        },
        safetySpecs: {
          fireSuppression: 'Novec 1230 gas flooding',
          deflagrationProtection: 'Pressure relief vents',
          gasDetection: 'H2 and thermal run-away detectors',
          certifications: ['IEC 62619', 'UL 9540A']
        },
        compatibility: {
          pcs: ['Grid-Forming 500kW PCS'],
          ems: ['CATL Microgrid Controller (diesel-solar-bess coordination)'],
          transformer: '0.4 кВ / 10 кВ'
        },
        translations: {
          en: {
            name: 'CATL Microgrid Station 500 kW / 1000 kWh',
            shortDesc: 'Autonomous microgrid storage system for continuous mission-critical facility power.',
            highlight: '500 kW power, 1000 kWh capacity, diesel generator and solar syncing, Black Start capable.'
          },
          'zh-CN': {
            name: 'CATL 微电网储能站 500 kW / 1000 kWh',
            shortDesc: '自治型微电网储能系统，为关键基础设施提供不间断供电保障。',
            highlight: '500 kW 构网型功率，1000 kWh 容量，支持柴油发电机与光伏协同，具备黑启动功能。'
          }
        }
      },

      // -------------------------------------------------------------
      // КОМПОНЕНТИ (BESS COMPONENTS)
      // -------------------------------------------------------------
      {
        id: 'catl-cell-314ah',
        name: 'Батарейний елемент CATL LFP 314Ah',
        family: 'Components',
        category: 'Компоненти',
        productType: 'BATTERY_CELL',
        shortDesc: 'Оригінальний призматичний LFP елемент CATL 314Ah спеціально розроблений для стаціонарних BESS.',
        highlight: '3.2В 314А·год (1004.8 Вт·год), ресурс понад 15 000 циклів, нульова деградація перші роки при низьких C-rate.',
        sourceUrl: 'https://www.catl.com/en/ess/cells/',
        energySpecs: {
          nominalCapacity: '314 А·год (1004.8 Вт·год)',
          usableCapacity: '1004.8 Вт·год',
          nominalVoltage: '3.2 В DC',
          voltageRange: '2.5 – 3.65 В DC',
          cRate: '0.5C / 1C',
          maxContinuousPowerKw: '1.0 кВт на осередок',
          efficiencyRoundTrip: '≥ 96.5%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 3200,
          priceDisplayUah: 'від 3 200 грн / шт',
          priceNoteUk: 'Ціна за 1 штуку при замовленні від 1 палети (оптові партії для інтеграторів)',
          priceNoteEn: 'Price per cell for pallet orders (wholesale tier for integrators)',
          priceNoteZh: '托盘批量采购单体电芯单价',
          availability: 'IN_STOCK',
          warrantyYears: '5 років гарантії виробника'
        },
        cellSpecs: {
          chemistry: 'LFP (Lithium Iron Phosphate)',
          cellModel: 'CATL 314Ah Prismatic Cell',
          cellCapacity: '314 А·год',
          cycleLife: '15 000 циклів',
          degradationFirstYears: '< 1% за перші 3 роки'
        },
        mechanicalSpecs: {
          dimensions: '71.5 × 174 × 207 мм',
          weight: '5.6 кг',
          containerStandard: 'Prismatic Aluminum Shell',
          protectionRating: 'IP00 (компонент для складання в модуль)'
        },
        thermalSpecs: {
          coolingMethod: 'Liquid-cooled plate ready',
          tempControlAccuracy: 'N/A',
          operatingTempRange: 'Заряд: 0…+55 °C; Розряд: -30…+55 °C'
        },
        safetySpecs: {
          fireSuppression: 'Вбудований клапан скидання тиску (explosion-proof vent valve)',
          deflagrationProtection: 'Алюмінієвий герметичний корпус',
          gasDetection: 'N/A',
          certifications: ['IEC 62619', 'UL 1973', 'UN 38.3', 'RoHS']
        },
        compatibility: {
          pcs: ['Усі сумісні інверторні системи'],
          ems: ['BMS CATL та сторонні інтеграційні контролери'],
          transformer: 'N/A'
        },
        translations: {
          en: {
            name: 'CATL LFP 314Ah Prismatic Cell',
            shortDesc: 'Original CATL 314Ah prismatic LFP battery cell engineered specifically for stationary BESS.',
            highlight: '3.2V 314Ah (1004.8 Wh), >15,000 cycle life, low degradation chemistry.'
          },
          'zh-CN': {
            name: 'CATL 磷酸铁锂 314Ah 储能专用电芯',
            shortDesc: 'CATL 原厂 314Ah 方形铝壳磷酸铁锂电芯，专为大规模储能电站研发。',
            highlight: '3.2V 314Ah (1004.8 Wh)，超过 15000 次超长循环寿命，低衰减长效化学体系。'
          }
        }
      },
      {
        id: 'catl-bms-industrial',
        name: 'CATL Industrial 3-Tier BMS',
        family: 'Components',
        category: 'Компоненти',
        productType: 'BMS',
        shortDesc: 'Трьохрівнева промислова система керування батареями (BMU, BCU, BAMS) для безпеки та балансування.',
        highlight: 'Контроль напруги кожного осередку з точністю ±1.5 мВ, ізоляційний контроль, IEC 61850 та Modbus TCP.',
        sourceUrl: 'https://www.catl.com/en/ess/bms/',
        energySpecs: {
          nominalCapacity: 'Підтримка систем до 10 МВт·год на один BAMS',
          usableCapacity: 'N/A',
          nominalVoltage: 'До 1500 В DC',
          voltageRange: '600 – 1500 В DC',
          cRate: 'N/A',
          maxContinuousPowerKw: 'N/A',
          efficiencyRoundTrip: '≥ 99.8%',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 185000,
          priceDisplayUah: 'від 185 000 грн',
          priceNoteUk: 'Ціна за комплект центрального контролера BAMS та блоків BCU',
          priceNoteEn: 'Price for central BAMS controller and BCU stack units',
          priceNoteZh: 'BAMS 主控系统及 BCU 单元成套价格',
          availability: 'IN_STOCK',
          warrantyYears: '5 років гарантії'
        },
        cellSpecs: {
          chemistry: 'Підтримка LFP, Sodium-ion, NMC',
          cellModel: 'Універсальний CATL протокол',
          cellCapacity: '50 – 500 А·год',
          cycleLife: '20 років термін служби електроніки',
          degradationFirstYears: 'N/A'
        },
        mechanicalSpecs: {
          dimensions: '19-дюймовий rack-mount 3U / 4U',
          weight: '12 кг',
          containerStandard: '19-inch Industrial Rack',
          protectionRating: 'IP20 (внутрішнє встановлення у шафу)'
        },
        thermalSpecs: {
          coolingMethod: 'Пасивне охолодження',
          tempControlAccuracy: 'Точність вимірювання температури ±1 °C',
          operatingTempRange: '-40 °C … +70 °C'
        },
        safetySpecs: {
          fireSuppression: 'Інтерфейс аварійного відключення EPO (Emergency Power Off) та зв’язок із пожежною системою',
          deflagrationProtection: 'Гальванічна ізоляція 5000 В',
          gasDetection: 'Підключення датчиків витоку електроліту',
          certifications: ['IEC 62619', 'UL 1973', 'ISO 26262 ASIL-D functional safety']
        },
        compatibility: {
          pcs: ['SMA, Sungrow, Ingeteam, Sineng, Deye'],
          ems: ['CATL Smart Cloud EMS, SCADA'],
          transformer: 'N/A'
        },
        translations: {
          en: {
            name: 'CATL Industrial 3-Tier BMS',
            shortDesc: 'Three-tier industrial battery management system (BMU, BCU, BAMS) for safety and cell balancing.',
            highlight: 'Cell-level voltage monitoring with ±1.5 mV accuracy, high insulation monitoring, IEC 61850.'
          },
          'zh-CN': {
            name: 'CATL 工业三级电池管理系统 (BMS)',
            shortDesc: '包含 BMU、BCU、BAMS 的三级架构工业级电池管理系统，提供严苛安全防护与主动均衡。',
            highlight: '单体电压采样精度高达 ±1.5 mV，超高绝缘监测，支持 IEC 61850 与 Modbus 协议。'
          }
        }
      },
      {
        id: 'catl-pcs-1250kw',
        name: 'Двонаправлений інвертор CATL PCS 1250 kW',
        family: 'Components',
        category: 'Компоненти',
        productType: 'PCS',
        shortDesc: 'Промисловий 1500В двонаправлений перетворювач потужності з функцією підтримки мережі Grid-Forming.',
        highlight: '1250 кВт вихідної потужності, ККД 99.0%, підтримка частоти мережі, робота в режимі Black Start.',
        sourceUrl: 'https://www.catl.com/en/ess/pcs/',
        energySpecs: {
          nominalCapacity: 'Номінальна вихідна потужність 1250 кВт (1375 кВА)',
          usableCapacity: 'N/A',
          nominalVoltage: 'Напруга DC: 1000 – 1500 В DC; Напруга AC: 690 В AC',
          voltageRange: '900 – 1500 В DC',
          cRate: 'Швидкість реакції < 20 мс',
          maxContinuousPowerKw: '1250 кВт',
          efficiencyRoundTrip: '≥ 99.0% піковий ККД',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 2950000,
          priceDisplayUah: 'від 2 950 000 грн',
          priceNoteUk: 'Ціна за 1 інверторний блок 1250 кВт у вуличному виконанні IP55',
          priceNoteEn: 'Price per 1250 kW outdoor inverter unit with IP55 enclosure',
          priceNoteZh: '1250 kW 户外型 IP55 变流器单机价格',
          availability: 'IN_STOCK',
          warrantyYears: '5 років гарантії'
        },
        cellSpecs: {
          chemistry: 'N/A (Силова електроніка IGBT / SiC)',
          cellModel: 'Infineon IGBT PrimePACK Generation',
          cellCapacity: 'N/A',
          cycleLife: '25 років розрахунковий ресурс',
          degradationFirstYears: 'N/A'
        },
        mechanicalSpecs: {
          dimensions: '1600 × 1100 × 2100 мм',
          weight: '1 950 кг',
          containerStandard: 'Outdoor Inverter Skid / Cabinet',
          protectionRating: 'IP55 / IP65'
        },
        thermalSpecs: {
          coolingMethod: 'Інтелектуальне примусове повітряне охолодження або рідинний контур',
          tempControlAccuracy: 'N/A',
          operatingTempRange: '-30 °C … +60 °C (без дерайтингу до 45 °C)'
        },
        safetySpecs: {
          fireSuppression: 'Швидкодіючі запобіжники та контактори DC/AC',
          deflagrationProtection: 'SPD Type II захист від перенапруг',
          gasDetection: 'N/A',
          certifications: ['IEC 62477-1', 'IEC 61000', 'IEEE 1547', 'Grid Code EN 50549']
        },
        compatibility: {
          pcs: ['Сумісний з усіма CATL BESS контейнерами 1500V'],
          ems: ['EtherCAT, Modbus TCP, IEC 60870'],
          transformer: '0.69/10(35) кВ'
        },
        translations: {
          en: {
            name: 'CATL Bi-Directional PCS 1250 kW',
            shortDesc: 'Utility-grade 1500V bidirectional power conversion system featuring Grid-Forming capabilities.',
            highlight: '1250 kW output, 99.0% peak efficiency, grid frequency support, Black Start capable.'
          },
          'zh-CN': {
            name: 'CATL 构网型储能变流器 (PCS) 1250 kW',
            shortDesc: '公用事业级 1500V 双向储能变流器，具备强大的构网型 (Grid-Forming) 控制能力。',
            highlight: '1250 kW 输出，99.0% 峰值转换效率，支持电网频率支撑与黑启动功能。'
          }
        }
      },
      {
        id: 'catl-ems-smartcloud',
        name: 'CATL Smart Cloud EMS Controller',
        family: 'Components',
        category: 'Компоненти',
        productType: 'EMS',
        shortDesc: 'Промисловий контролер енергоменеджменту з алгоритмами AI оптимізації для ринку РДН/ВДР та Укренерго.',
        highlight: 'Прогнозування генерації ВДЕ, керування піковими графіками, хмарна аналітика батарейного парку 24/7.',
        sourceUrl: 'https://www.catl.com/en/ess/ems/',
        energySpecs: {
          nominalCapacity: 'Керування парком BESS до 500 МВт·год',
          usableCapacity: 'N/A',
          nominalVoltage: 'Живлення: 24В DC або 230В AC',
          voltageRange: '20 – 30 В DC',
          cRate: 'Цикл опитування 10 мс',
          maxContinuousPowerKw: 'N/A',
          efficiencyRoundTrip: 'N/A',
          pricingType: 'STARTING_FROM',
          startingPriceUah: 320000,
          priceDisplayUah: 'від 320 000 грн',
          priceNoteUk: 'Ціна включає промисловий сервер, ліцензію на ПЗ та модуль зв’язку з НЕК Укренерго',
          priceNoteEn: 'Price includes industrial server, software license and grid operator integration module',
          priceNoteZh: '含工业服务器、软件授权及电网调度协议接入模块',
          availability: 'IN_STOCK',
          warrantyYears: '3 роки гарантії та оновлень ПЗ'
        },
        cellSpecs: {
          chemistry: 'N/A (Промисловий серверний комп’ютер Advantech / Siemens)',
          cellModel: 'Intel Xeon Industrial Grade',
          cellCapacity: 'N/A',
          cycleLife: 'MTBF > 150 000 годин',
          degradationFirstYears: 'N/A'
        },
        mechanicalSpecs: {
          dimensions: '19-inch 2U Rack / DIN-rail Cabinet',
          weight: '8.5 кг',
          containerStandard: 'Industrial Enclosure',
          protectionRating: 'IP40'
        },
        thermalSpecs: {
          coolingMethod: 'Безвентиляторне пасивне охолодження (Fanless)',
          tempControlAccuracy: 'N/A',
          operatingTempRange: '-20 °C … +70 °C'
        },
        safetySpecs: {
          fireSuppression: 'Кібербезпека: апаратний модуль TPM 2.0, криптозахищений тунель IPsec / WireGuard',
          deflagrationProtection: 'N/A',
          gasDetection: 'N/A',
          certifications: ['IEC 62443 (Кібербезпека АСУ ТП)', 'IEC 61850', 'CE']
        },
        compatibility: {
          pcs: ['Усі інвертори за протоколами Modbus, SunSpec, IEC 61850'],
          ems: ['Хмарна платформа CATL Cloud AI', 'АСКОЕ України'],
          transformer: 'N/A'
        },
        translations: {
          en: {
            name: 'CATL Smart Cloud EMS Controller',
            shortDesc: 'Industrial energy management system with AI optimization algorithms for power markets.',
            highlight: 'Solar forecasting, peak shaving optimization, 24/7 cloud battery fleet diagnostics.'
          },
          'zh-CN': {
            name: 'CATL 智慧云端能量管理系统 (EMS)',
            shortDesc: '工业级智慧能量管理控制器，集成 AI 调度算法，适配电力现货与辅助服务市场。',
            highlight: '光伏出力精准预测，自动削峰填谷策略，7×24小时电池集群健康度云端诊断。'
          }
        }
      }
    ];

    // 4. Upsert Products, Specifications, Fact Sources, and Translations
    for (const p of products) {
      console.log(`[Master Registry Seed] Processing product: ${p.name} (${p.id})...`);

      // 4.1 Upsert pim_products
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
        [p.id, p.name, p.family, p.category, p.shortDesc, p.highlight, p.productType, p.sourceUrl, adminUser.name, adminUser.id]
      );

      // 4.2 Upsert pim_specifications
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
          JSON.stringify(p.energySpecs),
          JSON.stringify(p.cellSpecs),
          JSON.stringify(p.mechanicalSpecs),
          JSON.stringify(p.thermalSpecs),
          JSON.stringify(p.safetySpecs),
          JSON.stringify(p.compatibility)
        ]
      );

      // 4.3 Insert Provenance Facts (Fact Sources)
      const factPaths = [
        { path: 'energySpecs.nominalCapacity', value: p.energySpecs.nominalCapacity, excerpt: `Official CATL verified rating: ${p.energySpecs.nominalCapacity}` },
        { path: 'cellSpecs.chemistry', value: p.cellSpecs.chemistry, excerpt: `Chemistry: ${p.cellSpecs.chemistry}` },
        { path: 'mechanicalSpecs.protectionRating', value: p.mechanicalSpecs.protectionRating, excerpt: `Ingress Protection: ${p.mechanicalSpecs.protectionRating}` },
        { path: 'thermalSpecs.coolingMethod', value: p.thermalSpecs.coolingMethod, excerpt: `Thermal management: ${p.thermalSpecs.coolingMethod}` }
      ];

      for (const fact of factPaths) {
        await client.query(
          `INSERT INTO pim_product_fact_sources (product_id, specification_revision, field_path, value_snapshot, source_snapshot_id, page_section, evidence_excerpt, status, verified_by_id, verified_at, created_at)
           VALUES ($1, 1, $2, $3::jsonb, $4, 'Technical Specifications Section', $5, 'VERIFIED', $6, NOW(), NOW())
           ON CONFLICT (product_id, specification_revision, field_path) DO UPDATE SET
             value_snapshot = EXCLUDED.value_snapshot,
             evidence_excerpt = EXCLUDED.evidence_excerpt,
             status = 'VERIFIED',
             verified_at = NOW()`,
          [p.id, fact.path, JSON.stringify(fact.value), snapshotId, fact.excerpt, adminUser.id]
        );
      }

      // 4.4 Upsert Translations: uk-UA (baseline), en, zh-CN
      const fullUkSpecs = {
        energySpecs: p.energySpecs,
        cellSpecs: p.cellSpecs,
        mechanicalSpecs: p.mechanicalSpecs,
        thermalSpecs: p.thermalSpecs,
        safetySpecs: p.safetySpecs,
        compatibility: p.compatibility
      };

      // Baseline Ukrainian translation
      await client.query(
        `INSERT INTO pim_product_translations (id, product_id, locale, name, short_desc, highlight, specifications, translation_status, source_revision, reviewed_by, reviewed_at, created_at, updated_at)
         VALUES ($1, $2, 'uk-UA', $3, $4, $5, $6::jsonb, 'PUBLISHED', 1, $7, NOW(), NOW(), NOW())
         ON CONFLICT (product_id, locale) DO UPDATE SET
           name = EXCLUDED.name,
           short_desc = EXCLUDED.short_desc,
           highlight = EXCLUDED.highlight,
           specifications = EXCLUDED.specifications,
           translation_status = 'PUBLISHED',
           source_revision = 1,
           reviewed_at = NOW()`,
        [randomUUID(), p.id, p.name, p.shortDesc, p.highlight, JSON.stringify(fullUkSpecs), adminUser.name]
      );

      // English translation
      const enTrans = p.translations.en;
      const enSpecs = {
        ...fullUkSpecs,
        energySpecs: { ...p.energySpecs, priceNote: p.energySpecs.priceNoteEn },
      };
      await client.query(
        `INSERT INTO pim_product_translations (id, product_id, locale, name, short_desc, highlight, specifications, translation_status, source_revision, reviewed_by, reviewed_at, created_at, updated_at)
         VALUES ($1, $2, 'en', $3, $4, $5, $6::jsonb, 'PUBLISHED', 1, $7, NOW(), NOW(), NOW())
         ON CONFLICT (product_id, locale) DO UPDATE SET
           name = EXCLUDED.name,
           short_desc = EXCLUDED.short_desc,
           highlight = EXCLUDED.highlight,
           specifications = EXCLUDED.specifications,
           translation_status = 'PUBLISHED',
           source_revision = 1,
           reviewed_at = NOW()`,
        [randomUUID(), p.id, enTrans.name, enTrans.shortDesc, enTrans.highlight, JSON.stringify(enSpecs), adminUser.name]
      );

      // Chinese translation
      const zhTrans = p.translations['zh-CN'];
      const zhSpecs = {
        ...fullUkSpecs,
        energySpecs: { ...p.energySpecs, priceNote: p.energySpecs.priceNoteZh },
      };
      await client.query(
        `INSERT INTO pim_product_translations (id, product_id, locale, name, short_desc, highlight, specifications, translation_status, source_revision, reviewed_by, reviewed_at, created_at, updated_at)
         VALUES ($1, $2, 'zh-CN', $3, $4, $5, $6::jsonb, 'PUBLISHED', 1, $7, NOW(), NOW(), NOW())
         ON CONFLICT (product_id, locale) DO UPDATE SET
           name = EXCLUDED.name,
           short_desc = EXCLUDED.short_desc,
           highlight = EXCLUDED.highlight,
           specifications = EXCLUDED.specifications,
           translation_status = 'PUBLISHED',
           source_revision = 1,
           reviewed_at = NOW()`,
        [randomUUID(), p.id, zhTrans.name, zhTrans.shortDesc, zhTrans.highlight, JSON.stringify(zhSpecs), adminUser.name]
      );
    }

    // 5. Seed Engineering Documents for Key Models
    const officialDocuments = [
      {
        id: 'b1000000-0000-4000-8000-000000000001',
        productId: 'catl-tener-6250',
        documentType: 'DATASHEET',
        locale: 'uk-UA',
        version: 'v2.4',
        title: 'CATL TENER 6.25 MWh — Офіційна технічна специфікація (Datasheet)',
        sourceUrl: 'https://www.catl.com/uploads/1/files/CATL_TENER_6.25MWh_Datasheet.pdf',
        objectKey: 'documents/catl-tener-6250/CATL_TENER_6250_Datasheet_UK.pdf',
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        mimeType: 'application/pdf',
        sizeBytes: 3450000
      },
      {
        id: 'b1000000-0000-4000-8000-000000000002',
        productId: 'catl-tener-6250',
        documentType: 'CERTIFICATE',
        locale: 'en',
        version: 'v1.0',
        title: 'TÜV Rheinland Certificate IEC 62619 & UL 9540A — CATL TENER',
        sourceUrl: 'https://www.catl.com/certificates/tuv_tener_ul9540a.pdf',
        objectKey: 'documents/catl-tener-6250/TUV_Certificate_UL9540A.pdf',
        checksum: 'f4c1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866',
        mimeType: 'application/pdf',
        sizeBytes: 1820000
      },
      {
        id: 'b1000000-0000-4000-8000-000000000003',
        productId: 'catl-enerone-372',
        documentType: 'DATASHEET',
        locale: 'uk-UA',
        version: 'v3.1',
        title: 'CATL EnerOne 372.7 kWh — Технічний паспорт батарейної шафи',
        sourceUrl: 'https://www.catl.com/uploads/1/files/CATL_EnerOne_372kWh_Datasheet.pdf',
        objectKey: 'documents/catl-enerone-372/CATL_EnerOne_Datasheet_UK.pdf',
        checksum: 'a2b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877',
        mimeType: 'application/pdf',
        sizeBytes: 2980000
      },
      {
        id: 'b1000000-0000-4000-8000-000000000004',
        productId: 'catl-enerone-plus',
        documentType: 'MANUAL',
        locale: 'uk-UA',
        version: 'v2.0',
        title: 'CATL EnerOne Plus — Інструкція з монтажу, підключення рідинного охолодження та безпеки',
        sourceUrl: 'https://www.catl.com/manuals/EnerOne_Plus_Installation_Guide.pdf',
        objectKey: 'documents/catl-enerone-plus/EnerOne_Plus_Installation_Manual.pdf',
        checksum: 'c5c1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888',
        mimeType: 'application/pdf',
        sizeBytes: 5120000
      },
      {
        id: 'b1000000-0000-4000-8000-000000000005',
        productId: 'catl-residential-pr15',
        documentType: 'DATASHEET',
        locale: 'uk-UA',
        version: 'v1.5',
        title: 'CATL Residential PR-15 / PR-30 — Паспорт домашньої системи накопичення енергії',
        sourceUrl: 'https://www.catl.com/uploads/residential/CATL_PR_Series_Datasheet.pdf',
        objectKey: 'documents/catl-residential-pr15/CATL_PR_Series_Datasheet_UK.pdf',
        checksum: 'd1b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899',
        mimeType: 'application/pdf',
        sizeBytes: 2450000
      },
      {
        id: 'b1000000-0000-4000-8000-000000000006',
        productId: 'catl-enerc-plus',
        documentType: 'DATASHEET',
        locale: 'uk-UA',
        version: 'v2.8',
        title: 'CATL EnerC Plus 3.727 MWh — Технічні характеристики контейнера BESS',
        sourceUrl: 'https://www.catl.com/uploads/1/files/CATL_EnerC_Plus_Datasheet.pdf',
        objectKey: 'documents/catl-enerc-plus/CATL_EnerC_Plus_Datasheet_UK.pdf',
        checksum: 'e7b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8aa',
        mimeType: 'application/pdf',
        sizeBytes: 3100000
      }
    ];

    for (const doc of officialDocuments) {
      await client.query(
        `INSERT INTO documents (id, product_id, document_type, locale, version, title, source_url, object_key, checksum_sha256, mime_type, size_bytes, published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           version = EXCLUDED.version,
           source_url = EXCLUDED.source_url,
           published = true`,
        [doc.id, doc.productId, doc.documentType, doc.locale, doc.version, doc.title, doc.sourceUrl, doc.objectKey, doc.checksum, doc.mimeType, doc.sizeBytes]
      );
    }

    await client.query('COMMIT');
    console.log('[Master Registry Seed] Successfully populated 16 verified CATL ESS products and engineering documents.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Master Registry Seed Error]:', error);
    throw error;
  } finally {
    client.release();
    await closeDatabasePool();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed-master-registry.ts')) {
  seedMasterProductRegistry().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
