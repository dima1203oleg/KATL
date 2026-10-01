import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingDown,
  Download,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { BessSingleLineDiagram } from '../BessSingleLineDiagram';
import { BessLoadProfileVisualizer } from '../BessLoadProfileVisualizer';
import { BessLcosSimulator } from '../BessLcosSimulator';
import { BessDocumentLibrary } from '../BessDocumentLibrary';
import { BessKnowledgeSection } from '../BessKnowledgeSection';

interface KatlTechPageProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (productName?: string) => void;
}

export const KatlTechPage: React.FC<KatlTechPageProps> = ({
  onNavigate,
  onOpenRfq,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sld' | 'load-profile' | 'lcos' | 'docs' | 'standards'>('sld');

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Інженерний хаб & Технології</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                CATL ENGINEERING HUB
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Інженерія та Системна Інтеграція
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Повний набір інженерних інструментів: інтерактивна однолінійна схема підключення до РУ-10 кВ, 24-годинна оптимізація добового графіка споживання, 15-річний LCOS симулятор та бібліотека технічної документації.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenRfq('Запит технічного аудиту об\'єкта')}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <span>Замовити технічний аудит</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10 text-xs font-semibold">
            {[
              { id: 'sld', label: 'Однолінійна схема (SLD)', icon: Zap },
              { id: 'load-profile', label: '24-годинний профіль (Peak Shaving)', icon: Activity },
              { id: 'lcos', label: 'LCOS & Фінансова модель', icon: TrendingDown },
              { id: 'standards', label: 'Стандарти & База знань', icon: ShieldCheck },
              { id: 'docs', label: 'Технічна документація', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all cursor-pointer ${
                    activeSubTab === tab.id
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

      {/* Main Content Area */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeSubTab === 'sld' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                <strong>Інженерна примітка:</strong> Схема відображає підключення CATL TENER/EnerOne через трансформаторну підстанцію 0.69/10(35) кВ із захистами РЗА, вакуумними вимикачами та комерційним обліком АСКОЕ згідно з ДСТУ EN 62619 та вимогами НЕК «Укренерго».
              </div>
              <BessSingleLineDiagram />
            </div>
          )}

          {activeSubTab === 'load-profile' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                <strong>Симуляція оптимізації споживання:</strong> Дослідіть, як зарядка в нічні години низького тарифу та розряд у ранковий/вечірній піки зменшують витрати на електроенергію на 35–45%.
              </div>
              <BessLoadProfileVisualizer />
            </div>
          )}

          {activeSubTab === 'lcos' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                <strong>Фінансово-інженерний розрахунок:</strong> Модель нормованої вартості зберігання енергії (Levelized Cost of Storage) з урахуванням деградації LFP комірок CATL та графіку повернення інвестицій (Payback / IRR).
              </div>
              <BessLcosSimulator />
            </div>
          )}

          {activeSubTab === 'standards' && (
            <div className="space-y-6">
              <BessKnowledgeSection />
            </div>
          )}

          {activeSubTab === 'docs' && (
            <div className="space-y-6">
              <BessDocumentLibrary />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
