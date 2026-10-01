import React, { useState, useEffect } from 'react';
import {
  Search,
  Check,
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  Sparkles,
  Database,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { CatlContainerGraphic } from './KatlVisualAssets';

interface KatlCatalogPageProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (productName?: string) => void;
  onSelectProduct?: (productId: string) => void;
  compareProductIds?: string[];
  onToggleCompare?: (productId: string) => void;
}

export const KatlCatalogPage: React.FC<KatlCatalogPageProps> = ({
  onNavigate,
  onOpenRfq,
  onSelectProduct,
  compareProductIds,
  onToggleCompare,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localCompare, setLocalCompare] = useState<string[]>(['catl-tener-h', 'catl-tener-s']);
  const [isPimSynced, setIsPimSynced] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/products')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setIsPimSynced(true);
        }
      })
      .catch(() => {
        setIsPimSynced(false);
      });
  }, []);

  const selectedForCompare = compareProductIds || localCompare;

  const toggleCompare = (id: string) => {
    if (onToggleCompare) {
      onToggleCompare(id);
    } else {
      if (localCompare.includes(id)) {
        setLocalCompare(localCompare.filter((item) => item !== id));
      } else {
        if (localCompare.length < 4) {
          setLocalCompare([...localCompare, id]);
        }
      }
    }
  };

  const handleClearCompare = () => {
    if (onToggleCompare) {
      selectedForCompare.forEach((id) => onToggleCompare(id));
    }
    setLocalCompare([]);
  };

  const products = [
    {
      id: 'catl-tener-h',
      name: 'CATL TENER H',
      series: 'Next Generation Utility-Scale ESS',
      tag: 'Utility-scale',
      specs: [
        'До 9.008 МВт·год висока щільність',
        '20 років термін експлуатації',
        'LFP cells безпека',
      ],
      type: 'tener-h',
      segment: 'utility',
    },
    {
      id: 'catl-tener-s',
      name: 'CATL TENER S',
      series: 'Proven Utility-Scale Platform',
      tag: 'Utility-scale',
      specs: [
        'До 6.25 МВт·год 20-ft контейнер',
        '20 років термін експлуатації',
        'LFP cells надійність',
      ],
      type: 'tener-s',
      segment: 'utility',
    },
    {
      id: 'catl-tener-stack',
      name: 'CATL TENER Stack',
      series: 'Modular Utility-Scale ESS',
      tag: 'Utility-scale',
      specs: [
        'До 9 МВт·год модульна система',
        'Гнучка конфігурація кабінетна',
        'LFP cells',
      ],
      type: 'stack',
      segment: 'utility',
    },
    {
      id: 'catl-enerone-plus',
      name: 'CATL EnerOne Plus',
      series: 'Outdoor Cabinet ESS',
      tag: 'C&I',
      specs: [
        'Гнучка ємність 100 кВт — 1+ МВт',
        'Рідинне охолодження висока ефективність',
        'LFP cells',
      ],
      type: 'enerone',
      segment: 'ci',
    },
    {
      id: 'catl-pr-series',
      name: 'CATL PR Series',
      series: 'Residential ESS',
      tag: 'Residential',
      specs: [
        'До 50 кВт·год домашні та малий бізнес',
        'Компактний дизайн тиха робота',
        'LFP cells',
      ],
      type: 'tener-flex',
      segment: 'residential',
    },
    {
      id: 'catl-pu100',
      name: 'CATL PU100',
      series: 'Data Center Backup',
      tag: 'Data Center',
      specs: [
        'Висока потужність для критичних навантажень',
        'Висока надійність 24/7',
        'LFP cells',
      ],
      type: 'tener',
      segment: 'datacenter',
    },
    {
      id: 'catl-tener-sodium',
      name: 'CATL TENER Sodium',
      series: 'Next Generation Sodium-ion ESS',
      tag: 'Sodium-ion',
      specs: [
        'Інноваційна технологія поставки з 06.2027',
        'Широкий температурний діапазон',
        'Sodium-ion cells',
      ],
      type: 'sodium',
      segment: 'sodium',
    },
    {
      id: 'catl-unic-series',
      name: 'CATL UniC Series',
      series: 'Commercial & Industrial ESS',
      tag: 'C&I',
      specs: [
        '100 кВт — 2+ МВт гнучке масштабування',
        'Рідинне охолодження',
        'LFP cells',
      ],
      type: 'enerone',
      segment: 'ci',
    },
    {
      id: 'pcs-inverters',
      name: 'PCS / Інвертори',
      series: 'Grid-forming / Hybrid',
      tag: 'Компоненти',
      specs: [
        '50 кВт — 1+ МВт',
        'Управління мережею BESS, PV',
        'Висока ефективність 98.8%',
      ],
      type: 'stack',
      segment: 'components',
    },
    {
      id: 'ems-scada',
      name: 'EMS / BMS / SCADA',
      series: 'Управління та моніторинг',
      tag: 'Компоненти',
      specs: [
        'Реальний час моніторингу',
        'Прогнозування навантаження',
        'Інтеграція з SCADA',
      ],
      type: 'stack',
      segment: 'components',
    },
    {
      id: 'transformers',
      name: 'Трансформатори та switchgear',
      series: 'MV / LV',
      tag: 'Інфраструктура',
      specs: [
        'Під ключ 10/35 кВ',
        'Сумісність з BESS CATL',
        'Надійні європейські виробники',
      ],
      type: 'tener-flex',
      segment: 'components',
    },
    {
      id: 'cables-mounting',
      name: 'Кабелі та монтаж',
      series: 'Повна інфраструктура',
      tag: 'Аксесуари',
      specs: [
        'Силові кабелі 1-35 кВ',
        'Системи кріплення',
        'Монтажні рішення під ключ',
      ],
      type: 'enerone',
      segment: 'accessories',
    },
  ];

  const filtered = products.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'utility') return p.segment === 'utility';
    if (activeCategory === 'ci') return p.segment === 'ci';
    if (activeCategory === 'residential') return p.segment === 'residential';
    if (activeCategory === 'datacenter') return p.segment === 'datacenter';
    if (activeCategory === 'sodium') return p.segment === 'sodium';
    if (activeCategory === 'components') return p.segment === 'components';
    if (activeCategory === 'accessories') return p.segment === 'accessories';
    return true;
  }).filter((p) => {
    if (!searchQuery) return true;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.series.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      
      {/* 1. Header Banner & Breadcrumbs (Dark top section matching photo 2) */}
      <div className="bg-[#070b14] text-white border-b border-white/10 pt-8 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Продукти</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
                Каталог продуктів
              </h1>
              <p className="text-sm text-neutral-300 mt-1 max-w-xl">
                Повна лінійка рішень CATL для будь-якого масштабу та задачі
              </p>
            </div>

            {/* Right card: TENER H Hero highlight */}
            <div
              onClick={() => onNavigate('product')}
              className="p-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-4"
            >
              <div className="h-12 w-20 flex items-center justify-center">
                <CatlContainerGraphic type="tener-h" className="w-20 h-12" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white">TENER H</div>
                <div className="text-[11px] text-neutral-400">Next Generation Utility-Scale ESS</div>
                <div className="text-[11px] font-bold text-[#0077ff] mt-0.5 flex items-center gap-1">
                  <span>Дізнатись більше</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Feature Badges row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs text-neutral-300">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div>
                <div className="font-bold text-white">Оригінальні технології CATL</div>
                <div className="text-[10px] text-neutral-400">LFP та Sodium-ion</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div>
                <div className="font-bold text-white">Для всіх сегментів</div>
                <div className="text-[10px] text-neutral-400">Utility · C&I · Residential · Data Center</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Wrench className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div>
                <div className="font-bold text-white">Інженерна підтримка</div>
                <div className="text-[10px] text-neutral-400">від вибору до запуску</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div>
                <div className="font-bold text-white">Офіційні поставки</div>
                <div className="text-[10px] text-neutral-400">та партнерство з CATL</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Category Tabs with Badges */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none text-xs font-semibold">
            {[
              { id: 'all', label: 'Всі продукти', count: 32 },
              { id: 'utility', label: 'Utility-scale', count: 8 },
              { id: 'ci', label: 'C&I', count: 6 },
              { id: 'residential', label: 'Residential', count: 4 },
              { id: 'datacenter', label: 'Data Center', count: 3 },
              { id: 'sodium', label: 'Sodium-ion', count: 3 },
              { id: 'components', label: 'Компоненти', count: 8 },
              { id: 'accessories', label: 'Аксесуари', count: 12 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-[#0077ff] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Catalog Main Layout: Sidebar Filters + Products Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 3 Cols: Filter Sidebar */}
          <div className="lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
            
            {/* Header & Reset */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Фільтри</span>
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-[#0077ff] hover:underline text-[11px] font-semibold cursor-pointer"
              >
                Скинути
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук продуктів..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0077ff] focus:outline-none"
              />
            </div>

            {/* Filter Section: Сегмент */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="font-bold text-slate-900 mb-2">Сегмент</div>
              {['Utility-scale (8)', 'C&I (6)', 'Residential (4)', 'Data Center (3)', 'Sodium-ion (3)', 'Компоненти (8)', 'Аксесуари (12)'].map((seg, i) => (
                <label key={i} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 0} className="rounded border-slate-300 text-[#0077ff] focus:ring-0" />
                  <span>{seg}</span>
                </label>
              ))}
            </div>

            {/* Filter Section: Застосування */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="font-bold text-slate-900 mb-2">Застосування</div>
              {['Резервне живлення', 'Зниження піків', 'СЕС + накопичення', 'Мікромережі', 'Grid services', 'Дата-центри', 'EV Charging', 'Промисловість'].map((app, i) => (
                <label key={i} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-[#0077ff] focus:ring-0" />
                  <span>{app}</span>
                </label>
              ))}
            </div>

            {/* Filter Section: Технологія */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="font-bold text-slate-900 mb-2">Технологія</div>
              {['LFP (24)', 'Sodium-ion (3)'].map((tech, i) => (
                <label key={i} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 0} className="rounded border-slate-300 text-[#0077ff] focus:ring-0" />
                  <span>{tech}</span>
                </label>
              ))}
            </div>

            {/* Filter Section: Охолодження */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 mb-2">Система охолодження</div>
              {['Рідинне (15)', 'Повітряне (9)'].map((cool, i) => (
                <label key={i} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 0} className="rounded border-slate-300 text-[#0077ff] focus:ring-0" />
                  <span>{cool}</span>
                </label>
              ))}
            </div>

          </div>

          {/* Right 9 Cols: Product Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Results bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
              <div>
                Знайдено продуктів: <strong className="text-slate-900">{filtered.length}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>Сортувати за:</span>
                <select className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium">
                  <option>Популярністю</option>
                  <option>Потужністю</option>
                  <option>Ємністю</option>
                </select>
              </div>
            </div>

            {/* Cards Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    {/* Image Graphic */}
                    <div className="h-36 flex items-center justify-center bg-slate-50 rounded-xl mb-4 p-2">
                      <CatlContainerGraphic type={prod.type as any} className="w-full h-28" />
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {prod.tag}
                    </span>

                    <h3 className="font-display text-base font-bold text-slate-900 mt-2 mb-0.5 group-hover:text-[#0077ff] transition-colors">
                      {prod.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium mb-3">
                      {prod.series}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      {prod.specs.map((sp, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0077ff]" />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Compare Checkbox */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(prod.id);
                        onNavigate('product');
                      }}
                      className="flex items-center gap-1.5 font-bold text-[#0077ff] hover:underline cursor-pointer"
                    >
                      <span>Детальніше</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <label className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedForCompare.includes(prod.id)}
                        onChange={() => toggleCompare(prod.id)}
                        className="rounded border-slate-300 text-[#0077ff] focus:ring-0"
                      />
                      <span>Порівняти</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom 3 Action Cards (Matching Screenshot 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
              
              {/* Card 1: Порівняйте продукти */}
              <div className="rounded-2xl border border-slate-200 bg-[#080d19] text-white p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-white mb-1">
                    Порівняйте продукти
                  </h4>
                  <p className="text-[11px] text-neutral-400 mb-4">
                    Додайте до 4 систем та порівняйте характеристики, застосування та переваги.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('compare')}
                  className="w-full rounded-xl bg-[#0077ff] py-2.5 px-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Перейти до порівняння →
                </button>
              </div>

              {/* Card 2: BESS Designer */}
              <div className="rounded-2xl border border-slate-200 bg-[#0a1224] text-white p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-white mb-1">
                    Не знаєте що обрати?
                  </h4>
                  <p className="text-[11px] text-neutral-400 mb-4">
                    Пройдіть інтелектуальний підбір системи під ваші задачі за 3 хвилини.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('bess-designer-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="w-full rounded-xl bg-[#0077ff] py-2.5 px-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Запустити BESS Designer →
                </button>
              </div>

              {/* Card 3: Індивідуальна конфігурація */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-white mb-1">
                    Потрібна індивідуальна конфігурація?
                  </h4>
                  <p className="text-[11px] text-neutral-400 mb-4">
                    Отримайте технічну пропозицію від наших інженерів під ваш проєкт.
                  </p>
                </div>
                <button
                  onClick={() => onOpenRfq()}
                  className="w-full rounded-xl bg-[#0077ff] py-2.5 px-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Запитати про проект →
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Floating Compare Dock */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto rounded-full border border-white/20 bg-[#0e162a]/95 backdrop-blur-xl px-5 py-3 shadow-2xl flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077ff] text-white font-mono font-bold text-[11px]">
                {selectedForCompare.length}
              </span>
              <span className="text-white font-semibold">
                Обрано для порівняння ({selectedForCompare.length}/4)
              </span>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearCompare}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                Очистити
              </button>
              <button
                onClick={() => onNavigate('compare')}
                className="rounded-full bg-[#0077ff] px-4 py-1.5 font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>Порівняти системи</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
