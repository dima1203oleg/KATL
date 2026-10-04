import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LcosCalculator } from '../../../../components/LcosCalculator';
import { AnimatedSection } from '../../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const ui = {
  'uk-UA': {
    title: 'Калькулятор LCOS для систем BESS | Оцінка вартості зберігання енергії',
    description: 'Оцініть дисконтовану нормовану вартість відпущеної енергії (LCOS) BESS за вашими CAPEX, OPEX та експлуатаційними припущеннями.',
    home: 'Головна',
    engineering: 'Інженерія',
    heading: 'Калькулятор LCOS (Levelized Cost of Storage)',
    intro: 'Розрахунок вартості зберігання 1 кВт·год енергії протягом життєвого циклу BESS з урахуванням CAPEX, щорічного OPEX, деградації, циклів та дисконтування.',
  },
  en: {
    title: 'LCOS Calculator for BESS | Levelized Cost of Storage Analysis',
    description: 'Evaluate the levelized cost of storage (LCOS) per delivered kWh considering CAPEX, OPEX, cycles, and discount rates.',
    home: 'Home',
    engineering: 'Engineering',
    heading: 'BESS Levelized Cost of Storage (LCOS) Calculator',
    intro: 'Determine lifetime cost per delivered kilowatt-hour based on system CAPEX, annual operational costs, round-trip efficiency, degradation, and financial discount rates.',
  },
  'zh-CN': {
    title: 'BESS 储能度电成本 (LCOS) 计算器',
    description: '基于 CAPEX、OPEX、循环寿命、衰减率与折现率测算储能系统全生命周期度电成本 (LCOS)。',
    home: '首页',
    engineering: '工程工具',
    heading: 'BESS 储能度电成本 (LCOS) 分析计算器',
    intro: '基于系统初始投资、年运维费用、循环次数、充放电往返效率及折现率，测算全生命周期度电储能成本。',
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

export default async function LcosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();
  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];

  return (
    <main>
      <AnimatedSection className="page-hero" direction="none">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{t.home}</Link> / <Link href={`/${locale}/engineering`}>{t.engineering}</Link> / LCOS
          </div>
          <div className="eyebrow">FINANCIAL & TECHNO-ECONOMIC ANALYSIS</div>
          <h1>{t.heading}</h1>
          <p>{t.intro}</p>
        </div>
      </AnimatedSection>
      <AnimatedSection className="content-section">
        <div className="container">
          <LcosCalculator locale={locale} />
        </div>
      </AnimatedSection>
    </main>
  );
}
