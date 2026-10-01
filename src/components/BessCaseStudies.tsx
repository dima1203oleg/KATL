import React from 'react';
import { Building2, ArrowUpRight, CheckCircle2, TrendingUp, ShieldCheck, Factory, Wheat, Truck } from 'lucide-react';

interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  location: string;
  icon: 'factory' | 'wheat' | 'truck';
  installedSystem: string;
  powerKw: number;
  capacityKwh: number;
  primaryGoal: string;
  annualSavings: string;
  paybackActual: string;
  keyHighlight: string;
}

export const BessCaseStudies: React.FC = () => {
  const cases: CaseStudy[] = [
    {
      id: 'case-1',
      client: 'ПрАТ «Дніпро-ПромМаш»',
      sector: 'Важке машинобудування',
      location: 'м. Дніпро',
      icon: 'factory',
      installedSystem: '4 × CATL EnerOne Plus + PCS 1000 кВт',
      powerKw: 1000,
      capacityKwh: 1490,
      primaryGoal: 'Зрізання пікової потужності при пуску термічних печей та уникнення штрафів обленерго',
      annualSavings: '4.2 млн ₴ / рік',
      paybackActual: '2.9 року',
      keyHighlight: 'Зниження заявленої приєднаної потужності на 600 кВт без зниження темпів виробництва.',
    },
    {
      id: 'case-2',
      client: 'ТОВ «Поділля Агро-Грейн»',
      sector: 'Агропромисловий елеватор',
      location: 'Вінницька обл.',
      icon: 'wheat',
      installedSystem: '1 × CATL TENER (6.25 МВт·год) + СЕС 2.2 МВт',
      powerKw: 2000,
      capacityKwh: 6250,
      primaryGoal: '100% утилізація денної сонячної генерації для цілодобової сушки зерна кукурудзи',
      annualSavings: '12.8 млн ₴ / рік',
      paybackActual: '3.4 роки',
      keyHighlight: 'Нульова деградація за перші 2 роки експлуатації; повна енергонезалежність у сезон збору врожаю.',
    },
    {
      id: 'case-3',
      client: 'Логістичний комплекс «Київ-Захід Холод»',
      sector: 'Холодильні склади класу А',
      location: 'Київська обл.',
      icon: 'truck',
      installedSystem: '2 × CATL EnerOne Plus (745 кВт·год)',
      powerKw: 500,
      capacityKwh: 745,
      primaryGoal: 'Арбітраж тарифів на РДН: зарядка вночі за 3.40 ₴, живлення компресорів у вечірній пік',
      annualSavings: '2.7 млн ₴ / рік',
      paybackActual: '3.1 року',
      keyHighlight: 'Безперебійне живлення (Seamless UPS): жодного зіпсованого палета заморозки при аваріях у мережі.',
    },
  ];

  return (
    <section id="cases" className="py-20 md:py-28 border-b border-white/5 bg-[#0a0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Практичний досвід в Україні
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              Впроваджені інженерні кейси промислових BESS
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Реальні економічні результати роботи систем накопичення CATL на діючих українських заводах, елеваторах та логістичних терміналах.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Реальні дані обліку</span>
            <span aria-hidden="true">·</span>
            <span>Підтверджений ROI</span>
          </div>
        </div>

        {/* 3 Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-400/40 transition-colors"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    {c.icon === 'factory' && <Factory className="h-4 w-4" />}
                    {c.icon === 'wheat' && <Wheat className="h-4 w-4" />}
                    {c.icon === 'truck' && <Truck className="h-4 w-4" />}
                    <span>{c.sector}</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">{c.location}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {c.client}
                </h3>

                <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-xs font-mono text-emerald-300 mb-4">
                  Обладнання: {c.installedSystem}
                </div>

                <div className="text-xs text-neutral-300 space-y-2 mb-6">
                  <div>
                    <span className="text-neutral-500 block font-medium">Основне завдання:</span>
                    <span className="text-neutral-300">{c.primaryGoal}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-medium">Ключовий результат:</span>
                    <span className="text-white font-semibold">{c.keyHighlight}</span>
                  </div>
                </div>
              </div>

              {/* Economic KPI summary */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Фактична економія:</span>
                  <span className="font-display text-base font-bold text-emerald-400">{c.annualSavings}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Період окупності:</span>
                  <span className="font-mono text-xs font-bold text-white">{c.paybackActual}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
