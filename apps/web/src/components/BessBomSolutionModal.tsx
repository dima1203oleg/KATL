"use client";

import React, { useState } from 'react';
import { X, Layers, ShieldCheck, Printer, Download, CheckCircle2, Cpu, Wrench, HelpCircle } from 'lucide-react';
import { generateBom, generateCalculationTrace, BomItem, CalculationTraceStep } from '../data/advancedPlatformData';

interface BessBomSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  powerKw: number;
  capacityKwh: number;
  recommendedProduct: string;
  tariffUah: number;
  durationHours: number;
  onOpenProposal: () => void;
}

export const BessBomSolutionModal: React.FC<BessBomSolutionModalProps> = ({
  isOpen,
  onClose,
  powerKw,
  capacityKwh,
  recommendedProduct,
  tariffUah,
  durationHours,
  onOpenProposal,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'bom' | 'trace'>('bom');
  const bomList = generateBom(powerKw, capacityKwh, recommendedProduct);
  const traceSteps = generateCalculationTrace(powerKw, durationHours, 'peak-shaving', tariffUah);

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
          <Layers className="h-4 w-4" />
          <span>Solution Configurator · BOM Engine & Calculation Trace</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          Специфікація комплексу (Bill of Materials) та інженерний слід розрахунку
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6 max-w-3xl">
          Повний склад промислового комплексу BESS: від акумуляторних комірок CATL та інвертора PCS до підвищувального трансформатора 10 кВ, шафи EMS та автоматичного пожежогасіння Novec.
        </p>

        {/* Top Badges & Ruleset version */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-black/40 rounded-xl border border-white/10 mb-6 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-emerald-400 font-bold">Конфігурація: {recommendedProduct}</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-300">Потужність: {powerKw} кВт</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-300">Ємність: {capacityKwh.toLocaleString()} кВт·год</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Ruleset v4.2.1-UA
            </span>
            <span>Аудит пройдено</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-black/50 rounded-xl border border-white/10 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bom')}
            className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bom' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Специфікація обладнання (BOM)
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'trace' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Аудиторський слід розрахунку (Calculation Trace)
          </button>
        </div>

        {/* Tab 1: BOM Table */}
        {activeTab === 'bom' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-neutral-400 border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Категорія підсистеми</th>
                    <th className="p-3.5">Найменування обладнання</th>
                    <th className="p-3.5">Інженерні характеристики</th>
                    <th className="p-3.5 text-center">К-сть</th>
                    <th className="p-3.5">Виробник</th>
                    <th className="p-3.5">Стандарти безпеки</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {bomList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-semibold text-emerald-400 font-sans">{item.category}</td>
                      <td className="p-3.5 font-bold text-white font-sans">{item.name}</td>
                      <td className="p-3.5 text-neutral-300 text-[11px] leading-relaxed">{item.spec}</td>
                      <td className="p-3.5 text-center font-bold text-emerald-300">{item.quantity} {item.unit}</td>
                      <td className="p-3.5 text-neutral-300 font-sans">{item.manufacturer}</td>
                      <td className="p-3.5 text-cyan-300 text-[10px]">{item.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-neutral-400 font-sans">
                Усі компоненти мають пряму взаємну сумісність через протоколи Modbus TCP та IEC 61850.
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenProposal();
                }}
                className="shrink-0 flex items-center gap-1.5 rounded-md bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300 cursor-pointer"
              >
                <span>Згенерувати комерційну пропозицію (ТКП)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Calculation Trace */}
        {activeTab === 'trace' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300 leading-relaxed font-sans">
              <span className="font-bold text-emerald-400">Прозорість інженерії (Section 11 ТЗ): </span>
              Жодна цифра не береться випадково або через неперевірений штучний інтелект. Кожен крок спирається на детерміновані правила ДСТУ, коефіцієнти перевантаження PCS 1.05x та нормативні обмеження глибини розряду DoD 85%.
            </div>

            <div className="space-y-3">
              {traceSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#12141d] border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white font-sans">{step.step}: {step.parameter}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      step.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-500 block font-sans">Вхідні дані:</span>
                      <span className="text-neutral-300">{step.inputValue}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block font-sans">Застосоване інженерне правило:</span>
                      <span className="text-cyan-300">{step.ruleApplied}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block font-sans">Нормований результат:</span>
                      <span className="text-emerald-400 font-bold">{step.normalizedResult}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
