import React, { useState } from 'react';
import { X, Wrench, ShieldCheck, Activity, TrendingUp, Layers, CheckCircle2, AlertTriangle, FileText, Database, Target, Award } from 'lucide-react';
import {
  platformOpportunities,
  competitorGapMatrix,
  demandIntelligenceData,
  platformCertifications,
  PlatformOpportunity,
  CompetitorGapItem,
  CertificationItem,
} from '../data/advancedPlatformData';

interface EngineerReviewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOpportunity?: (targetUrl: string) => void;
}

export const EngineerReviewWorkspaceModal: React.FC<EngineerReviewWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onApplyOpportunity,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'opportunities' | 'gaps' | 'demand' | 'certs'>('opportunities');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0f1118] p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
          <Wrench className="h-4 w-4" />
          <span>Closed-Loop Digital Platform · Intelligence Workspace</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          Інженерний та аналітичний простір управління платформою
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6 max-w-3xl">
          Синхронізація ринкового попиту, Opportunity Engine (пошукові та продуктові гепи), MW/MWh пайплайн замовлень та реєстр верифікованих сертифікацій.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'opportunities' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Opportunity Engine (4 задачі)</span>
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gaps' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Competitor Gap Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demand' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>MW / MWh Demand Intelligence</span>
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'certs' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Реєстр сертифікацій & Data Quality</span>
          </button>
        </div>

        {/* Tab 1: Opportunity Engine */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-neutral-300 leading-relaxed font-sans">
              <span className="font-bold text-emerald-400">Closed-Loop Automation (Section 1–2 ТЗ): </span>
              Система безперервно збирає пошукові сигнали (GSC, нульові внутрішні пошуки, налаштування в BESS Designer, запити RFQ) та генерує пріоритезовані інженерні задачі для продуктової команди.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platformOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-xl bg-[#12141d] border border-white/10 space-y-3 flex flex-col justify-between hover:border-emerald-400/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        opp.priority === 'P0' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {opp.priority} · {opp.type}
                      </span>
                      <span className="text-emerald-400 font-bold">{opp.status}</span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-white">{opp.title}</h4>
                    <p className="text-xs text-neutral-400">{opp.evidence}</p>

                    <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-cyan-300 font-mono">
                      Цінність: {opp.potentialValue}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 text-xs text-neutral-300">
                    <div className="text-neutral-500 text-[10px] uppercase font-mono mb-1">Рекомендована дія:</div>
                    <div>{opp.recommendedAction}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Competitor Gap Matrix */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs text-neutral-300 leading-relaxed font-sans">
              <span className="font-bold text-white">Стратегія інформаційного відриву (Section 3–5 ТЗ): </span>
              Ми не копіюємо сайти конкурентів. Матриця виявляє запити з високим комерційним попитом, де у конкурентів слабке або нульове покриття, і закриває їх інженерним інструментарієм.
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-neutral-400 border-b border-white/10">
                  <tr>
                    <th className="p-3.5 font-sans">Стратегічна тема / Запит</th>
                    <th className="p-3.5 text-center">Наше покриття</th>
                    <th className="p-3.5 text-center">Попит ринку</th>
                    <th className="p-3.5 text-center">Конкуренти</th>
                    <th className="p-3.5 font-sans">Інженерний цифровий бар'єр (Moat)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {competitorGapMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-bold text-white font-sans">{item.topic}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          {item.ourCoverage}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-cyan-300 font-bold">{item.searchDemand}</td>
                      <td className="p-3.5 text-center text-neutral-400">{item.competitorCoverage}</td>
                      <td className="p-3.5 text-neutral-300 font-sans text-[11px] leading-relaxed max-w-xs">
                        {item.strategicMoat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Demand Intelligence & Pipeline */}
        {activeTab === 'demand' && (
          <div className="space-y-6">
            {/* Top Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-neutral-400">Загальний запитаний обсяг ємності</div>
                <div className="font-display text-3xl font-bold text-emerald-400 mt-1">
                  {demandIntelligenceData.totalRequestedMwh} МВт·год
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">В активних розрахунках платформи</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-neutral-400">Активні проєкти в опрацюванні</div>
                <div className="font-display text-3xl font-bold text-white mt-1">
                  {demandIntelligenceData.totalActiveProjects} об’єктів
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Підприємства України</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-neutral-400">Оціночна вартість пайплайну</div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-amber-300 mt-1">
                  {demandIntelligenceData.totalPipelineValueUah}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Потенціал реалізації під ключ</div>
              </div>
            </div>

            {/* Split Grid: By Industry vs By Application */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* By Industry */}
              <div className="p-5 rounded-xl bg-[#12141d] border border-white/10 space-y-3">
                <h4 className="font-display text-sm font-bold text-white border-b border-white/5 pb-2">
                  Розподіл попиту за галузями
                </h4>
                <div className="space-y-3">
                  {demandIntelligenceData.byIndustry.map((ind, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">{ind.industry}</span>
                        <span className="font-mono text-emerald-400 font-bold">{ind.mwh} МВт·год ({ind.sharePercent}%)</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5">
                        <div
                          style={{ width: `${ind.sharePercent}%` }}
                          className="bg-emerald-400 h-1.5 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Application */}
              <div className="p-5 rounded-xl bg-[#12141d] border border-white/10 space-y-3">
                <h4 className="font-display text-sm font-bold text-white border-b border-white/5 pb-2">
                  Розподіл попиту за сценаріями застосування
                </h4>
                <div className="space-y-3">
                  {demandIntelligenceData.byApplication.map((app, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">{app.app}</span>
                        <span className="font-mono text-cyan-300 font-bold">{app.mwh} МВт·год ({app.percent}%)</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5">
                        <div
                          style={{ width: `${app.percent}%` }}
                          className="bg-cyan-400 h-1.5 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attribution Trace concept */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300">
              <span className="font-bold text-emerald-400 font-mono">Search-to-Revenue Attribution: </span>
              Запит Google → Лендинг галузі → Розрахунок у BESS Designer → Заявка RFQ → Оцінка потенціалу ємності (MWh) в CRM без втрати контексту.
            </div>
          </div>
        )}

        {/* Tab 4: Certification Registry & Data Quality */}
        {activeTab === 'certs' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-neutral-300 leading-relaxed font-sans">
              <span className="font-bold text-emerald-400">Реєстр сертифікацій (Section 22–24 ТЗ): </span>
              Усі паспортні дані та протоколи випробувань літій-залізо-фосфатних систем CATL прив’язані до офіційних звітів лабораторій UL Solutions, TÜV Rheinland та Bureau Veritas.
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-neutral-400 border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Код / Стандарт</th>
                    <th className="p-3.5 font-sans">Назва стандарту</th>
                    <th className="p-3.5">Обладнання</th>
                    <th className="p-3.5">Лабораторія / Звіт</th>
                    <th className="p-3.5 text-center">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {platformCertifications.map((cert) => (
                    <tr key={cert.code} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-bold text-cyan-300">{cert.standard}</td>
                      <td className="p-3.5 font-sans text-neutral-300 text-[11px] leading-relaxed max-w-xs">{cert.title}</td>
                      <td className="p-3.5 text-emerald-400 font-bold">{cert.productFamily}</td>
                      <td className="p-3.5 text-neutral-400 text-[11px]">
                        <div>{cert.issuer}</div>
                        <div className="text-neutral-500">№ {cert.testReportNo}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          ДІЙСНИЙ ДО {cert.validThrough}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span>Data Quality Score: <strong className="text-emerald-400">100 / 100</strong> (0 конфліктних специфікацій, 100% відповідність ДСТУ)</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Верифіковано інженерним аудитом 2026</span>
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
