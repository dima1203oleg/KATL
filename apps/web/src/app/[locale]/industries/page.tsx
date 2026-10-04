import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  Building2, 
  Factory, 
  Hotel, 
  Leaf, 
  Server, 
  Truck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const ui = {
  'uk-UA': {
    title: 'Галузі застосування стаціонарних систем CATL BESS в Україні',
    description: 'Використання систем накопичення енергії у промисловості, агросекторі, логістиці, ЦОД та комерційній нерухомості.',
    home: 'Головна',
    industries: 'Галузі',
    eyebrow: 'ЕНЕРГОСИСТЕМА ТА ІНФРАСТРУКТУРА ОБ’ЄКТА',
    heading: 'Галузеві сценарії застосування BESS',
    intro: 'Рішення починається з виміряного графіка навантаження та конкретної інженерної задачі об’єкта. Оберіть ваш галузевий сегмент для попереднього аналізу.',
    view: 'Переглянути сценарій',
    list: [
      { slug: 'manufacturing', title: 'Промисловість та виробництво', desc: 'Усунення пікових навантажень, безаварійна робота конвеєрів та оптимізація тарифів.', icon: Factory },
      { slug: 'agriculture', title: 'Агросектор та елеватори', desc: 'Сезонне споживання, зерносушарки, потужні компресори та холодильні комплекси.', icon: Leaf },
      { slug: 'logistics', title: 'Логістичні парки та склади', desc: 'Резервування складів класу «А», холодильних терміналів та зарядки електронавантажувачів.', icon: Truck },
      { slug: 'data-centres', title: 'Центри обробки даних (ЦОД)', desc: '100% неперервність IT-процесів, координована робота з дизель-генераторами та UPS.', icon: Server },
      { slug: 'retail', title: 'Торговельні мережі та ТРЦ', desc: 'Зрізання денних піків споживання та автономне електроживлення під час блекаутів.', icon: Building2 },
      { slug: 'hotels', title: 'Готелі та комерційні комплекси', desc: 'Комфорт гостей, безперебійна робота кліматичних систем та систем безпеки.', icon: Hotel },
      { slug: 'ev-charging', title: 'EV Charging Хаби', desc: 'Буферний накопичувач високої потужності для надшвидких зарядних станцій електромобілів.', icon: Zap }
    ]
  },
  en: {
    title: 'Industrial & Commercial Applications of CATL BESS | Ukraine',
    description: 'Energy storage solutions for manufacturing, agriculture, logistics, data centers, and commercial real estate.',
    home: 'Home',
    industries: 'Industries',
    eyebrow: 'FACILITY POWER ARCHITECTURE',
    heading: 'Industry Scenarios for BESS',
    intro: 'Energy storage begins with an audited load profile and clear operational targets. Select your sector to explore sizing guidelines.',
    view: 'Explore Scenario',
    list: [
      { slug: 'manufacturing', title: 'Manufacturing & Plants', desc: 'Peak shaving, zero production line downtime, and grid tariff optimization.', icon: Factory },
      { slug: 'agriculture', title: 'Agriculture & Grain Terminals', desc: 'Seasonal demand surges, grain dryers, high-capacity chillers and irrigation.', icon: Leaf },
      { slug: 'logistics', title: 'Logistics Parks & Warehousing', desc: 'Backup power for Class-A facilities, cold storage, and EV forklift fleets.', icon: Truck },
      { slug: 'data-centres', title: 'Data Centers (Tier III/IV)', desc: 'Zero downtime for IT server infrastructure, seamless diesel genset handover.', icon: Server },
      { slug: 'retail', title: 'Retail Chains & Malls', desc: 'Demand charge limitation and full islanding during utility grid blackouts.', icon: Building2 },
      { slug: 'hotels', title: 'Hotels & Commercial Complexes', desc: 'Uninterrupted guest comfort, continuous HVAC, elevator and life safety operation.', icon: Hotel },
      { slug: 'ev-charging', title: 'EV Charging Hubs', desc: 'High-power buffer storage for ultra-fast EV chargers without costly grid upgrades.', icon: Zap }
    ]
  },
  'zh-CN': {
    title: 'CATL 储能系统行业应用场景 | 乌克兰官方平台',
    description: '储能系统在工业制造、农业仓储、现代物流、数据中心及商业地产的完整解决方案。',
    home: '首页',
    industries: '行业应用',
    eyebrow: '设施能源系统架构',
    heading: 'CATL 储能行业应用场景',
    intro: '储能系统选型始于实测负荷曲线与明确的工程需求。选择您的行业查看定制化方案。',
    view: '查看行业方案',
    list: [
      { slug: 'manufacturing', title: '重工制造与产线', desc: '需量管理削峰填谷，保障连续生产线不停机与容需量电费优化。', icon: Factory },
      { slug: 'agriculture', title: '现代农业与粮库', desc: '季节性高负荷应对、谷物烘干机、大型冷链冷库及灌溉机组。', icon: Leaf },
      { slug: 'logistics', title: '物流园区与冷链仓储', desc: '甲级物流园高可靠保电、恒温冷库与电动叉车大功率充换电缓冲。', icon: Truck },
      { slug: 'data-centres', title: '数据中心 (IDC)', desc: '核心算力基础设施零中断保障，与柴油发电机组实现毫秒级并网切换。', icon: Server },
      { slug: 'retail', title: '大型商超与综合体', desc: '白昼负荷高峰平抑、市电停电应急孤岛保电与冷柜负荷保护。', icon: Building2 },
      { slug: 'hotels', title: '高端酒店与商业楼宇', desc: '保障核心空调机组、客梯与消防设施不间断供电，提升服务品质。', icon: Hotel },
      { slug: 'ev-charging', title: '新能源超充站', desc: '作为大功率超充站高能缓冲蓄水池，免去高昂的电网增容投资。', icon: Zap }
    ]
  }
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

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();
  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];
  const root = `/${locale}`;

  return (
    <main className="industries-page">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={root}>{t.home}</Link> / {t.industries}
          </div>
          <div className="eyebrow">{t.eyebrow}</div>
          <AnimatedSection direction="up" delay={0.05}>
            <h1>{t.heading}</h1>
            <p>{t.intro}</p>
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection className="content-section" delay={0.2}>
        <div className="container">
          <AnimatedStaggerGroup className="tile-grid">
            {t.list.map((item) => {
              const Icon = item.icon;
              return (
                <AnimatedStaggerItem key={item.slug}>
                  <Link 
                    className="solution-card" 
                    href={`${root}/industries/${item.slug}`}
                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <span className="icon-box">
                      <Icon size={22} />
                    </span>
                    <h2 style={{ fontSize: 18, fontWeight: 750, margin: '0 0 8px', color: '#091d34' }}>
                      {item.title}
                    </h2>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: '0 0 16px', flex: 1 }}>
                      {item.desc}
                    </p>
                    <span className="text-link" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                      {t.view} <ArrowRight size={14} />
                    </span>
                  </Link>
                </AnimatedStaggerItem>
              );
            })}
          </AnimatedStaggerGroup>
        </div>
      </AnimatedSection>
    </main>
  );
}
