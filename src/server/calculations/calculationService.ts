/**
 * Engineering Calculation Service
 * Versioned algorithms for BESS sizing, LCOS, IRR, Payback, and Bill of Materials (BOM).
 */

export interface SizingInput {
  solarMw: number;
  loadMw: number;
  durationHours: number;
  tariffUah?: number;
}

export interface SizingResult {
  algorithmVersion: string;
  calculatedCapacityMwh: number;
  recommendedPowerMw: number;
  recommendedProduct: {
    id: string;
    name: string;
    containerCount: number;
  };
  economics: {
    estimatedCapexUsd: number;
    annualSavingsUah: number;
    paybackYears: number;
    irrPercent: number;
    lcosCentPerKwh: number;
  };
  bom: Array<{
    category: string;
    item: string;
    quantity: number;
    unit: string;
  }>;
}

export class BessCalculationService {
  private readonly ALGORITHM_VERSION = 'v1.4.2-ua-2026';

  public calculate(input: SizingInput): SizingResult {
    const { solarMw, loadMw, durationHours, tariffUah = 8.5 } = input;

    const capacityMwh = Number((loadMw * durationHours).toFixed(2));
    const powerMw = Number(loadMw.toFixed(2));

    // Select recommended product
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

    // Financial model
    const capexPerKwhUsd = capacityMwh >= 5 ? 185 : 220;
    const totalCapexUsd = Math.round(capacityMwh * 1000 * capexPerKwhUsd);

    const dailyShiftedKwh = capacityMwh * 1000 * 0.95;
    const peakTariffSpreadUah = tariffUah * 0.45; // average day/night or peak spread
    const annualSavingsUah = Math.round(dailyShiftedKwh * peakTariffSpreadUah * 330);
    const annualSavingsUsd = annualSavingsUah / 41.5;

    const paybackYears = Math.max(2.6, Number((totalCapexUsd / annualSavingsUsd).toFixed(1)));
    const irrPercent = Number((100 / paybackYears + solarMw * 1.5).toFixed(1));
    const lcosCentPerKwh = Number((6.8 + (durationHours === 4 ? 0.6 : 1.2)).toFixed(1));

    // Bill of Materials
    const bom = [
      {
        category: 'Battery Storage',
        item: `${productName} літій-залізо-фосфатний модуль`,
        quantity: containerCount,
        unit: 'комплект',
      },
      {
        category: 'Power Conversion (PCS)',
        item: `Двонаправлений інвертор PCS ${powerMw} МВт Grid-Forming`,
        quantity: 1,
        unit: 'шафа',
      },
      {
        category: 'Medium Voltage',
        item: `Трансформатор силовий ТМГ 10/0.4 кВ (${Math.ceil(powerMw * 1.25 * 1000)} кВА)`,
        quantity: 1,
        unit: 'шт',
      },
      {
        category: 'Monitoring & Safety',
        item: 'CATL Native AI EMS + АСКОЕ / ЛУЗОД телеметрія',
        quantity: 1,
        unit: 'ліцензія + шафа',
      },
      {
        category: 'Fire Suppression',
        item: 'Автоматична газова система пожежогасіння Novec 1230',
        quantity: containerCount,
        unit: 'контур',
      },
    ];

    return {
      algorithmVersion: this.ALGORITHM_VERSION,
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
        paybackYears,
        irrPercent,
        lcosCentPerKwh,
      },
      bom,
    };
  }
}

export const calculationService = new BessCalculationService();
