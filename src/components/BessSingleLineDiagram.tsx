import React, { useState } from 'react';
import { Cpu, Zap, ShieldCheck, ArrowRight, Info, CheckCircle2, ChevronRight } from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  voltage: string;
  role: string;
  standards: string;
  parameters: Record<string, string>;
}

export const BessSingleLineDiagram: React.FC = () => {
  const [selectedComponentId, setSelectedComponentId] = useState<string>('transformer');

  const components: Record<string, ComponentDetail> = {
    grid: {
      id: 'grid',
      name: 'Точка приєднання до зовнішньої мережі (РУ-10 кВ)',
      voltage: '10,000 V (трифазна змінна)',
      role: 'Межа балансової належності з оператором системи розподілу (ОСР / Обленерго).',
      standards: 'Кодекс систем розподілу України, ДСТУ EN 50160',
      parameters: {
        'Клас напруги': '10 кВ ± 10%',
        'Струм КЗ (номінальний)': '20 кА (термічна стійкість 3с)',
        'Комерційний облік': 'Лічильник класу 0.2S з телеметрією ЛУЗОД/АСКОЕ',
      },
    },
    breaker: {
      id: 'breaker',
      name: 'Вакуумний вимикач введення ВВ-10 кВ з мікропроцесорним РЗА',
      voltage: '10 кВ',
      role: 'Миттєве відключення та захист від струмів короткого замикання за час менше 40 мс.',
      standards: 'ДСТУ 3020, IEC 62271-100',
      parameters: {
        'Номінальний струм': '630 А / 1250 А',
        'Струм відключення': '20 кА / 31.5 кА',
        'Релейний захист': 'МТЗ, струмова відсічка, захист від замикань на землю',
      },
    },
    transformer: {
      id: 'transformer',
      name: 'Силовий блоковий трансформатор ТМГ 10/0.4 кВ',
      voltage: '10 / 0.4 кВ',
      role: 'Узгодження напруги низьковольтного перетворювача PCS із заводською мережею 10 кВ.',
      standards: 'ДСТУ 21021, IEC 60076',
      parameters: {
        'Номінальна потужність': '1,000 кВА – 2,500 кВА',
        'Схема з’єднання обмоток': 'Dyn11 (зірка з нейтраллю)',
        'Напруга КЗ (u_k)': '6.0%',
        'Втрати холостого ходу': 'Знижені екологічні втрати EcoDesign Tier 2',
      },
    },
    pcs: {
      id: 'pcs',
      name: 'Двонаправлений перетворювач напруги (PCS) 4-Quadrant',
      voltage: 'AC 400 V ↔ DC 1000–1500 V',
      role: 'Перетворення AC/DC з функцією формування сітки (Grid-Forming) та чорного пуску (Black Start).',
      standards: 'IEC 62477-1, ДСТУ EN 50549-2',
      parameters: {
        'ККД перетворення': '≥ 98.8%',
        'Час перемикання': '< 15 мс (Seamless Islanding)',
        'Коефіцієнт потужності': 'Регульований від -0.8 до +0.8 (компенсація реактиву)',
        'Гармонійні спотворення (THDi)': '< 2.5% при номіналі',
      },
    },
    dc_bus: {
      id: 'dc_bus',
      name: 'DC Шина постійного струму та блоки запобіжників',
      voltage: '1004 V – 1498 V DC',
      role: 'Збір постійного струму від акумуляторних стійок CATL до вхідного каскаду інвертора.',
      standards: 'UL 1973, IEC 60947-3',
      parameters: {
        'Номінальна напруга DC': '1331.2 V',
        'Швидкодіючі запобіжники': '1000 А aR для захисту напівпровідників PCS',
        'Контроль ізоляції': 'Постійний моніторинг витоку на землю (IMD)',
      },
    },
    battery: {
      id: 'battery',
      name: 'Акумуляторні кластери CATL LFP (Cell-to-Pack)',
      voltage: '1331.2 V DC (Номінал)',
      role: 'Електрохімічне накопичення енергії в негорючих LFP комірках із рідинним терморегулюванням.',
      standards: 'UL 9540A, NFPA 855, IEC 62619',
      parameters: {
        'Хімічний склад': 'Lithium Iron Phosphate (LiFePO4)',
        'Ресурс комірок': '15 000+ циклів (5 років 0% деградації)',
        'Теплове поле': 'Рідинний контур, ΔT між комірками ≤ 2.5°C',
        'Пожежогасіння': 'Датчики раннього детектування H2/CO + Novec 1230',
      },
    },
  };

  const selected = components[selectedComponentId] || components.transformer;

  return (
    <section id="schematic" className="py-20 md:py-28 border-b border-white/5 bg-[#0b0c10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Інженерна схемотехніка
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              Інтерактивна однолінійна схема (Single-Line Diagram)
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Типова схема приєднання промислової системи CATL BESS до заводського розподільчого пункту РУ-10 кВ з релейним захистом та вузлом комерційного обліку.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>ДСТУ EN 62271</span>
            <span aria-hidden="true">·</span>
            <span>Dyn11 10/0.4 кВ</span>
            <span aria-hidden="true">·</span>
            <span>Grid-Forming</span>
          </div>
        </div>

        {/* Interactive Diagram Canvas + Component Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: Interactive Schematic Flow */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 text-xs text-neutral-400 font-mono">
              <span>СХЕМА ЕЛЕКТРИЧНА ПРИНЦИПОВА ОДНОЛІНІЙНА</span>
              <span className="text-emerald-400">Натисніть на вузол для аудиту</span>
            </div>

            {/* Visual Schematic Flow */}
            <div className="space-y-4">
              
              {/* Node 1: Grid */}
              <button
                onClick={() => setSelectedComponentId('grid')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedComponentId === 'grid'
                    ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
                    10kV
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Ввід від мережі ОСР (10 кВ)</div>
                    <div className="text-[11px] text-neutral-400">Шафа обліку з трансформаторами струму та напруги</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>

              <div className="flex justify-center">
                <div className="h-4 w-0.5 bg-emerald-400/50" />
              </div>

              {/* Node 2: Breaker */}
              <button
                onClick={() => setSelectedComponentId('breaker')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedComponentId === 'breaker'
                    ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
                    ВВ
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Вакуумний вимикач 10 кВ + РЗА</div>
                    <div className="text-[11px] text-neutral-400">Комутація та миттєвий захист від коротких замикань</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>

              <div className="flex justify-center">
                <div className="h-4 w-0.5 bg-emerald-400/50" />
              </div>

              {/* Node 3: Transformer */}
              <button
                onClick={() => setSelectedComponentId('transformer')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedComponentId === 'transformer'
                    ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs font-mono">
                    ТМГ
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Трансформатор силовий ТМГ 10/0.4 кВ</div>
                    <div className="text-[11px] text-neutral-400">Гальванічна розв'язка та перетворення напруги</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>

              <div className="flex justify-center">
                <div className="h-4 w-0.5 bg-emerald-400/50" />
              </div>

              {/* Node 4: PCS Inverter */}
              <button
                onClick={() => setSelectedComponentId('pcs')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedComponentId === 'pcs'
                    ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs font-mono">
                    PCS
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Двонаправлений перетворювач PCS 400V ↔ DC</div>
                    <div className="text-[11px] text-neutral-400">Інвертування, зарядка/розрядка, Grid-Forming & Black Start</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>

              <div className="flex justify-center">
                <div className="h-4 w-0.5 bg-emerald-400/50" />
              </div>

              {/* Node 5: DC Bus & Batteries */}
              <button
                onClick={() => setSelectedComponentId('battery')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedComponentId === 'battery'
                    ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                    BESS
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Акумуляторний блок CATL LFP (1332 V DC)</div>
                    <div className="text-[11px] text-neutral-400">Комірки CATL, рідкісне охолодження, пожежогасіння Novec</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>

            </div>
          </div>

          {/* Right 5 Cols: Selected Component Deep Technical Dossier */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-7 space-y-5 lg:sticky lg:top-24">
            <div className="border-b border-white/10 pb-3">
              <div className="text-xs font-mono text-emerald-400 mb-1">Інженерний паспорт вузла</div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                {selected.name}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-1">
                <div className="text-neutral-400 font-sans">Робоча напруга:</div>
                <div className="font-mono font-bold text-emerald-300">{selected.voltage}</div>
              </div>

              <div>
                <div className="text-neutral-400 mb-1 font-semibold">Функціональне призначення:</div>
                <p className="text-neutral-300 leading-relaxed">{selected.role}</p>
              </div>

              <div>
                <div className="text-neutral-400 mb-1 font-semibold">Нормативні стандарти:</div>
                <div className="font-mono text-cyan-300 text-[11px]">{selected.standards}</div>
              </div>

              {/* Technical Parameters Table */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Електричні параметри:
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {Object.entries(selected.parameters).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-400 font-sans">{key}:</span>
                      <span className="text-white font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 text-[11px] text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Відповідає ПУЕ та типовим проектам Укренерго</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
