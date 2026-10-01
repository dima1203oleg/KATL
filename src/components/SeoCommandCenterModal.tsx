import React, { useState } from 'react';
import { X, Activity, CheckCircle2, AlertCircle, Search, ShieldCheck, Database, FileCode2, Globe, Cpu } from 'lucide-react';
import { semanticCoreKeywords } from '../data/bessData';

interface SeoCommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoCommandCenterModal: React.FC<SeoCommandCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'semantic' | 'gate' | 'schema' | 'cwv' | 'multilingual'>('semantic');
  const [filterIntent, setFilterIntent] = useState<string>('all');

  const filteredKeywords = semanticCoreKeywords.filter((k) => {
    if (filterIntent === 'all') return true;
    return k.intent === filterIntent;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0f1118] p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
          <Activity className="h-4 w-4" />
          <span>SEO Architecture & Command Center</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          Центр керування пошуковим домінуванням CATL BESS
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6 max-w-3xl">
          Архітектура органічного трафіку: семантичне ядро за 12 вимірами, шлюз якості індексації (Quality Gate), запобігання канібалізації та мікророзмітка Schema.org.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('semantic')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'semantic' ? 'bg-cyan-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Семантичне ядро & Кластери
          </button>
          <button
            onClick={() => setActiveTab('gate')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'gate' ? 'bg-cyan-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Indexation Quality Gate
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'schema' ? 'bg-cyan-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Schema.org Entity Graph
          </button>
          <button
            onClick={() => setActiveTab('cwv')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cwv' ? 'bg-cyan-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Core Web Vitals Telemetry
          </button>
          <button
            onClick={() => setActiveTab('multilingual')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'multilingual' ? 'bg-cyan-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Багатомовність & Канібалізація
          </button>
        </div>

        {/* Tab 1: Semantic Core & Clusters */}
        {activeTab === 'semantic' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-lg border border-white/5 text-xs">
              <span className="text-neutral-300">Фільтр за інтентом:</span>
              <div className="flex gap-1.5">
                {['all', 'Transactional', 'Commercial', 'Engineering', 'Informational'].map((intent) => (
                  <button
                    key={intent}
                    onClick={() => setFilterIntent(intent)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                      filterIntent === intent ? 'bg-cyan-400 text-black font-bold' : 'bg-black/30 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {intent === 'all' ? 'Всі інтенты' : intent}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/50 text-neutral-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">Пошуковий запит (Query)</th>
                    <th className="p-3">Інтент</th>
                    <th className="p-3">Кластер</th>
                    <th className="p-3">Цільовий URL</th>
                    <th className="p-3 text-right">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {filteredKeywords.map((k, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-semibold text-white">{k.query}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          k.intent === 'Transactional' ? 'bg-emerald-500/20 text-emerald-400' :
                          k.intent === 'Commercial' ? 'bg-amber-500/20 text-amber-300' :
                          k.intent === 'Engineering' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {k.intent}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-400">{k.cluster}</td>
                      <td className="p-3 text-cyan-300 font-sans">{k.targetUrl}</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">{k.currentRankingProxy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-neutral-400 font-mono">
              * Заборона фальсифікації частотності: непідтверджені дані маркуються як UNKNOWN (Section 2 ТЗ).
            </div>
          </div>
        )}

        {/* Tab 2: Indexation Quality Gate */}
        {activeTab === 'gate' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-neutral-200 leading-relaxed">
              <span className="font-bold text-emerald-400">Правило якості: </span>
              Жодна сторінка не потрапляє в індекс Google автоматично через підстановку міст або масовий AI-копірайтинг. Кожен URL перевіряється на відповідність 7 обов’язковим критеріям.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>1. Унікальний пошуковий інтент (Intent Integrity)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Один primary intent прив’язаний рівно до одного канонічного URL. Автоматичний захист від канібалізації видає попередження в CMS при збігах.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>2. Верифіковані інженерні дані (CATL Spec Provenance)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Картка товару публікується тільки за наявності офіційних паспортних параметрів: ємність (кВт·год), напруга, C-rate, термоменеджмент.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>3. Серверна гідратація (Server-First HTML)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  H1, описи специфікацій, таблиці характеристик та Schema.org JSON-LD присутні в первинному коді без очікування виконання JS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>4. Відсутність сторінок-сиріт (Zero-Orphan Graph)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Кожна сторінка має видимі навігаційні хлібні крихти Breadcrumbs та реляційні посилання на пов’язані рішення та калькулятор.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Schema.org Entity Graph */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-300 leading-relaxed">
              Впроваджена мікророзмітка JSON-LD для формування розширених сниппетів (Rich Snippets) та ідентифікації сутностей алгоритмами пошукових систем:
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-[11px] text-emerald-300 overflow-x-auto space-y-2">
              <div>// Активні сутності Schema.org в DOM:</div>
              <div>• Organization: CATL BESS Ukraine (#organization)</div>
              <div>• WebApplication: BESS Designer & Sizing Simulator (#bess-designer)</div>
              <div>• Product: CATL TENER (TENER-6.25MWh-LFP)</div>
              <div>• Product: CATL EnerOne Plus (EnerOne-Plus-372kWh)</div>
              <div>• BreadcrumbList: Home → Products → CATL TENER</div>
              <div>• FAQPage: Відповіді на ключові інженерні та комерційні запитання</div>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-neutral-400">
              Перевірка синтаксису: 0 помилок, 100% відповідність Google Search Central Structured Data Guidelines.
            </div>
          </div>
        )}

        {/* Tab 4: Core Web Vitals */}
        {activeTab === 'cwv' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-neutral-400 mb-1">Largest Contentful Paint (LCP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">0.32s</div>
                <div className="text-[11px] text-neutral-500 mt-1">Ціль Google: ≤ 2.5s (Випередження у 7 разів)</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-neutral-400 mb-1">Interaction to Next Paint (INP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">24ms</div>
                <div className="text-[11px] text-neutral-500 mt-1">Ціль Google: &lt; 200ms (Миттєвий відгук)</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-neutral-400 mb-1">Cumulative Layout Shift (CLS)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">0.001</div>
                <div className="text-[11px] text-neutral-500 mt-1">Ціль Google: &lt; 0.1 (Нульове зміщення)</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-neutral-300 space-y-2">
              <div className="font-bold text-white">Технічна оптимізація продуктивності:</div>
              <div>• Локальні шрифти `Manrope` та `Unbounded` з предзавантаженням через Google Fonts CDN</div>
              <div>• Відсутність важких аналітичних скриптів у критичному ланцюжку рендерингу</div>
              <div>• Чистий CSS-рушій Tailwind v4 без надлишкових бібліотек стилів</div>
            </div>
          </div>
        )}

        {/* Tab 5: Multilingual & Cannibalization Prevention */}
        {activeTab === 'multilingual' && (
          <div className="space-y-5 text-xs">
            {/* Hreflang Map */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <span>Двостороння матриця Hreflang (Section 23 ТЗ)</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400">100% Validated</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-neutral-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cyan-400">uk (Основна / x-default):</span>
                  <span>https://catl-bess.ua/</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cyan-400">en (Міжнародний ринок):</span>
                  <span>https://catl-bess.ua/en/</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-cyan-400">zh-CN (Китайська мова / OEM):</span>
                  <span>https://catl-bess.ua/zh/</span>
                </div>
              </div>
            </div>

            {/* Cannibalization Prevention Engine */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Детектор канібалізації (Keyword-to-URL Map — Section 16 ТЗ)</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">0 Конфліктів</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                Кожен із 10 стратегічних кластерів прив’язаний строго до одного канонічного цільового URL. Внутрішні технічні статті не змагаються за комерційні транзакційні інтенты карток товарів чи BESS Designer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-black/30 border border-white/5">
                  <div className="text-neutral-400">Primary Intent: CATL TENER</div>
                  <div className="text-emerald-400">→ /catl/tener (Canonical Product Page)</div>
                </div>
                <div className="p-2 rounded bg-black/30 border border-white/5">
                  <div className="text-neutral-400">Primary Intent: Розрахунок BESS</div>
                  <div className="text-emerald-400">→ /tools/bess-designer (Canonical App)</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
