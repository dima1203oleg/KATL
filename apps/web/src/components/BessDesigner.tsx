"use client";

import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, BatteryCharging, Zap, Coins, TrendingUp, Check, ShieldCheck, Clock, Download } from 'lucide-react';

interface BessDesignerProps {
  onApplyToRfq: (summary: string, recommendedProduct: string, powerKw: number, capacityKwh: number) => void;
  preselectedProduct?: string;
  onOpenBom?: (powerKw: number, capacityKwh: number, recommendedProduct: string, tariffUah: number, durationHours: number) => void;
  onOpenProposal?: (powerKw: number, capacityKwh: number, recommendedProduct: string, tariffUah: number) => void;
}

export const BessDesigner: React.FC<BessDesignerProps> = ({
  onApplyToRfq,
  preselectedProduct,
  onOpenBom,
  onOpenProposal,
}) => {
  // Configurator state
  const [powerKw, setPowerKw] = useState<number>(500); // 100 kW to 10 000 kW
  const [durationHours, setDurationHours] = useState<number>(2); // 1h, 2h, 4h, 6h
  const [application, setApplication] = useState<'peak-shaving' | 'arbitrage' | 'backup' | 'solar'>('peak-shaving');
  const [tariffUah, setTariffUah] = useState<number>(8.5); // Average commercial tariff ₴/kWh

  // Interactive calculation model
  const calculation = useMemo(() => {
    const requiredCapacityKwh = powerKw * durationHours;

    // Architecture selection logic
    let recommendedProduct = '';
    let moduleCount = 1;
    let totalCapacityKwh = 0;
    let containerType = '';

    if (requiredCapacityKwh <= 1500) {
      // EnerOne Plus (372.7 kWh each)
      moduleCount = Math.max(1, Math.ceil(requiredCapacityKwh / 372.7));
      totalCapacityKwh = Math.round(moduleCount * 372.7);
      recommendedProduct = `CATL EnerOne Plus (${moduleCount} × 372.7 кВт·год)`;
      containerType = `${moduleCount} компактні вуличні шафи EnerOne Plus (IP55)`;
    } else if (requiredCapacityKwh <= 5000) {
      // EnerC Plus (3.72 MWh) or multiple EnerOne
      if (requiredCapacityKwh <= 3727) {
        recommendedProduct = 'CATL EnerC Plus (3.72 МВт·год)';
        totalCapacityKwh = 3727;
        containerType = '1 × 40ft High-Cube контейнер EnerC Plus';
      } else {
        recommendedProduct = 'CATL TENER (6.25 МВт·год Utility-Scale)';
        totalCapacityKwh = 6250;
        containerType = '1 × 20ft High-Cube контейнер CATL TENER';
      }
    } else {
      // TENER 6.25 MWh units
      const tenerCount = Math.ceil(requiredCapacityKwh / 6250);
      recommendedProduct = `CATL TENER (${tenerCount} × 6.25 МВт·год)`;
      totalCapacityKwh = tenerCount * 6250;
      containerType = `${tenerCount} × 20ft контейнери CATL TENER (5 років 0% деградації)`;
    }

    // Inverter PCS capacity (with 1.1x margin)
    const pcsKw = Math.round(powerKw * 1.05);

    // Financial model estimation (UA market parameters)
    // Daily cycled energy (kWh)
    const dailyKwhCycled = totalCapacityKwh * 0.85; // 85% depth of discharge
    let annualSavingsUah = 0;

    if (application === 'peak-shaving') {
      // Peak charge savings + partial arbitrage
      const monthlyPeakSavings = powerKw * 480; // ~480 грн/кВт плата за перебір потужності
      const energySavings = dailyKwhCycled * 300 * 2.8; // 2.80 грн спред
      annualSavingsUah = Math.round(monthlyPeakSavings * 12 + energySavings);
    } else if (application === 'arbitrage') {
      // Arbitrage spread ~3.80 грн/кВт·год на РДН / балансуючому ринку
      annualSavingsUah = Math.round(dailyKwhCycled * 330 * 3.8);
    } else if (application === 'solar') {
      // 100% self-consumption of solar energy vs buying from grid at tariffUah
      annualSavingsUah = Math.round(dailyKwhCycled * 280 * (tariffUah - 1.2));
    } else {
      // Backup & downtime avoidance (equivalent value of preventing shutdowns)
      annualSavingsUah = Math.round(powerKw * 18000);
    }

    // Rough estimated CAPEX (USD to UAH proxy at 41.5)
    // CATL LFP containerized solutions ~ $180-$260 / kWh turnkey including PCS
    const estimatedCapexUsd = totalCapacityKwh * 210 + pcsKw * 55;
    const estimatedCapexUah = Math.round(estimatedCapexUsd * 41.5);

    // Payback period
    const paybackYears = Math.min(6.5, Math.max(2.2, +(estimatedCapexUah / (annualSavingsUah || 1)).toFixed(1)));

    return {
      requiredCapacityKwh,
      totalCapacityKwh,
      recommendedProduct,
      containerType,
      pcsKw,
      annualSavingsUah,
      estimatedCapexUsd,
      paybackYears,
    };
  }, [powerKw, durationHours, application, tariffUah]);

  const handleTransfer = () => {
    const appLabel = application === 'peak-shaving' ? 'Peak Shaving (Зрізання піків)'
      : application === 'arbitrage' ? 'Енергетичний арбітраж на РДН'
      : application === 'solar' ? 'Інтеграція із сонячною СЕС'
      : 'Гарантоване резервне живлення';

    const summary = `[BESS Designer]\nНеобхідна потужність: ${powerKw} кВт\nТривалість зберігання: ${durationHours} год\nПотрібна ємність: ${calculation.requiredCapacityKwh} кВт·год\nРекомендоване рішення: ${calculation.recommendedProduct}\nТип виконання: ${calculation.containerType}\nСценарій: ${appLabel}\nОрієнтовна річна економія: ~${(calculation.annualSavingsUah / 1000000).toFixed(2)} млн грн/рік\nРозрахунковий термін окупності: ~${calculation.paybackYears} роки`;

    onApplyToRfq(summary, calculation.recommendedProduct, powerKw, calculation.totalCapacityKwh);
  };

  return (
    <section id="designer" className="py-20 md:py-28 border-b border-white/5 bg-[#0b0c10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Calculator className="h-4 w-4" />
              <span>Інженерний конфігуратор</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              BESS Designer: Підбір потужності та розрахунок окупності
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Розрахуйте необхідну конфігурацію накопичувача CATL, інверторного обладнання та річну економію на тарифах для вашого підприємства.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Тарифи України 2026</span>
            <span aria-hidden="true">·</span>
            <span>РДН спреди</span>
            <span aria-hidden="true">·</span>
            <span>Точний розрахунок</span>
          </div>
        </div>

        {/* 2-Column Grid: Configurator inputs on left, Live Sizing & Financial Model on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Parameters */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Power Slider */}
            <div className="rounded-xl border border-white/10 bg-[#12141d] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white">
                  1. Потужність навантаження підприємства (кВт / МВт)
                </label>
                <span className="font-mono text-base font-bold text-emerald-400">
                  {powerKw >= 1000 ? `${(powerKw / 1000).toFixed(1)} МВт` : `${powerKw} кВт`}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={powerKw}
                onChange={(e) => setPowerKw(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-2">
                <span>100 кВт (Малий бізнес)</span>
                <span>1 МВт (Завод / Елеватор)</span>
                <span>5 МВт (Великий комбінат)</span>
              </div>
            </div>

            {/* Step 2: Storage Duration */}
            <div className="rounded-xl border border-white/10 bg-[#12141d] p-5 sm:p-6">
              <label className="block text-sm font-bold text-white mb-3">
                2. Бажаний час накопичення / автономної роботи
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[1, 2, 4, 6].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setDurationHours(hours)}
                    className={`p-3 rounded-lg border text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer text-center ${
                      durationHours === hours
                        ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400 shadow-sm'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    <div>{hours} год</div>
                    <div className="text-[10px] font-sans font-normal opacity-70 mt-0.5">
                      {hours === 1 ? '1C Fast' : hours === 2 ? '0.5C Opt' : 'Long Res'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Application Profile */}
            <div className="rounded-xl border border-white/10 bg-[#12141d] p-5 sm:p-6">
              <label className="block text-sm font-bold text-white mb-3">
                3. Головний сценарій застосування BESS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApplication('peak-shaving')}
                  className={`text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    application === 'peak-shaving'
                      ? 'border-emerald-400 bg-emerald-400/10 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">Peak Shaving</div>
                  <div className="text-[11px] text-neutral-400">Зрізання пікової потужності та захист від перевантаження мережі</div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplication('arbitrage')}
                  className={`text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    application === 'arbitrage'
                      ? 'border-emerald-400 bg-emerald-400/10 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">Енергетичний арбітраж</div>
                  <div className="text-[11px] text-neutral-400">Зарядка вночі за низьким тарифом — розряд у пікові години (РДН)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplication('solar')}
                  className={`text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    application === 'solar'
                      ? 'border-emerald-400 bg-emerald-400/10 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">СЕС + Накопичувач</div>
                  <div className="text-[11px] text-neutral-400">100% утилізація денної сонячної генерації без небалансів</div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplication('backup')}
                  className={`text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    application === 'backup'
                      ? 'border-emerald-400 bg-emerald-400/10 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">Резервне живлення (UPS)</div>
                  <div className="text-[11px] text-neutral-400">Миттєвий перехід на батареї (&lt; 20мс) при знеструмленні</div>
                </button>
              </div>
            </div>

            {/* Step 4: Electricity Tariff Reference */}
            <div className="rounded-xl border border-white/10 bg-[#12141d] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <label className="text-xs sm:text-sm font-bold text-white block">
                  4. Середній тариф на електроенергію підприємства
                </label>
                <span className="text-[11px] text-neutral-400">
                  Включаючи вартість передачі та розподілу
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="15"
                  value={tariffUah}
                  onChange={(e) => setTariffUah(Number(e.target.value))}
                  className="w-20 rounded-md border border-white/15 bg-black/40 px-2.5 py-1.5 text-sm font-mono text-white text-right focus:border-emerald-400 focus:outline-none"
                />
                <span className="text-xs text-neutral-300 font-mono">₴/кВт·год</span>
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Architecture & Financial Payback Model */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-emerald-400/30 bg-[#131622] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Інженерний розрахунок конфігурації
                </span>
                <span className="text-xs font-mono text-neutral-400">LFP Model</span>
              </div>

              {/* Recommended CATL System */}
              <div className="mb-5">
                <div className="text-xs text-neutral-400 mb-1">Рекомендована система накопичення:</div>
                <div className="font-display text-xl sm:text-2xl font-bold text-white">
                  {calculation.recommendedProduct}
                </div>
                <div className="text-xs text-emerald-300 font-mono mt-1">
                  {calculation.containerType}
                </div>
              </div>

              {/* Sizing Parameters Card */}
              <div className="space-y-2.5 p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Корисна ємність BESS:</span>
                  <span className="text-white font-bold">{calculation.totalCapacityKwh.toLocaleString()} кВт·год</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Потужність інвертора (PCS):</span>
                  <span className="text-white font-bold">{calculation.pcsKw} кВт (0.4 / 10 кВ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Орієнтовний термін служби:</span>
                  <span className="text-emerald-400 font-bold">15 000+ циклів (20+ років)</span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-200">Орієнтовна річна економія:</span>
                  <span className="font-display text-lg font-bold text-emerald-300 tabular-nums">
                    ≈ {(calculation.annualSavingsUah / 1000000).toFixed(2)} млн ₴ / рік
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-emerald-500/20 pt-2">
                  <span className="text-xs text-neutral-200">Розрахунковий термін окупності:</span>
                  <span className="font-mono text-base font-bold text-white">
                    ≈ {calculation.paybackYears} роки
                  </span>
                </div>
              </div>

              {/* CTA Action */}
              <button
                onClick={handleTransfer}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-400 py-3.5 px-4 text-xs sm:text-sm font-bold text-black hover:bg-emerald-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-emerald-400/20"
              >
                <span>Перенести параметри у запит КП (RFQ)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Solution Configurator & Proposal Triggers */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {onOpenBom && (
                  <button
                    type="button"
                    onClick={() => onOpenBom(powerKw, calculation.totalCapacityKwh, calculation.recommendedProduct, tariffUah, durationHours)}
                    className="flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 py-2 px-2 text-[11px] font-semibold text-neutral-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <span>Специфікація BOM</span>
                  </button>
                )}

                {onOpenProposal && (
                  <button
                    type="button"
                    onClick={() => onOpenProposal(powerKw, calculation.totalCapacityKwh, calculation.recommendedProduct, tariffUah)}
                    className="flex items-center justify-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 py-2 px-2 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                  >
                    <span>Сформувати ТКП (V1.0)</span>
                  </button>
                )}
              </div>

              <p className="mt-4 text-[11px] text-neutral-400 text-center leading-relaxed">
                Точний інженерний розрахунок із однолінійною схемою та ТЕО надається після аудиту графіка навантаження об'єкта.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
