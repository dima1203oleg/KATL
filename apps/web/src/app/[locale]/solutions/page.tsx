import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Home, Building2, Factory, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const SOL_META = {
  'uk-UA': { title: 'Рішення BESS: peak shaving, резерв, СЕС, арбітраж', description: 'Сценарії застосування систем накопичення енергії для бізнесу, промисловості та енергосистеми: зрізання піків, резервне живлення, СЕС + накопичення, арбітраж, мікромережі.' },
  en: { title: 'BESS solutions: peak shaving, backup, solar, arbitrage', description: 'Battery energy storage use cases for business, industry and the grid: peak shaving, backup power, solar + storage, arbitrage and microgrids.' },
  'zh-CN': { title: '储能解决方案：削峰、备用、光储、套利', description: '面向工商业与电网的储能应用：削峰、备用电源、光伏 + 储能、套利与微电网。' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = SOL_META[locale === 'en' ? 'en' : locale === 'zh-CN' ? 'zh-CN' : 'uk-UA'];
  return { title: m.title, description: m.description, alternates: { canonical: `/${locale}/solutions`, languages: { 'uk-UA': '/uk-UA/solutions', en: '/en/solutions', 'zh-CN': '/zh-CN/solutions', 'x-default': '/uk-UA/solutions' } } };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();

  const t = {
    'uk-UA': {
      home: 'Головна',
      solutions: 'Рішення',
      tag: 'Галузеві концепції',
      title: 'Рішення накопичення енергії CATL ESS',
      subtitle: 'Від енергонезалежності приватного домогосподарства до балансування енергосистеми країни — підберіть перевірену інженерну архітектуру під ваші завдання.',
      techBase: 'Базова технологія:',
      sectors: [
        {
          id: 'residential',
          icon: Home,
          title: 'Для дому та котеджних містечок',
          badge: '5–30 кВт·год',
          desc: 'Гарантоване резервне живлення, інтеграція із даховою СЕС та максимальна енергонезалежність від аварійних відключень мережі.',
          features: [
            'Миттєве безшовне перемикання < 20 мс',
            'Гібридна робота із сонячними інверторами',
            'LFP безпека найвищого стандарту для житла',
            'Модульне нарощування ємності блоками по 5 кВт·год',
          ],
          recommended: 'CATL Residential BESS & Модулі',
          action: 'Підібрати для дому',
          href: `/${locale}/products?category=${encodeURIComponent('Домашні системи')}`,
        },
        {
          id: 'commercial',
          icon: Building2,
          title: 'Для бізнесу та комерційної нерухомості',
          badge: '100–1000 кВт',
          desc: 'Зменшення плати за приєднану пікову потужність (Peak Shaving), безперебійне живлення офісів і ТРЦ, комерційний арбітраж на ринку на добу наперед (РДН).',
          features: [
            'Зрізання пікових графіків споживання на 30–50%',
            'Стабільне живлення серверних та охолодження',
            'Зарядні хаби для електромобілів (EV Charging)',
            'Компактні вуличні шафи EnerOne Plus (IP55)',
          ],
          recommended: 'CATL EnerOne Plus (372.7 кВт·год)',
          action: 'Розрахувати для бізнесу',
          href: `/${locale}/bess-designer`,
        },
        {
          id: 'industrial',
          icon: Factory,
          title: 'Для промисловості та агросектору',
          badge: '1–10 МВт·год',
          desc: 'Повний захист безперервних виробничих циклів від просідань напруги, побудова заводських мікромереж (Microgrid) та утилізація власної СЕС.',
          features: [
            'Усунення простоїв і браку через зникнення живлення',
            'Робота в режимі острівної мікромережі з дизель-генератором',
            'Оптимізація роботи елеваторів і переробних заводів',
            'Пожежогасіння Novec 1230 та рідинне охолодження',
          ],
          recommended: 'CATL EnerC Plus & EnerD',
          action: 'Специфікація для заводу',
          href: `/${locale}/bess-designer`,
        },
        {
          id: 'utility',
          icon: Zap,
          title: 'Для великої енергетики (Grid-Scale BESS)',
          badge: '6.25–100+ МВт·год',
          desc: 'Масштабні накопичувачі для операторів системи передачі (ОСП) та генерації. Балансування частоти (FCR/aFRR), інтеграція мегаватної ВДЕ, peak shifting.',
          features: [
            'CATL TENER: 5 років нульової деградації ємності та потужності',
            'Щільність енергії 6.25 МВт·год у стандартному 20ft контейнері',
            'Пряме підключення до підстанцій 35/110 кВ через блочні ТМГ',
            'Ресурс понад 15 000 повних циклів (20+ років служби)',
          ],
          recommended: 'CATL TENER (6.25 МВт·год) & TENER H',
          action: 'Замовити ТКП Utility BESS',
          href: `/${locale}/rfq?product=CATL%20TENER%206.25%20MWh`,
        },
      ],
    },
    'en': {
      home: 'Home',
      solutions: 'Solutions',
      tag: 'Sector Concepts',
      title: 'CATL ESS Energy Storage Solutions',
      subtitle: 'From private residential energy independence to grid-scale utility frequency balancing — choose verified engineering architectures tailored to your operational profile.',
      techBase: 'Base Technology:',
      sectors: [
        {
          id: 'residential',
          icon: Home,
          title: 'Residential & Micro-Communities',
          badge: '5–30 kWh',
          desc: 'Uninterrupted home backup, rooftop PV self-consumption, and total resilience during grid disruptions.',
          features: [
            'Sub-20ms seamless transfer time',
            'Hybrid compatibility with leading solar inverters',
            'Highest-standard LFP cell thermal safety',
            'Modular stackable design in 5 kWh increments',
          ],
          recommended: 'CATL Residential BESS & Modules',
          action: 'Select Home Solution',
          href: `/${locale}/products?category=${encodeURIComponent('Домашні системи')}`,
        },
        {
          id: 'commercial',
          icon: Building2,
          title: 'Commercial Real Estate & SMEs',
          badge: '100–1000 kW',
          desc: 'Peak shaving to curb maximum demand charges, reliable backup for offices and retail, and day-ahead market arbitrage.',
          features: [
            '30–50% reduction in peak demand surcharges',
            'Continuous uptime for servers and HVAC systems',
            'High-power EV charging hub integration',
            'Compact outdoor EnerOne Plus cabinets (IP55)',
          ],
          recommended: 'CATL EnerOne Plus (372.7 kWh)',
          action: 'Size Commercial System',
          href: `/${locale}/bess-designer`,
        },
        {
          id: 'industrial',
          icon: Factory,
          title: 'Heavy Industry & Agriculture',
          badge: '1–10 MWh',
          desc: 'Protect manufacturing processes from voltage sags, establish factory microgrids, and maximize local solar yield.',
          features: [
            'Zero production downtime from brownouts',
            'Microgrid islanding with genset synchronization',
            'Optimized throughput for agro elevators and mills',
            'Novec 1230 fire suppression & liquid cooling',
          ],
          recommended: 'CATL EnerC Plus & EnerD',
          action: 'Industrial Configuration',
          href: `/${locale}/bess-designer`,
        },
        {
          id: 'utility',
          icon: Zap,
          title: 'Utility & Grid-Scale Infrastructure',
          badge: '6.25–100+ MWh',
          desc: 'Large-scale storage for transmission grid operators (TSO/DSO) and IPPs. Primary frequency response (FCR), peak shaving and renewable firming.',
          features: [
            'CATL TENER: 5-year zero degradation guarantee',
            '6.25 MWh energy density in a standard TEU 20ft container',
            'Direct interconnect to 35/110 kV step-up transformers',
            'Over 15,000 cycle lifetime (20+ operational years)',
          ],
          recommended: 'CATL TENER (6.25 MWh) & TENER H',
          action: 'Request Utility Sizing',
          href: `/${locale}/rfq?product=CATL%20TENER%206.25%20MWh`,
        },
      ],
    },
    'zh-CN': {
      home: '首页',
      solutions: '解决方案',
      tag: '行业应用架构',
      title: 'CATL 储能系统完整解决方案',
      subtitle: '从家庭离网应急保电到电网级百万千瓦时电站调频调峰，提供经过验证的原厂工程系统架构。',
      techBase: '核心技术选型：',
      sectors: [
        {
          id: 'residential',
          icon: Home,
          title: '户用储能与微电网社区',
          badge: '5–30 kWh',
          desc: '高品质家庭应急后备电源、屋顶光伏自发自用与应对电网拉闸限电。',
          features: [
            '< 20ms 离网毫秒级无缝自动切换',
            '兼容主流单相及三相混合储能逆变器',
            '车规级 LFP 电芯极致热失控安全标准',
            '5 kWh 模块化即插即用扩展设计',
          ],
          recommended: 'CATL 户用储能一体机及模组',
          action: '选择户用方案',
          href: `/${locale}/products?category=${encodeURIComponent('Домашні системи')}`,
        },
        {
          id: 'commercial',
          icon: Building2,
          title: '工商业园区与写字楼',
          badge: '100–1000 kW',
          desc: '变压器需量管理削峰填谷，降低大工业电价尖峰支出；保障精密服务器与中央空调不间断运行。',
          features: [
            '降低最大负荷需量支出 30–50%',
            '保障办公大楼算力机房零停机',
            '高能量密度电动汽车大功率充电站配套',
            '一体化户外液冷柜 EnerOne Plus (IP55)',
          ],
          recommended: 'CATL EnerOne Plus (372.7 kWh)',
          action: '测算工商业系统',
          href: `/${locale}/bess-designer`,
        },
        {
          id: 'industrial',
          icon: Factory,
          title: '重工业制造与大型农业',
          badge: '1–10 MWh',
          desc: '消除电网电压暂降对连续制造流程的冲击，打造工厂独立孤岛微电网，高效消纳厂区光伏。',
          features: [
            '杜绝因瞬时断电造成的产线报废与停工',
            '支持与柴油发电机组智能并联孤岛运行',
            '优化大型粮仓、冷库与化工厂用电负荷',
            'Novec 1230 气体灭火与智能全氟己酮液冷系统',
          ],
          recommended: 'CATL EnerC Plus & EnerD',
          action: '查看工业配置方案',
          href: `/${locale}/bess-designer`,
        },
        {
          id: 'utility',
          icon: Zap,
          title: '电网侧大型储能 (Grid-Scale BESS)',
          badge: '6.25–100+ MWh',
          desc: '面向输配电系统调度与大型新能源电站：一次调频、调峰填谷、可再生能源平滑接入。',
          features: [
            'CATL TENER：前 5 年容量与功率零衰减',
            '标准 20 尺集装箱内达 6.25 MWh 行业最高能量密度',
            '通过升压变直连 35/110 kV 变电站',
            '超 15,000 次循环寿命（20+ 年设计运营寿命）',
          ],
          recommended: 'CATL TENER (6.25 MWh) & TENER H',
          action: '获取电网级商业方案',
          href: `/${locale}/rfq?product=CATL%20TENER%206.25%20MWh`,
        },
      ],
    },
  }[locale as 'uk-UA' | 'en' | 'zh-CN'] || {
    home: 'Головна',
    solutions: 'Рішення',
    tag: 'Галузеві концепції',
    title: 'Рішення накопичення енергії CATL ESS',
    subtitle: 'Від енергонезалежності до балансування енергосистеми.',
    techBase: 'Базова технологія:',
    sectors: []
  };

  return (
    <main className="solutions-hub-page">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{t.home}</Link> / {t.solutions}
          </div>
          <div className="eyebrow">{t.tag}</div>
          <AnimatedSection direction="up" delay={0.05}>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection className="content-section" delay={0.2}>
        <div className="container">
          <AnimatedStaggerGroup className="solutions-showcase-grid">
            {t.sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <AnimatedStaggerItem key={sector.id}>
                  <article className="solutions-showcase-card">
                    <header className="sector-card-head">
                      <div className="sector-icon-box">
                        <Icon size={24} />
                      </div>
                      <span className="sector-badge">{sector.badge}</span>
                    </header>

                    <div className="sector-card-body">
                      <h2>{sector.title}</h2>
                      <p>{sector.desc}</p>

                      <ul className="sector-features">
                        {sector.features.map((feat, idx) => (
                          <li key={idx}>
                            <ShieldCheck size={16} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <footer className="sector-card-foot">
                      <div className="sector-tech">
                        <small>{t.techBase}</small>
                        <strong>{sector.recommended}</strong>
                      </div>
                      <Link href={sector.href} className="button">
                        <span>{sector.action}</span>
                        <ArrowRight size={15} />
                      </Link>
                    </footer>
                  </article>
                </AnimatedStaggerItem>
              );
            })}
          </AnimatedStaggerGroup>
        </div>
      </AnimatedSection>
    </main>
  );
}
