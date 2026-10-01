import React, { useState } from 'react';
import { Search, Gauge, Shield, Smartphone, Zap, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface ExpressAuditBarProps {
  lang: Language;
  onApplyForAudit: (domain: string) => void;
}

export const ExpressAuditBar: React.FC<ExpressAuditBarProps> = ({
  lang,
  onApplyForAudit,
}) => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    lcp: string;
    cls: string;
    mobileScore: number;
    issues: string[];
  } | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setAnalyzing(true);
    setResult(null);

    // Simulate diagnostic scan
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: Math.floor(Math.random() * 25) + 62, // 62 - 87
        lcp: '3.4s (Повільний рендеринг банера)',
        cls: '0.18 (Зсув контенту при завантаженні)',
        mobileScore: 68,
        issues: [
          'Неоптимізовані зображення у форматі PNG/JPEG без AVIF стиснення',
          'Блокуючий рендеринг JavaScript бандл (> 850 KB)',
          'Відсутність серверного кешування на рівні CDN',
        ],
      });
    }, 1200);
  };

  return (
    <div className="py-12 bg-[#10121a] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-2xl border border-white/10 bg-[#141622] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                {lang === 'ua' ? 'Експрес-діагностика швидкості' : 'Express Speed Diagnosis'}
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {lang === 'ua' ? 'Перевірте ваш поточний сайт за стандартами Core Web Vitals' : 'Audit your existing web application against Core Web Vitals'}
              </h3>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative min-w-[280px] sm:min-w-[340px]">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={lang === 'ua' ? 'vash-site.com.ua' : 'yoursite.com'}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={analyzing}
                className="flex items-center justify-center gap-1.5 rounded-md bg-amber-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-300 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
              >
                {analyzing ? (
                  <span>{lang === 'ua' ? 'Скануємо...' : 'Scanning...'}</span>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    <span>{lang === 'ua' ? 'Аналізувати сайт' : 'Analyze Site'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Diagnostic Result Container */}
          {result && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">PageSpeed Performance</div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">{result.score} / 100</div>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-amber-400/80" />
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Largest Contentful Paint (LCP)</div>
                    <div className="text-sm font-bold font-mono text-rose-400 mt-1">{result.lcp}</div>
                  </div>
                  <Zap className="h-6 w-6 text-rose-400/80" />
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Mobile User Experience</div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">{result.mobileScore} / 100</div>
                  </div>
                  <Smartphone className="h-6 w-6 text-amber-400/80" />
                </div>
              </div>

              {/* Actionable points */}
              <div className="rounded-lg bg-black/20 p-4 border border-white/5 space-y-2 mb-4">
                <div className="text-xs font-semibold text-neutral-300">
                  {lang === 'ua' ? 'Виявлені критичні фактори уповільнення:' : 'Detected Performance Bottlenecks:'}
                </div>
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-neutral-400">
                  {lang === 'ua'
                    ? 'Студія ОБРІЙ гарантує виведення вашого сайту в зелену зону 95+ балів.'
                    : 'OBRIY Studio guarantees migrating your site into the 95+ green zone.'}
                </span>
                <button
                  onClick={() => onApplyForAudit(url)}
                  className="flex items-center gap-1.5 text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  <span>{lang === 'ua' ? 'Отримати повноцінний інженерний план аудиту' : 'Get Full Engineering Optimization Plan'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
