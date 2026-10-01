import React from 'react';
import { Check, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language, ProcessStep } from '../types';
import { content } from '../data/content';

interface ProcessSectionProps {
  lang: Language;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ lang }) => {
  const t = content[lang].process;

  return (
    <section id="process" className="py-20 md:py-28 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {lang === 'ua' ? 'Етапи & Методологія' : 'Delivery & Methodology'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((stepItem: ProcessStep) => (
            <div
              key={stepItem.step}
              className="rounded-xl border border-white/10 bg-[#13151f] p-6 hover:border-amber-400/40 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Step Number and Duration */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <span className="font-display text-2xl font-extrabold text-amber-400">
                    {stepItem.step}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{stepItem.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {stepItem.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                  {stepItem.description}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                {stepItem.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400">
                    <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 rounded-xl border border-white/10 bg-[#10121a] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {lang === 'ua' ? '30 днів повної гарантійної підтримки' : '30-Day Complete Warranty Included'}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                {lang === 'ua' 
                  ? 'Будь-які технічні правки чи виправлення багів після релізу здійснюються безкоштовно та оперативно.'
                  : 'Any bug fixes or minor parameter tweaks after launch are handled swiftly at zero additional charge.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline shrink-0"
          >
            <span>{lang === 'ua' ? 'Обговорити гарантійні умови' : 'Learn more about warranty'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
