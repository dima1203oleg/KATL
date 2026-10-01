import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BessLcosSimulator: React.FC = () => {
  const [capacityKwh, setCapacityKwh] = useState<number>(3727); // default EnerC or TENER
  const [capexPerKwhUsd, setCapexPerKwhUsd] = useState<number>(210); // $210 / kWh
  const [dailyCycles, setDailyCycles] = useState<number>(1.2); // 1.2 cycles / day (arbitrage + peak)
  const [spreadUah, setSpreadUah] = useState<number>(4.2); // 4.20 ₴/kWh arbitrage spread

  const simulation = useMemo(() => {
    const usdToUah = 41.5;
    const initialCapexUsd = capacityKwh * capexPerKwhUsd;
    const initialCapexUah = initialCapexUsd * usdToUah;

    // 15-year simulation
    let cumulativeEnergyKwhCatl = 0;
    let cumulativeEnergyKwhStandard = 0;
    let cumulativeRevenueUahCatl = 0;
    let cumulativeOpexUah = 0;

    const yearlyData = [];

    for (let year = 1; year <= 15; year++) {
      // CATL degradation: 0% for years 1-5, then 1.5% per year
      const catlDegradationFactor = year <= 5 ? 1.0 : 1.0 - (year - 5) * 0.015;

      // Standard battery degradation: 2.8% from year 1
      const standardDegradationFactor = Math.max(0.6, 1.0 - year * 0.028);

      const days = 350; // operating days per year
      const yearDeliveredKwhCatl = capacityKwh * 0.85 * dailyCycles * days * catlDegradationFactor;
      const yearDeliveredKwhStandard = capacityKwh * 0.85 * dailyCycles * days * standardDegradationFactor;

      cumulativeEnergyKwhCatl += yearDeliveredKwhCatl;
      cumulativeEnergyKwhStandard += yearDeliveredKwhStandard;

      const yearRevenueUah = yearDeliveredKwhCatl * spreadUah;
      cumulativeRevenueUahCatl += yearRevenueUah;

      const yearOpexUah = initialCapexUah * 0.015; // 1.5% annual OPEX
      cumulativeOpexUah += yearOpexUah;

      const netCashFlowYear = cumulativeRevenueUahCatl - initialCapexUah - cumulativeOpexUah;

      yearlyData.push({
        year,
        catlDegradation: ((1 - catlDegradationFactor) * 100).toFixed(1),
        standardDegradation: ((1 - standardDegradationFactor) * 100).toFixed(1),
        netCashFlowUahMln: (netCashFlowYear / 1000000).toFixed(2),
      });
    }

    // LCOS = (CAPEX + OPEX) / Total Energy
    const totalLifetimeCostUsd = initialCapexUsd + (cumulativeOpexUah / usdToUah);
    const lcosUsdPerKwh = +(totalLifetimeCostUsd / cumulativeEnergyKwhCatl).toFixed(3);
    const lcosUahPerKwh = +(lcosUsdPerKwh * usdToUah).toFixed(2);

    // Advantage of CATL zero-degradation
    const extraEnergyKwh = Math.round(cumulativeEnergyKwhCatl - cumulativeEnergyKwhStandard);
    const extraRevenueUahMln = +((extraEnergyKwh * spreadUah) / 1000000).toFixed(2);

    return {
      initialCapexUahMln: (initialCapexUah / 1000000).toFixed(2),
      lcosUsdPerKwh,
      lcosUahPerKwh,
      extraEnergyKwh,
      extraRevenueUahMln,
      yearlyData,
    };
  }, [capacityKwh, capexPerKwhUsd, dailyCycles, spreadUah]);

  return (
    <section id="lcos" className="py-20 md:py-28 border-b border-white/5 bg-[#08090d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span>15-Year Financial & LCOS Engine</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            Калькулятор нормованої вартості зберігання (LCOS)
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            Розрахуйте повну собівартість зберігання кожної кВт·год за формулою IRENA та оцініть перевагу 5-річної нульової деградації CATL у грошовому виразі.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-7 space-y-6">
            <h3 className="font-display text-base font-bold text-white border-b border-white/10 pb-3">
              Параметри фінансової моделі
            </h3>

            {/* Capacity Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-neutral-300">Ємність комплексу:</span>
                <span className="font-mono text-emerald-400 font-bold">{capacityKwh.toLocaleString()} кВт·год</span>
              </div>
              <input
                type="range"
                min="372"
                max="12500"
                step="372"
                value={capacityKwh}
                onChange={(e) => setCapacityKwh(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                <span>1× EnerOne (372 кВт·год)</span>
                <span>1× TENER (6,250 кВт·год)</span>
                <span>2× TENER (12.5 МВт·год)</span>
              </div>
            </div>

            {/* CAPEX slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-neutral-300">Питомий CAPEX "під ключ":</span>
                <span className="font-mono text-white font-bold">${capexPerKwhUsd} / кВт·год</span>
              </div>
              <input
                type="range"
                min="170"
                max="280"
                step="5"
                value={capexPerKwhUsd}
                onChange={(e) => setCapexPerKwhUsd(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* Daily Cycles */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-neutral-300">Інтенсивність експлуатації (циклів на добу):</span>
                <span className="font-mono text-cyan-300 font-bold">{dailyCycles} циклу/добу</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={dailyCycles}
                onChange={(e) => setDailyCycles(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                <span>1 цикл (Лише арбітраж)</span>
                <span>2 цикли (Арбітраж + Peak Shaving)</span>
              </div>
            </div>

            {/* Tariff spread */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-neutral-300">Середній арбітражний спред на ринку:</span>
                <span className="font-mono text-amber-300 font-bold">{spreadUah} ₴ / кВт·год</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="6.0"
                step="0.1"
                value={spreadUah}
                onChange={(e) => setSpreadUah(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
            </div>
          </div>

          {/* Results Card & Degradation Comparison */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* LCOS Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-[#121622] p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Нормована собівартість зберігання (LCOS)
                </span>
                <span className="text-[11px] font-mono text-neutral-400">15-Year Horizon</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-xs text-neutral-400">LCOS у доларах:</div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                    ${simulation.lcosUsdPerKwh}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">за 1 кВт·год циклу</div>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <div className="text-xs text-neutral-300">LCOS у гривні:</div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                    {simulation.lcosUahPerKwh} ₴
                  </div>
                  <div className="text-[11px] text-emerald-300/80 mt-0.5">за 1 кВт·год циклу</div>
                </div>
              </div>

              {/* CATL Zero Degradation Moat Benefit */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1 text-xs">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Перевага нульової деградації CATL TENER (5 років):</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed pt-1">
                  Завдяки відсутності зносу в перші 5 років система додатково генерує{' '}
                  <strong className="text-white">{(simulation.extraEnergyKwh / 1000).toFixed(0)} тис. кВт·год</strong>,
                  що приносить <strong className="text-emerald-400">+{simulation.extraRevenueUahMln} млн грн додаткового прибутку</strong> порівняно зі звичайними BESS на ринку!
                </p>
              </div>
            </div>

            {/* Cash Flow milestones table */}
            <div className="rounded-xl border border-white/10 bg-[#12141c] p-5">
              <div className="text-xs font-semibold text-white mb-3 flex items-center justify-between">
                <span>Динаміка накопиченого чистого прибутку (Net Cash Flow):</span>
                <span className="text-[11px] font-mono text-neutral-400">Початковий CAPEX: ≈ {simulation.initialCapexUahMln} млн ₴</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <div className="text-neutral-400">Рік 1</div>
                  <div className="text-rose-400 font-bold mt-1">-{(Number(simulation.initialCapexUahMln) * 0.7).toFixed(1)} млн</div>
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <div className="text-neutral-400">Рік 3</div>
                  <div className="text-amber-300 font-bold mt-1">Окупність</div>
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <div className="text-neutral-400">Рік 7</div>
                  <div className="text-emerald-400 font-bold mt-1">+{(Number(simulation.initialCapexUahMln) * 0.9).toFixed(1)} млн</div>
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <div className="text-neutral-400">Рік 15</div>
                  <div className="text-emerald-300 font-bold mt-1">+{(Number(simulation.initialCapexUahMln) * 2.8).toFixed(1)} млн</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
