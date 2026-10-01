import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Check,
  Shield,
  Infinity,
  Cpu,
  Wrench,
  Headphones,
  Globe,
  Battery,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sun,
  Zap,
  Building,
  Server,
  Truck,
  RotateCcw,
  Download,
  CheckCircle2,
  FileText,
  HelpCircle,
  ExternalLink,
  Flame,
  Thermometer,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { CatlContainerGraphic } from './KatlVisualAssets';

interface KatlHomePageProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (prefilledNote?: string) => void;
  onSelectProduct?: (productId: string) => void;
  onOpenVideo?: () => void;
  onOpenBom?: () => void;
  onOpenProposal?: () => void;
}

export const KatlHomePage: React.FC<KatlHomePageProps> = ({
  onNavigate,
  onOpenRfq,
  onSelectProduct,
  onOpenVideo,
  onOpenBom,
  onOpenProposal,
}) => {
  // State hooks
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [heroSlide, setHeroSlide] = useState(0);

  // Live Sizing state in BESS Designer card
  const [calcSolarMw, setCalcSolarMw] = useState<number>(1.5);
  const [calcLoadMw, setCalcLoadMw] = useState<number>(1.2);
  const [calcDurationH, setCalcDurationH] = useState<number>(2);

  const calculatedCapacityMwh = Number((calcLoadMw * calcDurationH).toFixed(1));
  const calculatedSavingsPct = Math.min(52, Math.round(30 + calcSolarMw * 3.5 + (calcDurationH === 4 ? 6 : 0)));
  const calculatedPayback = Math.max(2.8, Number((4.6 - calcSolarMw * 0.25 - (calcDurationH === 4 ? 0.3 : 0)).toFixed(1)));
  const calculatedIrr = Number((16.2 + calcSolarMw * 1.4 + (calcDurationH === 4 ? 1.6 : 0)).toFixed(1));

  // Flagship carousel slides matching photo
  const heroSlides = [
    {
      id: 'catl-tener-h',
      tag: 'FLAGSHIP',
      title: 'TENER H',
      subtitle: 'Next Generation Utility-Scale ESS',
      capacity: '9.008 МВт·год',
      capacityNote: 'на 20-фут. контейнер',
      lifespan: '20 років',
      lifespanNote: 'термін експлуатації',
      cell: '575 Ah LFP cells',
      cellNote: 'надвисока щільність',
      mgmt: 'AI Smart O&M',
      mgmtNote: 'цифрове управління',
      type: 'tener-h',
    },
    {
      id: 'catl-tener-s',
      tag: 'STANDARD',
      title: 'TENER S',
      subtitle: 'Proven Utility-Scale Platform',
      capacity: '6.25 МВт·год',
      capacityNote: '20-футовий контейнер',
      lifespan: '15 000 циклів',
      lifespanNote: '0% деградація (5 років)',
      cell: '314 Ah LFP cells',
      cellNote: 'перевірена безпека',
      mgmt: 'Liquid Cooling ΔT≤2.5°C',
      mgmtNote: 'двоконтурна система',
      type: 'tener-s',
    },
    {
      id: 'catl-tener-stack',
      tag: 'MODULAR',
      title: 'TENER Stack',
      subtitle: 'Modular Stackable Cabinet ESS',
      capacity: 'До 9.0 МВт·год',
      capacityNote: 'модульна архітектура',
      lifespan: '12 000 циклів',
      lifespanNote: 'довговічний ресурс',
      cell: 'CTP Module Cells',
      cellNote: 'безмодульна компоновка',
      mgmt: 'Rack-Level Control',
      mgmtNote: 'автономний захист шаф',
      type: 'stack',
    },
    {
      id: 'catl-enerone-plus',
      tag: 'C&I CHOICE',
      title: 'EnerOne Plus',
      subtitle: 'Outdoor Cabinet ESS для бізнесу',
      capacity: '372.7 кВт·год',
      capacityNote: 'на одну зовнішню шафу',
      lifespan: '10 000+ циклів',
      lifespanNote: 'до 15 років роботи',
      cell: '280 / 314 Ah LFP',
      cellNote: 'високий ККД > 94%',
      mgmt: 'All-In-One Outdoor',
      mgmtNote: 'площа всього 1.3 м²',
      type: 'enerone',
    },
    {
      id: 'catl-tener-sodium',
      tag: 'FUTURE TECH',
      title: 'TENER Sodium',
      subtitle: 'Sodium-ion Utility-Scale (Global 2027)',
      capacity: 'Висока потужність',
      capacityNote: 'миттєвий відгук 4C',
      lifespan: '-40°C ... +60°C',
      lifespanNote: 'без підігріву взимку',
      cell: 'Na-ion CATL Gen 2',
      cellNote: 'доступна сировина',
      mgmt: 'Multi-chemistry EMS',
      mgmtNote: 'зелена енергетика',
      type: 'sodium',
    },
  ];

  const currentSlide = heroSlides[heroSlide];

  // Products array matching photo 1
  const catalogProducts = [
    {
      id: 'catl-tener',
      name: 'TENER',
      series: 'Utility-scale',
      desc: 'До 6.25 МВт·год\n20-фут. контейнер',
      type: 'tener',
      category: 'utility',
    },
    {
      id: 'catl-tener-s',
      name: 'TENER S',
      series: 'Utility-scale',
      desc: '20 років\nтермін експлуатації',
      type: 'tener-s',
      category: 'utility',
    },
    {
      id: 'catl-tener-h',
      name: 'TENER H',
      series: 'Utility-scale',
      desc: 'До 9.008 МВт·год\nвисока щільність',
      type: 'tener-h',
      category: 'utility',
      isFlagship: true,
    },
    {
      id: 'catl-tener-stack',
      name: 'TENER Stack',
      series: 'Utility-scale',
      desc: 'До 9 МВт·год\nмодульна система',
      type: 'stack',
      category: 'utility',
    },
    {
      id: 'catl-tener-flex',
      name: 'TENER Flex',
      series: 'Utility-scale',
      desc: 'Гнучка конфігурація\nкабінетна система',
      type: 'tener-flex',
      category: 'utility',
    },
    {
      id: 'catl-tener-sodium',
      name: 'TENER Sodium',
      series: 'Utility-scale',
      desc: 'Натрій-іонна технологія\nГлобально з 06.2027',
      type: 'sodium',
      category: 'sodium',
      badge: 'Coming 2027',
    },
    {
      id: 'catl-enerone-plus',
      name: 'EnerOne Plus',
      series: 'C&I',
      desc: 'Outdoor cabinet\nрідинне охолодження',
      type: 'enerone',
      category: 'ci',
    },
  ];

  const filteredProducts = catalogProducts.filter((p) => {
    if (selectedProductCategory === 'all') return true;
    if (selectedProductCategory === 'utility') return p.category === 'utility';
    if (selectedProductCategory === 'ci') return p.category === 'ci';
    if (selectedProductCategory === 'sodium') return p.category === 'sodium';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#06080e] text-white">
      
      {/* 1. HERO SECTION (Exact layout from Screenshot 1) */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#080d1a] via-[#091122] to-[#06080e]">
        
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#06080e] via-[#06080e]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 7 Cols: Headline & Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Partner Ecosystem Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-mono tracking-wider uppercase text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-[#0077ff] animate-pulse" />
                <span>CATL OFFICIAL TECHNOLOGY PARTNER ECOSYSTEM</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] [text-wrap:balance]">
                Енергія <br />
                під контролем. <br />
                Сильніша <span className="text-[#0091ff]">Україна.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed font-sans">
                Комплексні системи накопичення енергії CATL для бізнесу, промисловості, генерації та критичної інфраструктури. Проектування. Поставка. Монтаж. Сервіс.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('bess-designer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0066ee] transition-all cursor-pointer shadow-lg shadow-blue-500/25"
                >
                  <span>Розрахувати BESS</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    if (onOpenVideo) onOpenVideo();
                    else onNavigate('product');
                  }}
                  className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current text-white" />
                  <span>Дивитись відео (2 хв)</span>
                </button>
              </div>

            </div>

            {/* Right 5 Cols: Floating CATL TENER Card with Carousel Pagination */}
            <div className="lg:col-span-5 flex justify-end">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0e1424]/80 p-6 sm:p-7 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-wider">
                    CATL
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold">
                    {currentSlide.tag}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-black text-white">
                  {currentSlide.title}
                </h3>
                <div className="text-xs text-neutral-400 font-medium mt-0.5 mb-5">
                  {currentSlide.subtitle}
                </div>

                {/* 4 Feature Items */}
                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white">{currentSlide.capacity}</span>
                      <span className="text-neutral-400 ml-1.5">{currentSlide.capacityNote}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white">{currentSlide.lifespan}</span>
                      <span className="text-neutral-400 ml-1.5">{currentSlide.lifespanNote}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Battery className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white">{currentSlide.cell}</span>
                      <span className="text-neutral-400 ml-1.5">{currentSlide.cellNote}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white">{currentSlide.mgmt}</span>
                      <span className="text-neutral-400 ml-1.5">{currentSlide.mgmtNote}</span>
                    </div>
                  </div>
                </div>

                {/* Pagination bar */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-neutral-400">
                  <span>0{heroSlide + 1} / 0{heroSlides.length}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHeroSlide((prev) => (prev > 0 ? prev - 1 : heroSlides.length - 1))}
                      className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-white cursor-pointer transition-colors"
                      title="Попередній продукт"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setHeroSlide((prev) => (prev < heroSlides.length - 1 ? prev + 1 : 0))}
                      className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-white cursor-pointer transition-colors"
                      title="Наступний продукт"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(currentSlide.id);
                        onNavigate('product');
                      }}
                      className="h-8 w-8 rounded-full bg-[#0077ff] flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
                      title="Детальніше про модель"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Feature Ticker Ribbon at bottom of Hero */}
        <div className="relative z-10 w-full border-t border-white/10 bg-[#080d19]/90 backdrop-blur-md py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs font-medium text-neutral-300">
              
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0077ff] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] leading-tight">Надійність LFP та Sodium-ion</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0077ff] shrink-0">
                  <Infinity className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] leading-tight">До 20+ років експлуатації</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0077ff] shrink-0">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] leading-tight">Повна інтеграція BESS + PCS + EMS</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0077ff] shrink-0">
                  <Wrench className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] leading-tight">Інженерна підтримка від 10 кВт до 100+ МВт</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0077ff] shrink-0">
                  <Headphones className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] leading-tight">Сервіс 24/7 в Україні</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0077ff] shrink-0">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] leading-tight">Офіційні поставки та партнерство з CATL</span>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* 2. ЛІНІЙКА CATL ENERGY STORAGE (White Cards Layout) */}
      <section className="py-20 bg-[#f8fafc] text-slate-900 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                Лінійка CATL Energy Storage
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Повна екосистема рішень для будь-якого масштабу
              </p>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0077ff] hover:underline cursor-pointer"
            >
              <span>Весь каталог</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-10 text-xs font-semibold">
            {[
              { id: 'all', label: 'Всі продукти' },
              { id: 'utility', label: 'Utility-scale' },
              { id: 'ci', label: 'C&I' },
              { id: 'residential', label: 'Residential' },
              { id: 'datacenter', label: 'Data Center' },
              { id: 'sodium', label: 'Sodium-ion' },
              { id: 'accessories', label: 'Аксесуари' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedProductCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                  selectedProductCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Container 3D Render Graphic */}
                  <div className="h-28 flex items-center justify-center mb-3">
                    <CatlContainerGraphic type={p.type as any} className="w-full h-24" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-600 font-bold">
                      {p.series}
                    </span>
                    {p.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-sm font-bold text-slate-900 mt-1 mb-1 group-hover:text-[#0077ff] transition-colors">
                    {p.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 whitespace-pre-line leading-snug">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(p.id);
                      onNavigate('product');
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#0077ff] hover:underline cursor-pointer"
                  >
                    <span>Детальніше</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. РІШЕННЯ ДЛЯ РІЗНИХ ЗАДАЧ (7 Dark Cards Grid) */}
      <section id="solutions-section" className="py-20 bg-[#080b12] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Рішення для різних задач
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Оберіть сценарій та отримайте готову конфігурацію
              </p>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0077ff] hover:underline cursor-pointer"
            >
              <span>Всі рішення</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {[
              { title: 'Резервне живлення', desc: 'Стабільність бізнесу під час відключень', icon: Zap },
              { title: 'Зниження пікових навантажень', desc: 'Економія на тарифах', icon: RotateCcw },
              { title: 'СЕС + накопичення', desc: 'Максимальна ефективність', icon: Sun },
              { title: 'Дата-центри', desc: 'Надійність для AI та критичної інфраструктури', icon: Server },
              { title: 'Комерційні об\'єкти', desc: 'Склади, ритейл, готелі', icon: Building },
              { title: 'EV Charging + BESS', desc: 'Зарядна інфраструктура без перевантаження мереж', icon: Battery },
              { title: 'Мікромережі', desc: 'Енергетична незалежність', icon: Globe },
            ].map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onOpenRfq(`Сценарій: ${sol.title}`)}
                  className="rounded-xl border border-white/10 bg-[#0e1322] p-4 flex flex-col justify-between hover:border-blue-500/50 hover:bg-[#12192c] transition-all cursor-pointer group"
                >
                  <div>
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0077ff] mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-xs font-bold text-white mb-1.5 leading-snug">
                      {sol.title}
                    </h3>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      {sol.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 flex justify-end">
                    <span className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-[#0077ff] group-hover:text-white transition-colors">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. BESS DESIGNER (Matching Screenshot 1) */}
      <section id="bess-designer-section" className="py-20 bg-[#06080e] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#0d1424] via-[#0b101c] to-[#080d18] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Sizing Steps & Action */}
              <div className="lg:col-span-4 space-y-5">
                <div>
                  <h3 className="font-display text-2xl font-black text-white">
                    BESS Designer
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    Розрахуйте оптимальне рішення за кілька кроків
                  </p>
                </div>

                {/* 5 Steps */}
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 rounded-full bg-[#0077ff] text-white text-[11px] font-bold items-center justify-center shrink-0">1</span>
                    <span className="text-neutral-200">Вкажіть параметри об'єкта</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 rounded-full bg-white/10 text-neutral-400 text-[11px] font-bold items-center justify-center shrink-0">2</span>
                    <span className="text-neutral-300">Завантажте профіль споживання</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 rounded-full bg-white/10 text-neutral-400 text-[11px] font-bold items-center justify-center shrink-0">3</span>
                    <span className="text-neutral-300">Отримайте підбір системи CATL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 rounded-full bg-white/10 text-neutral-400 text-[11px] font-bold items-center justify-center shrink-0">4</span>
                    <span className="text-neutral-300">Фінансова модель (ROI, TCO, IRR)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 rounded-full bg-white/10 text-neutral-400 text-[11px] font-bold items-center justify-center shrink-0">5</span>
                    <span className="text-neutral-300">Звіт у форматі PDF</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenRfq('Розрахунок у BESS Designer')}
                    className="flex items-center gap-2 rounded-full bg-[#0077ff] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    <span>Почати розрахунок</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('compare')}
                    className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-white/10 cursor-pointer"
                  >
                    <span>Демо-приклад</span>
                  </button>
                </div>
              </div>

              {/* Center Column: System Diagram & Interactive Sliders */}
              <div className="lg:col-span-4 bg-black/40 rounded-2xl border border-white/10 p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs text-center font-mono">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-amber-400 font-bold">{calcSolarMw} MW</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Сонячна станція (СЕС)</div>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <div className="text-blue-300 font-bold">{calculatedCapacityMwh} MWh</div>
                    <div className="text-[10px] text-blue-200 mt-0.5">BESS ({calcDurationH} год)</div>
                  </div>
                </div>

                {/* Interactive Sliders */}
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                      <span>Пікове навантаження об'єкта:</span>
                      <strong className="text-white font-mono">{calcLoadMw} MW</strong>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="5.0"
                      step="0.1"
                      value={calcLoadMw}
                      onChange={(e) => setCalcLoadMw(parseFloat(e.target.value))}
                      className="w-full accent-[#0077ff] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                      <span>Потужність генерації СЕС:</span>
                      <strong className="text-amber-400 font-mono">{calcSolarMw} MW</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6.0"
                      step="0.5"
                      value={calcSolarMw}
                      onChange={(e) => setCalcSolarMw(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-neutral-400">Цільова тривалість розряду:</span>
                    <div className="flex gap-1.5">
                      {[2, 4].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setCalcDurationH(h)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                            calcDurationH === h
                              ? 'bg-[#0077ff] text-white'
                              : 'bg-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {h} години
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs space-y-0.5">
                  <div className="font-bold text-white text-[11px]">Підключення до РУ-10(35) кВ</div>
                  <div className="text-[10px] text-neutral-400">Автономний острівний режим + підтримка мережі</div>
                </div>
              </div>

              {/* Right Column: Calculated Results Card */}
              <div className="lg:col-span-4 rounded-2xl border border-blue-500/30 bg-[#0d162a] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-white">Розрахована конфігурація</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    CATL Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <div className="text-neutral-400 text-[10px]">Рекомендована потужність:</div>
                    <div className="text-lg font-bold text-white">{calcLoadMw} MW</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-[10px]">Рекомендована ємність:</div>
                    <div className="text-lg font-bold text-blue-400">{calculatedCapacityMwh} MWh</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-[10px]">Тривалість розряду:</div>
                    <div className="text-sm font-bold text-white">{calcDurationH} h</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-[10px]">Рекомендована серія:</div>
                    <div className="text-xs font-bold text-neutral-200">
                      {calculatedCapacityMwh >= 5 ? 'CATL TENER' : 'CATL EnerOne Plus'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
                  <div className="p-2 bg-black/40 rounded-lg">
                    <div className="text-emerald-400 font-bold text-sm">-{calculatedSavingsPct}%</div>
                    <div className="text-[9px] text-neutral-400">економія</div>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg">
                    <div className="text-white font-bold text-sm">{calculatedPayback} р.</div>
                    <div className="text-[9px] text-neutral-400">окупність</div>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg">
                    <div className="text-blue-300 font-bold text-sm">{calculatedIrr}%</div>
                    <div className="text-[9px] text-neutral-400">IRR</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (onOpenProposal) onOpenProposal();
                      else onOpenRfq(`Розрахунок BESS: ${calcLoadMw} MW / ${calculatedCapacityMwh} MWh`);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0077ff] py-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
                  >
                    <span>Отримати повний звіт ТКП (PDF)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {onOpenBom && (
                    <button
                      onClick={onOpenBom}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Переглянути специфікацію (BOM)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. ПОВНА ЕКОСИСТЕМА РІШЕНЬ (Infrastructure Overview) */}
      <section className="py-20 bg-[#080d19] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Повна екосистема рішень
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Не тільки батареї, а комплексна інфраструктура для вашого проекту
              </p>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0077ff] hover:underline cursor-pointer"
            >
              <span>Весь каталог</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 text-xs font-semibold">
            {['Загальна схема', 'Електрична частина', 'Системи керування', 'Безпека', 'Термоменеджмент', 'Сервіс'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                  i === 0 ? 'bg-white text-black font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 3-Column Ecosystem Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 4 Cols: Primary Equipment List */}
            <div className="lg:col-span-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Сонячні модулі</div>
                  <div className="text-[11px] text-neutral-400">та кріплення</div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-500" />
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">PCS / Інвертори</div>
                  <div className="text-[11px] text-neutral-400">50 кВт — 1+ МВт</div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-500" />
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">EMS / BMS / SCADA</div>
                  <div className="text-[11px] text-neutral-400">Управління та моніторинг</div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-500" />
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Трансформатори</div>
                  <div className="text-[11px] text-neutral-400">та switchgear</div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-500" />
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Кабелі та монтаж</div>
                  <div className="text-[11px] text-neutral-400">Повна інфраструктура</div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-500" />
              </div>
            </div>

            {/* Center 4 Cols: Container Visual */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/10">
              <CatlContainerGraphic type="tener-h" className="w-full h-44" />
              <div className="text-center mt-3">
                <div className="font-display text-sm font-bold text-white">CATL BESS CONTAINER</div>
                <div className="text-[11px] text-blue-400 font-mono">Центральний елемент комплексу</div>
              </div>
            </div>

            {/* Right 4 Cols: Safety, Thermal & Service */}
            <div className="lg:col-span-4 space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Системи безпеки</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Пожежна сигналізація, газові системи Novec 1230
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-cyan-400" />
                  <span>Термоменеджмент</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Liquid cooling, HVAC прецизійні контури
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-emerald-400" />
                  <span>Сервіс та підтримка</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Проектування, монтаж, гарантійне обслуговування О&М
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. РЕАЛЬНІ ПРОЕКТИ У СВІТІ ТА В УКРАЇНІ (6 Cards) */}
      <section id="projects-section" className="py-20 bg-[#06080e] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Реальні проекти у світі та в Україні
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                BESS-рішення CATL у різних галузях
              </p>
            </div>

            <button
              onClick={() => onOpenRfq('Запит референс-листа проектів')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0077ff] hover:underline cursor-pointer"
            >
              <span>Всі проекти</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-10 text-xs font-semibold">
            {['Всі', 'Україна', 'Європа', 'Азія', 'Дата-центри', 'Промисловість'].map((filter, i) => (
              <button
                key={filter}
                onClick={() => setSelectedProjectFilter(filter)}
                className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                  (i === 0 && selectedProjectFilter === 'all') || selectedProjectFilter === filter
                    ? 'bg-[#0077ff] text-white font-bold'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { cap: '200 МВт·год', title: 'Grid-scale BESS', geo: 'Європа' },
              { cap: '100 МВт·год', title: 'Сонячна станція + BESS', geo: 'Азія' },
              { cap: '50 МВт·год', title: 'Стабілізація мережі', geo: 'Європа' },
              { cap: '20 МВт·год', title: 'Промислове підприємство', geo: 'Україна' },
              { cap: 'C&I 5 МВт·год', title: 'Логістичний центр', geo: 'Україна' },
              { cap: '2 МВт·год', title: 'Дата-центр', geo: 'Україна' },
            ].map((proj, idx) => (
              <div
                key={idx}
                onClick={() => onOpenRfq(`Запит деталей проекту: ${proj.cap} ${proj.title}`)}
                className="rounded-2xl border border-white/10 bg-[#0e1424] p-5 flex flex-col justify-between hover:border-blue-500/50 hover:bg-[#121a30] transition-all cursor-pointer group"
              >
                <div>
                  <div className="h-20 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                    <CatlContainerGraphic type="tener" className="w-24 h-16" />
                  </div>
                  <div className="font-display text-base font-bold text-white mb-1">
                    {proj.cap}
                  </div>
                  <div className="text-xs text-neutral-300 font-medium">
                    {proj.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    {proj.geo}
                  </div>
                </div>

                <div className="pt-4 mt-2 flex justify-end">
                  <span className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-[#0077ff] group-hover:text-white transition-colors">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. ГОТОВІ РЕАЛІЗУВАТИ ВАШ ЕНЕРГЕТИЧНИЙ ПРОЕКТ? (CTA Banner) */}
      <section className="py-20 bg-gradient-to-r from-[#070b16] via-[#091124] to-[#070b16] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-white/15 bg-[#0e162a]/90 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Col */}
              <div className="lg:col-span-7 space-y-5">
                <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                  Готові реалізувати ваш енергетичний проект?
                </h2>
                <p className="text-sm text-neutral-300 max-w-lg leading-relaxed">
                  Отримайте консультацію та інженерний розрахунок від наших експертів.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => onOpenRfq()}
                    className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    <span>Запитати про проект</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onOpenRfq('Зв\'язатися з нами')}
                    className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <span>Зв'язатися з нами</span>
                  </button>
                </div>
              </div>

              {/* Right Col: Process checklist */}
              <div className="lg:col-span-5 space-y-3 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                  <span>Технічна консультація</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                  <span>Підбір рішення CATL</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                  <span>Комерційна пропозиція</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                  <span>Поставка та митне оформлення</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#0077ff] shrink-0" />
                  <span>Сервісна підтримка</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
