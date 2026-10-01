import React, { useState } from 'react';
import { Activity, Zap, Sun, Moon, ArrowUpRight, TrendingDown, CheckCircle2 } from 'lucide-react';

export const BessLoadProfileVisualizer: React.FC = () => {
  const [showBessAction, setShowBessAction] = useState<boolean>(true);
  const [includeSolar, setIncludeSolar] = useState<boolean>(true);

  // 24-hour simulation data (Hour 0 to 23)
  const hours = [
    { hour: '00:00', baseLoadKw: 420, solarKw: 0, tariffType: 'night' },
    { hour: '02:00', baseLoadKw: 380, solarKw: 0, tariffType: 'night' },
    { hour: '04:00', baseLoadKw: 390, solarKw: 0, tariffType: 'night' },
    { hour: '06:00', baseLoadKw: 550, solarKw: 20, tariffType: 'normal' },
    { hour: '08:00', baseLoadKw: 920, solarKw: 120, tariffType: 'peak' },
    { hour: '10:00', baseLoadKw: 1050, solarKw: 450, tariffType: 'peak' },
    { hour: '12:00', baseLoadKw: 980, solarKw: 620, tariffType: 'normal' },
    { hour: '14:00', baseLoadKw: 940, solarKw: 580, tariffType: 'normal' },
    { hour: '16:00', baseLoadKw: 880, solarKw: 280, tariffType: 'normal' },
    { hour: '18:00', baseLoadKw: 1180, solarKw: 40, tariffType: 'peak' },
    { hour: '20:00', baseLoadKw: 1120, solarKw: 0, tariffType: 'peak' },
    { hour: '22:00', baseLoadKw: 650, solarKw: 0, tariffType: 'normal' },
  ];

  // Peak limit threshold when BESS is active
  const peakGridCapKw = 750;

  return (
    <section className="py-20 md:py-28 border-b border-white/5 bg-[#0a0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Activity className="h-4 w-4" />
              <span>Інженерна симуляція 24-годинного графіка</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              Фізика оптимізації добового графіка споживання
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Наочна демонстрація нічного заряду BESS за низьким тарифом та миттєвого зрізання денних і вечірніх піків споживання підприємства.
            </p>
          </div>

          {/* Interactive Layer Toggles */}
          <div className="flex flex-wrap gap-2.5 p-1.5 bg-[#12141c] rounded-xl border border-white/10 self-start lg:self-auto">
            <button
              onClick={() => setShowBessAction(!showBessAction)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                showBessAction ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Робота BESS CATL: {showBessAction ? 'Увімкнено' : 'Вимкнено'}</span>
            </button>

            <button
              onClick={() => setIncludeSolar(!includeSolar)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                includeSolar ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Генерація СЕС: {includeSolar ? 'Активна' : 'Без СЕС'}</span>
            </button>
          </div>
        </div>

        {/* Visualizer Chart Card */}
        <div className="rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-8 shadow-2xl">
          
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 text-xs">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-neutral-600" />
                <span className="text-neutral-300">Базовий графік без BESS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-emerald-400" />
                <span className="text-emerald-300 font-semibold">Фактичне споживання з мережі (з BESS)</span>
              </div>
              {includeSolar && (
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-amber-400" />
                  <span className="text-amber-300">Сонячна генерація</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1"><Moon className="h-3 w-3 text-cyan-400" /> 00:00–06:00 (Нічний тариф)</span>
              <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-rose-400" /> 18:00–22:00 (Пік РДН)</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 sm:h-72 w-full flex items-end gap-2 sm:gap-4 pt-4 pb-2 border-b border-white/10">
            {hours.map((item, idx) => {
              // Calculate effective grid load
              let effectiveLoad = item.baseLoadKw;
              let isDischarging = false;
              let isCharging = false;

              if (includeSolar) {
                effectiveLoad = Math.max(100, effectiveLoad - item.solarKw);
              }

              if (showBessAction) {
                if (item.tariffType === 'peak' && effectiveLoad > peakGridCapKw) {
                  isDischarging = true;
                  effectiveLoad = peakGridCapKw;
                } else if (item.tariffType === 'night') {
                  isCharging = true;
                  effectiveLoad += 280; // Charging BESS
                }
              }

              const baseHeightPercent = Math.min(100, (item.baseLoadKw / 1300) * 100);
              const effectiveHeightPercent = Math.min(100, (effectiveLoad / 1300) * 100);

              return (
                <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                  
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute -top-14 bg-black/90 text-[10px] font-mono p-2 rounded border border-white/20 whitespace-nowrap z-20 shadow-xl">
                    <div className="text-white font-bold">{item.hour} ({item.tariffType.toUpperCase()})</div>
                    <div className="text-neutral-300">База: {item.baseLoadKw} кВт</div>
                    <div className="text-emerald-400 font-bold">З мережі: {effectiveLoad} кВт</div>
                    {isDischarging && <div className="text-cyan-300">BESS розряд: -{item.baseLoadKw - effectiveLoad} кВт</div>}
                    {isCharging && <div className="text-emerald-300">BESS заряд: +280 кВт</div>}
                  </div>

                  {/* Bars */}
                  <div className="w-full max-w-[28px] h-full flex items-end justify-center relative">
                    {/* Shadow Ghost Bar: Original Base Load */}
                    {!showBessAction || (showBessAction && isDischarging) ? (
                      <div
                        style={{ height: `${baseHeightPercent}%` }}
                        className="w-full absolute bottom-0 bg-neutral-700/40 rounded-t-sm"
                      />
                    ) : null}

                    {/* Active Grid Draw Bar */}
                    <div
                      style={{ height: `${effectiveHeightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all duration-300 relative z-10 ${
                        isDischarging
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : isCharging
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                          : 'bg-gradient-to-t from-neutral-600 to-neutral-400'
                      }`}
                    />
                  </div>

                  {/* Hour Label */}
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 mt-2">
                    {item.hour.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sizing Analysis Summary */}
          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-neutral-400">Зрізання пікової потужності</div>
              <div className="font-display text-2xl font-bold text-emerald-400 mt-1">
                {showBessAction ? '-430 кВт' : '0 кВт'}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                {showBessAction ? 'Економія на платі за приєднання' : 'Висока плата за піки'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-neutral-400">Нічний обсяг заряду</div>
              <div className="font-display text-2xl font-bold text-cyan-300 mt-1">
                {showBessAction ? '1,680 кВт·год' : '0 кВт·год'}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Зарядка за нічним тарифом 3.40 ₴
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-neutral-400">Розрахункова добова економія</div>
              <div className="font-display text-2xl font-bold text-amber-300 mt-1">
                {showBessAction ? '≈ 11,400 ₴ / добу' : '0 ₴'}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                ≈ 4.1 млн грн чистої економії на рік
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
