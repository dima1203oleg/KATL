/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductDomainEntity {
  id: string;
  slug: string;
  name: string;
  category: 'container' | 'cabinet' | 'c-and-i' | 'utility' | 'residential';
  nominalCapacityKwh: number;
  nominalPowerKw: number;
  cellType: string;
  coolingType: 'liquid' | 'air';
  cRate: string;
  cycleLife: number;
  dimensionsMm: {
    length: number;
    width: number;
    height: number;
  };
  weightKg: number;
  ipRating: string;
  certifications: string[];
  provenance: {
    sourceUrl: string;
    verifiedAt: string;
    verifiedBy: string;
    confidence: 'official' | 'datasheet' | 'preliminary';
  };
}

export interface CalculationInput {
  requiredPowerKw: number;
  requiredCapacityKwh: number;
  durationHours: number;
  application: 'peak-shaving' | 'solar-storage' | 'backup' | 'arbitrage';
  tariffUahPerKwh: number;
  gridVoltageKv: number;
}

export interface CalculationResult {
  algorithmVersion: string;
  recommendedProductSlug: string;
  unitCount: number;
  installedPowerKw: number;
  installedCapacityKwh: number;
  systemWeightTons: number;
  footprintM2: number;
  estimatedCapexUsd: number;
  annualSavingsUsd: number;
  simplePaybackYears: number;
  lcosUsdPerKwh: number;
  singleLineDiagramTopology: string;
  generatedAt: string;
}
