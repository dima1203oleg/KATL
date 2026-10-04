'use client';

/**
 * "How long will your site run without the grid?" — the question every Ukrainian business asks first.
 * Deterministic: hours = usable energy × units × inverter efficiency ÷ critical load.
 * System data comes from the catalogue (passed from the server), so it updates with the PIM.
 */
import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { ArrowRight, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export type BackupSystem = { id: string; name: string; usableKwh: number; powerKw: number };
type L = 'uk-UA' | 'en' | 'zh-CN';

const EFF = 0.95; // PCS/inverter efficiency assumed for discharge

const COPY = {
  'uk-UA': {
    load: 'Критичне навантаження', system: 'Система CATL', units: 'Кількість систем', start: 'Відключення о',
    hours: 'год автономної роботи', until: 'до', nextDay: 'наступного дня',
    okPower: 'Потужності достатньо', lowPower: (n: number) => `Потужності не вистачає: потрібно щонайменше ${n} шт.`,
    energy: 'Корисна енергія', power: 'Потужність', fixPower: 'Встановити потрібну кількість',
    assumptions: `Припущення: ККД перетворення ${Math.round(EFF * 100)}%, постійне навантаження, повний заряд на старті, без СЕС і генератора. Характеристики — попередні дані каталогу; остаточні — в ТКП.`,
    cta: 'Отримати ТКП на цю конфігурацію', details: (h: string, kw: number, sys: string, n: number) => `Резервне живлення: ${kw} кВт критичного навантаження, ціль ≈${h} год. Розглядаю ${n} × ${sys}.`,
    timeline: 'Шкала часу відключення', empty: 'Каталог тимчасово недоступний — розрахунок відновиться автоматично.',
  },
  en: {
    load: 'Critical load', system: 'CATL system', units: 'Number of systems', start: 'Outage starts at',
    hours: 'hours of autonomy', until: 'until', nextDay: 'next day',
    okPower: 'Enough power', lowPower: (n: number) => `Not enough power: at least ${n} units needed.`,
    energy: 'Usable energy', power: 'Power', fixPower: 'Set the required number',
    assumptions: `Assumptions: ${Math.round(EFF * 100)}% conversion efficiency, constant load, full charge at start, no PV or generator. Specs are preliminary catalogue data; final values in the proposal.`,
    cta: 'Get a proposal for this configuration', details: (h: string, kw: number, sys: string, n: number) => `Backup power: ${kw} kW critical load, target ≈${h} h. Considering ${n} × ${sys}.`,
    timeline: 'Outage timeline', empty: 'Catalogue temporarily unavailable — the calculation will return automatically.',
  },
  'zh-CN': {
    load: '重要负荷', system: 'CATL 系统', units: '系统数量', start: '停电开始时间',
    hours: '小时 离网运行', until: '至', nextDay: '次日',
    okPower: '功率充足', lowPower: (n: number) => `功率不足：至少需要 ${n} 台。`,
    energy: '可用能量', power: '功率', fixPower: '设为所需数量',
    assumptions: `假设：转换效率 ${Math.round(EFF * 100)}%，负荷恒定，起始满电，无光伏及发电机。参数为产品目录初步数据，以正式方案为准。`,
    cta: '获取该配置的正式方案', details: (h: string, kw: number, sys: string, n: number) => `备用电源：重要负荷 ${kw} kW，目标约 ${h} 小时。考虑 ${n} × ${sys}。`,
    timeline: '停电时间轴', empty: '产品目录暂时不可用，恢复后自动计算。',
  },
} as const;

const fmt = (n: number, lang: L, d = 0) => n.toLocaleString(lang, { maximumFractionDigits: d, minimumFractionDigits: d }).replace(/ | /g, ' ');

export function BlackoutCalc({ locale, systems }: { locale: string; systems: BackupSystem[] }) {
  const lang = (locale === 'en' || locale === 'zh-CN' ? locale : 'uk-UA') as L;
  const t = COPY[lang];
  const ids = { load: useId(), sys: useId(), units: useId(), start: useId() };
  // Start from a mid-size C&I system if present: it is the most common Ukrainian enquiry.
  const initial = systems.find((s) => s.usableKwh >= 200 && s.usableKwh <= 1000) ?? systems[0];
  const [sysId, setSysId] = useState(initial?.id ?? '');
  const [load, setLoad] = useState(150);
  const [units, setUnits] = useState(1);
  const [start, setStart] = useState(18);

  const sys = systems.find((s) => s.id === sysId) ?? initial;
  const r = useMemo(() => {
    if (!sys) return null;
    const energy = sys.usableKwh * units;
    const power = sys.powerKw * units;
    const hours = (energy * EFF) / load;
    const needUnits = Math.ceil(load / sys.powerKw);
    const end = start + hours;
    return { energy, power, hours, needUnits, powerOk: power >= load, end };
  }, [sys, units, load, start]);

  if (!sys || !r) return <p className="kx-bo-empty">{t.empty}</p>;

  const hText = fmt(r.hours, lang, r.hours < 10 ? 1 : 0);
  const endH = r.end % 24;
  const endLabel = `${String(Math.floor(endH)).padStart(2, '0')}:${String(Math.round((endH % 1) * 60) % 60).padStart(2, '0')}`;
  const span = 24; // timeline shows 24 h from outage start
  const fill = Math.min(1, r.hours / span);
  const rfq = `/${lang}/rfq?product=${encodeURIComponent(sys.id)}&powerKw=${load}&capacityKwh=${Math.round(r.energy)}&durationHours=${encodeURIComponent(hText)}&details=${encodeURIComponent(t.details(hText, load, sys.name, units))}`;

  return (
    <div className="kx-bo">
      <form className="kx-bo-controls" onSubmit={(e) => e.preventDefault()}>
        <div className="kx-slider">
          <label htmlFor={ids.load}><span>{t.load}</span><output htmlFor={ids.load} className="kx-mono">{fmt(load, lang)} kW</output></label>
          <input id={ids.load} type="range" min={5} max={3000} step={5} value={load} onChange={(e) => setLoad(Number(e.target.value))} />
        </div>
        <div className="kx-field">
          <label htmlFor={ids.sys}>{t.system}</label>
          <select id={ids.sys} value={sys.id} onChange={(e) => { setSysId(e.target.value); setUnits(1); }}>
            {systems.map((s) => <option key={s.id} value={s.id}>{s.name} · {fmt(s.usableKwh, lang)} kWh / {fmt(s.powerKw, lang)} kW</option>)}
          </select>
        </div>
        <div className="kx-bo-row">
          <div className="kx-field">
            <label htmlFor={ids.units}>{t.units}</label>
            <div className="kx-stepper">
              <button type="button" aria-label="−1" onClick={() => setUnits((u) => Math.max(1, u - 1))}>−</button>
              <input id={ids.units} type="number" inputMode="numeric" min={1} max={200} value={units} onChange={(e) => setUnits(Math.min(200, Math.max(1, Number(e.target.value) || 1)))} />
              <button type="button" aria-label="+1" onClick={() => setUnits((u) => Math.min(200, u + 1))}>+</button>
            </div>
          </div>
          <div className="kx-field">
            <label htmlFor={ids.start}>{t.start}</label>
            <select id={ids.start} value={start} onChange={(e) => setStart(Number(e.target.value))}>
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
            </select>
          </div>
        </div>
        <p className={`kx-bo-status ${r.powerOk ? 'is-ok' : 'is-warn'}`} role="status">
          {r.powerOk ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
          <span>{r.powerOk ? t.okPower : t.lowPower(r.needUnits)}</span>
          {!r.powerOk ? <button type="button" onClick={() => setUnits(r.needUnits)}>{t.fixPower}</button> : null}
        </p>
      </form>

      <div className="kx-bo-result" aria-live="polite">
        <p className="kx-bo-big"><span className="kx-mono">{r.powerOk ? hText : '—'}</span><small>{t.hours}</small></p>
        {r.powerOk ? <p className="kx-bo-until">{t.until} <strong className="kx-mono">{endLabel}</strong>{r.end >= 24 ? ` · ${t.nextDay}` : ''}{r.hours > span ? ' +' : ''}</p> : null}

        <div className="kx-bo-timeline" role="img" aria-label={`${t.timeline}: ${hText} h`}>
          <div className="kx-bo-track"><span className={r.powerOk ? '' : 'is-off'} style={{ transform: `scaleX(${r.powerOk ? fill : 0})` }} /></div>
          <div className="kx-bo-ticks" aria-hidden="true">
            {[0, 6, 12, 18, 24].map((o) => <span key={o} style={{ left: `${(o / span) * 100}%` }}>{String((start + o) % 24).padStart(2, '0')}:00</span>)}
          </div>
        </div>

        <dl className="kx-bo-facts">
          <div><dt>{t.energy}</dt><dd className="kx-mono">{fmt(r.energy, lang)} kWh</dd></div>
          <div><dt>{t.power}</dt><dd className="kx-mono">{fmt(r.power, lang)} kW</dd></div>
        </dl>
        <Link className="kx-btn kx-btn-primary" href={rfq}><Zap size={16} aria-hidden="true" />{t.cta}<ArrowRight size={16} aria-hidden="true" /></Link>
        <p className="kx-fine kx-fine-light">{t.assumptions}</p>
      </div>
    </div>
  );
}
