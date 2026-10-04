'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { simulatePeakShaving, type ProfileId } from '../../lib/energy/illustrativeSim';

type L = 'uk-UA' | 'en' | 'zh-CN';

const copy: Record<L, {
  kicker: string; title: string; body: string;
  profiles: Record<ProfileId, string>; profile: string;
  target: string; power: string; energy: string;
  before: string; after: string; soc: string;
  peakBefore: string; peakAfter: string; reduction: string; discharged: string;
  ok: string; limPower: string; limEnergy: string;
  note: string; cta: string; cta2: string;
}> = {
  'uk-UA': {
    kicker: 'ЛАБОРАТОРІЯ · PEAK SHAVING',
    title: 'Подивіться, як BESS зрізає пік — ще до розмови з інженером',
    body: 'Оберіть тип об’єкта, задайте ліміт потужності з мережі та параметри накопичувача. Модель покаже новий графік споживання й чого саме не вистачає: потужності чи ємності.',
    profiles: { factory: 'Завод, 2 зміни', cold: 'Холодильний склад', agro: 'Елеватор у сезон' },
    profile: 'Профіль навантаження',
    target: 'Ліміт з мережі', power: 'Потужність BESS', energy: 'Ємність BESS',
    before: 'Без BESS', after: 'З BESS', soc: 'Заряд BESS',
    peakBefore: 'Пік без BESS', peakAfter: 'Пік з BESS', reduction: 'Зниження піку', discharged: 'Віддано за добу',
    ok: 'Ціль досягнута: споживання не перевищує ліміт.',
    limPower: 'Не вистачає потужності: збільште кВт або підніміть ліміт.',
    limEnergy: 'Не вистачає ємності: пікові години довші, ніж запас енергії.',
    note: 'Синтетичний профіль, 15-хв крок, резерв 10% ємності, ККД заряду 92%. Для реального рішення потрібні інтервальні дані лічильника.',
    cta: 'Розрахувати на своїх даних', cta2: 'Як читати профіль навантаження',
  },
  en: {
    kicker: 'LAB · PEAK SHAVING',
    title: 'See how a BESS clips the peak — before you talk to an engineer',
    body: 'Pick a facility type, set the grid demand limit and the storage parameters. The model redraws the demand curve and tells you what is missing: power or energy.',
    profiles: { factory: 'Factory, 2 shifts', cold: 'Cold storage', agro: 'Grain elevator, season' },
    profile: 'Load profile',
    target: 'Grid limit', power: 'BESS power', energy: 'BESS energy',
    before: 'Without BESS', after: 'With BESS', soc: 'BESS charge',
    peakBefore: 'Peak without BESS', peakAfter: 'Peak with BESS', reduction: 'Peak reduction', discharged: 'Delivered per day',
    ok: 'Target met: demand never exceeds the limit.',
    limPower: 'Power-limited: add kW or raise the limit.',
    limEnergy: 'Energy-limited: peak hours last longer than the stored energy.',
    note: 'Synthetic profile, 15-min step, 10% capacity reserve, 92% charge efficiency. A real decision needs interval meter data.',
    cta: 'Run it on your data', cta2: 'How to read a load profile',
  },
  'zh-CN': {
    kicker: '实验室 · 削峰',
    title: '在联系工程师之前，先看看储能如何削减峰值',
    body: '选择设施类型，设定电网取电上限与储能参数。模型将重绘负荷曲线，并指出不足之处：功率还是容量。',
    profiles: { factory: '工厂（两班制）', cold: '冷库', agro: '粮食烘干（季节）' },
    profile: '负荷曲线',
    target: '电网上限', power: '储能功率', energy: '储能容量',
    before: '无储能', after: '有储能', soc: '储能电量',
    peakBefore: '无储能峰值', peakAfter: '有储能峰值', reduction: '削峰幅度', discharged: '日放电量',
    ok: '目标达成：负荷未超过上限。',
    limPower: '功率不足：增加 kW 或提高上限。',
    limEnergy: '容量不足：高峰时段长于储能电量可覆盖时间。',
    note: '合成负荷曲线，15 分钟步长，保留 10% 容量，充电效率 92%。实际决策需要电表间隔数据。',
    cta: '使用您的数据计算', cta2: '如何解读负荷曲线',
  },
};

/** A sensible starting limit per profile (~85% of its synthetic peak) so every profile shows an effect. */
const DEFAULT_TARGET: Record<ProfileId, number> = { factory: 1450, cold: 1100, agro: 1350 };

const n = (v: number) => Math.round(v).toLocaleString('uk-UA').replace(/ /g, ' ');

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div className="kx-slider">
      <label htmlFor={id}><span>{label}</span><output htmlFor={id} className="kx-mono">{n(value)} {unit}</output></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function PeakShavingLab({ locale }: { locale: string }) {
  const t = copy[(locale as L)] ?? copy['uk-UA'];
  const [profile, setProfile] = useState<ProfileId>('factory');
  const [target, setTarget] = useState(1450);
  const [power, setPower] = useState(500);
  const [energy, setEnergy] = useState(1500);
  const r = useMemo(() => simulatePeakShaving(profile, target, power, energy), [profile, target, power, energy]);

  const W = 720, H = 260, top = 2200;
  const x = (tt: number) => (tt / 24) * W;
  const y = (kw: number) => H - (kw / top) * H;
  const line = (key: 'before' | 'after') => r.points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const area = `${line('after')} L${W} ${H} L0 ${H} Z`;
  const reduction = r.peakBefore ? Math.round((1 - r.peakAfter / r.peakBefore) * 100) : 0;
  const status = r.limitedBy === 'none' ? t.ok : r.limitedBy === 'power' ? t.limPower : t.limEnergy;

  return (
    <div className="kx-lab">
      <div className="kx-lab-controls">
        <fieldset className="kx-seg">
          <legend>{t.profile}</legend>
          {(Object.keys(t.profiles) as ProfileId[]).map((id) => (
            <button key={id} type="button" aria-pressed={profile === id} onClick={() => { setProfile(id); setTarget(DEFAULT_TARGET[id]); }}>{t.profiles[id]}</button>
          ))}
        </fieldset>
        <Slider label={t.target} value={target} min={800} max={1800} step={25} unit="kW" onChange={setTarget} />
        <Slider label={t.power} value={power} min={100} max={1500} step={50} unit="kW" onChange={setPower} />
        <Slider label={t.energy} value={energy} min={200} max={5000} step={100} unit="kWh" onChange={setEnergy} />
        <p className={`kx-lab-status ${r.limitedBy === 'none' ? 'is-ok' : 'is-warn'}`} role="status">{status}</p>
        <div className="kx-lab-actions">
          <Link className="kx-btn kx-btn-primary" href={`/${locale}/bess-designer`}>{t.cta}<ArrowRight size={16} /></Link>
          <Link className="kx-link" href={`/${locale}/resources/glossary#load-profile`}>{t.cta2}</Link>
        </div>
      </div>

      <div className="kx-lab-chart">
        <dl className="kx-kpis">
          <div><dt>{t.peakBefore}</dt><dd className="kx-mono">{n(r.peakBefore)}<small> kW</small></dd></div>
          <div><dt>{t.peakAfter}</dt><dd className="kx-mono kx-accent">{n(r.peakAfter)}<small> kW</small></dd></div>
          <div><dt>{t.reduction}</dt><dd className="kx-mono">−{reduction}<small>%</small></dd></div>
          <div><dt>{t.discharged}</dt><dd className="kx-mono">{n(r.dischargedKwh)}<small> kWh</small></dd></div>
        </dl>
        <svg viewBox={`0 0 ${W} ${H + 24}`} className="kx-chart" role="img" aria-label={`${t.peakBefore} ${n(r.peakBefore)} kW, ${t.peakAfter} ${n(r.peakAfter)} kW`}>
          {[500, 1000, 1500, 2000].map((g) => (
            <g key={g}>
              <line x1="0" x2={W} y1={y(g)} y2={y(g)} className="kx-gridline" />
              <text x="4" y={y(g) - 4} className="kx-axis">{n(g)}</text>
            </g>
          ))}
          {[0, 6, 12, 18, 24].map((h) => (
            <text key={h} x={Math.min(W - 16, x(h))} y={H + 18} className="kx-axis">{String(h).padStart(2, '0')}:00</text>
          ))}
          <path d={area} className="kx-area" />
          <path d={line('before')} className="kx-line-before" />
          <path d={line('after')} className="kx-line-after" />
          <line x1="0" x2={W} y1={y(target)} y2={y(target)} className="kx-target" />
          <text x={W - 4} y={y(target) - 6} textAnchor="end" className="kx-axis kx-target-label">{t.target} {n(target)} kW</text>
          {r.points.map((p, i) => (i % 2 === 0 ? (
            <rect key={i} x={x(p.t)} y={H - p.soc * 22} width={W / 48 - 1.5} height={p.soc * 22} className="kx-socbar" />
          ) : null))}
        </svg>
        <ul className="kx-legend">
          <li><i className="kx-sw kx-sw-before" />{t.before}</li>
          <li><i className="kx-sw kx-sw-after" />{t.after}</li>
          <li><i className="kx-sw kx-sw-soc" />{t.soc}</li>
        </ul>
        <p className="kx-fine">{t.note}</p>
      </div>
    </div>
  );
}
