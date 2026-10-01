/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Central Engineering Calculation Service for KATL Platform
 * Versioned algorithms for BESS Sizing, LCOS, Financial ROI, and BOM Generation.
 */

export const CALCULATION_ENGINE_VERSION = 'v1.4.2-ua-2026';

export interface BessSizingInput {
  solarMw: number;
  loadMw: number;
  durationHours: number;
  tariffUah?: number;
  reservePct?: number;
}

export interface BessEconomics {
  estimatedCapexUsd: number;
  annualSavingsUah: number;
  annualSavingsUsd: number;
  paybackYears: number;
  irrPercent: number;
  lcosCentPerKwh: number;
}

export interface BomItem {
  category: string;
  item: string;
  quantity: number;
  unit: string;
}

export interface BessSizingOutput {
  algorithmVersion: string;
  calculatedAt: string;
  calculatedCapacityMwh: number;
  recommendedPowerMw: number;
  recommendedProduct: {
    id: string;
    name: string;
    containerCount: number;
  };
  economics: BessEconomics;
  bom: BomItem[];
}

export class BessEngineeringCalculator {
  public static calculate(input: BessSizingInput): BessSizingOutput {
    const { solarMw, loadMw, durationHours, tariffUah = 8.5, reservePct = 10 } = input;

    // Usable capacity considering duration and safety reserve
    const baseCapacity = loadMw * durationHours;
    const capacityMwh = Number((baseCapacity * (1 + reservePct / 100)).toFixed(2));
    const powerMw = Number(loadMw.toFixed(2));

    // Determine CATL container selection based on optimal unit density
    let productId = 'catl-enerone-plus';
    let productName = 'CATL EnerOne Plus';
    let containerCount = Math.max(1, Math.ceil((capacityMwh * 1000) / 372.7));

    if (capacityMwh >= 5.0) {
      productId = 'catl-tener-h';
      productName = 'CATL TENER H (9.008 МВт·год)';
      containerCount = Math.max(1, Math.ceil(capacityMwh / 9.008));
    } else if (capacityMwh >= 2.0) {
      productId = 'catl-tener-s';
      productName = 'CATL TENER S (6.25 МВт·год)';
      containerCount = Math.max(1, Math.ceil(capacityMwh / 6.25));
    }

    // CAPEX model based on utility-scale vs commercial volume
    const capexPerKwhUsd = capacityMwh >= 5 ? 185 : 220;
    const totalCapexUsd = Math.round(capacityMwh * 1000 * capexPerKwhUsd);

    // Peak shaving / tariff spread financial model (Kyiv/UA C&I standard tariffs)
    const dailyShiftedKwh = capacityMwh * 1000 * 0.92; // RTE adjusted
    const peakTariffSpreadUah = tariffUah * 0.45;
    const annualSavingsUah = Math.round(dailyShiftedKwh * peakTariffSpreadUah * 330);
    const annualSavingsUsd = Math.round(annualSavingsUah / 41.5);

    const paybackYears = Math.max(2.5, Number((totalCapexUsd / annualSavingsUsd).toFixed(1)));
    const irrPercent = Number((100 / paybackYears + solarMw * 1.5).toFixed(1));
    const lcosCentPerKwh = Number((6.8 + (durationHours === 4 ? 0.6 : 1.2)).toFixed(1));

    // Automated Bill of Materials (BOM)
    const bom: BomItem[] = [
      {
        category: 'Battery Energy Storage',
        item: `${productName} літій-залізо-фосфатний комплекс`,
        quantity: containerCount,
        unit: 'блок',
      },
      {
        category: 'Power Conversion (PCS)',
        item: `Двонаправлений інвертор PCS ${powerMw} МВт Grid-Forming`,
        quantity: 1,
        unit: 'шафа',
      },
      {
        category: 'Medium Voltage Substation',
        item: `Трансформатор силовий ТМГ 10/0.4 кВ (${Math.ceil(powerMw * 1.25 * 1000)} кВА)`,
        quantity: 1,
        unit: 'шт',
      },
      {
        category: 'Monitoring & Safety',
        item: 'CATL Native AI EMS + АСКОЕ / ЛУЗОД телеметрія',
        quantity: 1,
        unit: 'комплект',
      },
      {
        category: 'Fire Suppression & HVAC',
        item: 'Двоконтурне рідинне охолодження + газова система NFPA 855',
        quantity: containerCount,
        unit: 'інтегрована система',
      },
    ];

    return {
      algorithmVersion: CALCULATION_ENGINE_VERSION,
      calculatedAt: new Date().toISOString(),
      calculatedCapacityMwh: capacityMwh,
      recommendedPowerMw: powerMw,
      recommendedProduct: {
        id: productId,
        name: productName,
        containerCount,
      },
      economics: {
        estimatedCapexUsd: totalCapexUsd,
        annualSavingsUah,
        annualSavingsUsd,
        paybackYears,
        irrPercent,
        lcosCentPerKwh,
      },
      bom,
    };
  }
}
