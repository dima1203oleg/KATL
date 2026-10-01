import React, { useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Layers, Terminal, Sparkles } from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { content } from '../data/content';

interface ServicesSectionProps {
  lang: Language;
  onSelectServiceForEstimator: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  onSelectServiceForEstimator,
}) => {
  const t = content[lang].services;
  const [expandedId, setExpandedId] = useState<string | null>('web-apps');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="services" className="py-20 md:py-28 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {lang === 'ua' ? 'Експертиза & Послуги' : 'Expertise & Capabilities'}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              {t.sectionTitle}
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400">
            <span>Гарантія якості</span>
            <span aria-hidden="true">·</span>
            <span>Фіксовані строки</span>
            <span aria-hidden="true">·</span>
            <span>Чистий код</span>
          </div>
        </div>

        {/* Asymmetric Bento / Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map((service: ServiceItem) => {
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                className="group rounded-xl border border-white/10 bg-[#13151f] p-6 sm:p-8 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                    <span className="font-display text-base font-bold text-amber-400">
                      {service.number}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span>{service.timeline}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-neutral-200">{service.startingPrice}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-sm font-medium text-amber-400/90 mb-3">
                    {service.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Unboxed Tech Stack Metadata (Anti-slop zero pills) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 mb-6">
                    <span className="text-neutral-500 font-medium">Стек:</span>
                    {service.techStack.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="text-neutral-300">{tech}</span>
                        {idx < service.techStack.length - 1 && (
                          <span className="text-neutral-600" aria-hidden="true">/</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Expanded Deliverables List */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        {lang === 'ua' ? 'Що входить у розробку:' : 'Deliverables & Inclusions:'}
                      </div>
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? (lang === 'ua' ? 'Згорнути' : 'Collapse') : (lang === 'ua' ? 'Переглянути деталі' : 'View details')}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => onSelectServiceForEstimator(service.id)}
                    className="flex items-center gap-1.5 rounded-md bg-white/5 hover:bg-amber-400 hover:text-black px-3.5 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.ctaSelect}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
