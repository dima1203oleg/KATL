import React, { useState } from 'react';
import {
  Check,
  X,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Download,
  Info,
  ChevronDown,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { CatlContainerGraphic } from './KatlVisualAssets';

interface KatlComparePageProps {
  selectedProductIds?: string[];
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (productName?: string) => void;
  onSelectProduct?: (productId: string) => void;
}

interface ProductCompareData {
  id: string;
  name: string;
  series: string;
  capacity: string;
  footprint: string;
  cellType: string;
  cycleLife: string;
  cooling: string;
  safety: string;
  voltage: string;
  cRate: string;
  degradation: string;
  standards: string;
  type: string;
  tag: string;
}

export const KatlComparePage: React.FC<KatlComparePageProps> = ({
  selectedProductIds,
  onNavigate,
  onOpenRfq,
  onSelectProduct,
}) => {
  const allComparisonProducts: ProductCompareData[] = [
    {
      id: 'catl-tener-h',
      name: 'CATL TENER H',
      series: 'Flagship Utility-scale',
      capacity: '9.008 МВт·год',
      footprint: '20ft High Cube (6058 × 2438 × 2896 мм)',
      cellType: '575 Ah Ultra-Dense LFP',
      cycleLife: '15 000+ циклів (20 років)',
      cooling: 'Двоконтурне рідинне (Liquid Cooling, ΔT ≤ 2.5°C)',
      safety: 'NFPA 855 + Novec 1230 + дефлаграційні вікна',
      voltage: '1500 V DC (1250 ~ 1700 V)',
      cRate: '0.5C (2 год) / опц. 1C',
      degradation: 'Нульова деградація перші 5 років',
      standards: 'NFPA 855, UL 9540A, IEC 62619, CE, ДСТУ EN',
      type: 'tener-h',
      tag: 'Найвища щільність',
    },
    {
      id: 'catl-tener-s',
      name: 'CATL TENER S',
      series: 'Proven Utility-scale',
      capacity: '6.25 МВт·год',
      footprint: '20ft ISO контейнер',
      cellType: '314 Ah LFP Gen 2',
      cycleLife: '15 000 циклів (20 років)',
      cooling: 'Рідинне охолодження (ΔT ≤ 3.0°C)',
      safety: 'NFPA 855 + вбудована газова система + аерозоль',
      voltage: '1500 V DC (1200 ~ 1680 V)',
      cRate: '0.5C (2 год)',
      degradation: '0% втрат ємності за перші 5 років',
      standards: 'NFPA 855, UL 9540A, IEC 62619, CE',
      type: 'tener-s',
      tag: 'Перевірений стандарт',
    },
    {
      id: 'catl-tener-stack',
      name: 'CATL TENER Stack',
      series: 'Modular Stackable ESS',
      capacity: 'До 9.0 МВт·год',
      footprint: 'Модульні вертикальні шафи (N × 1.8 м²)',
      cellType: '314 / 575 Ah LFP CTP',
      cycleLife: '12 000 циклів',
      cooling: 'Модульне рідинне охолодження стійок',
      safety: 'Індивідуальний захист стійок + клапани скидання тиску',
      voltage: '1500 V DC',
      cRate: '0.5C - 1C',
      degradation: '< 1.2% на рік',
      standards: 'UL 9540A, IEC 62619, CE',
      type: 'stack',
      tag: 'Гнучке компонування',
    },
    {
      id: 'catl-enerone-plus',
      name: 'CATL EnerOne Plus',
      series: 'C&I Outdoor Cabinet',
      capacity: '372.7 кВт·год (на шафу)',
      footprint: '1300 × 1300 × 2250 мм (всього 1.3 м²)',
      cellType: '314 Ah LFP',
      cycleLife: '10 000+ циклів',
      cooling: 'Вбудоване автономне рідинне охолодження',
      safety: 'NFPA 68/69 дефлаграційні панелі + аерозоль',
      voltage: '1146 V DC (920 ~ 1310 V)',
      cRate: '0.5C - 1C (миттєвий розряд)',
      degradation: '< 1.5% на рік',
      standards: 'UL 9540, UL 1973, IEC 62619, ДСТУ EN 62619',
      type: 'enerone',
      tag: 'Для бізнесу (C&I)',
    },
    {
      id: 'catl-tener-sodium',
      name: 'CATL TENER Sodium',
      series: 'Sodium-ion Utility ESS',
      capacity: '4.5 МВт·год',
      footprint: '20ft ISO контейнер',
      cellType: 'CATL Na-Cell 200 Ah (Na-ion)',
      cycleLife: '8 000+ циклів',
      cooling: 'Рідинне охолодження з антифризом',
      safety: 'Висока хімічна стабільність Na-ion при екстремальних T',
      voltage: '1500 V DC (1000 ~ 1600 V)',
      cRate: '1C - 4C (надшвидкий відгук)',
      degradation: 'Стабільна ємність без підігріву до -40°C',
      standards: 'IEC 62619 (pre-cert), UN 38.3',
      type: 'sodium',
      tag: 'Технологія 2027',
    },
  ];

  // Initialize selected IDs from prop or default to first 3
  const initialIds = selectedProductIds && selectedProductIds.length > 0
    ? selectedProductIds
    : ['catl-tener-h', 'catl-tener-s', 'catl-enerone-plus'];

  const [activeProductIds, setActiveProductIds] = useState<string[]>(initialIds);

  const displayedProducts = allComparisonProducts.filter((p) => activeProductIds.includes(p.id));

  const toggleProduct = (id: string) => {
    if (activeProductIds.includes(id)) {
      if (activeProductIds.length > 1) {
        setActiveProductIds(activeProductIds.filter((item) => item !== id));
      }
    } else {
      if (activeProductIds.length < 4) {
        setActiveProductIds([...activeProductIds, id]);
      }
    }
  };

  const handleSelectProductClick = (id: string) => {
    if (onSelectProduct) onSelectProduct(id);
    onNavigate('product');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">Головна</button>
            <span>/</span>
            <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors cursor-pointer">Продукти</button>
            <span>/</span>
            <span className="text-white font-bold">Порівняння BESS систем</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                CATL BENCHMARK MATRIX
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Порівняння систем накопичення CATL
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Детальний технічний аналіз ключових моделей промислових BESS для точного вибору під масштаб вашого проекту.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenRfq('Запит техніко-економічного аналізу порівняння BESS')}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25 min-h-[44px]"
              >
                <span>Замовити підбір інженера</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Model Selector Pills */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-xs font-mono text-neutral-400 mb-2">
              Оберіть моделі для порівняння (від 1 до 4):
            </div>
            <div className="flex flex-wrap gap-2">
              {allComparisonProducts.map((p) => {
                const isSelected = activeProductIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[38px] ${
                      isSelected
                        ? 'bg-blue-600/30 border border-blue-400 text-white shadow-sm'
                        : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-neutral-600'}`} />
                    <span>{p.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">({p.capacity})</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Swipe Hint */}
          <div className="flex items-center justify-between text-[11px] font-mono text-blue-300 mb-3 sm:hidden">
            <span>⇄ Проведіть пальцем вправо/вліво для перегляду</span>
            <span className="text-neutral-400">{displayedProducts.length} системи обрано</span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-[#0e1424]/95 shadow-2xl">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              
              {/* Product Header Row */}
              <thead>
                <tr className="border-b border-white/10 bg-black/50">
                  <th className="p-4 font-mono text-neutral-400 font-bold uppercase tracking-wider w-48 sm:w-60 sticky left-0 bg-[#090f1d] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.4)]">
                    Характеристика
                  </th>
                  {displayedProducts.map((p) => (
                    <th key={p.id} className="p-4 min-w-[190px] text-center align-top border-l border-white/10">
                      <div className="h-20 flex items-center justify-center mb-2">
                        <CatlContainerGraphic type={p.type as any} className="w-full h-16" />
                      </div>
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold mb-1">
                        {p.tag}
                      </div>
                      <div className="font-display text-sm sm:text-base font-black text-white">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {p.series}
                      </div>
                      <div className="mt-3 flex flex-col gap-1.5">
                        <button
                          onClick={() => handleSelectProductClick(p.id)}
                          className="w-full py-1.5 px-3 rounded-lg bg-[#0077ff] text-white font-bold text-[11px] hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          Детальніше про модель →
                        </button>
                        <button
                          onClick={() => onOpenRfq(`Комерційна пропозиція на ${p.name}`)}
                          className="w-full py-1.5 px-3 rounded-lg bg-white/10 text-white font-semibold text-[11px] hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          Запитати КП
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specs Rows */}
              <tbody className="divide-y divide-white/10 text-neutral-200">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Номінальна ємність
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-bold text-blue-400 font-mono text-sm border-l border-white/10">
                      {p.capacity}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Форм-фактор / Габарити
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center text-neutral-300 text-xs border-l border-white/10">
                      {p.footprint}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Хімічний склад (Chemistry)
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono text-neutral-200 border-l border-white/10">
                      {p.cellType}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Ресурс та життєвий цикл
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-semibold text-emerald-400 border-l border-white/10">
                      {p.cycleLife}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Деградація перші роки
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center text-blue-300 font-bold border-l border-white/10">
                      {p.degradation}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Система охолодження
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center text-neutral-300 border-l border-white/10">
                      {p.cooling}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Пожежна безпека та захист
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center text-neutral-300 text-xs border-l border-white/10">
                      {p.safety}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Номінальна напруга DC
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono text-neutral-300 border-l border-white/10">
                      {p.voltage}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    C-Rate (швидкість розряду)
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono text-neutral-300 border-l border-white/10">
                      {p.cRate}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white sticky left-0 bg-[#0e1424] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                    Сертифікація
                  </td>
                  {displayedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono text-xs text-neutral-400 border-l border-white/10">
                      {p.standards}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action bottom banner */}
          <div className="mt-8 p-6 rounded-2xl bg-[#0e1528] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-display text-base font-bold text-white">
                Потрібна детальна однолінійна схема та ТЕО під ваш об'єкт?
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Інженерний відділ виконає розрахунок окупності та підбере оптимальну конфігурацію PCS та трансформатора.
              </p>
            </div>
            <button
              onClick={() => onOpenRfq('Запит індивідуального ТКП на основі порівняння')}
              className="rounded-full bg-[#0077ff] px-6 py-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
            >
              Замовити індивідуальний розрахунок →
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
