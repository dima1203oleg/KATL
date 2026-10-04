"use client";

import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText, Building2, Calendar, Phone } from 'lucide-react';
import { generateBom } from '../data/advancedPlatformData';

interface BessProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  powerKw: number;
  capacityKwh: number;
  recommendedProduct: string;
  tariffUah: number;
}

export const BessProposalModal: React.FC<BessProposalModalProps> = ({
  isOpen,
  onClose,
  powerKw,
  capacityKwh,
  recommendedProduct,
  tariffUah,
}) => {
  if (!isOpen) return null;

  const bomItems = generateBom(powerKw, capacityKwh, recommendedProduct);
  const annualSavingsMln = ((powerKw * 480 * 12 + capacityKwh * 0.85 * 300 * 3.2) / 1000000).toFixed(2);
  const estimatedCapexMln = ((capacityKwh * 210 * 41.5 + powerKw * 55 * 41.5) / 1000000).toFixed(2);
  const simplePayback = (Number(estimatedCapexMln) / Number(annualSavingsMln)).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0e1017] p-6 sm:p-10 shadow-2xl text-left print:bg-white print:text-black print:p-0 print:border-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Controls (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-neutral-400">
              Попереднє техніко-комерційне обґрунтування · Документ № ТКП-2026/BESS-{powerKw}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Друк / Зберегти PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-8 print:space-y-6">
          
          {/* Header Bar */}
          <div className="flex items-start justify-between border-b-2 border-emerald-400 pb-4">
            <div>
              <div className="font-display text-2xl font-bold text-white print:text-black">
                CATL BESS UKRAINE
              </div>
              <div className="text-xs text-neutral-400 print:text-neutral-600 font-mono mt-0.5">
                Авторизована інженерна платформа систем накопичення енергії
              </div>
            </div>
            <div className="text-right text-xs font-mono text-neutral-300 print:text-neutral-700">
              <div>Дата: 01.10.2026</div>
              <div>Версія: ТКП-1.0 (Офіційний драфт)</div>
              <div>Термін дії: 30 календарних днів</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-2">
              1. Резюме проєкту (Executive Summary)
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 print:text-neutral-800 leading-relaxed">
              На запит підприємства розроблено концептуальне технічне рішення промислової системи накопичення енергії (BESS) на базі офіційного обладнання CATL із літій-залізо-фосфатними (LFP) осередками підвищеного циклічного ресурсу. Система призначена для зрізання пікових навантажень (Peak Shaving), цілодобового забезпечення стабільності та утилізації арбітражного потенціалу ринку на добу наперед (РДН).
            </p>
          </div>

          {/* Section 2: Technical Architecture Parameters */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-2">
              2. Цільові інженерні параметри комплексу
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-black/40 print:bg-neutral-100 rounded-lg border border-white/5 print:border-neutral-300">
                <div className="text-neutral-400 print:text-neutral-600">Потужність (AC):</div>
                <div className="text-base font-bold text-white print:text-black mt-1">{powerKw} кВт</div>
              </div>
              <div className="p-3 bg-black/40 print:bg-neutral-100 rounded-lg border border-white/5 print:border-neutral-300">
                <div className="text-neutral-400 print:text-neutral-600">Корисна ємність:</div>
                <div className="text-base font-bold text-emerald-400 print:text-emerald-800 mt-1">{capacityKwh.toLocaleString()} кВт·год</div>
              </div>
              <div className="p-3 bg-black/40 print:bg-neutral-100 rounded-lg border border-white/5 print:border-neutral-300">
                <div className="text-neutral-400 print:text-neutral-600">Базовий накопичувач:</div>
                <div className="text-xs font-bold text-white print:text-black mt-1">{recommendedProduct}</div>
              </div>
              <div className="p-3 bg-black/40 print:bg-neutral-100 rounded-lg border border-white/5 print:border-neutral-300">
                <div className="text-neutral-400 print:text-neutral-600">Клас напруги:</div>
                <div className="text-base font-bold text-white print:text-black mt-1">10 кВ (через ТМГ)</div>
              </div>
            </div>
          </div>

          {/* Section 3: Itemized BOM */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-2">
              3. Специфікація обладнання (Bill of Materials)
            </h4>
            <div className="rounded-lg border border-white/10 print:border-neutral-300 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/50 print:bg-neutral-200 border-b border-white/10 print:border-neutral-300 text-neutral-300 print:text-neutral-700">
                  <tr>
                    <th className="p-2.5">Найменування</th>
                    <th className="p-2.5">Виробник</th>
                    <th className="p-2.5 text-center">К-сть</th>
                    <th className="p-2.5">Стандарти безпеки</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200 text-neutral-200 print:text-neutral-800">
                  {bomItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold font-sans">{item.name}</td>
                      <td className="p-2.5 font-sans">{item.manufacturer}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-400 print:text-black">{item.quantity} {item.unit}</td>
                      <td className="p-2.5 text-[11px] text-cyan-300 print:text-neutral-600">{item.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Economics & Payback */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-2">
              4. Фінансово-економічні показники (ТЕО)
            </h4>
            <div className="p-4 bg-emerald-500/10 print:bg-neutral-100 rounded-xl border border-emerald-500/20 print:border-neutral-300 space-y-2 text-xs text-neutral-200 print:text-neutral-800">
              <div className="flex justify-between border-b border-emerald-500/20 print:border-neutral-300 pb-1.5 font-mono">
                <span>Орієнтовний обсяг інвестицій (Turnkey CAPEX):</span>
                <span className="font-bold text-white print:text-black">≈ {estimatedCapexMln} млн грн (включаючи монтаж та ПНР)</span>
              </div>
              <div className="flex justify-between border-b border-emerald-500/20 print:border-neutral-300 pb-1.5 font-mono">
                <span>Прогнозована річна економія підприємства:</span>
                <span className="font-bold text-emerald-300 print:text-emerald-800">≈ {annualSavingsMln} млн грн / рік</span>
              </div>
              <div className="flex justify-between font-mono pt-1 text-sm font-bold">
                <span>Розрахунковий простий термін окупності:</span>
                <span className="text-emerald-400 print:text-emerald-800">≈ {simplePayback} роки</span>
              </div>
            </div>
          </div>

          {/* Section 5: Implementation Roadmap */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-2">
              5. Етапи реалізації проєкту під ключ (Timeline)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-3 bg-black/30 print:bg-neutral-100 rounded border border-white/5 print:border-neutral-300">
                <div className="text-emerald-400 print:text-black font-bold">Тиждень 1–2:</div>
                <div className="text-[11px] text-neutral-300 print:text-neutral-700 mt-1">Аудит графіка навантаження, геодезія, ТУ обленерго.</div>
              </div>
              <div className="p-3 bg-black/30 print:bg-neutral-100 rounded border border-white/5 print:border-neutral-300">
                <div className="text-emerald-400 print:text-black font-bold">Тиждень 3–6:</div>
                <div className="text-[11px] text-neutral-300 print:text-neutral-700 mt-1">Виготовлення та поставка шаф/контейнерів CATL.</div>
              </div>
              <div className="p-3 bg-black/30 print:bg-neutral-100 rounded border border-white/5 print:border-neutral-300">
                <div className="text-emerald-400 print:text-black font-bold">Тиждень 7–8:</div>
                <div className="text-[11px] text-neutral-300 print:text-neutral-700 mt-1">Будівельні роботи, фундаментна плита, кабельні траси.</div>
              </div>
              <div className="p-3 bg-black/30 print:bg-neutral-100 rounded border border-white/5 print:border-neutral-300">
                <div className="text-emerald-400 print:text-black font-bold">Тиждень 9–10:</div>
                <div className="text-[11px] text-neutral-300 print:text-neutral-700 mt-1">Пусконалагоджувальні роботи, інтеграція EMS та здача в експлуатацію.</div>
              </div>
            </div>
          </div>

          {/* Footer Contacts in Proposal */}
          <div className="pt-6 border-t border-white/10 print:border-neutral-300 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-neutral-400 print:text-neutral-600 gap-4">
            <div>
              <div className="font-bold text-white print:text-black">Інженерний центр CATL BESS Ukraine</div>
              <div>вул. Володимирська, 49А, Київ, Україна · Телефон: +380 44 290 88 12</div>
            </div>
            <div className="text-emerald-400 print:text-emerald-800 font-mono font-semibold">
              bess@catl-energy.ua · www.catl-bess.ua
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
