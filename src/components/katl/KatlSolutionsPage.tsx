import React, { useState } from 'react';
import {
  TrendingDown,
  Sun,
  Zap,
  Coins,
  Server,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Layers,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { titanSolutionsList, TitanSolution } from '../../data/titanPlatformData';
import { CatlContainerGraphic } from './KatlVisualAssets';

interface KatlSolutionsPageProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const KatlSolutionsPage: React.FC<KatlSolutionsPageProps> = ({
  onNavigate,
  onOpenRfq,
  onSelectProduct,
}) => {
  const [selectedSolution, setSelectedSolution] = useState<TitanSolution>(titanSolutionsList[0]);

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Хаб рішень BESS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                CATL APPLICATION SOLUTIONS
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Рішення під конкретні енергетичні задачі
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Оптимізуйте витрати підприємства, усуньте ризики знеструмлення або максимізуйте дохід від сонячної генерації за допомогою перевірених інженерних сценаріїв CATL.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenRfq(`Запит на розрахунок рішення: ${selectedSolution.title}`)}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <span>Підібрати конфігурацію</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Solution Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-10">
            {titanSolutionsList.map((sol) => (
              <button
                key={sol.slug}
                onClick={() => setSelectedSolution(sol)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedSolution.slug === sol.slug
                    ? 'border-[#0077ff] bg-blue-600/15 shadow-lg shadow-blue-500/15'
                    : 'border-white/10 bg-[#0e1424] hover:border-white/25 hover:bg-[#121a2e]'
                }`}
              >
                <div>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${
                    selectedSolution.slug === sol.slug ? 'bg-[#0077ff] text-white' : 'bg-white/5 text-blue-400'
                  }`}>
                    {sol.slug === 'peak-shaving' && <TrendingDown className="h-4 w-4" />}
                    {sol.slug === 'solar-storage' && <Sun className="h-4 w-4" />}
                    {sol.slug === 'backup-power' && <Zap className="h-4 w-4" />}
                    {sol.slug === 'energy-arbitrage' && <Coins className="h-4 w-4" />}
                    {sol.slug === 'datacenter' && <Server className="h-4 w-4" />}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    {sol.category}
                  </div>
                  <div className="font-display text-xs font-bold text-white mt-1 leading-snug">
                    {sol.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Deep Dive for Selected Solution */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 7 cols: Problem & Engineering Solution */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                    {selectedSolution.category}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-3">
                    {selectedSolution.title}
                  </h2>
                  <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                    {selectedSolution.shortDesc}
                  </p>
                </div>

                {/* Problem definition box */}
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-1.5">
                  <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Вихідна проблема бізнесу</span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {selectedSolution.problem}
                  </p>
                </div>

                {/* Solution Mechanism */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Інженерний механізм вирішення CATL</span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {selectedSolution.solutionMechanism}
                  </p>
                </div>

                {/* Before / After Load Comparison */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
                    Порівняння енергетичного профілю:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-red-400 font-bold font-mono">ДО впровадження BESS:</div>
                      <div className="text-[11px] text-neutral-300">{selectedSolution.beforeProfile}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                      <div className="text-emerald-400 font-bold font-mono">ПІСЛЯ оптимізації BESS:</div>
                      <div className="text-[11px] text-blue-200">{selectedSolution.afterProfile}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      onNavigate('home');
                      setTimeout(() => {
                        const el = document.getElementById('bess-designer-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    <span>Розрахувати у BESS Designer</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onOpenRfq(`Консультація по рішенню ${selectedSolution.title}`)}
                    className="rounded-full bg-white/5 border border-white/15 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Замовити технічний розрахунок
                  </button>
                </div>
              </div>

              {/* Right 5 cols: Recommended Equipment & Economics Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-black/40 p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Рекомендоване обладнання
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">
                      CATL Tier-1
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedSolution.recommendedProducts.map((prodName, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(prodName.includes('TENER') ? 'catl-tener-h' : 'catl-enerone-plus');
                          onNavigate('product');
                        }}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-600/10 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <CatlContainerGraphic type="enerone" className="w-12 h-10" />
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                              {prodName}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              Сертифіковано для ринку України
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>

                  {/* Economics highlight */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 space-y-1.5">
                    <div className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider">
                      Очікуваний економічний ефект
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed font-semibold">
                      {selectedSolution.economicsSummary}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-neutral-400 leading-relaxed">
                    * Точні показники IRR та терміну повернення інвестицій розраховуються індивідуально на основі фактичного погодинного графіка споживання вашого підприємства.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
