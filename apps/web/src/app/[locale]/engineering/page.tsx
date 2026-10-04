import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Calculator, 
  TrendingUp, 
  Network, 
  Sliders, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Zap, 
  FileCheck2 
} from 'lucide-react';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const ui = {
  'uk-UA': {
    title: 'Інженерні інструменти та калькулятори CATL BESS в Україні',
    description: 'Комплекс інженерних інструментів для розрахунку систем накопичення енергії CATL: підбір ємності, LCOS, однолінійні схеми (SLD) та конфігуратор.',
    home: 'Головна',
    engineering: 'Інженерія',
    heading: 'Інженерні інструменти CATL ESS',
    intro: 'Розрахункові модулі, математичні моделі та електричні схеми для інженерів, проектувальників та інвесторів в енергетичну інфраструктуру.',
    tools: [
      {
        id: 'bess-calc',
        title: 'Калькулятор BESS',
        desc: 'Швидкий розрахунок необхідної потужності (кВт/МВт), корисної ємності, буфера деградації та C-rate для вашого навантаження.',
        href: '/engineering/bess-calculator',
        icon: Calculator,
        badge: 'Розмірність'
      },
      {
        id: 'lcos-calc',
        title: 'Калькулятор LCOS',
        desc: 'Фінансово-економічний аналіз собівартості зберігання енергії (Levelized Cost of Storage) на весь життєвий цикл системи.',
        href: '/engineering/lcos',
        icon: TrendingUp,
        badge: 'Економіка'
      },
      {
        id: 'designer',
        title: 'Конфігуратор BESS Designer',
        desc: 'Покрокове моделювання проекту: вибір сонячної генерації, профілю навантаження, підбір CATL обладнання та експорт комерційної пропозиції.',
        href: '/bess-designer',
        icon: Sliders,
        badge: 'Конфігуратор'
      },
      {
        id: 'sld',
        title: 'Single Line Diagram (SLD)',
        desc: 'Інтерактивна однолінійна електрична схема підключення BESS до РУ 0.4 кВ та РУ 10(35) кВ із захистами РЗА та обліком АСКОЕ.',
        href: '/engineering/single-line-diagram',
        icon: Network,
        badge: 'Електросхема'
      },
      {
        id: 'docs',
        title: 'Технічна документація',
        desc: 'Офіційні паспорти обладнання (Datasheets), сертифікати випробувань TÜV / UL 9540A та керівництва користувача.',
        href: '/documents',
        icon: FileText,
        badge: 'Паспорти'
      },
      {
        id: 'compare',
        title: 'Порівняння систем',
        desc: 'Детальна порівняльна матриця 2–4 моделей з підсвічуванням інженерних відмінностей, ККД та масо-габаритних параметрів.',
        href: '/compare',
        icon: Layers,
        badge: 'Бенчмарк'
      }
    ],
    ctaTitle: 'Потрібен комплексний інженерний проєкт?',
    ctaDesc: 'Наші інженери розроблять детальну стадію ТЕО або «П» для підключення до мереж операторів системи розподілу чи НЕК Укренерго.',
    ctaBtn: 'Створити інженерний запит'
  },
  en: {
    title: 'CATL BESS Engineering Tools & Calculators | Official Platform',
    description: 'Engineering calculation suite for CATL energy storage: system sizing, LCOS, Single Line Diagrams, and technical configurators.',
    home: 'Home',
    engineering: 'Engineering',
    heading: 'CATL ESS Engineering Suite',
    intro: 'Simulation modules, mathematical calculation models, and single-line schematics for electrical engineers, system designers, and investors.',
    tools: [
      {
        id: 'bess-calc',
        title: 'BESS Calculator',
        desc: 'Fast sizing of required continuous power (kW/MW), usable storage capacity, degradation margin, and C-rate for your site profile.',
        href: '/engineering/bess-calculator',
        icon: Calculator,
        badge: 'Sizing'
      },
      {
        id: 'lcos-calc',
        title: 'LCOS Calculator',
        desc: 'Financial and techno-economic evaluation of Levelized Cost of Storage per delivered kWh over the 20-year lifetime.',
        href: '/engineering/lcos',
        icon: TrendingUp,
        badge: 'Economics'
      },
      {
        id: 'designer',
        title: 'BESS Designer',
        desc: 'Step-by-step system configurator: PV coupling, load profile modeling, CATL product selection, and proposal export.',
        href: '/bess-designer',
        icon: Sliders,
        badge: 'Configurator'
      },
      {
        id: 'sld',
        title: 'Single Line Diagram (SLD)',
        desc: 'Interactive electrical single-line schematic of BESS interconnecting with 0.4 kV and 10(35) kV switchgear with relay protection.',
        href: '/engineering/single-line-diagram',
        icon: Network,
        badge: 'Schematic'
      },
      {
        id: 'docs',
        title: 'Technical Documentation',
        desc: 'Official manufacturer datasheets, TÜV / UL 9540A safety test reports, and engineering manuals.',
        href: '/documents',
        icon: FileText,
        badge: 'Datasheets'
      },
      {
        id: 'compare',
        title: 'System Comparator',
        desc: 'Multi-system comparative matrix for 2-4 models with instant technical delta highlighting.',
        href: '/compare',
        icon: Layers,
        badge: 'Benchmark'
      }
    ],
    ctaTitle: 'Need a comprehensive engineering study?',
    ctaDesc: 'Our engineering team will assist in preparing feasibility studies and grid connection packages for DSOs and TSOs.',
    ctaBtn: 'Submit Engineering Request'
  },
  'zh-CN': {
    title: 'CATL 储能工程工具与计算器 | 乌克兰官方平台',
    description: 'CATL 储能系统工程工具套件：容量测算、LCOS 平准化成本、电气主接线图 (SLD) 及方案配置器。',
    home: '首页',
    engineering: '工程工具',
    heading: 'CATL 储能工程工具套件',
    intro: '为电气工程师、项目设计师与能源投资者打造的专业测算工具、数学模型与电气设计图纸。',
    tools: [
      {
        id: 'bess-calc',
        title: 'BESS 容量计算器',
        desc: '快速测算所需放电功率 (kW/MW)、有效储能容量、衰减裕量及充放电倍率。',
        href: '/engineering/bess-calculator',
        icon: Calculator,
        badge: '容量测算'
      },
      {
        id: 'lcos-calc',
        title: 'LCOS 度电成本计算器',
        desc: '全生命周期储能度电成本平准化财务经济模型分析。',
        href: '/engineering/lcos',
        icon: TrendingUp,
        badge: '财务模型'
      },
      {
        id: 'designer',
        title: 'BESS Designer 系统配置器',
        desc: '多步骤工程选型向导：光伏配储、负载曲线匹配、CATL 产品选型及方案导出。',
        href: '/bess-designer',
        icon: Sliders,
        badge: '配置选型'
      },
      {
        id: 'sld',
        title: '电气主接线图 (SLD)',
        desc: '储能系统接入 0.4 kV 与 10(35) kV 高低压配电装置的交互式单线图，含微机保护与计量。',
        href: '/engineering/single-line-diagram',
        icon: Network,
        badge: '电气图纸'
      },
      {
        id: 'docs',
        title: '技术资料中心',
        desc: '原厂技术规格书 (Datasheets)、TÜV / UL 9540A 认证检测报告及操作指南。',
        href: '/documents',
        icon: FileText,
        badge: '规格资料'
      },
      {
        id: 'compare',
        title: '多型号性能对比',
        desc: '支持 2 至 4 款型号的深度技术参数对比矩阵，一键突出技术差异。',
        href: '/compare',
        icon: Layers,
        badge: '横向对比'
      }
    ],
    ctaTitle: '需要编制完整工程可行性研究？',
    ctaDesc: '我们的资深工程师团队将为您编制接入电网的专项工程设计与技术方案。',
    ctaBtn: '提交工程技术需求'
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

export default async function EngineeringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();
  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];
  const root = `/${locale}`;

  return (
    <main className="engineering-hub-page">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={root}>{t.home}</Link> / {t.engineering}
          </div>
          <div className="eyebrow">ENGINEERING & SYSTEM ARCHITECTURE</div>
          <AnimatedSection direction="up" delay={0.05}>
            <h1>{t.heading}</h1>
            <p>{t.intro}</p>
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection className="content-section" delay={0.2}>
        <div className="container">
          <AnimatedStaggerGroup className="tool-grid">
            {t.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <AnimatedStaggerItem key={tool.id}>
                  <Link
                    href={`${root}${tool.href}`}
                    className="tool-card"
                    style={{ display: 'flex', flexDirection: 'column', padding: 26, borderRadius: 16 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <div className="icon-box" style={{ margin: 0 }}>
                        <Icon size={22} />
                      </div>
                      <span className="doc-type-badge">{tool.badge}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 750, margin: '0 0 8px', color: '#091d34' }}>
                      {tool.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0, flex: 1 }}>
                      {tool.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18, color: '#005bff', fontWeight: 700, fontSize: 13 }}>
                      <span>{locale === 'en' ? 'Open tool' : locale === 'zh-CN' ? '打开工具' : 'Відкрити інструмент'}</span>
                      <ArrowRight size={15} />
                    </div>
                  </Link>
                </AnimatedStaggerItem>
              );
            })}
          </AnimatedStaggerGroup>

          {/* Engineering Banner */}
          <AnimatedSection className="cta-panel" style={{ marginTop: 40, borderRadius: 20 }} delay={0.4}>
            <div>
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaDesc}</p>
            </div>
            <Link className="button button-primary-accent" href={`${root}/rfq`}>
              {t.ctaBtn}
              <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </AnimatedSection>
    </main>
  );
}
