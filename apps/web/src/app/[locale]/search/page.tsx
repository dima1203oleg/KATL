import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search, FileText, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Пошук по платформі | KATL ESS Україна',
  robots: { index: false, follow: false },
};

interface SearchResult {
  type: 'product' | 'document';
  id: string;
  title: string;
  category?: string;
  snippet?: string;
  url: string;
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ locale }, { q = '' }] = await Promise.all([params, searchParams]);
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();

  let data: { total: number; results: SearchResult[] } | null = null;
  let failed = false;

  const trimmedQuery = q.trim();

  if (trimmedQuery.length >= 2) {
    try {
      const base = process.env.API_URL || 'http://127.0.0.1:4000';
      const url = new URL('/api/v1/search', base);
      url.searchParams.set('q', trimmedQuery.slice(0, 100));
      url.searchParams.set('locale', locale);
      const response = await fetch(url.toString(), { cache: 'no-store' });
      if (!response.ok) throw new Error('Search failed');
      data = await response.json();
    } catch {
      failed = true;
    }
  }

  const t = {
    'uk-UA': {
      tag: 'Єдиний інженерний індекс',
      title: 'Пошук по каталогу та базі знань',
      subtitle: 'Знайдіть необхідну модель BESS, технічний паспорт, сертифікат безпеки або категорію рішень.',
      placeholder: 'Наприклад: TENER, EnerOne, 6.25, Домашні, інвертор...',
      searchBtn: 'Знайти',
      foundPrefix: 'Знайдено матеріалів:',
      emptyTitle: 'Нічого не знайдено',
      emptyDesc: 'Спробуйте використати назву серії (наприклад TENER, EnerC) або скористайтеся конфігуратором системи.',
      rfqPrompt: 'Не знайшли потрібної модифікації? Оформіть запит на інженерну оцінку.',
      rfqLink: 'Отримати комерційну пропозицію →',
      catProduct: 'Обладнання CATL',
      catDoc: 'Офіційний документ',
    },
    'en': {
      tag: 'Unified Engineering Index',
      title: 'Platform Search & Knowledge Base',
      subtitle: 'Search for BESS models, technical datasheets, safety certificates, and architectural solutions.',
      placeholder: 'e.g. TENER, EnerOne, 6.25 MWh, Residential, Inverter...',
      searchBtn: 'Search',
      foundPrefix: 'Matching results found:',
      emptyTitle: 'No results found',
      emptyDesc: 'Try searching by series name (TENER, EnerOne) or use our system sizing configurator.',
      rfqPrompt: 'Need a custom layout? Submit an engineering request.',
      rfqLink: 'Request Commercial Proposal →',
      catProduct: 'CATL Hardware',
      catDoc: 'Official Document',
    },
    'zh-CN': {
      tag: '统一工程索引库',
      title: '全平台产品与技术文档搜索',
      subtitle: '检索 CATL 储能产品型号、技术规格书 (Datasheet)、安全认证及工程解决方案。',
      placeholder: '例如：TENER, EnerOne, 6.25 MWh, 户用储能, 逆变器...',
      searchBtn: '搜索',
      foundPrefix: '检索到的结果数：',
      emptyTitle: '未找到相关结果',
      emptyDesc: '请尝试按产品系列名称（如 TENER、EnerC）搜索，或使用我们的系统选型配置器。',
      rfqPrompt: '需要定制化工程方案？请提交工程咨询申请。',
      rfqLink: '获取商业建议书 →',
      catProduct: 'CATL 储能产品',
      catDoc: '官方技术文档',
    },
  }[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA'];

  return (
    <main className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Search className="h-3.5 w-3.5" />
            <span>{t.tag}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mb-3">
            {t.title}
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>

          {/* Search Input Bar */}
          <form
            action={`/${locale}/search`}
            method="GET"
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                id="q"
                name="q"
                type="text"
                minLength={2}
                maxLength={100}
                defaultValue={trimmedQuery}
                placeholder={t.placeholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/15 bg-[#141722] text-sm text-white focus:border-emerald-400 focus:outline-none placeholder:text-neutral-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-black hover:bg-emerald-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-emerald-400/20"
            >
              <span>{t.searchBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="max-w-3xl mx-auto">
          {failed ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-300 text-center text-sm">
              Пошуковий сервіс тимчасово оновлюється. Будь ласка, повторіть запит через кілька хвилин.
            </div>
          ) : trimmedQuery.length < 2 ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-neutral-400 text-sm">
              Введіть щонайменше 2 символи для запуску пошуку по Master Product Registry та технічних документах.
            </div>
          ) : data?.total ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/10">
                <span>{t.foundPrefix} <strong className="text-emerald-400">{data.total}</strong></span>
                <span>CATL Verified Index</span>
              </div>

              <div className="space-y-3">
                {data.results.map((item, idx) => (
                  <article
                    key={`${item.id}-${idx}`}
                    className="group rounded-xl border border-white/10 bg-[#12141e] hover:border-emerald-500/40 p-5 transition-all shadow-md hover:shadow-emerald-500/5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        {item.type === 'product' ? <Layers className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        {item.type === 'product' ? t.catProduct : t.catDoc}
                      </span>
                      {item.category && <span>{item.category}</span>}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      <Link href={item.url} className="flex items-center justify-between gap-2">
                        <span>{item.title}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 shrink-0" />
                      </Link>
                    </h2>

                    {item.snippet && (
                      <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#12141e] p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-neutral-400 mb-4">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                {t.emptyTitle}
              </h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
                {t.emptyDesc}
              </p>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 max-w-md mx-auto">
                <p className="text-xs text-neutral-300 mb-3">{t.rfqPrompt}</p>
                <Link
                  href={`/${locale}/rfq`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>{t.rfqLink}</span>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
