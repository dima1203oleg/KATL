import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import '../globals.css';
import { PublicShell } from '../../components/SiteShell';

const locales = ['uk-UA', 'en', 'zh-CN'];
const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL || 'https://catl.site'),
  title: { default: 'CATL Energy Storage в Україні', template: '%s | CATL Energy Storage' },
  description: 'Каталог, інженерні інструменти та інформація про системи накопичення енергії для проєктів в Україні.',
  openGraph: { siteName: 'CATL Energy Storage Україна', type: 'website' },
};
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localized = locale === 'en'
    ? { title: 'CATL Energy Storage in Ukraine', description: 'CATL energy storage systems, engineering tools and project information for Ukraine.' }
    : locale === 'zh-CN'
      ? { title: 'CATL 乌克兰储能', description: '面向乌克兰项目的 CATL 储能系统、工程工具和项目信息。' }
      : { title: 'CATL Energy Storage в Україні', description: 'Системи накопичення енергії CATL, інженерні інструменти та інформація для проєктів в Україні.' };
  return { ...baseMetadata, title: { default: localized.title, template: `%s | CATL Energy Storage` }, description: localized.description, openGraph: { ...baseMetadata.openGraph, siteName: localized.title, locale } };
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <html lang={locale}><body><PublicShell>{children}</PublicShell></body></html>;
}
