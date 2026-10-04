import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { glossary, groupLabels, type GlossaryGroup } from '../../../../data/glossary';
import { asLocale, BRAND, languageAlternates, LOCALES, type Locale } from '../../../../lib/brand';
import { JsonLd, breadcrumbLd } from '../../../../components/seo/JsonLd';

const T: Record<Locale, { title: string; h1: string; intro: string; home: string; res: string; related: string; formula: string; cta: string; ctaBody: string; ctaBtn: string; meta: string; jump: string }> = {
  'uk-UA': {
    title: 'Глосарій BESS: терміни систем накопичення енергії',
    h1: 'Глосарій систем накопичення енергії',
    intro: 'Ключові терміни BESS простою інженерною мовою: архітектура, технічні показники, економіка, застосування й безпека. Посилайтеся на будь-який термін за якорем.',
    meta: 'Що таке BESS, PCS, EMS, C-rate, DoD, SOC, SOH, RTE, LCOS, peak shaving та арбітраж — визначення та формули для проєктів накопичення енергії.',
    home: 'Головна', res: 'База знань', related: 'Пов’язані терміни', formula: 'Формула', jump: 'Розділи',
    cta: 'Терміни зрозумілі — перейдемо до цифр?', ctaBody: 'Порахуйте потужність, ємність і LCOS для свого об’єкта.', ctaBtn: 'Відкрити інструменти',
  },
  en: {
    title: 'BESS Glossary: Energy Storage Terms Explained',
    h1: 'Energy storage glossary',
    intro: 'Key BESS terms in plain engineering language: architecture, technical metrics, economics, applications and safety. Link to any term by its anchor.',
    meta: 'What BESS, PCS, EMS, C-rate, DoD, SOC, SOH, RTE, LCOS, peak shaving and arbitrage mean — definitions and formulas for energy storage projects.',
    home: 'Home', res: 'Knowledge', related: 'Related terms', formula: 'Formula', jump: 'Sections',
    cta: 'Terms clear — ready for numbers?', ctaBody: 'Calculate power, energy and LCOS for your site.', ctaBtn: 'Open the tools',
  },
  'zh-CN': {
    title: '储能术语表：BESS 核心概念解释',
    h1: '储能术语表',
    intro: '用工程语言解释储能核心术语：系统架构、技术指标、经济性、应用场景与安全。可通过锚点链接任一术语。',
    meta: 'BESS、PCS、EMS、C-rate、DoD、SOC、SOH、RTE、LCOS、削峰与套利的定义与公式。',
    home: '首页', res: '知识库', related: '相关术语', formula: '公式', jump: '分类',
    cta: '理解了术语，开始计算？', ctaBody: '为您的项目计算功率、容量与 LCOS。', ctaBtn: '打开工具',
  },
};

const lang = (l: Locale) => (l === 'en' ? 'en' : l === 'zh-CN' ? 'zh' : 'uk') as 'uk' | 'en' | 'zh';
const groups: GlossaryGroup[] = ['system', 'metrics', 'economics', 'applications', 'technology', 'safety'];

export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const alt = languageAlternates('/resources/glossary');
  return {
    title: T[locale].title,
    description: T[locale].meta,
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
    openGraph: { title: T[locale].title, description: T[locale].meta, type: 'article', locale },
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  if (!(LOCALES as string[]).includes(raw)) notFound();
  const locale = asLocale(raw);
  const t = T[locale];
  const k = lang(locale);
  const root = `/${locale}`;
  const byslug = new Map(glossary.map((g) => [g.slug, g]));
  const pageUrl = `${BRAND.siteUrl}${root}/resources/glossary`;

  const termSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${pageUrl}#set`,
    name: t.h1,
    inLanguage: locale,
    hasDefinedTerm: glossary.map((g) => ({
      '@type': 'DefinedTerm',
      '@id': `${pageUrl}#${g.slug}`,
      name: g.term,
      alternateName: g.aka,
      termCode: g.slug,
      description: g[k],
      url: `${pageUrl}#${g.slug}`,
    })),
  };

  return (
    <main className="kx kx-doc">
      <JsonLd data={termSet} />
      <JsonLd data={breadcrumbLd([[t.home, root], [t.res, `${root}/resources`], [t.h1, `${root}/resources/glossary`]])} />

      <section className="kx-doc-hero">
        <div className="kx-wrap">
          <nav className="kx-crumbs" aria-label="Breadcrumb">
            <Link href={root}>{t.home}</Link><span aria-hidden="true">/</span>
            <Link href={`${root}/resources`}>{t.res}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{t.h1}</span>
          </nav>
          <h1>{t.h1}</h1>
          <p className="kx-lead">{t.intro}</p>
          <nav className="kx-jump" aria-label={t.jump}>
            {groups.map((g) => <a key={g} href={`#group-${g}`}>{groupLabels[g][k]}</a>)}
          </nav>
        </div>
      </section>

      <div className="kx-wrap kx-gloss">
        <aside className="kx-gloss-index" aria-label="A–Z">
          <ul>
            {[...glossary].sort((a, b) => a.term.localeCompare(b.term)).map((g) => (
              <li key={g.slug}><a href={`#${g.slug}`}>{g.term}</a></li>
            ))}
          </ul>
        </aside>
        <div className="kx-gloss-body">
          {groups.map((group) => (
            <section key={group} id={`group-${group}`} aria-labelledby={`h-${group}`} className="kx-gloss-group">
              <h2 id={`h-${group}`}>{groupLabels[group][k]}</h2>
              {glossary.filter((g) => g.group === group).map((g) => (
                <article key={g.slug} id={g.slug} className="kx-term">
                  <header>
                    <h3><a href={`#${g.slug}`}>{g.term}</a></h3>
                    {g.aka && g.aka !== g.term && <span className="kx-mono kx-term-aka">{g.aka}</span>}
                  </header>
                  <p>{g[k]}</p>
                  {g.formula && (
                    <div className="kx-formula"><span>{t.formula}</span><code>{g.formula}</code></div>
                  )}
                  {g.related?.length ? (
                    <p className="kx-term-related">
                      <span>{t.related}:</span>{' '}
                      {g.related.filter((s) => byslug.has(s)).map((s, i) => (
                        <span key={s}>{i > 0 && ', '}<a href={`#${s}`}>{byslug.get(s)!.term}</a></span>
                      ))}
                    </p>
                  ) : null}
                </article>
              ))}
            </section>
          ))}
          <aside className="kx-doc-cta">
            <div>
              <strong>{t.cta}</strong>
              <span>{t.ctaBody}</span>
            </div>
            <Link className="kx-btn kx-btn-primary" href={`${root}/engineering`}>{t.ctaBtn}<ArrowRight size={16} /></Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
