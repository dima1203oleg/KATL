import React from 'react';
import { Layers, ArrowRight, Check, Zap, ShieldCheck } from 'lucide-react';
import { bessProducts } from '../data/bessData';

interface BessComparatorProps {
  onSelectProductForDesigner: (productId: string) => void;
}

export const BessComparator: React.FC<BessComparatorProps> = ({
  onSelectProductForDesigner,
}) => {
  const specs = [
    { label: 'Номінальна ємність', tener: '6.25 МВт·год (6,250 кВт·год)', enerone: '372.7 кВт·год / шафа', enerc: '3.72 МВт·год (3,727 кВт·год)' },
    { label: 'Форм-фактор розміщення', tener: 'Стандартний 20ft HC контейнер', enerone: 'Окрема вулична шафа (1.69 м²)', enerc: '40ft HC контейнер' },
    { label: 'Гарантована нульова деградація', tener: '5 років (0% зносу потужності й ємності)', enerone: 'Стандартна лінійна LFP крива', enerc: 'Стандартна лінійна LFP крива' },
    { label: 'Робочий C-rate (струм)', tener: '0.25C – 0.5C (Оптимум 2–4 год)', enerone: '0.5C – 1C (Швидкий розряд 1 год)', enerc: '0.5C (2 год)' },
    { label: 'Система терморегулювання', tener: 'Liquid Cooling (ΔT ≤ 2.5°C)', enerone: 'Автономний рідинний контур шафи', enerc: 'Централізований рідинний чилер' },
    { label: 'Енергетична щільність', tener: '430 Вт·год/л (Світовий рекорд)', enerone: 'Компактна C&I щільність', enerc: 'Висока контейнерна щільність' },
    { label: 'Рівень захисту оболонки', tener: 'IP55 / C5 морське антикорозійне', enerone: 'IP55 вуличне виконання', enerc: 'IP55 / Сейсмостійкий каркас' },
    { label: 'ККД циклу (AC-AC Round Trip)', tener: '≥ 96.0%', enerone: '≥ 95.2%', enerc: '≥ 95.5%' },
    { label: 'Головна сфера застосування', tener: 'Utility-scale, СЕС від 10 МВт, заводи', enerone: 'Заводи, елеватори, склади (100–3000 кВт)', enerc: 'Великі промислові об’єкти 3–15 МВт' },
  ];

  return (
    <section id="compare" className="py-20 md:py-28 border-b border-white/5 bg-[#0b0c10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Порівняння конфігурацій
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            Порівняльна матриця промислових систем CATL
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            Зіставлення технічних характеристик та сфер призначення для вибору оптимального рішення під інженерні вимоги вашого об’єкта.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-white/10 bg-[#12141c] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              
              {/* Product Headers */}
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 sm:p-5 text-neutral-400 font-mono w-1/4">Параметр системи</th>
                  <th className="p-4 sm:p-5 w-1/4">
                    <div className="font-display text-base font-bold text-emerald-400">CATL TENER</div>
                    <div className="text-[11px] text-neutral-400 font-mono">6.25 МВт·год Utility Container</div>
                  </th>
                  <th className="p-4 sm:p-5 w-1/4">
                    <div className="font-display text-base font-bold text-white">CATL EnerOne Plus</div>
                    <div className="text-[11px] text-neutral-400 font-mono">372.7 кВт·год Modular Cabinet</div>
                  </th>
                  <th className="p-4 sm:p-5 w-1/4">
                    <div className="font-display text-base font-bold text-white">CATL EnerC Plus</div>
                    <div className="text-[11px] text-neutral-400 font-mono">3.72 МВт·год 40ft Container</div>
                  </th>
                </tr>
              </thead>

              {/* Rows */}
              <tbody className="divide-y divide-white/5 font-mono">
                {specs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-sans font-medium text-neutral-400">{row.label}</td>
                    <td className="p-4 font-bold text-emerald-300 bg-emerald-500/[0.03]">{row.tener}</td>
                    <td className="p-4 text-neutral-200">{row.enerone}</td>
                    <td className="p-4 text-neutral-200">{row.enerc}</td>
                  </tr>
                ))}
              </tbody>

              {/* Action Buttons in footer of table */}
              <tfoot>
                <tr className="border-t border-white/10 bg-black/30">
                  <td className="p-4 text-xs font-sans text-neutral-400 font-medium">Розрахунок у конфігураторі:</td>
                  <td className="p-4">
                    <button
                      onClick={() => onSelectProductForDesigner('catl-tener')}
                      className="w-full rounded-md bg-emerald-400 py-2 px-3 text-center text-xs font-bold text-black hover:bg-emerald-300 cursor-pointer"
                    >
                      Підібрати TENER
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onSelectProductForDesigner('catl-enerone-plus')}
                      className="w-full rounded-md border border-white/20 bg-white/5 py-2 px-3 text-center text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
                    >
                      Підібрати EnerOne
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onSelectProductForDesigner('catl-enerc-plus')}
                      className="w-full rounded-md border border-white/20 bg-white/5 py-2 px-3 text-center text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
                    >
                      Підібрати EnerC
                    </button>
                  </td>
                </tr>
              </tfoot>

            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
