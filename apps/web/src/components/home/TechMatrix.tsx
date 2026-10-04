'use client';

/**
 * CATL Tech Matrix — homepage bento.
 * Two kinds of numbers, never mixed:
 *  1. Manufacturer claims — quoted from CATL press releases, each tile links its source.
 *  2. Mode simulation — deterministic illustrative model (lib/energy/illustrativeSim), labelled as such.
 * Anything derived (e.g. container counts) is plain arithmetic on (1), shown with its formula.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { simulateDay, type FlowMode } from '../../lib/energy/illustrativeSim';

type L = 'uk-UA' | 'en' | 'zh-CN';
type Mode = 'peak' | 'microgrid' | 'blackout';
const SIM: Record<Mode, FlowMode> = { peak: 'peak', microgrid: 'solar', blackout: 'backup' };

const SRC = {
  tener: 'https://www.aap.com.au/aapreleases/cision20240412ae86428',
  stack: 'https://www.aap.com.au/aapreleases/cision20250507ae82459',
};

const COPY = {
  'uk-UA': {
    kicker: 'TECH MATRIX', title: 'Технології CATL — у цифрах, які можна перевірити',
    body: 'Ліворуч — заяви виробника з посиланням на першоджерело. Праворуч — як накопичувач поводиться у трьох режимах роботи на моделі заводу.',
    source: 'Джерело: прес-реліз CATL', claim: 'заява виробника',
    tenerTitle: 'TENER', tenerUnit: 'МВт·год', tenerBody: 'у 20-футовому контейнері (TEU). Щільність комірок — 430 Вт·год/л.',
    degTitle: 'Деградація', degNum: '0', degUnit: '% за 5 років', degBody: 'Нульова деградація ємності та потужності в перші п’ять років експлуатації.',
    degAfter: 'після 5 років — за гарантійними умовами', year: 'рік',
    stackTitle: 'TENER Stack', stackUnit: 'МВт·год', stackBody: 'Для станції 800 МВт·год:',
    containers: (a: number, b: number) => `${a} контейнери по 6 МВт·год проти ${b} по 9 МВт·год`,
    formula: '⌈800 ÷ 6⌉ і ⌈800 ÷ 9⌉ — арифметика на основі заявленої ємності',
    safetyTitle: 'Безпека TENER Stack', safety: [['2 год', 'вогнестійкість потрійної ізоляції'], ['+40%', 'чутливість газових сенсорів'], ['−35%', 'час спрацювання гасіння']],
    logTitle: 'Логістика', logNum: '<36', logUnit: 'т', logBody: 'маса кожної половини модуля TENER Stack — розрахунок перевезення до України робимо до ТКП.',
    logCta: 'Маршрут Китай → Україна',
    modesLabel: 'Режим роботи',
    modes: { peak: 'Зрізання піків', microgrid: 'Мікромережа + СЕС', blackout: 'Захист від блекауту' },
    modeNote: {
      peak: 'BESS тримає імпорт з мережі під договірним лімітом і заряджається вночі.',
      microgrid: 'Надлишок СЕС удень іде в накопичувач, а не в мережу, і повертається на об’єкт увечері.',
      blackout: 'О 17:00 мережа зникає — накопичувач і СЕС утримують навантаження до її повернення.',
    },
    kpi: { peak: 'Пік споживання', grid: 'Пік імпорту з мережі', solar: 'СЕС використано на об’єкті', outage: 'Покрито під час відключення', soc: 'Мін. заряд BESS' },
    legend: { load: 'Навантаження', grid: 'Імпорт з мережі', soc: 'Заряд BESS', outage: 'Відключення' },
    simNote: 'Ілюстративна модель: синтетичний профіль заводу, BESS 600 кВт / 1,6 МВт·год. Не є розрахунком для вашого об’єкта.',
    cta: 'Розрахувати на своїх даних',
  },
  en: {
    kicker: 'TECH MATRIX', title: 'CATL technology — in numbers you can verify',
    body: 'Left: manufacturer claims with a link to the primary source. Right: how storage behaves in three operating modes on a factory model.',
    source: 'Source: CATL press release', claim: 'manufacturer claim',
    tenerTitle: 'TENER', tenerUnit: 'MWh', tenerBody: 'in a 20-ft (TEU) container. Cell energy density: 430 Wh/L.',
    degTitle: 'Degradation', degNum: '0', degUnit: '% over 5 years', degBody: 'Zero capacity and power degradation in the first five years of operation.',
    degAfter: 'after year 5 — per warranty terms', year: 'year',
    stackTitle: 'TENER Stack', stackUnit: 'MWh', stackBody: 'For an 800 MWh plant:',
    containers: (a: number, b: number) => `${a} containers of 6 MWh vs ${b} of 9 MWh`,
    formula: '⌈800 ÷ 6⌉ and ⌈800 ÷ 9⌉ — arithmetic on the stated capacity',
    safetyTitle: 'TENER Stack safety', safety: [['2 h', 'fire resistance, triple-layer insulation'], ['+40%', 'gas sensor sensitivity'], ['−35%', 'suppression trigger time']],
    logTitle: 'Logistics', logNum: '<36', logUnit: 't', logBody: 'per TENER Stack half-unit — we plan transport to Ukraine before the proposal.',
    logCta: 'China → Ukraine route',
    modesLabel: 'Operating mode',
    modes: { peak: 'Peak shaving', microgrid: 'Microgrid + PV', blackout: 'Blackout protection' },
    modeNote: {
      peak: 'The BESS keeps grid import under the contracted limit and recharges overnight.',
      microgrid: 'Midday PV surplus goes into storage instead of the grid and returns to the site in the evening.',
      blackout: 'At 17:00 the grid drops — storage and PV carry the load until it returns.',
    },
    kpi: { peak: 'Peak demand', grid: 'Peak grid import', solar: 'PV used on site', outage: 'Covered during outage', soc: 'Min. BESS charge' },
    legend: { load: 'Load', grid: 'Grid import', soc: 'BESS charge', outage: 'Outage' },
    simNote: 'Illustrative model: synthetic factory profile, 600 kW / 1.6 MWh BESS. Not a calculation for your site.',
    cta: 'Run it on your data',
  },
  'zh-CN': {
    kicker: 'TECH MATRIX', title: 'CATL 技术——可核验的数字',
    body: '左侧为制造商公开声明并附原始出处；右侧展示储能在三种运行模式下于工厂模型中的表现。',
    source: '来源：CATL 新闻稿', claim: '制造商声明',
    tenerTitle: 'TENER 天恒', tenerUnit: 'MWh', tenerBody: '20 尺标准箱（TEU）。电芯能量密度 430 Wh/L。',
    degTitle: '衰减', degNum: '0', degUnit: '% · 5 年', degBody: '运行前五年容量与功率零衰减。',
    degAfter: '5 年后——以质保条款为准', year: '年',
    stackTitle: 'TENER Stack', stackUnit: 'MWh', stackBody: '以 800 MWh 电站为例：',
    containers: (a: number, b: number) => `${a} 台 6 MWh 集装箱 对比 ${b} 台 9 MWh`,
    formula: '⌈800 ÷ 6⌉ 与 ⌈800 ÷ 9⌉——基于声明容量的算术',
    safetyTitle: 'TENER Stack 安全', safety: [['2 小时', '三层隔热耐火'], ['+40%', '气体传感器灵敏度'], ['−35%', '消防触发时间']],
    logTitle: '物流', logNum: '<36', logUnit: '吨', logBody: 'TENER Stack 每个半模块重量——报价前完成至乌克兰的运输规划。',
    logCta: '中国 → 乌克兰路线',
    modesLabel: '运行模式',
    modes: { peak: '削峰', microgrid: '微电网 + 光伏', blackout: '停电保障' },
    modeNote: {
      peak: '储能将电网取电控制在合同上限以下，并在夜间充电。',
      microgrid: '午间光伏余电存入储能而非上网，晚间供给现场。',
      blackout: '17:00 电网中断——储能与光伏持续供电直至恢复。',
    },
    kpi: { peak: '负荷峰值', grid: '电网取电峰值', solar: '光伏就地消纳', outage: '停电期间覆盖率', soc: '储能最低电量' },
    legend: { load: '负荷', grid: '电网取电', soc: '储能电量', outage: '停电' },
    simNote: '示意模型：合成工厂负荷，储能 600 kW / 1.6 MWh。不代表您项目的计算结果。',
    cta: '使用您的数据计算',
  },
} as const;

const fmt = (n: number, lang: L) => Math.round(n).toLocaleString(lang).replace(/ | /g, ' ');

/** Counts up once when scrolled into view. SSR renders the final value, so no-JS and crawlers see the real number. */
function CountUp({ to, decimals = 0, lang }: { to: number; decimals?: number; lang: L }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setV(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{v.toLocaleString(lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

function Source({ href, label }: { href: string; label: string }) {
  return <a className="kx-tm-src" href={href} target="_blank" rel="noreferrer noopener">{label}<ArrowUpRight size={12} aria-hidden="true" /></a>;
}

export function TechMatrix({ locale }: { locale: string }) {
  const lang = (locale === 'en' || locale === 'zh-CN' ? locale : 'uk-UA') as L;
  const t = COPY[lang];
  const [mode, setMode] = useState<Mode>('peak');

  const sim = useMemo(() => {
    const f = simulateDay(SIM[mode]);
    const grid = f.map((x) => x.gridToLoad + x.gridToBess);
    const outage = f.filter((x) => !x.gridUp);
    const solarTotal = f.reduce((s, x) => s + x.solar, 0);
    const solarOnSite = f.reduce((s, x) => s + x.solarToLoad + x.solarToBess, 0);
    const outLoad = outage.reduce((s, x) => s + x.load, 0);
    const outServed = outage.reduce((s, x) => s + x.bessToLoad + x.solarToLoad, 0);
    return {
      f, grid,
      peakLoad: Math.max(...f.map((x) => x.load)),
      peakGrid: Math.max(...grid),
      solarShare: solarTotal ? (solarOnSite / solarTotal) * 100 : 0,
      outageCover: outLoad ? Math.min(100, (outServed / outLoad) * 100) : null,
      outageSpan: outage.length ? [outage[0].t, outage[outage.length - 1].t + 0.25] as [number, number] : null,
      minSoc: Math.min(...f.map((x) => x.soc)) * 100,
    };
  }, [mode]);

  // Chart geometry
  const W = 560, H = 200, TOP = 2000;
  const x = (h: number) => (h / 24) * W;
  const y = (kw: number) => H - (Math.min(kw, TOP) / TOP) * H;
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(sim.f[i].t).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const loadArea = `${path(sim.f.map((p) => p.load))} L${W} ${H} L0 ${H} Z`;
  const socPath = sim.f.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${(H - p.soc * H).toFixed(1)}`).join(' ');

  const kpis: Array<[string, string, string]> = mode === 'peak'
    ? [[t.kpi.peak, fmt(sim.peakLoad, lang), 'kW'], [t.kpi.grid, fmt(sim.peakGrid, lang), 'kW'], [t.kpi.soc, fmt(sim.minSoc, lang), '%']]
    : mode === 'microgrid'
      ? [[t.kpi.solar, fmt(sim.solarShare, lang), '%'], [t.kpi.grid, fmt(sim.peakGrid, lang), 'kW'], [t.kpi.soc, fmt(sim.minSoc, lang), '%']]
      : [[t.kpi.outage, fmt(sim.outageCover ?? 0, lang), '%'], [t.kpi.peak, fmt(sim.peakLoad, lang), 'kW'], [t.kpi.soc, fmt(sim.minSoc, lang), '%']];

  const ceil6 = Math.ceil(800 / 6), ceil9 = Math.ceil(800 / 9);

  return (
    <div className="kx-tm">
      {/* 1 — TENER capacity */}
      <article className="kx-tm-tile kx-tm-hero">
        <header><h3>{t.tenerTitle}</h3><span className="kx-tm-tag">{t.claim}</span></header>
        <p className="kx-tm-num"><CountUp to={6.25} decimals={2} lang={lang} /><small>{t.tenerUnit}</small></p>
        <p className="kx-tm-body">{t.tenerBody}</p>
        <svg className="kx-tm-teu" viewBox="0 -8 300 72" aria-hidden="true">
          <rect x="1" y="8" width="298" height="54" rx="3" className="kx-tm-teu-box" />
          {Array.from({ length: 20 }, (_, i) => <rect key={i} x={10 + i * 14.2} y="16" width="10" height="38" rx="1.5" className="kx-tm-teu-rack" style={{ animationDelay: `${i * 40}ms` }} />)}
          <text x="1" y="1" className="kx-tm-axis">20 ft · TEU</text>
        </svg>
        <Source href={SRC.tener} label={t.source} />
      </article>

      {/* 2 — Zero degradation */}
      <article className="kx-tm-tile kx-tm-deg">
        <header><h3>{t.degTitle}</h3><span className="kx-tm-tag">{t.claim}</span></header>
        <p className="kx-tm-num">{t.degNum}<small>{t.degUnit}</small></p>
        <svg viewBox="0 0 260 90" className="kx-tm-degchart" role="img" aria-label={t.degBody}>
          <line x1="0" x2="260" y1="20" y2="20" className="kx-tm-grid" />
          <line x1="0" x2="260" y1="80" y2="80" className="kx-tm-grid" />
          <text x="0" y="14" className="kx-tm-axis">100%</text>
          <path d="M0 20 L130 20" className="kx-tm-flat" />
          <path d="M130 20 L260 20" className="kx-tm-unknown" />
          <circle cx="130" cy="20" r="3.5" className="kx-tm-dot" />
          <text x="0" y="92" className="kx-tm-axis">0</text>
          <text x="124" y="92" className="kx-tm-axis">5</text>
          <text x="236" y="92" className="kx-tm-axis">10 {t.year}</text>
          <text x="136" y="36" className="kx-tm-axis kx-tm-muted">{t.degAfter}</text>
        </svg>
        <p className="kx-tm-body">{t.degBody}</p>
        <Source href={SRC.tener} label={t.source} />
      </article>

      {/* 3 — Live operating modes (illustrative simulation) */}
      <article className="kx-tm-tile kx-tm-live" aria-labelledby="tm-live-h">
        <header>
          <h3 id="tm-live-h">{t.modesLabel}</h3>
          <span className="kx-tm-pulse" aria-hidden="true" />
        </header>
        <div className="kx-tm-seg" role="tablist" aria-label={t.modesLabel}>
          {(Object.keys(t.modes) as Mode[]).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} aria-controls="tm-live-panel" onClick={() => setMode(m)}>{t.modes[m]}</button>
          ))}
        </div>
        <div id="tm-live-panel" role="tabpanel" aria-live="polite">
          <p className="kx-tm-mode-note">{t.modeNote[mode]}</p>
          <dl className="kx-tm-kpis">
            {kpis.map(([k, v, u]) => <div key={k}><dt>{k}</dt><dd><span className="kx-mono">{v}</span><small>{u}</small></dd></div>)}
          </dl>
          <svg viewBox={`0 0 ${W} ${H + 18}`} className="kx-tm-chart" role="img" aria-label={`${t.kpi.peak}: ${fmt(sim.peakLoad, lang)} kW; ${t.kpi.grid}: ${fmt(sim.peakGrid, lang)} kW`}>
            {sim.outageSpan ? <rect x={x(sim.outageSpan[0])} y="0" width={x(sim.outageSpan[1]) - x(sim.outageSpan[0])} height={H} className="kx-tm-outage" /> : null}
            {[500, 1000, 1500].map((g) => <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} className="kx-tm-grid" />)}
            <path d={loadArea} className="kx-tm-load" />
            <path d={socPath} className="kx-tm-soc" />
            <path d={path(sim.grid)} className="kx-tm-gridline" />
            {[0, 6, 12, 18, 24].map((h) => <text key={h} x={Math.min(W - 30, x(h))} y={H + 14} className="kx-tm-axis">{String(h).padStart(2, '0')}:00</text>)}
          </svg>
          <ul className="kx-tm-legend">
            <li><i className="is-load" />{t.legend.load}</li>
            <li><i className="is-grid" />{t.legend.grid}</li>
            <li><i className="is-soc" />{t.legend.soc}</li>
            {sim.outageSpan ? <li><i className="is-outage" />{t.legend.outage}</li> : null}
          </ul>
          <p className="kx-tm-fine">{t.simNote}</p>
          <Link className="kx-btn kx-btn-primary kx-btn-sm" href={`/${lang}/bess-designer`}>{t.cta}<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </article>

      {/* 4 — TENER Stack container arithmetic */}
      <article className="kx-tm-tile kx-tm-stack">
        <header><h3>{t.stackTitle}</h3><span className="kx-tm-tag">{t.claim}</span></header>
        <p className="kx-tm-num"><CountUp to={9} lang={lang} /><small>{t.stackUnit}</small></p>
        <p className="kx-tm-body">{t.stackBody} <strong>{t.containers(ceil6, ceil9)}</strong></p>
        <div className="kx-tm-dots" aria-hidden="true">
          <svg viewBox="0 0 270 22">{Array.from({ length: ceil6 }, (_, i) => <rect key={i} x={(i % 67) * 4} y={Math.floor(i / 67) * 5} width="3" height="4" className="kx-tm-d6" />)}</svg>
          <svg viewBox="0 0 270 22">{Array.from({ length: ceil9 }, (_, i) => <rect key={i} x={(i % 67) * 4} y={Math.floor(i / 67) * 5} width="3" height="4" className="kx-tm-d9" />)}</svg>
        </div>
        <p className="kx-tm-fine">{t.formula}</p>
        <Source href={SRC.stack} label={t.source} />
      </article>

      {/* 5 — Safety */}
      <article className="kx-tm-tile kx-tm-safety">
        <header><h3>{t.safetyTitle}</h3><span className="kx-tm-tag">{t.claim}</span></header>
        <dl>{t.safety.map(([n, d]) => <div key={d}><dt className="kx-mono">{n}</dt><dd>{d}</dd></div>)}</dl>
        <Source href={SRC.stack} label={t.source} />
      </article>

      {/* 6 — Logistics */}
      <article className="kx-tm-tile kx-tm-log">
        <header><h3>{t.logTitle}</h3><span className="kx-tm-tag">{t.claim}</span></header>
        <p className="kx-tm-num">{t.logNum}<small>{t.logUnit}</small></p>
        <p className="kx-tm-body">{t.logBody}</p>
        <a className="kx-tm-link" href="#kx-corridor-title">{t.logCta}<ArrowRight size={14} aria-hidden="true" /></a>
      </article>
    </div>
  );
}
