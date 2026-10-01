import React, { useState } from 'react';
import { ArrowUpRight, Check, Zap, TrendingUp, ShieldAlert, Sun, Layers } from 'lucide-react';
import { bessSolutions, BessSolution } from '../data/bessData';

interface BessSolutionsSectionProps {
  onSelectSolutionForDesigner: (slug: string) => void;
}

export const BessSolutionsSection: React.FC<BessSolutionsSectionProps> = ({
  onSelectSolutionForDesigner,
}) => {
  return (
    <section id="solutions" className="py-20 md:py-28 border-b border-white/5 bg-[#0a0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Сценарії застосування
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            Як системи накопичення енергії приносять прибуток
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            BESS — це не просто резервний акумулятор, а активний фінансовий інструмент оптимізації витрат на електроенергію підприємства.
          </p>
        </div>

        {/* 4 Application Cards (Bento style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bessSolutions.map((sol) => (
            <div
              key={sol.id}
              className="rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-400/40 transition-all duration-300"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Окупність: {sol.typicalPaybackYears}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Рекомендовано: {sol.recommendedProduct}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                  {sol.title}
                </h3>
                <div className="text-xs sm:text-sm font-medium text-emerald-300 mb-4">
                  {sol.subtitle}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                  {sol.description}
                </p>

                {/* Key Benefits */}
                <div className="space-y-2 mb-6">
                  {sol.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Industries and Action */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-neutral-400">
                  <span className="text-neutral-500 font-medium">Галузі: </span>
                  {sol.targetIndustries.join(' · ')}
                </div>

                <button
                  onClick={() => onSelectSolutionForDesigner(sol.slug)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline cursor-pointer shrink-0"
                >
                  <span>Розрахувати цей сценарій</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
