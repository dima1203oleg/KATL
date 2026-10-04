import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { solutions, toolLinks } from '../../../../data/solutions';
import { glossary } from '../../../../data/glossary';
import { asLocale, languageAlternates, LOCALES, type Locale } from '../../../../lib/brand';
import { JsonLd, breadcrumbLd } from '../../../../components/seo/JsonLd';

const L: Record<Locale, { home: string; sols: string; how: string; drivers: string; inputs: string; arch: string; terms: string; tools: string; start: string; rfq: string; note: string; kicker: string }> = {
  'uk-UA': { home: 'Головна', sols: 'Рішення', how: 'Як це працює', drivers: 'Що визначає економічний ефект', inputs: 'Дані для попередньої оцінки', arch: 'Типова архітектура', terms: 'Терміни', tools: 'Інструменти', start: 'Оцінити параметри', rfq: 'Інженерний запит', kicker: 'СЦЕНАРІЙ ЗАСТОСУВАННЯ', note: 'Загальна інженерна інформація. Конкретне обладнання, сумісність і фінансовий результат підтверджуються після аналізу даних майданчика та документації виробника.' },
  en: { home: 'Home', sols: 'Solutions', how: 'How it works', drivers: 'What drives the economics', inputs: 'Data for a preliminary assessment', arch: 'Typical architecture', terms: 'Terms', tools: 'Tools', start: 'Estimate parameters', rfq: 'Engineering request', kicker: 'USE CASE', note: 'General engineering information. Specific equipment, compatibility and financial outcome are confirmed after analysing site data and manufacturer documentation.' },
  'zh-CN': { home: '首页', sols: '解决方案', how: '工作原理', drivers: '影响经济性的因素', inputs: '初步评估所需资料', arch: '典型架构', terms: '术语', tools: '工具', start: '估算参数', rfq: '工程咨询', kicker: '应用场景', note: '本页为一般工程信息。具体设备、兼容性与财务结果需在分析现场数据与制造商文件后确认。' },
};
const k = (l: Locale) => (l === 'en' ? 'en' : l === 'zh-CN' ? 'zh' : 'uk') as 'uk' | 'en' | 'zh';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => solutions.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const s = solutions.find((x) => x.slug === slug);
  if (!s) return {};
  const alt = languageAlternates(`/solutions/${slug}`);
  return {
    title: s.title[k(locale)],
    description: s.summary[k(locale)],
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
    openGraph: { title: s.title[k(locale)], description: s.summary[k(locale)], type: 'article', locale },
  };
}

export default async function SolutionDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!(LOCALES as string[]).includes(raw)) notFound();
  const locale = asLocale(raw);
  const s = solutions.find((x) => x.slug === slug);
  if (!s) notFound();
  const t = L[locale];
  const key = k(locale);
  const root = `/${locale}`;

  return (
    <main className="kx kx-doc">
      <JsonLd data={breadcrumbLd([[t.home, root], [t.sols, `${root}/solutions`], [s.title[key], `${root}/solutions/${slug}`]])} />
      <section className="kx-doc-hero">
        <div className="kx-wrap">
          <nav className="kx-crumbs" aria-label="Breadcrumb">
            <Link href={root}>{t.home}</Link><span aria-hidden="true">/</span>
            <Link href={`${root}/solutions`}>{t.sols}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{s.title[key]}</span>
          </nav>
          <span className="kx-kicker" style={{ marginTop: 28 }}>{t.kicker}</span>
          <h1>{s.title[key]}</h1>
          <p className="kx-lead">{s.summary[key]}</p>
          <div className="kx-actions">
            <Link className="kx-btn kx-btn-primary" href={`${root}/bess-designer`}>{t.start}<ArrowRight size={16} /></Link>
            <Link className="kx-btn kx-btn-ghost" href={`${root}/rfq`}>{t.rfq}</Link>
          </div>
        </div>
      </section>

      <div className="kx-wrap kx-doc-grid">
        <article className="kx-prose">
          <h2>{t.how}</h2>
          <p>{s.how[key]}</p>
          <h2>{t.drivers}</h2>
          <ul>{s.drivers[key].map((d) => <li key={d}>{d}</li>)}</ul>
          <h2>{t.inputs}</h2>
          <ol className="kx-checklist">
            {s.inputs[key].map((d, i) => <li key={d}><span>{String(i + 1).padStart(2, '0')}</span><span>{d}</span></li>)}
          </ol>
          <h2>{t.arch}</h2>
          <p>{s.architecture[key]}</p>
          <p className="kx-note">{t.note}</p>
        </article>
        <aside className="kx-side">
          <div className="kx-side-card">
            <h3>{t.tools}</h3>
            {s.tools.map((tool) => (
              <Link key={tool} href={`${root}${toolLinks[tool].path}`}>{toolLinks[tool][key]}<ArrowRight size={15} /></Link>
            ))}
          </div>
          <div className="kx-side-card">
            <h3>{t.terms}</h3>
            {s.terms.map((slugT) => {
              const g = glossary.find((x) => x.slug === slugT);
              return g ? <Link key={slugT} href={`${root}/resources/glossary#${slugT}`}>{g.term}<ArrowRight size={15} /></Link> : null;
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
