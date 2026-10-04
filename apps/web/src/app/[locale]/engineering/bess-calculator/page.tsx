import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BessCalculator } from '../../../../components/BessCalculator';
import { AnimatedSection } from '../../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const ui = {
  'uk-UA': {
    title: 'Калькулятор BESS — розрахунок потужності та корисної ємності',
    description: 'Інженерний калькулятор підбору параметрів промислових систем накопичення енергії (BESS / ESS) CATL для об’єктів в Україні.',
    home: 'Головна',
    engineering: 'Інженерія',
    heading: 'Розрахунок потужності й енергії BESS',
    intro: 'Інженерний розрахунок базової енергії з урахуванням пікового навантаження, тривалості автономного розряду, резерву деградації та втрат перетворення (PCS).',
  },
  en: {
    title: 'BESS Calculator — Power & Usable Energy Sizing',
    description: 'Engineering sizing calculator for stationary CATL battery energy storage systems (BESS / ESS).',
    home: 'Home',
    engineering: 'Engineering',
    heading: 'BESS Power & Energy Sizing Calculator',
    intro: 'Determine nominal and usable capacity considering peak power, discharge duration, degradation margins, and PCS round-trip efficiency.',
  },
  'zh-CN': {
    title: 'BESS 储能计算器 — 功率与有效容量测算',
    description: 'CATL 固定式储能系统 (BESS / ESS) 工程选型与容量测算计算器。',
    home: '首页',
    engineering: '工程工具',
    heading: 'BESS 储能功率与容量工程测算器',
    intro: '基于峰值功率、放电时长、系统衰减裕量与 PCS 转换效率精确测算所需标称容量与配置建议。',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];
  return {
    title: t.title,
    description: t.description,
  };
}

export default async function BessCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();
  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];

  return (
    <main>
      <AnimatedSection className="page-hero" direction="none">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{t.home}</Link> / <Link href={`/${locale}/engineering`}>{t.engineering}</Link> / BESS Calculator
          </div>
          <div className="eyebrow">ENGINEERING SIZING SUITE</div>
          <h1>{t.heading}</h1>
          <p>{t.intro}</p>
        </div>
      </AnimatedSection>
      <AnimatedSection className="content-section">
        <div className="container">
          <BessCalculator locale={locale} />
        </div>
      </AnimatedSection>
    </main>
  );
}
