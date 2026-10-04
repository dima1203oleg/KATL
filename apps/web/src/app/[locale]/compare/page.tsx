import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pimRepository } from '../../../lib/pim/pimRepository';
import { BessComparator } from '../../../components/BessComparator';
import { Layers, ArrowLeft } from 'lucide-react';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const titles = {
  'uk-UA': {
    title: 'Порівняння стаціонарних систем CATL BESS | Офіційна платформа',
    description: 'Порівняльна інженерна матриця систем накопичення енергії CATL: TENER, EnerOne, EnerC, PR-15 та UniC. Зіставлення ємності, потужності, C-rate та LCOS.',
    heading: 'Порівняння систем CATL ESS',
    intro: 'Оберіть від 2 до 4 моделей для детального порівняння параметрів, вартості, терміну служби та типу охолодження.',
    back: 'До каталогу',
    home: 'Головна',
  },
  en: {
    title: 'CATL BESS Systems Comparison | Official Ukraine Platform',
    description: 'Engineering comparison matrix for CATL energy storage: TENER, EnerOne, EnerC, PR-15, and UniC. Compare capacity, power, C-rate, and LCOS.',
    heading: 'CATL ESS Systems Comparison',
    intro: 'Select 2 to 4 systems to compare technical parameters, pricing, cycle lifetime, and thermal cooling.',
    back: 'Back to Catalog',
    home: 'Home',
  },
  'zh-CN': {
    title: 'CATL 储能系统技术参数对比 | 乌克兰官方平台',
    description: 'CATL 储能系统对比矩阵：天恒 TENER、EnerOne、EnerC、PR-15 与 UniC 规格参数深度对比。',
    heading: 'CATL 储能系统对比矩阵',
    intro: '选择 2 至 4 款型号对比容量、功率、倍率、价格与温控方式。',
    back: '返回产品目录',
    home: '首页',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = titles[locale as keyof typeof titles] || titles['uk-UA'];
  return {
    title: t.title,
    description: t.description,
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ products?: string }>;
}) {
  const [{ locale }, { products: productQuery }] = await Promise.all([params, searchParams]);
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();

  const t = titles[locale as keyof typeof titles] || titles['uk-UA'];

  let allProducts: any[] = [];
  try {
    allProducts = await pimRepository.getAllProducts(locale);
  } catch {
    allProducts = [];
  }

  const initialIds = productQuery
    ? productQuery.split(',').map((s) => decodeURIComponent(s.trim()))
    : ['catl-tener-6250', 'catl-enerone-plus', 'catl-enerc-plus'];

  return (
    <main className="compare-page">
      <section className="page-hero compare-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{t.home}</Link> / <Link href={`/${locale}/products`}>{t.back}</Link> / {t.heading}
          </div>
          <div className="eyebrow">CATL BENCHMARK & COMPARISON</div>
          <AnimatedSection direction="up" delay={0.05}>
            <h1>{t.heading}</h1>
            <p>{t.intro}</p>
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection className="content-section compare-content" delay={0.2}>
        <div className="container">
          <BessComparator
            products={allProducts}
            locale={locale}
            initialSelectedIds={initialIds}
          />
        </div>
      </AnimatedSection>
    </main>
  );
}
