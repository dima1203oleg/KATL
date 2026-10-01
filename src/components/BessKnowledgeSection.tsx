import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { bessKnowledgeGuides, BessKnowledgeGuide } from '../data/bessData';

export const BessKnowledgeSection: React.FC = () => {
  const [openGuideId, setOpenGuideId] = useState<string>('guide-what-is-bess');

  const toggle = (id: string) => {
    setOpenGuideId(openGuideId === id ? '' : id);
  };

  return (
    <section id="knowledge" className="py-20 md:py-28 border-b border-white/5 bg-[#08090d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <BookOpen className="h-4 w-4" />
            <span>Інженерна база знань & FAQ Hub</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            Технічні стандарти та економіка систем накопичення
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            Верифіковані інженерні відповіді про архітектуру LFP, пожежну безпеку NFPA 855, параметри C-rate та методику розрахунку нормованої вартості зберігання (LCOS).
          </p>
        </div>

        {/* Guides Accordions with Direct Answer Boxes (AEO & Featured Snippet optimized) */}
        <div className="space-y-4">
          {bessKnowledgeGuides.map((guide: BessKnowledgeGuide) => {
            const isOpen = openGuideId === guide.id;

            return (
              <div
                key={guide.id}
                className="rounded-2xl border border-white/10 bg-[#12141c] overflow-hidden transition-all duration-200"
              >
                {/* Question Header Button */}
                <button
                  onClick={() => toggle(guide.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-white/[0.02] cursor-pointer"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-white pr-4">
                    {guide.question}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-emerald-400">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Direct Answer Box (Always rendered, visually distinct) */}
                <div className="px-5 sm:px-6 pb-4">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    <span className="font-bold text-emerald-400">Коротка відповідь: </span>
                    {guide.shortAnswer}
                  </div>
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    
                    {/* Key Facts List */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Ключові технічні факти:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {guide.keyFacts.map((fact, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200 bg-black/30 p-2.5 rounded-lg border border-white/5">
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Technical Prose */}
                    <div className="pt-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Інженерне обґрунтування:
                      </div>
                      <p className="bg-black/20 p-4 rounded-xl border border-white/5 text-neutral-300 leading-relaxed">
                        {guide.detailedContent}
                      </p>
                    </div>

                    {/* Standard & Citation Reference */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-white/5">
                      <span>Стандарт / Методологія: {guide.methodologyOrStandard}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span>Верифіковано CATL BESS UA</span>
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
