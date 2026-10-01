import React from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';
import { Language, Testimonial } from '../types';
import { content } from '../data/content';

interface TestimonialsSectionProps {
  lang: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const t = content[lang].testimonials;

  return (
    <section id="reviews" className="py-20 md:py-28 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {lang === 'ua' ? 'Довіра & Результати' : 'Trust & Outcomes'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {t.items.map((item: Testimonial) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-[#13151f] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <Quote className="h-6 w-6 text-amber-400/40 mb-4" />
                <p className="text-sm text-neutral-300 leading-relaxed mb-6 italic">
                  "{item.text}"
                </p>
              </div>

              <div>
                {/* Concrete outcome callout */}
                <div className="rounded-lg bg-black/40 border border-white/5 p-3 mb-5">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-neutral-200 font-medium">{item.outcome}</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="h-10 w-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-display text-xs font-bold text-amber-300">
                    {item.avatarText}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.author}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {item.role} · <span className="text-neutral-300">{item.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
