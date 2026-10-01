import React, { useState } from 'react';
import { ArrowUpRight, Check, ShieldCheck, Download, ChevronRight, Cpu, Layers, Battery } from 'lucide-react';
import { bessProducts, BessProduct } from '../data/bessData';

interface BessProductsSectionProps {
  onSelectProductForDesigner: (productId: string) => void;
  onOpenRfq: (productName: string) => void;
}

export const BessProductsSection: React.FC<BessProductsSectionProps> = ({
  onSelectProductForDesigner,
  onOpenRfq,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('catl-tener');

  const selectedProduct = bessProducts.find((p) => p.id === selectedProductId) || bessProducts[0];

  return (
    <section id="products" className="py-20 md:py-28 border-b border-white/5 bg-[#0a0b0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Лінійки обладнання CATL
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              Офіційні системи накопичення енергії CATL
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Від автономних модульних шаф EnerOne Plus до флагманських контейнерних платформ TENER 6.25 МВт·год із нульовою деградацією за перші 5 років.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>LiFePO4 (LFP)</span>
            <span aria-hidden="true">·</span>
            <span>Рідкісне охолодження</span>
            <span aria-hidden="true">·</span>
            <span>UL 9540A & NFPA 855</span>
          </div>
        </div>

        {/* Product Family Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 p-1.5 bg-[#12141c] rounded-xl border border-white/10 mb-10">
          {bessProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`flex-1 min-w-[200px] text-left p-4 rounded-lg transition-all cursor-pointer ${
                selectedProductId === p.id
                  ? 'bg-emerald-400 text-black shadow-lg font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="text-xs uppercase tracking-wider opacity-80">{p.series} Series</div>
              <div className="text-base sm:text-lg font-display font-bold mt-0.5">{p.name}</div>
              <div className="text-xs font-mono mt-1 opacity-90">{p.capacityDisplay}</div>
            </button>
          ))}
        </div>

        {/* Selected Product Deep-Dive Card */}
        <div className="rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Overview & Engineering Advantages */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <span>Модель: {selectedProduct.modelCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedProduct.protectionRating}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm font-medium text-emerald-300 mb-4">
                  {selectedProduct.tagline}
                </p>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {selectedProduct.primaryUse}
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Ключові інженерні переваги:
                </div>
                {selectedProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Certifications (Zero pills, clean unboxed list) */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Міжнародні сертифікати безпеки:
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-300 font-mono">
                  {selectedProduct.certifications.map((cert, idx) => (
                    <React.Fragment key={cert}>
                      <span className="text-emerald-400/90 font-semibold">{cert}</span>
                      {idx < selectedProduct.certifications.length - 1 && (
                        <span className="text-neutral-600" aria-hidden="true">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => onSelectProductForDesigner(selectedProduct.id)}
                  className="flex items-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Розрахувати конфігурацію в BESS Designer</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onOpenRfq(selectedProduct.name)}
                  className="flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>Запит специфікації</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Verified Technical Specification Table */}
            <div className="lg:col-span-5 rounded-xl border border-white/10 bg-black/40 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Паспортні специфікації
                </span>
                <span className="text-[11px] font-mono text-emerald-400">CATL Verified</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Номінальна ємність:</span>
                  <span className="text-white font-bold">{selectedProduct.capacityDisplay}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Номінальна напруга DC:</span>
                  <span className="text-white">{selectedProduct.nominalVoltage}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Діапазон робочої напруги:</span>
                  <span className="text-white">{selectedProduct.voltageRange}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Швидкість розряду (C-rate):</span>
                  <span className="text-emerald-400 font-bold">{selectedProduct.cRate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Тип охолодження:</span>
                  <span className="text-white">{selectedProduct.coolingType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">ККД циклу (RTE):</span>
                  <span className="text-emerald-400 font-bold">{selectedProduct.roundTripEfficiency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Циклічний ресурс:</span>
                  <span className="text-white">{selectedProduct.cycleLife}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 font-sans">Габарити (Д×Ш×В):</span>
                  <span className="text-white">{selectedProduct.dimensions}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-400 font-sans">Маса контейнера / шафи:</span>
                  <span className="text-white">{selectedProduct.weightKg}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-400 font-sans flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Повна відповідність ДСТУ EN 62619 та вимогам ОСП Укренерго</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
