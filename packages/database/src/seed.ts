import { getDatabasePool, closeDatabasePool } from './client';

export const OFFICIAL_CATL_SEEDS = [
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
      transformer: '0.69 / 35 кВ блочний трансформатор',
    },
    provenance: {
      sourceUrl: 'https://www.catl.com/en/ess/product/tener/',
      verifiedAt: '2026-03-15T10:00:00Z',
      verifiedBy: 'Chief Systems Engineer',
      confidence: 'OFFICIAL_CATL',
      revision: 3,
      lastUpdated: '2026-03-15T10:00:00Z',
    },
  },
  {
    id: 'catl-tener-s',
    name: 'CATL TENER S',
    family: 'TENER Series',
    category: 'Utility Scale',
    shortDesc: 'Оптимізована система для 4-годинного розряду та високої циклічності.',
    highlight: '6.25 МВт·год / 0.25C - 0.5C з нульовою деградацією у перші роки',
    status: 'AVAILABLE',
    type: 'tener-s',
    energySpecs: {
      nominalCapacity: '6.25 МВт·год',
      usableCapacity: '6.12 МВт·год',
      nominalVoltage: '1500 V DC',
      voltageRange: '1200 ~ 1700 V DC',
      cRate: '0.25C ~ 0.5C',
      efficiencyRoundTrip: '≥ 95.0%',
    },
    cellSpecs: {
      chemistry: 'LFP',
      cellModel: 'CATL Long-Life 314 Ah',
      cellCapacity: '314 Ah',
      cycleLife: '12 000+ циклів',
      degradationFirstYears: '0% деградація перші 3 роки',
    },
    mechanicalSpecs: {
      dimensions: '6058 × 2438 × 2896 мм (20ft HC)',
      weight: '≤ 42 000 кг',
      containerStandard: 'ISO 668',
      protectionRating: 'IP55',
    },
    thermalSpecs: {
      coolingMethod: 'Liquid Cooling з тепловим насосом',
      tempControlAccuracy: 'ΔT ≤ 3°C',
      operatingTempRange: '-30°C ... +50°C',
    },
    safetySpecs: {
      fireSuppression: 'Аерозольне + Novec 1230',
      deflagrationProtection: 'NFPA 68 випускні клапани',
      gasDetection: 'CO, H2, дим',
      certifications: ['UL 9540A', 'IEC 62619', 'CE'],
    },
    compatibility: {
      pcs: ['Ingeteam', 'SMA', 'Sungrow'],
      ems: ['CATL EMS', 'DNV GEMS'],
      transformer: '0.69 / 10(35) кВ',
    },
    provenance: {
      sourceUrl: 'https://www.catl.com/en/ess/product/tener-s/',
      verifiedAt: '2026-02-20T12:00:00Z',
      verifiedBy: 'Lead Electrical Engineer',
      confidence: 'OFFICIAL_CATL',
      revision: 2,
      lastUpdated: '2026-02-20T12:00:00Z',
    },
  },
  {
    id: 'catl-enerone-plus',
    name: 'CATL EnerOne Plus',
    family: 'EnerOne Series',
    category: 'C&I Storage',
    shortDesc: 'Модульна система з рідинним охолодженням для промислових підприємств (C&I).',
    highlight: '372.7 кВт·год на модуль, компактний футпринт 1.69 м²',
    status: 'AVAILABLE',
    type: 'enerone-plus',
    energySpecs: {
      nominalCapacity: '372.7 кВт·год',
      usableCapacity: '365 кВт·год',
      nominalVoltage: '1331 V DC',
      voltageRange: '1164 ~ 1497 V DC',
      cRate: '0.5C / 1C',
      efficiencyRoundTrip: '≥ 94.5%',
    },
    cellSpecs: {
      chemistry: 'LFP',
      cellModel: 'CATL 280Ah / 314Ah Cell',
      cellCapacity: '314 Ah',
      cycleLife: '10 000+ циклів',
      degradationFirstYears: '≤ 1.5% на рік',
    },
    mechanicalSpecs: {
      dimensions: '1300 × 1300 × 2300 мм',
      weight: '≤ 3 800 кг',
      containerStandard: 'Outdoor Cabinet',
      protectionRating: 'IP66 / C5-M',
    },
    thermalSpecs: {
      coolingMethod: 'Вбудоване рідинне охолодження модуля',
      tempControlAccuracy: 'ΔT ≤ 3°C',
      operatingTempRange: '-30°C ... +55°C',
    },
    safetySpecs: {
      fireSuppression: 'Газове пожежогасіння на рівні шафи',
      deflagrationProtection: 'Верхній вибуховий клапан',
      gasDetection: 'Багатоточкові сенсори',
      certifications: ['UL 9540', 'UL 1973', 'IEC 62619', 'ДСТУ EN 62619'],
    },
    compatibility: {
      pcs: ['Ingeteam C&I', 'SMA Sunny Island', 'GoodWe C&I'],
      ems: ['Local SCADA', 'CATL C&I EMS'],
      transformer: '0.4 / 10 кВ',
    },
    provenance: {
      sourceUrl: 'https://www.catl.com/en/ess/product/enerone-plus/',
      verifiedAt: '2026-03-01T08:00:00Z',
      verifiedBy: 'Senior Hardware Engineer',
      confidence: 'OFFICIAL_CATL',
      revision: 4,
      lastUpdated: '2026-03-01T08:00:00Z',
    },
  },
];

export async function seedDatabase() {
  const pool = getDatabasePool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('[Seed Framework] Seeding official CATL PIM catalog...');

    for (const prod of OFFICIAL_CATL_SEEDS) {
      await client.query(
        `
        INSERT INTO pim_products (
          id, name, family, category, short_desc, highlight, status, product_type,
          source_url, verified_at, verified_by, confidence, revision
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          family = EXCLUDED.family,
          category = EXCLUDED.category,
          short_desc = EXCLUDED.short_desc,
          highlight = EXCLUDED.highlight,
          revision = EXCLUDED.revision,
          updated_at = NOW();
      `,
        [
          prod.id,
          prod.name,
          prod.family,
          prod.category,
          prod.shortDesc,
          prod.highlight,
          prod.status,
          prod.type,
          prod.provenance.sourceUrl,
          prod.provenance.verifiedAt,
          prod.provenance.verifiedBy,
          prod.provenance.confidence,
          prod.provenance.revision,
        ]
      );

      await client.query(
        `
        INSERT INTO pim_specifications (
          product_id, energy_specs, cell_specs, mechanical_specs, thermal_specs, safety_specs, compatibility
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (product_id) DO UPDATE SET
          energy_specs = EXCLUDED.energy_specs,
          cell_specs = EXCLUDED.cell_specs,
          mechanical_specs = EXCLUDED.mechanical_specs,
          thermal_specs = EXCLUDED.thermal_specs,
          safety_specs = EXCLUDED.safety_specs,
          compatibility = EXCLUDED.compatibility,
          updated_at = NOW();
      `,
        [
          prod.id,
          JSON.stringify(prod.energySpecs),
          JSON.stringify(prod.cellSpecs),
          JSON.stringify(prod.mechanicalSpecs),
          JSON.stringify(prod.thermalSpecs),
          JSON.stringify(prod.safetySpecs),
          JSON.stringify(prod.compatibility),
        ]
      );
    }

    // Seed official CATL sources
    const sources = [
      {
        id: 'src-catl-tener',
        name: 'Official CATL Global ESS — TENER Product Line',
        url: 'https://www.catl.com/en/ess/product/tener/',
        type: 'OFFICIAL_WEB',
        interval: 60,
      },
      {
        id: 'src-catl-enerone',
        name: 'Official CATL Global ESS — EnerOne & EnerC Series',
        url: 'https://www.catl.com/en/ess/product/enerone-plus/',
        type: 'OFFICIAL_WEB',
        interval: 120,
      },
      {
        id: 'src-catl-cert-portal',
        name: 'CATL Compliance & Global Certificates Portal',
        url: 'https://www.catl.com/en/about/certification/',
        type: 'CERTIFICATE',
        interval: 360,
      },
    ];

    for (const src of sources) {
      await client.query(
        `
        INSERT INTO sync_sources (id, name, url, source_type, poll_interval_minutes, enabled)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          url = EXCLUDED.url;
      `,
        [src.id, src.name, src.url, src.type, src.interval]
      );
    }

    await client.query('COMMIT');
    console.log('[Seed Framework] Seeding completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Seed Framework Error]:', err);
    throw err;
  } finally {
    client.release();
    await closeDatabasePool();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase().catch((e) => {
    console.error(e);
    exit(1);
  });
}
