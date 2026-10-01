import React, { useState } from 'react';
import { ArrowUpRight, Calculator, Calendar, Sparkles, CheckCircle2, ShieldCheck, Zap, Code2, Gauge } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface HeroProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenBooking }) => {
  const t = content[lang].hero;
  const [activeTab, setActiveTab] = useState<'speed' | 'stack' | 'security'>('speed');

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCases = () => {
    document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[450px] w-full max-w-7xl bg-radial from-amber-500/10 via-amber-500/3 to-transparent blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Unboxed natural kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              <span>{t.kicker}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">Kyiv & Worldwide</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6 max-w-2xl [text-wrap:balance]">
              {t.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-xl">
              {t.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={scrollToEstimator}
                className="flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-amber-400/20 whitespace-nowrap"
              >
                <Calculator className="h-4 w-4" />
                <span>{t.ctaPrimary}</span>
              </button>

              <button
                onClick={scrollToCases}
                className="flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{t.ctaSecondary}</span>
                <ArrowUpRight className="h-4 w-4 text-amber-400" />
              </button>

              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2 rounded-md border border-amber-400/30 px-4 py-3 text-xs font-semibold text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{t.bookCall}</span>
              </button>
            </div>

            {/* Minimal metadata notice */}
            <div className="mt-8 flex items-center gap-3 text-xs text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.interactiveBadge}</span>
            </div>
          </div>

          {/* Right Column: Interactive Studio Console / Live Proof Terminal */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-white/10 bg-[#13151f] p-5 sm:p-6 shadow-2xl relative">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-neutral-400">obriy.engine.v2026</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded">Production Build</span>
              </div>

              {/* Console Navigation Tabs */}
              <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-4 text-xs">
                <button
                  onClick={() => setActiveTab('speed')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === 'speed' ? 'bg-amber-400 text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Gauge className="h-3.5 w-3.5" />
                  <span>Швидкість LCP</span>
                </button>
                <button
                  onClick={() => setActiveTab('stack')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === 'stack' ? 'bg-amber-400 text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Архітектура</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === 'security' ? 'bg-amber-400 text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Безпека</span>
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'speed' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                      <div className="text-xs text-neutral-400 mb-1">Google PageSpeed</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">99 / 100</div>
                      <div className="text-[11px] text-neutral-500 mt-1">Mobile & Desktop</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                      <div className="text-xs text-neutral-400 mb-1">First Contentful Paint</div>
                      <div className="text-2xl font-bold font-mono text-amber-300">0.24s</div>
                      <div className="text-[11px] text-neutral-500 mt-1">Edge CDN cached</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-neutral-300">Оптимізація рендерингу</span>
                      <span className="font-mono text-emerald-400">100% Passed</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-400 h-2 rounded-full w-[98%]" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>CLS: 0.001 (Zero Shift)</span>
                      <span>INP: 32ms (Instant Touch)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stack' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1.5 text-neutral-300">
                    <div className="text-amber-400 font-semibold">// Core Engineering Modules</div>
                    <div>• Frontend: React 19, TypeScript, Next.js App Router</div>
                    <div>• Styling: Tailwind CSS v4, Motion</div>
                    <div>• Backend: Node.js, Express, Edge Functions</div>
                    <div>• Databases: PostgreSQL, Prisma, Redis Caching</div>
                    <div>• Integrations: MonoPay, LiqPay, Stripe, Nova Poshta API</div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Чистий код без зайвих залежностей та повільних бібліотек</span>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300">Захист від DDoS & WAF</span>
                      <span className="text-emerald-400 font-mono">Active Cloudflare</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300">Шифрування даних</span>
                      <span className="text-emerald-400 font-mono">TLS 1.3 / AES-256</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300">Відповідність PCI DSS</span>
                      <span className="text-emerald-400 font-mono">Tier 1 Gateways</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Ізольовані середовища розробки та автоматичні бекапи</span>
                  </div>
                </div>
              )}

              {/* Action bar inside console */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Готові протестувати швидкість вашого сайту?</span>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-amber-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Замовити аудит</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quantitative Proof Adjacent to Hero (Section 1.H Claim-to-Proof Adjacency) */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {t.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-neutral-200 mt-1">
                {stat.label}
              </span>
              <span className="text-xs text-neutral-400 mt-0.5">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
