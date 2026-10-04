'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { simulateDay, type FlowFrame, type FlowMode } from '../../lib/energy/illustrativeSim';

type L = 'uk-UA' | 'en' | 'zh-CN';

const copy: Record<L, {
  modes: Record<FlowMode, { label: string; caption: string }>;
  solar: string; grid: string; bess: string; load: string; bus: string;
  outage: string; price: Record<FlowFrame['price'], string>;
  import: string; export: string; charge: string; discharge: string; idle: string;
  play: string; pause: string; time: string; note: string; figure: string;
}> = {
  'uk-UA': {
    modes: {
      peak: { label: 'Зрізання піків', caption: 'BESS тримає споживання з мережі нижче договірного ліміту, заряджаючись уночі.' },
      solar: { label: 'СЕС + накопичення', caption: 'Надлишок сонячної генерації вдень іде в батарею й повертається ввечері.' },
      backup: { label: 'Резерв', caption: 'Під час відключення критичне навантаження живиться від BESS і СЕС без перерви.' },
      arbitrage: { label: 'Арбітраж РДН', caption: 'Заряд у години низьких цін, віддача на ранковому та вечірньому піках ціни.' },
    },
    solar: 'СЕС', grid: 'Мережа', bess: 'BESS', load: 'Підприємство', bus: 'Шина 0.4/10 кВ',
    outage: 'ВІДКЛЮЧЕННЯ', price: { low: 'ціна низька', mid: 'ціна середня', high: 'ціна висока' },
    import: 'імпорт', export: 'експорт', charge: 'заряд', discharge: 'розряд', idle: 'очікування',
    play: 'Відтворити симуляцію', pause: 'Зупинити симуляцію', time: 'Час доби',
    note: 'Ілюстративна модель на синтетичному профілі. Не є розрахунком для вашого об’єкта.',
    figure: 'РИС. 01 — ПОТОКИ ЕНЕРГІЇ ЗА ДОБУ',
  },
  en: {
    modes: {
      peak: { label: 'Peak shaving', caption: 'The BESS keeps grid demand under the contracted limit and recharges overnight.' },
      solar: { label: 'Solar + storage', caption: 'Midday PV surplus is stored and delivered back in the evening.' },
      backup: { label: 'Backup', caption: 'During an outage, critical loads run on BESS and PV without interruption.' },
      arbitrage: { label: 'Arbitrage', caption: 'Charge in low-price hours, discharge into the morning and evening price peaks.' },
    },
    solar: 'Solar PV', grid: 'Grid', bess: 'BESS', load: 'Facility', bus: '0.4/10 kV bus',
    outage: 'OUTAGE', price: { low: 'low price', mid: 'mid price', high: 'high price' },
    import: 'import', export: 'export', charge: 'charging', discharge: 'discharging', idle: 'standby',
    play: 'Play simulation', pause: 'Pause simulation', time: 'Time of day',
    note: 'Illustrative model on a synthetic profile. Not a calculation for your site.',
    figure: 'FIG. 01 — ENERGY FLOWS OVER A DAY',
  },
  'zh-CN': {
    modes: {
      peak: { label: '削峰', caption: '储能将电网取电功率控制在合同限值以下，夜间充电。' },
      solar: { label: '光伏 + 储能', caption: '午间光伏余电存入电池，傍晚释放。' },
      backup: { label: '备用电源', caption: '停电期间，重要负荷由储能与光伏不间断供电。' },
      arbitrage: { label: '峰谷套利', caption: '低价时段充电，在早晚电价高峰放电。' },
    },
    solar: '光伏', grid: '电网', bess: '储能', load: '工厂', bus: '0.4/10 kV 母线',
    outage: '停电', price: { low: '低电价', mid: '平电价', high: '高电价' },
    import: '取电', export: '上网', charge: '充电', discharge: '放电', idle: '待机',
    play: '播放模拟', pause: '暂停模拟', time: '时刻',
    note: '基于合成负荷曲线的示意模型，并非针对您项目的计算结果。',
    figure: '图 01 — 一天内的能量流',
  },
};

const fmt = (n: number) => Math.round(Math.abs(n)).toLocaleString('uk-UA').replace(/ /g, ' ');
const hhmm = (t: number) => {
  const h = Math.floor(t) % 24;
  const m = Math.round((t - Math.floor(t)) * 60);
  return `${String(h).padStart(2, '0')}:${String(m === 60 ? 0 : m).padStart(2, '0')}`;
};

/** Two layouts of the same diagram: wide for desktop, compact (larger relative text) for phones. */
const GEOMETRY = {
  wide: {
    w: 560, h: 400,
    solar: [206, 20, 148], grid: [8, 164, 120], load: [432, 164, 120], bess: [196, 308], bus: [252, 186, 56, 28],
    eSolar: 'M280 92 L280 186', eGrid: 'M128 200 L252 200', eBess: 'M280 308 L280 214', eLoad: 'M308 200 L432 200',
  },
  compact: {
    w: 340, h: 420,
    solar: [100, 8, 140], grid: [0, 168, 106], load: [234, 168, 106], bess: [86, 332], bus: [150, 190, 40, 28],
    eSolar: 'M170 80 L170 190', eGrid: 'M106 204 L150 204', eBess: 'M170 332 L170 218', eLoad: 'M190 204 L234 204',
  },
} as const;

/** Edge between a node and the central bus. `value` > 0 flows towards the bus. */
function Edge({ d, value, color, max = 2400 }: { d: string; value: number; color: string; max?: number }) {
  const mag = Math.min(1, Math.abs(value) / max);
  const active = Math.abs(value) > 5;
  const duration = active ? `${(1.6 - mag * 1.1).toFixed(2)}s` : '0s';
  return (
    <g>
      <path d={d} className="kx-edge-base" />
      <path
        d={d}
        className={`kx-edge-flow ${active ? '' : 'is-idle'} ${value < 0 ? 'is-reverse' : ''}`}
        style={{ stroke: color, strokeWidth: 2 + mag * 5, animationDuration: duration }}
      />
    </g>
  );
}

export function EnergyFlowHero({ locale }: { locale: string }) {
  const t = copy[(locale as L)] ?? copy['uk-UA'];
  const [mode, setMode] = useState<FlowMode>('peak');
  const [index, setIndex] = useState(40); // 10:00
  const [playing, setPlaying] = useState(true);
  const reduced = useRef(false);
  const days = useMemo(() => ({
    peak: simulateDay('peak'), solar: simulateDay('solar'), backup: simulateDay('backup'), arbitrage: simulateDay('arbitrage'),
  }), []);
  const frames = days[mode];
  const f = frames[Math.min(index, frames.length - 1)];

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % (frames.length - 1));
    }, 150);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  const solarNet = f.solar; // towards bus
  const gridNet = f.gridToLoad + f.gridToBess - f.solarToGrid; // + import towards bus
  const bessNet = f.bessToLoad - f.solarToBess - f.gridToBess; // + discharge towards bus
  const loadNet = -f.load; // away from bus

  const bessState = bessNet > 5 ? t.discharge : bessNet < -5 ? t.charge : t.idle;
  const gridState = !f.gridUp ? t.outage : gridNet < -5 ? t.export : t.import;

  // Sparkline of facility demand from the grid for the scrubber.
  const spark = useMemo(() => {
    const max = 2500;
    return frames.map((fr, i) => {
      const x = (i / (frames.length - 1)) * 1000;
      const y = 60 - (Math.max(0, fr.gridToLoad + fr.gridToBess) / max) * 56;
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }, [frames]);

  return (
    <figure className="kx-flow" aria-label={t.figure}>
      <figcaption className="kx-flow-head">
        <span className="kx-mono kx-dim">{t.figure}</span>
        <div className="kx-flow-tabs" role="group" aria-label={t.figure}>
          {(Object.keys(t.modes) as FlowMode[]).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {t.modes[m].label}
            </button>
          ))}
        </div>
      </figcaption>

      <div className="kx-flow-stage">
        {(['wide', 'compact'] as const).map((variant) => {
          const g = GEOMETRY[variant];
          return (
            <svg
              key={variant}
              viewBox={`0 0 ${g.w} ${g.h}`}
              className={`kx-flow-svg kx-flow-svg-${variant}`}
              role="img"
              aria-label={`${t.modes[mode].label}: ${t.modes[mode].caption}`}
            >
              <defs>
                <pattern id={`kx-grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".06" />
                </pattern>
              </defs>
              <rect width={g.w} height={g.h} fill={`url(#kx-grid-${variant})`} />

              <Edge d={g.eSolar} value={solarNet} color="var(--kx-solar)" />
              <Edge d={g.eGrid} value={gridNet} color="var(--kx-grid)" />
              <Edge d={g.eBess} value={bessNet} color="var(--kx-charge)" max={700} />
              <Edge d={g.eLoad} value={-loadNet} color="var(--kx-load)" />

              <g className="kx-bus">
                <rect x={g.bus[0]} y={g.bus[1]} width={g.bus[2]} height={g.bus[3]} rx="6" />
                {variant === 'wide' && <text x="316" y="180" className="kx-svg-caption">{t.bus}</text>}
              </g>

              <g className={`kx-node ${mode === 'arbitrage' ? 'is-off' : ''}`} transform={`translate(${g.solar[0]} ${g.solar[1]})`}>
                <rect width={g.solar[2]} height="72" rx="12" />
                <circle cx="20" cy="24" r="6" fill="var(--kx-solar)" />
                <text x="34" y="28" className="kx-svg-label">{t.solar}</text>
                <text x="14" y="56" className="kx-svg-value">{fmt(f.solar)}<tspan className="kx-svg-unit"> kW</tspan></text>
              </g>

              <g className={`kx-node ${f.gridUp ? '' : 'is-alert'}`} transform={`translate(${g.grid[0]} ${g.grid[1]})`}>
                <rect width={g.grid[2]} height="72" rx="12" />
                <circle cx="18" cy="24" r="6" fill="var(--kx-grid)" />
                <text x="31" y="28" className="kx-svg-label">{t.grid}</text>
                <text x="12" y="56" className="kx-svg-value">{f.gridUp ? fmt(gridNet) : '0'}<tspan className="kx-svg-unit"> kW</tspan></text>
                <text x={g.grid[2] / 2} y="90" textAnchor="middle" className={`kx-svg-caption ${f.gridUp ? '' : 'kx-alert-text'}`}>
                  {gridState}{mode === 'arbitrage' && f.gridUp ? ` · ${t.price[f.price]}` : ''}
                </text>
              </g>

              <g className="kx-node" transform={`translate(${g.load[0]} ${g.load[1]})`}>
                <rect width={g.load[2]} height="72" rx="12" />
                {variant === 'wide' && <circle cx="20" cy="24" r="6" fill="var(--kx-load)" />}
                <text x={variant === 'wide' ? 34 : 12} y="28" className="kx-svg-label">{t.load}</text>
                <text x="12" y="56" className="kx-svg-value">{fmt(f.load)}<tspan className="kx-svg-unit"> kW</tspan></text>
              </g>

              <g className="kx-node kx-node-bess" transform={`translate(${g.bess[0]} ${g.bess[1]})`}>
                <rect width="168" height="80" rx="12" />
                <text x="16" y="26" className="kx-svg-label">{t.bess}</text>
                <text x="152" y="26" textAnchor="end" className="kx-svg-caption">{bessState}</text>
                <text x="16" y="54" className="kx-svg-value">{fmt(bessNet)}<tspan className="kx-svg-unit"> kW</tspan></text>
                <rect x="16" y="62" width="136" height="7" rx="3.5" className="kx-soc-track" />
                <rect x="16" y="62" width={Math.max(3, 136 * f.soc)} height="7" rx="3.5" fill="var(--kx-charge)" />
                <text x="152" y="54" textAnchor="end" className="kx-svg-caption">SOC {Math.round(f.soc * 100)}%</text>
              </g>
            </svg>
          );
        })}
      </div>

      <div className="kx-flow-foot">
        <button type="button" className="kx-icon-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? t.pause : t.play}>
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <span className="kx-mono kx-clock" aria-live="off">{hhmm(f.t)}</span>
        <div className="kx-scrub">
          <svg viewBox="0 0 1000 64" preserveAspectRatio="none" aria-hidden="true">
            <path d={spark} className="kx-spark" />
            <line x1={(index / (frames.length - 1)) * 1000} x2={(index / (frames.length - 1)) * 1000} y1="0" y2="64" className="kx-playhead" />
          </svg>
          <input
            type="range"
            min={0}
            max={frames.length - 2}
            value={index}
            aria-label={t.time}
            aria-valuetext={hhmm(f.t)}
            onChange={(e) => { setPlaying(false); setIndex(Number(e.target.value)); }}
          />
        </div>
      </div>
      <p className="kx-flow-caption">{t.modes[mode].caption}</p>
      <p className="kx-flow-note">{t.note}</p>
    </figure>
  );
}
