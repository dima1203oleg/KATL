import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { asLocale, languageAlternates } from '../../../../lib/brand';

const M = {
  'uk-UA': { title: 'Однолінійна схема BESS: PCS, трансформатор, захист', description: 'Типова однолінійна схема підключення системи накопичення енергії: батарея, PCS, трансформатор, комутація та захист для підключення до мережі 0.4/10 кВ.' },
  en: { title: 'BESS single-line diagram: PCS, transformer, protection', description: 'Typical single-line diagram for connecting a battery energy storage system: battery, PCS, transformer, switchgear and protection for 0.4/10 kV grid connection.' },
  'zh-CN': { title: '储能单线图：PCS、变压器与保护', description: '储能系统典型并网单线图：电池、PCS、变压器、开关与保护（0.4/10 kV）。' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const alt = languageAlternates('/engineering/single-line-diagram');
  return {
    title: M[locale].title,
    description: M[locale].description,
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
