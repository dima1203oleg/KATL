'use client';

import { useState } from 'react';
import { RotateCw } from 'lucide-react';

type LcosResult = {
  algorithmVersion: string;
  calculatedAt: string;
  lcosUsdPerKwh: number;
  annualThroughputKwh: number;
  lifetimeUndiscountedThroughputKwh: number;
  presentValueThroughputKwh: number;
  presentValueCostUsd: number;
  sensitivity: { degradationMinusOnePct: number; base: number; degradationPlusOnePct: number };
  assumptions: string[];
};

const fields = [
  ['capexUsd', 'CAPEX, USD', '0', 'any'],
  ['annualOpexUsd', 'Річний OPEX, USD', '0', 'any'],
  ['capacityKwh', 'Енергія на цикл, kWh', '0.001', 'any'],
  ['cyclesPerYear', 'Повних циклів на рік', '0.001', 'any'],
  ['degradationPct', 'Деградація на рік, %', '0', 'any'],
  ['lifetimeYears', 'Строк служби, років', '1', '1'],
  ['roundTripEfficiencyPct', 'Round-trip efficiency, %', '0.001', 'any'],
  ['discountRatePct', 'Ставка дисконтування, %', '0', 'any'],
] as const;

export function LcosCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    capexUsd: '', annualOpexUsd: '', capacityKwh: '', cyclesPerYear: '',
    degradationPct: '', lifetimeYears: '', roundTripEfficiencyPct: '', discountRatePct: '',
  });
  const [result, setResult] = useState<LcosResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setResult(null); setBusy(true);
    try {
      const response = await fetch('/api/v1/calculations/lcos', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)]))),
      });
      const body = await response.json();
      if (!response.ok || !body.data) throw new Error('Перевірте всі параметри й повторіть розрахунок.');
      setResult(body.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Калькулятор тимчасово недоступний.');
    } finally { setBusy(false); }
  }

  return <div className="calc-layout">
    <form className="calc-card" onSubmit={submit}>
      <h2 style={{ marginTop: 0 }}>Параметри системи</h2>
      <p className="field-hint">Введіть власні проєктні припущення. Ми не підставляємо ціни чи типові значення автоматично.</p>
      <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
        {fields.map(([name, label, min, step]) => <div className="field" key={name}>
          <label htmlFor={`lcos-${name}`}>{label}</label>
          <input id={`lcos-${name}`} type="number" inputMode="decimal" min={min} step={step} required value={values[name]} onChange={event => setValues(current => ({ ...current, [name]: event.target.value }))} />
        </div>)}
      </div>
      <button className="button" style={{ marginTop: 20 }} disabled={busy}>{busy ? <><RotateCw size={15}/>Розраховуємо…</> : 'Розрахувати LCOS'}</button>
    </form>
    <section className="calc-card" aria-live="polite">
      <h2 style={{ marginTop: 0 }}>Результат</h2>
      {error && <p className="error-note" role="alert">{error}</p>}
      {!result && !error && <div className="empty-state"><div><h3>Заповніть параметри проєкту</h3><p>LCOS — розрахункова оцінка за введеними даними, не комерційна пропозиція.</p></div></div>}
      {result && <>
        <div className="calc-results">
          <Metric label="LCOS" value={`${money(result.lcosUsdPerKwh)} USD/kWh`} />
          <Metric label="Річний відпуск" value={`${number(result.annualThroughputKwh)} kWh`} />
          <Metric label="Відпуск за строк служби, без дисконту" value={`${number(result.lifetimeUndiscountedThroughputKwh)} kWh`} />
          <Metric label="Дисконтована енергія" value={`${number(result.presentValueThroughputKwh)} kWh`} />
          <Metric label="Поточна вартість витрат" value={`${money(result.presentValueCostUsd)} USD`} />
          <Metric label="Версія алгоритму" value={result.algorithmVersion} />
        </div>
        <h3 style={{ fontSize: 14, marginTop: 24 }}>Чутливість до деградації (±1 відсотковий пункт)</h3>
        <div className="calc-results">
          <Metric label="Нижча деградація" value={`${money(result.sensitivity.degradationMinusOnePct)} USD/kWh`} />
          <Metric label="Базовий сценарій" value={`${money(result.sensitivity.base)} USD/kWh`} />
          <Metric label="Вища деградація" value={`${money(result.sensitivity.degradationPlusOnePct)} USD/kWh`} />
        </div>
        <h3 style={{ fontSize: 14, marginTop: 24 }}>Методика та припущення</h3>
        <ul className="field-hint">{result.assumptions.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="field-hint">Розраховано: {new Date(result.calculatedAt).toLocaleString('uk-UA')}</p>
      </>}
    </section>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="calc-result"><small>{label}</small><strong>{value}</strong></div>; }
function number(value: number) { return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(value); }
function money(value: number) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value); }
