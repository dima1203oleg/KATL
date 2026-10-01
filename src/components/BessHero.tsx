import React, { useState } from 'react';
import { ArrowUpRight, Calculator, ShieldCheck, Zap, Activity, BatteryCharging, Gauge, CheckCircle } from 'lucide-react';

interface BessHeroProps {
  onOpenDesigner: () => void;
  onOpenRfq: () => void;
}

export const BessHero: React.FC<BessHeroProps> = ({ onOpenDesigner, onOpenRfq }) => {
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'status' | 'thermal' | 'grid'>('status');

  return (
    <section className="relative overflow-hidden pt-10 pb-18 md:pt-16 md:pb-24 border-b border-white/5">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-radial from-emerald-500/10 via-emerald-500/3 to-transparent blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition and CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Clean unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              <span>CATL Energy Storage Systems</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">Промислова інженерія в Україні</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6 max-w-2xl [text-wrap:balance]">
              Промислові системи накопичення енергії CATL
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-xl">
              Флагманські накопичувачі CATL TENER (6.25 МВт·год, 0% деградації за перші 5 років) та модульні вуличні блоки EnerOne Plus. Зрізання піків навантаження, арбітраж на РДН та безперебійне живлення підприємств під ключ.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenDesigner}
                className="flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 text-xs sm:text-sm font-bold text-black hover:bg-emerald-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-emerald-400/20 whitespace-nowrap"
              >
                <Calculator className="h-4 w-4" />
                <span>BESS Designer (Підбір ємності)</span>
              </button>

              <button
                onClick={onOpenRfq}
                className="flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Отримати комерційну пропозицію</span>
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </button>
            </div>

            {/* Trust badge */}
            <div className="mt-8 flex items-center gap-3 text-xs text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Офіційні протоколи випробувань UL 9540A & NFPA 855 · Гарантія 10+ років</span>
            </div>
          </div>

          {/* Right Column: Live Interactive BESS Telemetry & Architecture Console */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#12141c] p-5 sm:p-6 shadow-2xl relative">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs text-white font-bold">CATL TENER-6.25MWh-ONLINE</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Grid-Forming Active
                </span>
              </div>

              {/* Console Tabs */}
              <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTelemetryTab('status')}
                  className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTelemetryTab === 'status' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Стан заряду
                </button>
                <button
                  onClick={() => setActiveTelemetryTab('thermal')}
                  className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTelemetryTab === 'thermal' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Рідкісний контур
                </button>
                <button
                  onClick={() => setActiveTelemetryTab('grid')}
                  className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTelemetryTab === 'grid' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Мережевий інвертор
                </button>
              </div>

              {/* Tab: Electrical Status */}
              {activeTelemetryTab === 'status' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="text-[11px] text-neutral-400 mb-1">State of Charge (SOC)</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">92.4%</div>
                      <div className="text-[10px] text-neutral-500 mt-1">Доступно: 5.78 МВт·год</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="text-[11px] text-neutral-400 mb-1">Поточна віддача</div>
                      <div className="text-2xl font-bold font-mono text-white">1,500 кВт</div>
                      <div className="text-[10px] text-neutral-500 mt-1">Режим: Peak Shaving</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-neutral-300">Циклічний ресурс акумуляторів</span>
                      <span className="font-mono text-emerald-400">0.0% зносу (Рік 2/5)</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div className="bg-emerald-400 h-2 rounded-full w-[100%]" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                      <span>Напруга DC шини: 1332 V</span>
                      <span>ККД циклу RTE: 96.2%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Thermal Management */}
              {activeTelemetryTab === 'thermal' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Температура комірок (середня)</span>
                      <span className="text-white font-bold">23.8 °C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Градієнт температур (ΔT)</span>
                      <span className="text-emerald-400 font-bold">1.8 °C (Норма ≤ 2.5°C)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Тиск у рідкісному контурі</span>
                      <span className="text-white font-bold">2.4 bar</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Прецизійний тепловий менеджмент подовжує термін служби на 33%</span>
                  </div>
                </div>
              )}

              {/* Tab: Grid & PCS */}
              {activeTelemetryTab === 'grid' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Частота мережі AC</span>
                      <span className="text-white">50.01 Hz (Стабільно)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Час відгуку на аварію</span>
                      <span className="text-emerald-400 font-bold">&lt; 15 мс (Seamless UPS)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Коефіцієнт потужності cos φ</span>
                      <span className="text-white">0.99</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Сертифікація за вимогами Кодексу системи передачі України</span>
                  </div>
                </div>
              )}

              {/* Footer inside console */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Потрібен інженерний розрахунок?</span>
                <button
                  onClick={onOpenDesigner}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Запустити конфігуратор</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Quantitative Proof Metrics Adjacent to Hero */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              6.25 МВт·год
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-200 mt-1">
              Рекордна ємність контейнера
            </span>
            <span className="text-xs text-neutral-400 mt-0.5">
              CATL TENER у стандартному 20ft HC
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
              0% деградації
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-200 mt-1">
              Протягом перших 5 років
            </span>
            <span className="text-xs text-neutral-400 mt-0.5">
              Унікальна технологія стабілізації SEI
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              15 000+
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-200 mt-1">
              Життєвий цикл комірок
            </span>
            <span className="text-xs text-neutral-400 mt-0.5">
              20+ років безпечної експлуатації
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
              &lt; 20 мс
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-200 mt-1">
              Швидкість перемикання
            </span>
            <span className="text-xs text-neutral-400 mt-0.5">
              Безперервна робота ліній заводу
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
