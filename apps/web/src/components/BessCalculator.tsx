'use client';

import React, { useState } from 'react';
import { ArrowRight, RotateCw, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type Result = {
  algorithmVersion: string;
  calculatedAt: string;
  input: { solarMw: number; loadMw: number; durationHours: number; reservePct: number };
  requestedPowerMw: number;
  requestedDeliverableEnergyMwh: number;
  nominalEnergyWithReserveMwh: number;
  assumptions: string[];
  limitations: string[];
};

const presets = [
  {
    id: 'ci_peak',
    title: { 'uk-UA': 'Комерційний об’єкт (Peak Shaving)', en: 'Commercial (Peak Shaving)', 'zh-CN': '工商业削峰填谷' },
    desc: { 'uk-UA': '200 kW / 400 kWh', en: '200 kW / 400 kWh', 'zh-CN': '200 kW / 400 kWh' },
    values: { loadMw: '0.2', durationHours: '2', reservePct: '10', solarMw: '0.3' },
  },
  {
    id: 'ind_backup',
    title: { 'uk-UA': 'Промисловий сектор (Back-up & Arbitrage)', en: 'Industrial (Back-up & Arbitrage)', 'zh-CN': '大型工业备电与套利' },
    desc: { 'uk-UA': '1 MW / 4 MWh', en: '1 MW / 4 MWh', 'zh-CN': '1 MW / 4 MWh' },
    values: { loadMw: '1.0', durationHours: '4', reservePct: '15', solarMw: '1.5' },
  },
  {
    id: 'utility_pv',
    title: { 'uk-UA': 'СЕС / Utility Grid Firming', en: 'Utility Solar / Grid Firming', 'zh-CN': '电网级新能源配储' },
    desc: { 'uk-UA': '5 MW / 20 MWh', en: '5 MW / 20 MWh', 'zh-CN': '5 MW / 20 MWh' },
    values: { loadMw: '5.0', durationHours: '4', reservePct: '10', solarMw: '8.0' },
  },
  {
    id: 'microgrid',
    title: { 'uk-UA': 'Автономний мікрогрід', en: 'Islanded Microgrid', 'zh-CN': '离网独立微电网' },
    desc: { 'uk-UA': '500 kW / 3 MWh', en: '500 kW / 3 MWh', 'zh-CN': '500 kW / 3 MWh' },
    values: { loadMw: '0.5', durationHours: '6', reservePct: '20', solarMw: '0.8' },
  },
];

export function BessCalculator({ locale = 'uk-UA' }: { locale?: string }) {
  const [form, setForm] = useState({
    solarMw: '1.5',
    loadMw: '1.0',
    durationHours: '4',
    reservePct: '15',
  });
  const [activePreset, setActivePreset] = useState<string>('ind_backup');
  const [result, setResult] = useState<Result | null>(null);
  const [calculationId, setCalculationId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const t = {
    'uk-UA': {
      title: 'Вихідні параметри BESS',
      subtitle: 'Оберіть типовий галузевий профіль або введіть власні параметри навантаження.',
      presetsLabel: 'Галузеві сценарії (швидкий вибір):',
      loadLabel: 'Потужність навантаження, MW',
      durationLabel: 'Тривалість розряду, години',
      reserveLabel: 'Резерв ємності (BoS / SoC margin), %',
      solarLabel: 'Потужність СЕС/ВЕС, MW (контекст генерації)',
      calcBtn: 'Розрахувати конфігурацію',
      calculating: 'Розрахунок інженерної моделі…',
      resultTitle: 'Результати розрахунку конфігурації',
      emptyTitle: 'Введіть параметри або оберіть сценарій',
      emptySub: 'Отримайте точний розрахунок відпускної та номінальної ємності системи CATL.',
      reqPower: 'Потрібна потужність',
      reqDeliverable: 'Відпускна енергія (Net)',
      nominalWithReserve: 'Номінальна ємність BESS (з резервом)',
      algoVersion: 'Версія алгоритму',
      assumptionsTitle: 'Інженерні припущення',
      limitationsTitle: 'Межі застосування та зауваження',
      rfqBtn: 'Передати розрахунок у ТКП (RFQ)',
    },
    en: {
      title: 'BESS Sizing Parameters',
      subtitle: 'Select an industry benchmark preset or enter your custom load parameters.',
      presetsLabel: 'Industry Benchmark Presets:',
      loadLabel: 'Required Load Power, MW',
      durationLabel: 'Discharge Duration, Hours',
      reserveLabel: 'Capacity Reserve (BoS / SoC Margin), %',
      solarLabel: 'Solar / Wind Capacity, MW (Generation Context)',
      calcBtn: 'Calculate Configuration',
      calculating: 'Running Engineering Model…',
      resultTitle: 'Sizing Model Output',
      emptyTitle: 'Enter parameters or select a preset',
      emptySub: 'Obtain precise net and nominal capacity requirements for CATL storage.',
      reqPower: 'Required Power',
      reqDeliverable: 'Net Deliverable Energy',
      nominalWithReserve: 'Nominal BESS Capacity (w/ Reserve)',
      algoVersion: 'Algorithm Version',
      assumptionsTitle: 'Engineering Assumptions',
      limitationsTitle: 'Operating Limitations',
      rfqBtn: 'Transfer to Commercial Proposal (RFQ)',
    },
    'zh-CN': {
      title: 'BESS 储能系统容量配置参数',
      subtitle: '选择典型行业应用模板，或输入您项目的实际负荷与放电需求。',
      presetsLabel: '典型行业应用基准：',
      loadLabel: '所需负荷功率 (MW)',
      durationLabel: '放电持续时间 (小时)',
      reserveLabel: '安全容量冗余裕度 (%)',
      solarLabel: '配套光伏/风电容量 (MW)',
      calcBtn: '计算系统选型配置',
      calculating: '正在运行系统选型模型…',
      resultTitle: '容量与功率计算结果',
      emptyTitle: '输入参数或选择上方预设',
      emptySub: '快速获取满足项目工况的净放电量及 CATL 推荐标称配置容量。',
      reqPower: '系统需求功率',
      reqDeliverable: '实际可用放电量 (Net)',
      nominalWithReserve: '推荐标称储能容量 (含冗余)',
      algoVersion: '算法模型版本',
      assumptionsTitle: '工程设计假设',
      limitationsTitle: '系统边界限制与说明',
      rfqBtn: '带入参数申请正式商业报价 (RFQ)',
    },
  }[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA'];

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setActivePreset('');
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setForm(preset.values);
    setActivePreset(preset.id);
  };

  async function calculate(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    setResult(null);

    try {
      const response = await fetch('/api/v1/calculations/bess', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          solarMw: Number(form.solarMw || 0),
          loadMw: Number(form.loadMw),
          durationHours: Number(form.durationHours),
          reservePct: Number(form.reservePct),
          locale,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.data) {
        throw new Error('Перевірте значення потужності, тривалості та резерву.');
      }
      setResult(data.data);
      setCalculationId(data.calculationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Калькулятор тимчасово недоступний.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="calc-layout">
      {/* Input Section */}
      <form className="calc-card" onSubmit={calculate}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <SlidersHorizontal style={{ width: 20, height: 20, color: '#0066ff' }} />
          <h2 style={{ margin: 0, fontSize: 20, color: '#091d34' }}>{t.title}</h2>
        </div>
        <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 18px', lineHeight: 1.5 }}>
          {t.subtitle}
        </p>

        {/* Quick Industry Presets */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: 8 }}>
            {t.presetsLabel}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: activePreset === preset.id ? '2px solid #0066ff' : '1px solid #e2e8f0',
                  background: activePreset === preset.id ? '#f0f6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 750, color: activePreset === preset.id ? '#0066ff' : '#1e293b' }}>
                  {preset.title[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA']}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  {preset.desc[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA']}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 14 }}>
          <NumberField
            label={t.loadLabel}
            name="loadMw"
            value={form.loadMw}
            min="0.001"
            step="any"
            required
            onChange={update}
          />
          <NumberField
            label={t.durationLabel}
            name="durationHours"
            value={form.durationHours}
            min="0.1"
            max="168"
            step="any"
            required
            onChange={update}
          />
          <NumberField
            label={t.reserveLabel}
            name="reservePct"
            value={form.reservePct}
            min="0"
            max="50"
            step="any"
            onChange={update}
          />
          <NumberField
            label={t.solarLabel}
            name="solarMw"
            value={form.solarMw}
            min="0"
            step="any"
            onChange={update}
          />
        </div>

        <button
          className="button"
          style={{ width: '100%', marginTop: 22 }}
          disabled={busy}
        >
          {busy ? (
            <>
              <RotateCw style={{ width: 16, height: 16 }} className="animate-spin" />
              <span>{t.calculating}</span>
            </>
          ) : (
            <>
              <Sparkles style={{ width: 16, height: 16 }} />
              <span>{t.calcBtn}</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </>
          )}
        </button>
      </form>

      {/* Output Section */}
      <section className="calc-card" aria-live="polite">
        <h2 style={{ margin: '0 0 16px', fontSize: 20, color: '#091d34' }}>{t.resultTitle}</h2>

        {error && <p className="error-note" role="alert">{error}</p>}

        {!result && !error && (
          <div className="empty-state">
            <div>
              <h3 style={{ color: '#091d34', fontSize: 16 }}>{t.emptyTitle}</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{t.emptySub}</p>
            </div>
          </div>
        )}

        {result && (
          <>
            <div className="calc-results" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <Metric label={t.reqPower} value={`${fmt(result.requestedPowerMw)} MW`} highlight />
              <Metric label={t.reqDeliverable} value={`${fmt(result.requestedDeliverableEnergyMwh)} MWh`} />
              <Metric label={t.nominalWithReserve} value={`${fmt(result.nominalEnergyWithReserveMwh)} MWh`} highlight />
              <Metric label={t.algoVersion} value={result.algorithmVersion} />
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 750, color: '#091d34', marginTop: 24, marginBottom: 8 }}>
              {t.assumptionsTitle}
            </h3>
            <ul className="field-hint" style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: 14, fontWeight: 750, color: '#091d34', marginTop: 18, marginBottom: 8 }}>
              {t.limitationsTitle}
            </h3>
            <ul className="field-hint" style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="field-hint" style={{ marginTop: 16, color: '#94a3b8' }}>
              Розраховано: {new Date(result.calculatedAt).toLocaleString(locale)} · ID {calculationId.slice(0, 8)}
            </p>

            <Link
              className="button button-secondary"
              style={{ width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              href={`/${locale}/rfq?powerKw=${Math.round(result.requestedPowerMw * 1000)}&capacityKwh=${Math.round(result.nominalEnergyWithReserveMwh * 1000)}&durationHours=${result.input.durationHours}&calculationId=${encodeURIComponent(calculationId)}`}
            >
              <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981' }} />
              <span>{t.rfqBtn}</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </>
        )}
      </section>
    </div>
  );
}

function NumberField({
  label,
  name,
  value,
  min,
  max,
  step,
  required,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="field">
      <label htmlFor={name} style={{ fontSize: 12, fontWeight: 650, color: '#334155' }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        max={max}
        step={step}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="calc-result"
      style={{
        background: highlight ? '#f0f7ff' : '#f8fafc',
        border: highlight ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <small style={{ display: 'block', color: highlight ? '#0054d1' : '#64748b', fontSize: 11, fontWeight: 600 }}>
        {label}
      </small>
      <strong style={{ display: 'block', fontSize: 20, color: highlight ? '#005bff' : '#091d34', marginTop: 4 }}>
        {value}
      </strong>
    </div>
  );
}

function fmt(value: number) {
  return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 }).format(value);
}
