import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import '../globals.css';
import { PublicShell } from '../../components/SiteShell';

const locales = ['uk-UA', 'en', 'zh-CN'];
export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL || 'https://catl.site'),
  title: { default: 'KATL — CATL Energy Storage в Україні', template: '%s | KATL' },
  description: 'Каталог, інженерні інструменти та інформація про системи накопичення енергії для проєктів в Україні.',
  openGraph: { siteName: 'KATL', type: 'website' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <html lang={locale}><body><PublicShell>{children}</PublicShell></body></html>;
}
