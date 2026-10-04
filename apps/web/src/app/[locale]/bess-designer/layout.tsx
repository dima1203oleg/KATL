import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { asLocale, languageAlternates } from '../../../lib/brand';

const M = {
  'uk-UA': { title: 'BESS Designer — підбір потужності та ємності накопичувача', description: 'Інтерактивний підбір системи накопичення енергії під ваш об’єкт: потужність, ємність, тривалість, конфігурація та попередній кошторис з відкритими припущеннями.' },
  en: { title: 'BESS Designer — size power and energy for your site', description: 'Interactive battery energy storage sizing for your site: power, energy, duration, configuration and a preliminary estimate with open assumptions.' },
  'zh-CN': { title: 'BESS 设计器 — 为项目配置功率与容量', description: '交互式储能系统配置：功率、容量、时长、系统组成及含公开假设的初步估算。' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const alt = languageAlternates('/bess-designer');
  return {
    title: M[locale].title,
    description: M[locale].description,
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
