import React, { useState } from 'react';
import { ArrowUpRight, Check, TrendingUp, Layers, Cpu, Coffee, Activity, ChevronRight } from 'lucide-react';
import { CaseStudy, Language } from '../types';
import { content } from '../data/content';

interface CaseStudiesSectionProps {
  lang: Language;
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  lang,
  onSelectCaseStudy,
}) => {
  const t = content[lang].cases;
  const [filter, setFilter] = useState<'all' | 'saas' | 'ecommerce' | 'iot'>('all');

  const filteredCases = t.items.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="cases" className="py-20 md:py-28 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {lang === 'ua' ? 'Портфоліо & Результати' : 'Portfolio & Results'}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              {t.sectionTitle}
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Interactive filter segmented buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#13151f] rounded-lg border border-white/10 self-start lg:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-amber-400 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilter('saas')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'saas' ? 'bg-amber-400 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterSaas}
            </button>
            <button
              onClick={() => setFilter('ecommerce')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'ecommerce' ? 'bg-amber-400 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterEcommerce}
            </button>
            <button
              onClick={() => setFilter('iot')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'iot' ? 'bg-amber-400 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterCorporate}
            </button>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCaseStudy(item)}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-[#12141d] overflow-hidden hover:border-amber-400/40 transition-all duration-300 flex flex-col"
            >
              {/* Visual Interface Showcase (Styled Generative Container - Zero Broken Images) */}
              <div className="h-64 sm:h-72 w-full bg-gradient-to-br from-[#181a26] via-[#10121a] to-[#0c0d12] p-5 sm:p-6 border-b border-white/10 relative overflow-hidden flex flex-col justify-between">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">{item.client}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{item.year}</span>
                </div>

                {/* Domain-specific visual mockup */}
                <div className="my-auto z-10">
                  {item.id === 'novapay-b2b' && (
                    <div className="rounded-lg border border-emerald-500/20 bg-black/40 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="text-neutral-300 font-medium">Щоденний оборот еквайрингу</span>
                        <span className="text-emerald-400 font-mono font-semibold">+184.2%</span>
                      </div>
                      <div className="h-14 flex items-end gap-1.5 sm:gap-2">
                        {[40, 55, 38, 70, 85, 65, 92, 78, 95, 110, 105, 128].map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h * 0.4}px` }}
                            className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500/30 to-emerald-400 hover:brightness-125 transition-all"
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-white/5 pt-2">
                        <span>Транзакцій: 142,890 / добу</span>
                        <span>Затримка: 0.28с</span>
                      </div>
                    </div>
                  )}

                  {item.id === 'kolo-modular' && (
                    <div className="rounded-lg border border-amber-500/20 bg-black/40 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-neutral-300 font-medium">Конфігуратор KOLO 92m²</span>
                        <span className="text-amber-300 font-mono font-bold">$78,400</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono mb-2">
                        <div className="p-2 rounded bg-white/5 text-center">
                          <span className="text-neutral-400 block text-[10px]">Модулі</span>
                          <span className="text-white font-semibold">3 секції</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 text-center">
                          <span className="text-neutral-400 block text-[10px]">Опалення</span>
                          <span className="text-white font-semibold">Тепловий насос</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 text-center">
                          <span className="text-neutral-400 block text-[10px]">Клас</span>
                          <span className="text-emerald-400 font-semibold">A+++ Passive</span>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full w-[85%]" />
                      </div>
                    </div>
                  )}

                  {item.id === 'aerogrid-iot' && (
                    <div className="rounded-lg border border-cyan-500/20 bg-black/40 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-neutral-300 font-medium">Телеметрія станції «Дніпро-Сонячна 1»</span>
                        <span className="text-cyan-400 font-mono font-semibold">Live 98.6 MWh</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                        <span className="text-neutral-400">Частота мережі</span>
                        <span className="font-mono text-white">50.02 Hz</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                        <span className="text-neutral-400">Активні інвертори</span>
                        <span className="font-mono text-emerald-400">64 / 64 Online</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-neutral-400">Черга оновлень</span>
                        <span className="font-mono text-cyan-300">&lt; 100ms</span>
                      </div>
                    </div>
                  )}

                  {item.id === 'lviv-craft-coffee' && (
                    <div className="rounded-lg border border-pink-500/20 bg-black/40 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-neutral-300 font-medium">Підписка: Ethiopia Yirgacheffe</span>
                        <span className="text-pink-400 font-mono font-semibold">Щотижня</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-xs">
                        <span className="text-neutral-400">Нотки:</span>
                        <span className="text-neutral-200">Бергамот · Жасмин · Персик</span>
                      </div>
                      <div className="p-2 rounded bg-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-400">MonoPay 1-клік чекаут</span>
                        <span className="text-emerald-400">Підтверджено 0.35с</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtle bottom indicator */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 z-10 pt-2 border-t border-white/5">
                  <span>{item.categoryLabel}</span>
                  <span className="group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                    <span>{t.viewCase}</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed category kicker */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    <span>{item.client}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400/90">{item.categoryLabel}</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-5">
                    {item.summary}
                  </p>

                  {/* Concrete quantified proof metric */}
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="font-display text-2xl font-extrabold text-amber-300 tabular-nums">
                      {item.metricHighlight}
                    </span>
                    <span className="text-xs text-neutral-300">
                      {item.metricLabel}
                    </span>
                  </div>
                </div>

                {/* Technologies used */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-400">
                    {item.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={tech} className="font-mono text-neutral-300">
                        {tech}
                        {idx < 2 && <span className="text-neutral-600 ml-2" aria-hidden="true">/</span>}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{t.viewCase}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
