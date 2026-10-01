import React, { useState } from 'react';
import {
  FolderKanban,
  Calculator,
  FileText,
  Clock,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Copy,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';

interface KatlCustomerPortalProps {
  onNavigate: (page: KatlPage) => void;
  onOpenDesignerWithConfig: (powerKw: number, capacityKwh: number, product: string) => void;
  onOpenRfq: (note?: string) => void;
}

export const KatlCustomerPortal: React.FC<KatlCustomerPortalProps> = ({
  onNavigate,
  onOpenDesignerWithConfig,
  onOpenRfq,
}) => {
  const [activeTab, setActiveTab] = useState<'calculations' | 'proposals' | 'timeline'>('calculations');

  const savedCalculations = [
    {
      id: 'CALC-2026-08',
      name: 'Основний виробничий цех (Peak Shaving)',
      date: '2026-09-28',
      powerKw: 1200,
      capacityKwh: 2400,
      product: 'CATL TENER S (6.25 МВт·год)',
      savings: '-42%',
      payback: '3.4 р.',
      version: 'V1.3',
    },
    {
      id: 'CALC-2026-05',
      name: 'СЕС 2 МВт + Накопичення надлишків',
      date: '2026-09-14',
      powerKw: 2000,
      capacityKwh: 4500,
      product: 'CATL TENER H (9.008 МВт·год)',
      savings: '-48%',
      payback: '3.1 р.',
      version: 'V1.1',
    },
    {
      id: 'CALC-2026-02',
      name: 'Резервне живлення серверної та лабораторії',
      date: '2026-08-30',
      powerKw: 350,
      capacityKwh: 745,
      product: 'CATL EnerOne Plus (2 шафи)',
      savings: '-31%',
      payback: '4.2 р.',
      version: 'V1.0',
    },
  ];

  const proposalsHistory = [
    {
      id: 'TKP-2026-991',
      version: 'V1.2 Final',
      title: 'Техніко-комерційна пропозиція на 1.2 MW / 2.4 MWh BESS',
      date: '2026-09-29',
      totalEur: '€ 548 000',
      status: 'ISSUED',
    },
    {
      id: 'TKP-2026-940',
      version: 'V1.0 Preliminary',
      title: 'Попереднє ТКП на базі CATL EnerOne Plus',
      date: '2026-09-15',
      totalEur: '€ 184 000',
      status: 'ARCHIVED',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Особистий кабінет замовника</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                CUSTOMER ENGINEERING WORKSPACE
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Кабінет замовника: Розрахунки та ТКП
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Централізований простір керування вашими енергетичними проектами: збережені версії розрахунків BESS Designer, офіційні ТКП та статус проходження проекту.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onNavigate('home');
                  setTimeout(() => {
                    const el = document.getElementById('bess-designer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <span>Новий розрахунок BESS</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-2 mt-8 pt-6 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('calculations')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeTab === 'calculations' ? 'bg-[#0077ff] text-white font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Збережені розрахунки ({savedCalculations.length})
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeTab === 'proposals' ? 'bg-[#0077ff] text-white font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Комерційні пропозиції ТКП ({proposalsHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeTab === 'timeline' ? 'bg-[#0077ff] text-white font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Етапи реалізації проекту
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* TAB 1: SAVED CALCULATIONS */}
          {activeTab === 'calculations' && (
            <div className="space-y-4">
              <div className="font-display text-base font-bold text-white mb-2">
                Історія інженерно-фінансових розрахунків:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedCalculations.map((c) => (
                  <div key={c.id} className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                        <span>{c.id}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">{c.version}</span>
                      </div>

                      <h3 className="font-display text-sm font-bold text-white mb-1">
                        {c.name}
                      </h3>
                      <div className="text-xs text-neutral-400 font-mono">
                        {c.product}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                        <div>Потужність: <strong className="text-white block">{c.powerKw} кВт</strong></div>
                        <div>Ємність: <strong className="text-blue-400 block">{c.capacityKwh} кВт·год</strong></div>
                        <div>Економія: <strong className="text-emerald-400 block">{c.savings}</strong></div>
                        <div>Окупність: <strong className="text-white block">{c.payback}</strong></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenDesignerWithConfig(c.powerKw, c.capacityKwh, c.product)}
                        className="flex-1 py-2 rounded-xl bg-[#0077ff] text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer text-center"
                      >
                        Відкрити в BESS Designer
                      </button>
                      <button
                        onClick={() => onOpenRfq(`Запит на базі розрахунку ${c.id}: ${c.name}`)}
                        className="py-2 px-3 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors cursor-pointer"
                        title="Сформувати запит КП"
                      >
                        RFQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROPOSALS HISTORY */}
          {activeTab === 'proposals' && (
            <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-6 space-y-4">
              <div className="font-display text-base font-bold text-white">
                Офіційні версії комерційних пропозицій (Незмінний аудит версій):
              </div>

              <div className="space-y-3">
                {proposalsHistory.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-blue-400 font-bold">{p.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">{p.version}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">{p.status}</span>
                      </div>
                      <div className="font-display text-sm font-bold text-white">{p.title}</div>
                      <div className="text-xs text-neutral-400 font-mono">Дата формування: {p.date} · Орієнтовна вартість: {p.totalEur}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenRfq(`Запит актуалізації пропозиції: ${p.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0077ff] text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Завантажити PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Проходження типового проекту BESS в Україні
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Повний життєвий цикл від первинного розрахунку до передачі в експлуатацію диспетчеру обленерго
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Технічний аудит', time: '1–2 тижні', status: 'COMPLETED' },
                  { step: '02', title: 'Проектування РУ-10 кВ', time: '3–4 тижні', status: 'IN_PROGRESS' },
                  { step: '03', title: 'Поставка контейнера CATL', time: '8–12 тижнів', status: 'UPCOMING' },
                  { step: '04', title: 'Монтаж та ПНР', time: '2 тижні', status: 'UPCOMING' },
                ].map((s) => (
                  <div key={s.step} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-400 font-bold">Крок {s.step}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        s.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-neutral-500'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="font-display text-sm font-bold text-white">{s.title}</div>
                    <div className="text-xs text-neutral-400 font-mono">Тривалість: {s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
