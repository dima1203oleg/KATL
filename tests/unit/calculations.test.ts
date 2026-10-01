import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BessEngineeringCalculator, CALCULATION_ENGINE_VERSION } from '../../packages/calculations/src/index';

describe('BESS Engineering Calculations Suite', () => {
  it('should calculate accurate capacity and containers for utility scale (TENER H)', () => {
    const result = BessEngineeringCalculator.calculate({
      solarMw: 5,
      loadMw: 5,
      durationHours: 2,
      tariffUah: 8.5,
    });

    assert.strictEqual(result.algorithmVersion, CALCULATION_ENGINE_VERSION);
    assert.ok(result.calculatedCapacityMwh >= 10.0);
    assert.strictEqual(result.recommendedProduct.id, 'catl-tener-h');
    assert.ok(result.recommendedProduct.containerCount >= 1);
    assert.ok(result.economics.paybackYears > 0);
    assert.ok(result.economics.lcosCentPerKwh > 0);
    assert.ok(result.bom.length >= 4);
  });

  it('should recommend EnerOne Plus for small commercial loads', () => {
    const result = BessEngineeringCalculator.calculate({
      solarMw: 0.5,
      loadMw: 0.3,
      durationHours: 2,
      tariffUah: 9.0,
    });

    assert.strictEqual(result.recommendedProduct.id, 'catl-enerone-plus');
    assert.ok(result.calculatedCapacityMwh < 2.0);
    assert.ok(result.economics.annualSavingsUah > 0);
  });
});
