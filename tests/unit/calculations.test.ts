import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BessEngineeringCalculator, CALCULATION_ENGINE_VERSION, calculateLcos, LCOS_ALGORITHM_VERSION } from '../../packages/calculations/src/index';

describe('deterministic preliminary BESS sizing', () => {
  it('calculates requested energy and explicit reserve without inventing a product or economics', () => {
    const result = BessEngineeringCalculator.calculate({ solarMw: 2.4, loadMw: 1.5, durationHours: 3, reservePct: 10 });
    assert.equal(result.algorithmVersion, CALCULATION_ENGINE_VERSION);
    assert.equal(result.requestedPowerMw, 1.5);
    assert.equal(result.requestedDeliverableEnergyMwh, 4.5);
    assert.equal(result.nominalEnergyWithReserveMwh, 4.95);
    assert.equal(result.input.solarMw, 2.4);
    assert.equal('recommendedProduct' in result, false);
    assert.equal('economics' in result, false);
    assert.ok(result.limitations.length > 0);
  });

  it('rejects invalid or unsafe input ranges', () => {
    assert.throws(() => BessEngineeringCalculator.calculate({ loadMw: 0, durationHours: 2 }), RangeError);
    assert.throws(() => BessEngineeringCalculator.calculate({ loadMw: 1, durationHours: 2, reservePct: 51 }), RangeError);
  });

  it('calculates discounted LCOS from explicit inputs and exposes degradation sensitivity', () => {
    const result = calculateLcos({
      capexUsd: 27000, annualOpexUsd: 0, capacityKwh: 1000, cyclesPerYear: 300,
      degradationPct: 0, lifetimeYears: 10, roundTripEfficiencyPct: 90, discountRatePct: 0,
    });
    assert.equal(result.algorithmVersion, LCOS_ALGORITHM_VERSION);
    assert.equal(result.annualThroughputKwh, 270000);
    assert.equal(result.presentValueThroughputKwh, 2700000);
    assert.equal(result.lcosUsdPerKwh, 0.01);
    assert.equal(result.sensitivity.degradationMinusOnePct, result.sensitivity.base);
    assert.ok(result.assumptions.length >= 4);
  });

  it('rejects invalid LCOS inputs', () => {
    assert.throws(() => calculateLcos({
      capexUsd: 1, annualOpexUsd: 0, capacityKwh: 0, cyclesPerYear: 300,
      degradationPct: 1, lifetimeYears: 10, roundTripEfficiencyPct: 90, discountRatePct: 5,
    }), RangeError);
  });
});
