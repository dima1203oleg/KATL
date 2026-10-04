'use client';

/**
 * "From cell to power plant" — scroll story. A sticky technical drawing changes as each step
 * scrolls into view. Only verified numbers (TENER 6.25 MWh / TEU) and plain arithmetic appear.
 * Works without JS (all steps readable; first drawing shown) and respects reduced motion.
 */
import { useEffect, useRef, useState } from 'react';

type L = 'uk-UA' | 'en' | 'zh-CN';

const COPY: Record<L, { steps: Array<{ k: string; title: string; body: string; metric?: [string, string] }>; of: string }> = {
  'uk-UA': {
    of: 'з',
    steps: [
      { k: 'КОМІРКА', title: 'Усе починається з комірки LFP', body: 'Літій-залізо-фосфатна хімія CATL — термічно стабільна і розрахована на тисячі циклів. Саме якість комірки визначає ресурс і безпеку всієї системи.' },
      { k: 'МОДУЛЬ', title: 'Комірки збираються в модулі під контролем BMS', body: 'Система керування батареєю стежить за напругою і температурою кожної комірки, а рідинне охолодження вирівнює температуру — без перегрітих зон.' },
      { k: 'КОНТЕЙНЕР', title: 'TENER: 6,25 МВт·год у 20-футовому контейнері', body: 'Стандартний морський контейнер — готова система з батареями, охолодженням, пожежогасінням і моніторингом. Його можна перевезти з Китаю як звичайний вантаж.', metric: ['6,25', 'МВт·год / TEU'] },
      { k: 'СТАНЦІЯ', title: 'Станція масштабується контейнерами', body: 'Для 100 МВт·год потрібно ⌈100 ÷ 6,25⌉ = 16 контейнерів TENER, плюс перетворювачі (PCS), трансформатор і система керування. Ми проєктуємо, постачаємо і вводимо в експлуатацію.', metric: ['16', 'контейнерів = 100 МВт·год'] },
    ],
  },
  en: {
    of: 'of',
    steps: [
      { k: 'CELL', title: 'It starts with an LFP cell', body: 'CATL lithium iron phosphate chemistry is thermally stable and built for thousands of cycles. Cell quality sets the lifetime and safety of the whole system.' },
      { k: 'MODULE', title: 'Cells become modules under BMS control', body: 'The battery management system watches the voltage and temperature of every cell, and liquid cooling keeps temperatures even — no hot spots.' },
      { k: 'CONTAINER', title: 'TENER: 6.25 MWh in a 20-ft container', body: 'A standard shipping container — a complete system with batteries, cooling, fire suppression and monitoring. It ships from China as regular freight.', metric: ['6.25', 'MWh / TEU'] },
      { k: 'PLANT', title: 'A plant scales container by container', body: '100 MWh takes ⌈100 ÷ 6.25⌉ = 16 TENER containers, plus power conversion (PCS), a transformer and controls. We design, supply and commission it.', metric: ['16', 'containers = 100 MWh'] },
    ],
  },
  'zh-CN': {
    of: '/',
    steps: [
      { k: '电芯', title: '一切从磷酸铁锂电芯开始', body: 'CATL 磷酸铁锂化学体系热稳定性高，可循环数千次。电芯品质决定整个系统的寿命与安全。' },
      { k: '模组', title: '电芯在 BMS 监控下组成模组', body: '电池管理系统监测每个电芯的电压与温度，液冷系统均衡温度，杜绝局部过热。' },
      { k: '集装箱', title: 'TENER：20 尺集装箱 6.25 MWh', body: '标准海运集装箱即一套完整系统：电池、温控、消防与监控。可作为普通货物从中国运输。', metric: ['6.25', 'MWh / TEU'] },
      { k: '电站', title: '电站按集装箱逐级扩展', body: '100 MWh 需要 ⌈100 ÷ 6.25⌉ = 16 台 TENER，另配 PCS、变压器与控制系统。我们负责设计、供货与调试。', metric: ['16', '台 = 100 MWh'] },
    ],
  },
};

function Drawing({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 400 300" className="kx-cg-svg" aria-hidden="true">
      <defs>
        <pattern id="kx-cg-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" className="kx-cg-gridline" /></pattern>
      </defs>
      <rect width="400" height="300" fill="url(#kx-cg-grid)" />

      {/* 0 — cell */}
      <g className={`kx-cg-layer ${i === 0 ? 'is-on' : ''}`}>
        <rect x="150" y="70" width="100" height="170" rx="6" className="kx-cg-body" />
        <rect x="170" y="56" width="18" height="14" rx="2" className="kx-cg-term" />
        <rect x="212" y="56" width="18" height="14" rx="2" className="kx-cg-term kx-cg-term-pos" />
        <rect x="162" y="90" width="76" height="130" rx="3" className="kx-cg-fill" />
        <rect x="162" y="90" width="76" height="130" rx="3" className="kx-cg-charge" />
        <text x="200" y="262" className="kx-cg-label" textAnchor="middle">LFP</text>
        <path d="M262 110 H320" className="kx-cg-dim" /><text x="324" y="114" className="kx-cg-label">BMS · V · °C</text>
      </g>

      {/* 1 — module */}
      <g className={`kx-cg-layer ${i === 1 ? 'is-on' : ''}`}>
        <rect x="70" y="70" width="260" height="150" rx="6" className="kx-cg-body" />
        {Array.from({ length: 24 }, (_, n) => (
          <rect key={n} x={84 + (n % 12) * 20} y={86 + Math.floor(n / 12) * 62} width="14" height="52" rx="2" className="kx-cg-fill kx-cg-pop" style={{ animationDelay: `${n * 25}ms` }} />
        ))}
        <path d="M70 236 H330" className="kx-cg-pipe" />
        <text x="70" y="256" className="kx-cg-label">LIQUID COOLING</text>
        <text x="330" y="256" className="kx-cg-label" textAnchor="end">BMS</text>
      </g>

      {/* 2 — container */}
      <g className={`kx-cg-layer ${i === 2 ? 'is-on' : ''}`}>
        <rect x="30" y="90" width="340" height="120" rx="4" className="kx-cg-body" />
        {Array.from({ length: 14 }, (_, n) => (
          <rect key={n} x={44 + n * 23} y="104" width="16" height="92" rx="2" className="kx-cg-fill kx-cg-rise" style={{ animationDelay: `${n * 40}ms` }} />
        ))}
        <path d="M30 228 H370" className="kx-cg-dim" />
        <text x="200" y="246" className="kx-cg-label" textAnchor="middle">20 ft · TEU · 6.25 MWh</text>
      </g>

      {/* 3 — plant */}
      <g className={`kx-cg-layer ${i === 3 ? 'is-on' : ''}`}>
        {Array.from({ length: 16 }, (_, n) => (
          <rect key={n} x={40 + (n % 4) * 62} y={54 + Math.floor(n / 4) * 50} width="52" height="32" rx="2" className="kx-cg-fill kx-cg-pop" style={{ animationDelay: `${n * 35}ms` }} />
        ))}
        <rect x="306" y="120" width="44" height="60" rx="3" className="kx-cg-body" />
        <text x="328" y="196" className="kx-cg-label" textAnchor="middle">PCS · TR</text>
        <path d="M290 150 H306 M350 150 H392" className="kx-cg-wire" />
        <path d="M290 70 V230" className="kx-cg-wire" />
        <text x="392" y="140" className="kx-cg-label" textAnchor="end">GRID</text>
      </g>
    </svg>
  );
}

export function CellToGrid({ locale }: { locale: string }) {
  const lang = (locale === 'en' || locale === 'zh-CN' ? locale : 'uk-UA') as L;
  const t = COPY[lang];
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="kx-cg">
      <div className="kx-cg-stage">
        <div className="kx-cg-frame">
          <Drawing i={active} />
          <div className="kx-cg-hud">
            <span className="kx-mono">{String(active + 1).padStart(2, '0')} {t.of} 04</span>
            <span className="kx-mono">{t.steps[active].k}</span>
          </div>
          <ol className="kx-cg-progress" aria-hidden="true">
            {t.steps.map((s, i) => <li key={s.k} className={i <= active ? 'is-on' : ''} />)}
          </ol>
        </div>
      </div>
      <ol className="kx-cg-steps">
        {t.steps.map((s, i) => (
          <li key={s.k} ref={(el) => { refs.current[i] = el; }} data-step={i} className={i === active ? 'is-active' : ''}>
            <span className="kx-cg-k kx-mono">{String(i + 1).padStart(2, '0')} · {s.k}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            {s.metric ? <p className="kx-cg-metric"><strong className="kx-mono">{s.metric[0]}</strong><span>{s.metric[1]}</span></p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
