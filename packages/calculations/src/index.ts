/** Deterministic preliminary sizing math. It does not select a vendor product or estimate project economics. */
export const CALCULATION_ENGINE_VERSION = 'bess-energy-sizing-v2';

export interface BessSizingInput {
  solarMw?: number;
  loadMw: number;
  durationHours: number;
  reservePct?: number;
}

export interface BessSizingOutput {
  algorithmVersion: string;
  calculatedAt: string;
  input: Required<BessSizingInput>;
  requestedPowerMw: number;
  requestedDeliverableEnergyMwh: number;
  nominalEnergyWithReserveMwh: number;
  assumptions: string[];
  limitations: string[];
}

export class BessEngineeringCalculator {
  static calculate(input: BessSizingInput): BessSizingOutput {
    const normalized = {
      solarMw: input.solarMw ?? 0,
      loadMw: input.loadMw,
      durationHours: input.durationHours,
      reservePct: input.reservePct ?? 0,
    };
    if (!Number.isFinite(normalized.solarMw) || normalized.solarMw < 0 || normalized.solarMw > 100_000) {
      throw new RangeError('solarMw must be between 0 and 100000 MW');
    }
    if (!Number.isFinite(normalized.loadMw) || normalized.loadMw <= 0 || normalized.loadMw > 100_000) {
      throw new RangeError('loadMw must be greater than 0 and no more than 100000 MW');
    }
    if (!Number.isFinite(normalized.durationHours) || normalized.durationHours <= 0 || normalized.durationHours > 168) {
      throw new RangeError('durationHours must be greater than 0 and no more than 168 hours');
    }
    if (!Number.isFinite(normalized.reservePct) || normalized.reservePct < 0 || normalized.reservePct > 50) {
      throw new RangeError('reservePct must be between 0 and 50 percent');
    }

    const requestedDeliverableEnergyMwh = normalized.loadMw * normalized.durationHours;
    const nominalEnergyWithReserveMwh = requestedDeliverableEnergyMwh * (1 + normalized.reservePct / 100);
    return {
      algorithmVersion: CALCULATION_ENGINE_VERSION,
      calculatedAt: new Date().toISOString(),
      input: normalized,
      requestedPowerMw: normalized.loadMw,
      requestedDeliverableEnergyMwh: round(requestedDeliverableEnergyMwh, 4),
      nominalEnergyWithReserveMwh: round(nominalEnergyWithReserveMwh, 4),
      assumptions: [
        'Requested load is maintained for the full entered duration.',
        'Reserve percentage is an explicit user input and is applied to deliverable energy.',
        'Solar generation is recorded as context only and is not credited against storage sizing.',
      ],
      limitations: [
        'Does not include conversion losses, auxiliary consumption, temperature derating, degradation, or operating constraints.',
        'Does not select a CATL product, determine equipment quantities, or estimate price, LCOS, savings, or payback.',
        'Requires site load, grid, protection, and product-specific data before engineering design.',
      ],
    };
  }
}

export const LCOS_ALGORITHM_VERSION = 'lcos-discounted-throughput-v1';
export interface LcosInput {
  capexUsd: number;
  annualOpexUsd: number;
  capacityKwh: number;
  cyclesPerYear: number;
  degradationPct: number;
  lifetimeYears: number;
  roundTripEfficiencyPct: number;
  discountRatePct: number;
}
export interface LcosOutput {
  algorithmVersion: string;
  calculatedAt: string;
  inputs: LcosInput;
  lcosUsdPerKwh: number;
  annualThroughputKwh: number;
  lifetimeUndiscountedThroughputKwh: number;
  presentValueThroughputKwh: number;
  presentValueCostUsd: number;
  sensitivity: { degradationMinusOnePct: number; base: number; degradationPlusOnePct: number };
  assumptions: string[];
}

export function calculateLcos(input: LcosInput): LcosOutput {
  validateLcosInput(input);
  const base = lcosCore(input);
  const lowerDegradation = lcosCore({ ...input, degradationPct: Math.max(0, input.degradationPct - 1) }).lcosUsdPerKwh;
  const higherDegradation = lcosCore({ ...input, degradationPct: Math.min(100, input.degradationPct + 1) }).lcosUsdPerKwh;
  return {
    algorithmVersion: LCOS_ALGORITHM_VERSION,
    calculatedAt: new Date().toISOString(),
    inputs: input,
    ...base,
    sensitivity: { degradationMinusOnePct: lowerDegradation, base: base.lcosUsdPerKwh, degradationPlusOnePct: higherDegradation },
    assumptions: [
      'Capacity is the energy delivered per full-equivalent cycle before annual degradation.',
      'Round-trip efficiency scales delivered energy once; no charge/discharge tariff asymmetry is modelled.',
      'CAPEX is paid at year zero and OPEX is paid at each year end.',
      'Degradation is compounded annually; cycles per year are held constant.',
      'No residual value, replacement, taxes, financing, augmentation, or salvage value is included.',
    ],
  };
}

function lcosCore(input: LcosInput) {
  const efficiency = input.roundTripEfficiencyPct / 100;
  const degradation = input.degradationPct / 100;
  const discount = input.discountRatePct / 100;
  let presentValueThroughputKwh = 0;
  let lifetimeUndiscountedThroughputKwh = 0;
  let presentValueOpexUsd = 0;
  for (let year = 1; year <= input.lifetimeYears; year++) {
    const annualEnergy = input.capacityKwh * input.cyclesPerYear * efficiency * Math.pow(1 - degradation, year - 1);
    lifetimeUndiscountedThroughputKwh += annualEnergy;
    presentValueThroughputKwh += annualEnergy / Math.pow(1 + discount, year);
    presentValueOpexUsd += input.annualOpexUsd / Math.pow(1 + discount, year);
  }
  const presentValueCostUsd = input.capexUsd + presentValueOpexUsd;
  if (presentValueThroughputKwh <= 0) throw new RangeError('Expected lifetime energy throughput must be greater than zero');
  return {
    lcosUsdPerKwh: round(presentValueCostUsd / presentValueThroughputKwh, 6),
    annualThroughputKwh: round(input.capacityKwh * input.cyclesPerYear * efficiency, 3),
    lifetimeUndiscountedThroughputKwh: round(lifetimeUndiscountedThroughputKwh, 3),
    presentValueThroughputKwh: round(presentValueThroughputKwh, 3),
    presentValueCostUsd: round(presentValueCostUsd, 2),
  };
}

function validateLcosInput(input: LcosInput) {
  const ranges: Array<[keyof LcosInput, number, number]> = [
    ['capexUsd', 0, 10_000_000_000], ['annualOpexUsd', 0, 1_000_000_000],
    ['capacityKwh', 0.001, 10_000_000_000], ['cyclesPerYear', 0.001, 3650],
    ['degradationPct', 0, 100], ['lifetimeYears', 1, 50],
    ['roundTripEfficiencyPct', 0.001, 100], ['discountRatePct', 0, 100],
  ];
  for (const [key, min, max] of ranges) {
    const value = input[key];
    if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${key} must be between ${min} and ${max}`);
  }
  if (!Number.isInteger(input.lifetimeYears)) throw new RangeError('lifetimeYears must be a whole number');
}

function round(value: number, decimals: number) {
  return Number(value.toFixed(decimals));
}
