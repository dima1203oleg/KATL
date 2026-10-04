import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { asLocale, languageAlternates } from '../../../lib/brand';

const M = {
  'uk-UA': { title: 'Кабінет клієнта', description: 'Особистий кабінет клієнта платформи KATL.' },
  en: { title: 'Customer account', description: 'KATL customer account.' },
  'zh-CN': { title: '客户账户', description: 'KATL 客户账户。' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const alt = languageAlternates('/portal');
  return {
    title: M[locale].title,
    description: M[locale].description,
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
    robots: { index: false, follow: true },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
