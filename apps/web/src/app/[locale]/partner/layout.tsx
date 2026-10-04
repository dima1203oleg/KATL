import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { asLocale, languageAlternates } from '../../../lib/brand';

const M = {
  'uk-UA': { title: 'Партнерам: EPC, інтегратори, виробники', description: 'Співпраця з платформою KATL для EPC-компаній, інтеграторів, девелоперів СЕС і виробників обладнання: проєкти накопичення енергії в Україні.' },
  en: { title: 'Partners: EPC, integrators, manufacturers', description: 'Work with the KATL platform as an EPC, integrator, solar developer or equipment manufacturer on energy storage projects in Ukraine.' },
  'zh-CN': { title: '合作伙伴：EPC、集成商与制造商', description: 'EPC、系统集成商、光伏开发商与设备制造商可与 KATL 平台合作开展乌克兰储能项目。' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const alt = languageAlternates('/partner');
  return {
    title: M[locale].title,
    description: M[locale].description,
    alternates: { canonical: alt.canonicalFor(locale), languages: alt.languages },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
