import React from 'react';
import { Factory, Wheat, Server, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { bessIndustries } from '../data/bessData';

interface BessIndustriesSectionProps {
  onSelectIndustry: (industryTitle: string) => void;
}

export const BessIndustriesSection: React.FC<BessIndustriesSectionProps> = ({
  onSelectIndustry,
}) => {
  return (
    <section id="industries" className="py-20 md:py-28 border-b border-white/5 bg-[#0b0c10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Галузеві рішення
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            Енергостійкість для провідних галузей економіки
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            Спеціалізовані інженерні конфігурації BESS, розраховані під графіки навантаження та специфіку українських підприємств.
          </p>
        </div>

        {/* 4 Industry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bessIndustries.map((ind) => (
            <div
              key={ind.id}
              className="rounded-2xl border border-white/10 bg-[#12141c] p-6 flex flex-col justify-between hover:border-emerald-400/40 transition-colors"
            >
              <div>
                {/* Icon */}
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  {ind.id === 'manufacturing' && <Factory className="h-5 w-5" />}
                  {ind.id === 'agriculture' && <Wheat className="h-5 w-5" />}
                  {ind.id === 'data-centers' && <Server className="h-5 w-5" />}
                  {ind.id === 'logistics' && <Truck className="h-5 w-5" />}
                </div>

                <h3 className="font-display text-base font-bold text-white mb-2">
                  {ind.title}
                </h3>

                <div className="text-xs text-neutral-400 mb-4 space-y-2">
                  <div>
                    <span className="text-neutral-500 block font-medium">Проблема:</span>
                    <span className="text-neutral-300">{ind.problem}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-medium">Рішення:</span>
                    <span className="text-neutral-300">{ind.solution}</span>
                  </div>
                </div>
              </div>

              {/* Bottom specs & button */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="text-xs font-mono">
                  <div className="text-neutral-400">Діапазон: <span className="text-white font-bold">{ind.powerRange}</span></div>
                  <div className="text-emerald-400 mt-0.5">Окупність: {ind.roiEstimate}</div>
                </div>

                <button
                  onClick={() => onSelectIndustry(ind.title)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-md bg-white/5 hover:bg-emerald-400 hover:text-black py-2 px-3 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <span>Замовити розрахунок</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
