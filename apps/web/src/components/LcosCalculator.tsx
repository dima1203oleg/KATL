'use client';

import React, { useState } from 'react';
import { ArrowRight, RotateCw, Calculator, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';

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

const presets = [
  {
    id: 'enerx_ci',
    title: { 'uk-UA': 'CATL EnerX (C&I)', en: 'CATL EnerX (C&I)', 'zh-CN': 'CATL EnerX 工商业' },
    desc: { 'uk-UA': '300 kWh, 15 років', en: '300 kWh, 15 yrs', 'zh-CN': '300 kWh, 15年' },
    values: {
      capexUsd: '65000',
      annualOpexUsd: '1200',
      capacityKwh: '300',
      cyclesPerYear: '365',
      degradationPct: '2.0',
      lifetimeYears: '15',
      roundTripEfficiencyPct: '89',
      discountRatePct: '8',
    },
  },
  {
    id: 'enerc_ind',
    title: { 'uk-UA': 'CATL EnerC+ (Industrial)', en: 'CATL EnerC+ (Industrial)', 'zh-CN': 'CATL EnerC+ 工业' },
    desc: { 'uk-UA': '2 MWh (2000 kWh), 15 років', en: '2 MWh (2000 kWh), 15 yrs', 'zh-CN': '2 MWh, 15年' },
    values: {
      capexUsd: '340000',
      annualOpexUsd: '4500',
      capacityKwh: '2000',
      cyclesPerYear: '400',
      degradationPct: '1.8',
      lifetimeYears: '15',
      roundTripEfficiencyPct: '91',
      discountRatePct: '8',
    },
  },
  {
    id: 'tener_utility',
    title: { 'uk-UA': 'CATL Tener (Utility Grid)', en: 'CATL Tener (Utility Grid)', 'zh-CN': 'CATL Tener 电网级' },
    desc: { 'uk-UA': '6.25 MWh (6250 kWh), 20 років', en: '6.25 MWh (6250 kWh), 20 yrs', 'zh-CN': '6.25 MWh, 20年' },
    values: {
      capexUsd: '890000',
      annualOpexUsd: '9500',
      capacityKwh: '6250',
      cyclesPerYear: '500',
      degradationPct: '1.2',
      lifetimeYears: '20',
      roundTripEfficiencyPct: '92',
      discountRatePct: '7',
    },
  },
];

export function LcosCalculator({ locale = 'uk-UA' }: { locale?: string }) {
  const [values, setValues] = useState<Record<string, string>>(presets[1].values);
  const [activePreset, setActivePreset] = useState<string>('enerc_ind');
  const [result, setResult] = useState<LcosResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const t = {
    'uk-UA': {
      title: 'Параметри LCOS та економічної моделі',
      subtitle: 'Оберіть типову систему або налаштуйте капітальні та операційні витрати.',
      presetsLabel: 'Конфігурації систем CATL (швидкий підбір):',
      calcBtn: 'Розрахувати LCOS',
      calculating: 'Розрахунок фінансової моделі…',
      resultTitle: 'Результати LCOS та відпуску енергії',
      emptyTitle: 'Введіть фінансово-технічні параметри',
      emptySub: 'LCOS визначає приведений тариф вартості збереження та віддачі 1 кВт·год за життєвий цикл.',
      lcosLabel: 'LCOS (Приведена вартість)',
      annualThroughput: 'Річний відпуск енергії',
      lifetimeThroughput: 'Сумарний відпуск за весь строк',
      pvThroughput: 'Дисконтована енергія (NPV)',
      pvCost: 'Приведена вартість витрат (PV Cost)',
      algoVersion: 'Версія алгоритму',
      sensitivityTitle: 'Чутливість до деградації комірок (±1 відсотковий пункт)',
      lowerDegradation: 'Краща якість (-1% деградації)',
      baseScenario: 'Базовий сценарій',
      higherDegradation: 'Гірша якість (+1% деградації)',
      assumptionsTitle: 'Методика розрахунку та припущення',
      rfqCta: 'Отримати фінансову пропозицію (ТКП)',
      fields: {
        capexUsd: 'Капітальні інвестиції (CAPEX), USD',
        annualOpexUsd: 'Щорічні експлуатаційні витрати (OPEX), USD',
        capacityKwh: 'Корисна ємність за цикл, kWh',
        cyclesPerYear: 'Кількість повних циклів на рік',
        degradationPct: 'Річна деградація ємності, %',
        lifetimeYears: 'Проєктний строк служби, років',
        roundTripEfficiencyPct: 'ККД системи (Round-Trip Efficiency), %',
        discountRatePct: 'Ставка дисконтування капіталу (WACC), %',
      },
    },
    en: {
      title: 'LCOS & Economic Sizing Model',
      subtitle: 'Select a standard system preset or adjust CAPEX/OPEX assumptions.',
      presetsLabel: 'CATL System Presets:',
      calcBtn: 'Calculate LCOS',
      calculating: 'Computing Discounted Cash Flows…',
      resultTitle: 'LCOS Sizing Output',
      emptyTitle: 'Enter project financial & operational assumptions',
      emptySub: 'LCOS represents the levelized cost per kWh delivered over the full operational lifetime.',
      lcosLabel: 'LCOS (Levelized Cost of Storage)',
      annualThroughput: 'Annual Delivered Energy',
      lifetimeThroughput: 'Cumulative Lifetime Delivered Energy',
      pvThroughput: 'Discounted Energy (NPV)',
      pvCost: 'Present Value of Costs (PV Cost)',
      algoVersion: 'Algorithm Version',
      sensitivityTitle: 'Degradation Sensitivity (±1 Percentage Point)',
      lowerDegradation: 'Optimistic (-1% degradation)',
      baseScenario: 'Base Case Scenario',
      higherDegradation: 'Conservative (+1% degradation)',
      assumptionsTitle: 'Financial Methodology & Assumptions',
      rfqCta: 'Request Engineered Bankable TKP',
      fields: {
        capexUsd: 'Total Capital Expenditure (CAPEX), USD',
        annualOpexUsd: 'Annual Operating Expenditure (OPEX), USD',
        capacityKwh: 'Usable Cycle Capacity, kWh',
        cyclesPerYear: 'Full-Equivalent Cycles per Year',
        degradationPct: 'Annual Cell Degradation, %',
        lifetimeYears: 'Operational Lifetime, Years',
        roundTripEfficiencyPct: 'Round-Trip Efficiency (RTE), %',
        discountRatePct: 'Discount Rate / WACC, %',
      },
    },
    'zh-CN': {
      title: '度电成本 LCOS 经济性分析参数',
      subtitle: '选择典型 CATL 储能配置或手动调整系统投资及运维参数。',
      presetsLabel: 'CATL 系统基准配置：',
      calcBtn: '计算度电成本 LCOS',
      calculating: '正在计算现金流折现模型…',
      resultTitle: 'LCOS 分析与能量吞吐量结果',
      emptyTitle: '输入项目参数或选择基准预设',
      emptySub: 'LCOS 代表储能系统在全生命周期内每放出一度电 (kWh) 的综合成本。',
      lcosLabel: '度电储能成本 (LCOS)',
      annualThroughput: '年有效放电量',
      lifetimeThroughput: '全寿命周期累计放电量',
      pvThroughput: '折现能量现值 (NPV kWh)',
      pvCost: '总支出折现成本 (PV Cost)',
      algoVersion: '计算算法版本',
      sensitivityTitle: '电芯衰减率敏感性分析 (±1百分点)',
      lowerDegradation: '优选工况 (-1% 衰减)',
      baseScenario: '基准方案',
      higherDegradation: '保守工况 (+1% 衰减)',
      assumptionsTitle: '计算方法与财务假设',
      rfqCta: '申请可融资性商业报价方案 (RFQ)',
      fields: {
        capexUsd: '总系统初始投资 (CAPEX), USD',
        annualOpexUsd: '年均运维支出 (OPEX), USD',
        capacityKwh: '单次循环有效可用容量, kWh',
        cyclesPerYear: '年等效满充满放循环次数',
        degradationPct: '年化容量衰减率, %',
        lifetimeYears: '项目设计运营年限, 年',
        roundTripEfficiencyPct: '充放电系统转换效率 (RTE), %',
        discountRatePct: '资金折现率 (WACC), %',
      },
    },
  }[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA'];

  const applyPreset = (preset: typeof presets[0]) => {
    setValues(preset.values);
    setActivePreset(preset.id);
  };

  const update = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    setActivePreset('');
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);
    setBusy(true);

    try {
      const response = await fetch('/api/v1/calculations/lcos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)]))
        ),
      });

      const body = await response.json();
      if (!response.ok || !body.data) {
        throw new Error('Перевірте всі параметри й повторіть розрахунок.');
      }
      setResult(body.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Калькулятор тимчасово недоступний.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="calc-layout">
      {/* Parameters Form */}
      <form className="calc-card" onSubmit={submit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Calculator style={{ width: 20, height: 20, color: '#0066ff' }} />
          <h2 style={{ margin: 0, fontSize: 20, color: '#091d34' }}>{t.title}</h2>
        </div>
        <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 18px', lineHeight: 1.5 }}>
          {t.subtitle}
        </p>

        {/* Quick System Presets */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: 8 }}>
            {t.presetsLabel}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
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

        {/* Input Fields */}
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {Object.entries(t.fields).map(([name, label]) => (
            <div className="field" key={name}>
              <label htmlFor={`lcos-${name}`} style={{ fontSize: 12, fontWeight: 650, color: '#334155' }}>
                {label}
              </label>
              <input
                id={`lcos-${name}`}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                required
                value={values[name] || ''}
                onChange={(event) => update(name, event.target.value)}
              />
            </div>
          ))}
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
              <DollarSign style={{ width: 16, height: 16 }} />
              <span>{t.calcBtn}</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </>
          )}
        </button>
      </form>

      {/* Output Card */}
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
              <div
                className="calc-result"
                style={{
                  gridColumn: 'span 2',
                  background: 'linear-gradient(135deg, #07192f, #0c2b4f)',
                  color: '#ffffff',
                  borderRadius: 14,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <small style={{ color: '#93c5fd', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.lcosLabel}
                </small>
                <strong style={{ display: 'block', fontSize: 32, fontWeight: 850, color: '#38bdf8', marginTop: 4 }}>
                  {money(result.lcosUsdPerKwh)} USD / kWh
                </strong>
                <span style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4, display: 'block' }}>
                  ≈ {money(result.lcosUsdPerKwh * 41.5)} UAH / kWh (за курсом НБУ)
                </span>
              </div>

              <Metric label={t.annualThroughput} value={`${number(result.annualThroughputKwh)} kWh`} />
              <Metric label={t.lifetimeThroughput} value={`${number(result.lifetimeUndiscountedThroughputKwh)} kWh`} />
              <Metric label={t.pvThroughput} value={`${number(result.presentValueThroughputKwh)} kWh`} />
              <Metric label={t.pvCost} value={`${money(result.presentValueCostUsd)} USD`} />
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 750, color: '#091d34', marginTop: 24, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingDown style={{ width: 16, height: 16, color: '#0066ff' }} />
              {t.sensitivityTitle}
            </h3>
            <div className="calc-results" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <Metric label={t.lowerDegradation} value={`${money(result.sensitivity.degradationMinusOnePct)} USD`} />
              <Metric label={t.baseScenario} value={`${money(result.sensitivity.base)} USD`} highlight />
              <Metric label={t.higherDegradation} value={`${money(result.sensitivity.degradationPlusOnePct)} USD`} />
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 750, color: '#091d34', marginTop: 20, marginBottom: 8 }}>
              {t.assumptionsTitle}
            </h3>
            <ul className="field-hint" style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="field-hint" style={{ marginTop: 16, color: '#94a3b8' }}>
              Розраховано: {new Date(result.calculatedAt).toLocaleString(locale)} · Алгоритм: {result.algorithmVersion}
            </p>

            <Link
              className="button button-secondary"
              style={{ width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              href={`/${locale}/rfq?capacityKwh=${values.capacityKwh}&powerKw=${Math.round(Number(values.capacityKwh) / 2)}`}
            >
              <span>{t.rfqCta}</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </>
        )}
      </section>
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
        padding: 14,
      }}
    >
      <small style={{ display: 'block', color: highlight ? '#0054d1' : '#64748b', fontSize: 11, fontWeight: 600 }}>
        {label}
      </small>
      <strong style={{ display: 'block', fontSize: 17, color: highlight ? '#0066ff' : '#091d34', marginTop: 4 }}>
        {value}
      </strong>
    </div>
  );
}

function number(value: number) {
  return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(value);
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
}
