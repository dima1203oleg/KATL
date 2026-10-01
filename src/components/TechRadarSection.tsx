import React, { useState } from 'react';
import { Layers, Server, Database, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface TechRadarSectionProps {
  lang: Language;
}

export const TechRadarSection: React.FC<TechRadarSectionProps> = ({ lang }) => {
  const [activeTier, setActiveTier] = useState<'frontend' | 'backend' | 'database' | 'infra'>('frontend');

  const tiers = {
    frontend: {
      title: lang === 'ua' ? 'Фронтенд & Інтерфейси' : 'Frontend & UI Engineering',
      description: lang === 'ua'
        ? 'Мінімальний JavaScript бандл, миттєвий відгук на дотики, підтримка доступності WCAG AA та плавні анімації 60/120 FPS.'
        : 'Sub-second first input latency, strict WCAG AA compliance, and hardware-accelerated 60/120 FPS transitions.',
      items: [
        { name: 'React 19 & Next.js App Router', role: 'Server Components, SSR & Streaming', speed: '< 0.3s LCP' },
        { name: 'TypeScript Strict Mode', role: 'Типобезпечний код та нуль рантайм помилок', speed: '100% Typed' },
        { name: 'Tailwind CSS v4 & Motion', role: 'Апаратне прискорення CSS змінних', speed: '60+ FPS' },
        { name: 'Micro-Frontend & Islands', role: 'Ізольовані інтерактивні віджети', speed: '< 45KB JS' },
      ],
      metrics: [
        { label: 'PageSpeed Score', value: '99/100' },
        { label: 'Cumulative Layout Shift', value: '0.001' },
        { label: 'Interaction to Next Paint', value: '28ms' },
      ],
    },
    backend: {
      title: lang === 'ua' ? 'Бекенд & API Шлюзи' : 'Backend & API Architecture',
      description: lang === 'ua'
        ? 'Масштабовані хмарні мікросервіси з низькою затримкою, безпечним доступом через JWT/OAuth та захистом від перевантажень.'
        : 'High-throughput stateless microservices with JWT/OAuth auth flows, rate limiting, and automated failover.',
      items: [
        { name: 'Node.js & Express / Fastify', role: 'Асинхронний високонавантажений обробник', speed: '15k req/s' },
        { name: 'Edge Serverless Functions', role: 'Виконання логіки найближче до користувача', speed: '< 15ms latency' },
        { name: 'REST & GraphQL Gateways', role: 'Гнучкі контракти даних з валідацією Zod', speed: 'Realtime' },
        { name: 'WebSocket Streams', role: 'Двосторонній зв’язок для чатів та телеметрії', speed: 'Sub-50ms' },
      ],
      metrics: [
        { label: 'API P95 Response', value: '42ms' },
        { label: 'Uptime SLA', value: '99.98%' },
        { label: 'Cold Start Latency', value: '0ms' },
      ],
    },
    database: {
      title: lang === 'ua' ? 'Бази даних & Кешування' : 'Data Tier & High-Speed Cache',
      description: lang === 'ua'
        ? 'Реляційні надійні сховища з підтримкою транзакцій ACID, реплікацією та миттєвим кешуванням у пам’яті через Redis.'
        : 'ACID-compliant relational clusters with automated snapshots, read-replicas, and sub-millisecond Redis memory layers.',
      items: [
        { name: 'PostgreSQL & Cloud SQL', role: 'Головна реляційна база з індексацією B-Tree', speed: 'ACID Safe' },
        { name: 'Redis In-Memory Layer', role: 'Кешування сесій, кошиків та лімітів запитів', speed: '< 2ms' },
        { name: 'Prisma / Drizzle ORM', role: 'Строго типізовані міграції без розсинхрону', speed: 'Zero Leak' },
        { name: 'Automated Snapshot Backups', role: 'Щоденне шифроване резервне копіювання', speed: 'Point-in-Time' },
      ],
      metrics: [
        { label: 'Cache Hit Ratio', value: '94.2%' },
        { label: 'Query P95 Latency', value: '4.8ms' },
        { label: 'Data Durability', value: '99.9999%' },
      ],
    },
    infra: {
      title: lang === 'ua' ? 'Інфраструктура & Еквайринг' : 'Infrastructure, Security & Payments',
      description: lang === 'ua'
        ? 'Розгортання у хмарі з глобальним захистом WAF від Cloudflare, інтеграцією MonoPay, LiqPay, Stripe та моніторингом 24/7.'
        : 'Enterprise edge distribution, DDoS mitigation, Ukrainian and global payment gateways, and automated continuous deployment.',
      items: [
        { name: 'MonoPay, LiqPay & Stripe', role: '1-клік оплати через Apple Pay та картки', speed: 'PCI DSS v4' },
        { name: 'Cloudflare Enterprise WAF', role: 'Захист від DDoS атак, ботів та скрейпінгу', speed: '320+ PoPs' },
        { name: 'Docker & Kubernetes CI/CD', role: 'Автоматичний деплой за 90 секунд без простою', speed: 'Zero Downtime' },
        { name: 'Sentry & Grafana Observability', role: 'Миттєве сповіщення про помилки в Telegram', speed: 'Live Alert' },
      ],
      metrics: [
        { label: 'Edge Locations', value: '320+' },
        { label: 'SSL Handshake', value: '18ms' },
        { label: 'Deploy Velocity', value: '90s' },
      ],
    },
  };

  const currentTier = tiers[activeTier];

  return (
    <section className="py-20 md:py-28 border-b border-white/5 bg-[#0a0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {lang === 'ua' ? 'Інженерна архітектура' : 'Technical Architecture'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            {lang === 'ua' ? 'Стек технологій, перевірений під високим навантаженням' : 'Modern engineering stack built for extreme resilience'}
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            {lang === 'ua'
              ? 'Ми обираємо сучасні інструменти без технічного боргу, що забезпечують швидкість рендерингу та безпеку транзакцій.'
              : 'Zero technical debt. We leverage battle-tested modern tools optimized for raw speed, security, and developer ergonomics.'}
          </p>
        </div>

        {/* Tier Selector Buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#13151f] rounded-xl border border-white/10 mb-8 max-w-2xl">
          <button
            onClick={() => setActiveTier('frontend')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTier === 'frontend' ? 'bg-amber-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'ua' ? 'Фронтенд' : 'Frontend'}
          </button>
          <button
            onClick={() => setActiveTier('backend')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTier === 'backend' ? 'bg-amber-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'ua' ? 'Бекенд & API' : 'Backend & API'}
          </button>
          <button
            onClick={() => setActiveTier('database')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTier === 'database' ? 'bg-amber-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'ua' ? 'Бази даних' : 'Databases'}
          </button>
          <button
            onClick={() => setActiveTier('infra')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTier === 'infra' ? 'bg-amber-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'ua' ? 'Хмара & Оплати' : 'Cloud & Payments'}
          </button>
        </div>

        {/* Active Tier Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stack modules */}
          <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-8">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
              {currentTier.title}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {currentTier.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {currentTier.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-amber-400/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.speed}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    {item.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Telemetry Benchmarks */}
          <div className="lg:col-span-4 rounded-2xl border border-amber-400/20 bg-[#141622] p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {lang === 'ua' ? 'Показники продуктивності' : 'Live Benchmarks'}
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-4">
              {currentTier.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-300">{m.label}</span>
                  <span className="font-mono text-base font-bold text-amber-300 tabular-nums">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-neutral-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{lang === 'ua' ? 'Повна передача Docker конфігурацій та документації' : 'Includes complete Docker configs and API documentation'}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
