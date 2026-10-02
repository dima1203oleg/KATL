import assert from 'node:assert/strict';
import test from 'node:test';
import { evidenceContainsFactValue, extractTechnicalFacts, normalizeSourceEvidence, sameJsonValue } from '../../apps/api/src/pim-fact-provenance';

test('technical fact extraction uses escaped JSON Pointer paths and ignores empty groups', () => {
  const facts = extractTechnicalFacts({ energy_specs: { 'capacity/mwh': 6.25, '~verified': true }, cell_specs: {}, thermal_specs: null });
  assert.deepEqual(facts, [
    { path: '/energy_specs/capacity~1mwh', value: 6.25 },
    { path: '/energy_specs/~0verified', value: true },
  ]);
});

test('evidence normalizes HTML, entities, whitespace and Unicode compatibility forms', () => {
  assert.equal(normalizeSourceEvidence('<p>Capacity&nbsp;: ６.２５ MWh</p><script>not a fact</script>'), 'capacity : 6.25 mwh');
  assert.equal(normalizeSourceEvidence('Value &#99999999; safe'), 'value safe');
});

test('numeric evidence matches exact values and rejects substring or nearby values', () => {
  assert.equal(evidenceContainsFactValue('Nominal energy: 6.25 MWh', 6.25), true);
  assert.equal(evidenceContainsFactValue('Nominal energy: 16.25 MWh', 6.25), false);
  assert.equal(evidenceContainsFactValue('Nominal energy: 6.250 MWh', 6.25), false);
});

test('string and boolean facts require a meaningful citation, JSON values compare stably', () => {
  assert.equal(evidenceContainsFactValue('Chemistry: LFP (LiFePO4)', 'LFP'), true);
  assert.equal(evidenceContainsFactValue('', true), false);
  assert.equal(sameJsonValue(6.25, 6.25), true);
  assert.equal(sameJsonValue('6.25', 6.25), false);
});
