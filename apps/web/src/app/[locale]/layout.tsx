import type { Metadata, Viewport } from 'next';
import { Onest, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import React from 'react';
import '../globals.css';
import '../kx.css';
import '../kx-home.css';
import { Motion } from '../../components/home/Motion';
import { PublicShell } from '../../components/SiteShell';
import { JsonLd, siteGraph } from '../../components/seo/JsonLd';
import { asLocale, BRAND, LOCALES, pick } from '../../lib/brand';

const onest = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-onest', display: 'swap' });
const jbMono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-jbmono', display: 'swap', weight: ['500', '600'] });

const defaults = {
  'uk-UA': { title: 'Системи накопичення енергії BESS в Україні', description: 'Інженерний підбір систем накопичення енергії на технологіях CATL: сайзинг, фінансова модель, логістика, митне оформлення, монтаж та сервіс в Україні.' },
  en: { title: 'Battery Energy Storage in Ukraine', description: 'Engineering-led battery energy storage on CATL technology: sizing, financial modelling, logistics, customs, installation and service in Ukraine.' },
  'zh-CN': { title: '乌克兰储能系统项目平台', description: '基于 CATL 技术的储能工程选型、财务模型、物流、清关、安装与运维服务。' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const d = defaults[locale];
  return {
    metadataBase: new URL(BRAND.siteUrl),
    title: { default: `${d.title} | ${BRAND.name}`, template: `%s | ${BRAND.name}` },
    description: d.description,
    applicationName: `${BRAND.name} — ${pick(BRAND.tagline, locale)}`,
    openGraph: { siteName: `${BRAND.name} — ${pick(BRAND.tagline, locale)}`, type: 'website', locale },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0e14',
};

export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export default async function LocaleRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(LOCALES as string[]).includes(locale)) notFound();
  return (
    <html lang={locale} className={`${onest.variable} ${jbMono.variable}`}>
      <body>
        <JsonLd data={siteGraph(asLocale(locale))} />
        <Motion />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
