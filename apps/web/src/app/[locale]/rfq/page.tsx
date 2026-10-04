import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RfqForm } from '../../../components/RfqForm';
import { FileSpreadsheet, ShieldCheck, Zap } from 'lucide-react';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Запит комерційної та інженерної пропозиції | KATL ESS Україна',
  description: 'Розрахуйте та отримайте офіційну комерційну пропозицію (ТКП) на системи накопичення енергії CATL для бізнесу та промисловості.',
};

export const dynamic = 'force-dynamic';

export default async function RfqPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();

  const attribution: Record<string, string> = {};
  for (const key of ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm']) {
    const queryKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    const value = query[queryKey];
    if (typeof value === 'string') attribution[key] = value.slice(0, 128);
  }

  const product = query.product;
  const initial: Record<string, string> = {};
  for (const key of ['powerKw', 'capacityKwh', 'durationHours', 'calculationId', 'location', 'details']) {
    const value = query[key];
    if (typeof value === 'string') {
      if (key === 'calculationId' ? /^[0-9a-f-]{36}$/i.test(value) : true) {
        initial[key] = value;
      }
    }
  }

  const t = {
    'uk-UA': {
      tag: 'Офіційний запит ТКП',
      title: 'Розкажіть про ваш об’єкт',
      subtitle: 'Заповніть вихідні параметри вашого об’єкта. Інженерна команда підготує деталізоване ТЕО, підбір обладнання CATL та комерційну пропозицію.',
      badges: [
        'Офіційна гарантія CATL до 15 000 циклів',
        'Повний склад: PCS + BMS + EMS + ОПС',
        'Розрахунок згідно з тарифами України',
      ],
    },
    'en': {
      tag: 'Commercial Proposal Request',
      title: 'Request a Commercial Proposal',
      subtitle: 'Submit your facility parameters. Our engineering department will design an optimal CATL BESS solution with financial payback modeling.',
      badges: [
        'Official CATL Warranty up to 15,000 cycles',
        'Full Turnkey: PCS + BMS + EMS + Fire Suppression',
        'Custom Grid & Tariff Optimization',
      ],
    },
    'zh-CN': {
      tag: '商业报价申请',
      title: '获取正式商业与技术方案',
      subtitle: '提供您的项目负荷与场地参数。CATL 乌克兰工程团队将为您定制储能系统配置及投资回报分析报告。',
      badges: [
        'CATL 原厂质保最高 15,000 次循环',
        '交钥匙交钥匙集成：PCS + BMS + EMS + 消防',
        '结合乌克兰本地电价政策优化',
      ],
    },
  }[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA'];

  return (
    <main className="rfq-page">
      <div className="rfq-container">
        
        {/* Header Hero */}
        <AnimatedSection className="rfq-hero" direction="none">
          <div className="rfq-badge">
            <Zap style={{ width: 14, height: 14 }} />
            <span>{t.tag}</span>
          </div>
          <h1 className="rfq-title">
            {t.title}
          </h1>
          <p className="rfq-subtitle">
            {t.subtitle}
          </p>

          {/* Value Badges */}
          <AnimatedStaggerGroup className="rfq-value-badges">
            {t.badges.map((badge, idx) => (
              <AnimatedStaggerItem key={idx}>
                <div className="rfq-value-chip">
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>{badge}</span>
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerGroup>
        </AnimatedSection>

        {/* RFQ Form Container */}
        <AnimatedSection style={{ maxWidth: 860, margin: '0 auto' }}>
          <RfqForm
            locale={locale}
            product={typeof product === 'string' ? product : undefined}
            attribution={attribution}
            initial={initial}
          />
        </AnimatedSection>

      </div>
    </main>
  );
}
