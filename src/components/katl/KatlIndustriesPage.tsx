import React, { useState } from 'react';
import {
  Factory,
  Wheat,
  Truck,
  Building,
  Server,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calculator,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { titanIndustriesList, TitanIndustry } from '../../data/titanPlatformData';
import { CatlContainerGraphic } from './KatlVisualAssets';

interface KatlIndustriesPageProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const KatlIndustriesPage: React.FC<KatlIndustriesPageProps> = ({
  onNavigate,
  onOpenRfq,
  onSelectProduct,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<TitanIndustry>(titanIndustriesList[0]);

  const getIndustryIcon = (slug: string) => {
    switch (slug) {
      case 'manufacturing': return <Factory className="h-5 w-5" />;
      case 'agriculture': return <Wheat className="h-5 w-5" />;
      case 'logistics': return <Truck className="h-5 w-5" />;
      case 'commercial': return <Building className="h-5 w-5" />;
      case 'datacenters': return <Server className="h-5 w-5" />;
      default: return <Factory className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Галузеві рішення CATL</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                INDUSTRY SPECIFIC ARCHITECTURES
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Галузеві рішення систем накопичення енергії
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Специфічні інженерні конфігурації BESS, розроблені під реальні профілі споживання українських підприємств: заводів, елеваторів, логістичних комплексів та дата-центрів.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenRfq(`Галузевий запит для сектору: ${selectedIndustry.name}`)}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <span>Замовити аудит об'єкта</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Industry Pills */}
          <div className="flex flex-wrap gap-2.5 mt-8">
            {titanIndustriesList.map((ind) => (
              <button
                key={ind.slug}
                onClick={() => setSelectedIndustry(ind)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedIndustry.slug === ind.slug
                    ? 'bg-[#0077ff] text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {getIndustryIcon(ind.slug)}
                <span>{ind.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Selected Industry Content */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 7 cols: Specific Characteristics & Pain Points */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#0077ff]" />
                    ГАЛУЗЕВИЙ ПРОФІЛЬ ЕНЕРГОСПОЖИВАННЯ
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {selectedIndustry.name}
                  </h2>
                </div>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-neutral-400">Типова потужність підприємства:</div>
                    <div className="text-xl font-bold text-white">{selectedIndustry.typicalPower}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/15 border border-blue-500/30 space-y-1">
                    <div className="text-[10px] text-blue-300">Рекомендована ємність BESS:</div>
                    <div className="text-xl font-bold text-blue-400">{selectedIndustry.typicalCapacity}</div>
                  </div>
                </div>

                {/* Typical Pain Points */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
                    Критичні виклики та ризики галузі:
                  </div>

                  <div className="space-y-2">
                    {selectedIndustry.painPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-neutral-200">
                        <span className="text-red-400 font-bold font-mono">0{idx + 1}.</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Reference */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Реалізований референс-проект в Україні:</span>
                    <span className="text-neutral-300">{selectedIndustry.caseReference}</span>
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
                    <span>Розрахувати BESS для {selectedIndustry.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onOpenRfq(`Запит інженерного розрахунку: ${selectedIndustry.name}`)}
                    className="rounded-full bg-white/5 border border-white/15 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Запитати ТКП
                  </button>
                </div>
              </div>

              {/* Right 5 cols: Architecture Card */}
              <div className="lg:col-span-5 bg-black/40 rounded-2xl border border-white/15 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Рекомендована архітектура
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Готове рішення
                  </span>
                </div>

                <div
                  onClick={() => {
                    const pid = selectedIndustry.recommendedSetup.includes('EnerOne')
                      ? 'catl-enerone-plus'
                      : selectedIndustry.recommendedSetup.includes('Stack')
                      ? 'catl-tener-stack'
                      : 'catl-tener-h';
                    if (onSelectProduct) onSelectProduct(pid);
                    onNavigate('product');
                  }}
                  className="cursor-pointer group"
                >
                  <div className="h-32 flex items-center justify-center p-2 bg-black/50 rounded-xl border border-white/5 group-hover:border-blue-500/40 group-hover:bg-blue-600/10 transition-all">
                    <CatlContainerGraphic
                      type={selectedIndustry.recommendedSetup.includes('EnerOne') ? 'enerone' : 'tener-h'}
                      className="w-full h-28"
                    />
                  </div>

                  <div className="space-y-1.5 mt-3">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Склад комплексу:</span>
                      <span className="text-[10px] text-blue-400 font-mono group-hover:underline flex items-center gap-1">
                        Детальніше про модель →
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-blue-500/30 text-xs font-mono text-blue-300">
                      {selectedIndustry.recommendedSetup}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                    <span>Повна сумісність з існуючою ТП 10/0.4 кВ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                    <span>Автоматичний перехід на акумулятори &lt; 20 мс</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                    <span>Інтеграція в корпоративну SCADA</span>
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
