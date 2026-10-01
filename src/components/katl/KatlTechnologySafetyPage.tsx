import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Thermometer,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Award,
  Download,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { platformCertifications, CertificationItem } from '../../data/advancedPlatformData';
import { CatlContainerGraphic } from './KatlVisualAssets';

interface KatlTechnologySafetyPageProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
}

export const KatlTechnologySafetyPage: React.FC<KatlTechnologySafetyPageProps> = ({
  onNavigate,
  onOpenRfq,
}) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'thermal' | 'chemistry' | 'certifications'>('safety');

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Центр технологій та безпеки</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                CATL SAFETY & TECHNOLOGY EXCELLENCE
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Технологічна архітектура та 5-рівнева безпека
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Дослідіть фундаментальні інженерні рішення CATL: коміркову хімію LFP, натрій-іонні розробки, двоконтурне рідинне охолодження та повну відповідність стандартам NFPA 855 і UL 9540A.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenRfq('Запит технічного звіту безпеки NFPA 855 / UL 9540A')}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <span>Отримати звіт безпеки (PDF)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtabs Navigation */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10 text-xs font-semibold">
            {[
              { id: 'safety', label: '5-Рівнева система безпеки', icon: ShieldCheck },
              { id: 'thermal', label: 'Термоменеджмент (Liquid Cooling)', icon: Thermometer },
              { id: 'chemistry', label: 'Хімія LFP та Sodium-ion', icon: Cpu },
              { id: 'certifications', label: 'Реєстр сертифікатів (UL/NFPA/IEC)', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0077ff] text-white font-bold shadow-md shadow-blue-500/30'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* TAB 1: 5-LEVEL SAFETY HIERARCHY */}
          {activeTab === 'safety' && (
            <div className="space-y-8">
              <div className="rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-10 shadow-2xl">
                <div className="max-w-3xl mb-8">
                  <h3 className="font-display text-2xl font-black text-white">
                    П'ятирівнева ієрархія захисту: Від нано-структури до майданчика
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                    CATL реалізує концепцію всебічної пожежо- та електробезпеки, де виникнення аварійної ситуації запобігається на рівні окремої комірки ще до можливого поширення на модуль чи контейнер.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    {
                      level: 'Рівень 1',
                      title: 'КОМІРКА (CELL)',
                      desc: 'Високостабільний катод LFP з олівіновою структурою. Термостійкий сепаратор із керамічним напиленням до 200°C. Вбудований механізм скидання надлишкового тиску CID.',
                    },
                    {
                      level: 'Рівень 2',
                      title: 'МОДУЛЬ (MODULE)',
                      desc: 'Аерогелеві теплоізоляційні бар’єри між сусідніми комірками, що виключають теплопередачу при перегріві однієї банки. Індивідуальні датчики температури на кожну пару.',
                    },
                    {
                      level: 'Рівень 3',
                      title: 'ШАФА / СТІЙКА (RACK)',
                      desc: 'Вбудований швидкодіючий контактор постійного струму DC та запобіжник на кожен рак. Локальний BMS відключає аварійну стійку за 10 мс без зупинки всього контейнера.',
                    },
                    {
                      level: 'Рівень 4',
                      title: 'КОНТЕЙНЕР (CONTAINER)',
                      desc: 'Газова система пожежогасіння Novec 1230. Датчики CO та H2 для виявлення газів офф-гасінгу. Дефлаграційні вибухорозвантажувальні панелі NFPA 68 на даху.',
                    },
                    {
                      level: 'Рівень 5',
                      title: 'МАЙДАНЧИК (SITE)',
                      desc: 'Протипожежні розриви згідно з ДБН та NFPA 855. Зовнішній сухотрубний водяний ввід для пожежних підрозділів. Інтеграція тривоги у загальнозаводську систему ДСНС.',
                    },
                  ].map((lvl, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold">
                          {lvl.level}
                        </span>
                        <div className="font-display text-sm font-bold text-white mt-2 mb-1.5">
                          {lvl.title}
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-relaxed">
                          {lvl.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>UL 9540A Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THERMAL MANAGEMENT */}
          {activeTab === 'thermal' && (
            <div className="rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                    LIQUID COOLING DUAL LOOP
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                    Двоконтурне рідинне охолодження CATL
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    На відміну від застарілого повітряного охолодження, рідинний контур CATL забезпечує рівномірне охолодження кожної комірки з різницею температур <strong>ΔT ≤ 2.5°C</strong> по всьому 6.25–9 МВт·год контейнеру.
                  </p>

                  <div className="space-y-2.5 text-xs text-neutral-200">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Thermometer className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span><strong>Економія 33% енергії:</strong> Споживання на власні потреби (HVAC) скорочено у 3 рази порівняно з повітряними кондиціонерами.</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span><strong>Збільшення ресурсу на 20%:</strong> Відсутність локальних гарячих точок (hotspots) запобігає прискореній деградації комірок.</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Cpu className="h-4 w-4 text-blue-400 shrink-0" />
                      <span><strong>Робота при -30°C до +55°C:</strong> Реверсивний режим підігріву антифризом гарантує миттєвий старт без затримок взимку.</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-black/40 rounded-2xl border border-white/10 p-6 text-center">
                  <CatlContainerGraphic type="tener-h" className="w-full h-44 mb-3" />
                  <div className="text-xs font-mono text-neutral-300 font-bold">
                    Двоконтурна гідравлічна плита прямого контакту
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-1">
                    Антифриз на основі етиленгліколю із захистом від замерзання до -45°C
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CELL CHEMISTRY */}
          {activeTab === 'chemistry' && (
            <div className="rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LFP Card */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-display text-lg font-black text-white">CATL LFP (LiFePO4)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold">Серійне виробництво</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Найбезпечніша промислова літієва хімія у світі. Олівінова кристалічна структура виключає виділення кисню при нагріванні, що робить комірку термічно стабільною до 270°C.
                  </p>
                  <div className="space-y-2 text-xs font-mono text-neutral-200">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400">Щільність енергії:</span>
                      <strong className="text-white">До 430 Вт·год/л</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400">Життєвий цикл:</span>
                      <strong className="text-emerald-400">15 000 циклів (20 років)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400">ККД (Round-trip):</span>
                      <strong className="text-white">≥ 95.5%</strong>
                    </div>
                  </div>
                </div>

                {/* Sodium-ion Card */}
                <div className="p-6 rounded-2xl bg-black/40 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-display text-lg font-black text-white">CATL Na-ion (Sodium-ion)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold">Глобально з 2027</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Революційна технологія натрій-іонних акумуляторів другого покоління. Не залежить від дефіциту літію, забезпечує безпрецедентну роботу на екстремальному морозі до -40°C та підтримку надвисоких струмів заряду.
                  </p>
                  <div className="space-y-2 text-xs font-mono text-neutral-200">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400">Температурний діапазон:</span>
                      <strong className="text-amber-400">-40°C ... +60°C</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400">Швидкість заряду:</span>
                      <strong className="text-white">До 4C (15 хв до 80%)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400">Життєвий цикл:</span>
                      <strong className="text-white">8 000+ циклів</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATIONS REGISTRY */}
          {activeTab === 'certifications' && (
            <div className="rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-white">
                    Реєстр сертифікатів та протоколів випробувань
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Усі системи CATL мають офіційні протоколи випробувань провідних міжнародних лабораторій (UL, TÜV, CE)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/40 text-neutral-400 font-mono">
                      <th className="p-3">Код стандарту</th>
                      <th className="p-3">Повна назва стандарту</th>
                      <th className="p-3">Обладнання</th>
                      <th className="p-3">Лабораторія / Орган</th>
                      <th className="p-3">Термін дії</th>
                      <th className="p-3">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {platformCertifications.map((cert) => (
                      <tr key={cert.code} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-400">{cert.standard}</td>
                        <td className="p-3 max-w-xs">{cert.title}</td>
                        <td className="p-3 font-medium text-white">{cert.productFamily}</td>
                        <td className="p-3 text-neutral-400">{cert.issuer}</td>
                        <td className="p-3 font-mono">{cert.validThrough}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
