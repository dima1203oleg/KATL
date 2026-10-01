import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Download,
  Play,
  Check,
  CheckCircle2,
  Shield,
  Layers,
  Wrench,
  Globe,
  Battery,
  Calendar,
  Zap,
  Box,
  FileText,
  RotateCw,
  Eye,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building,
  Server,
  Sun,
  Award,
  Sparkles,
  Database,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { CatlContainerGraphic, ArchitectureFlowGraphic } from './KatlVisualAssets';
import { getTitanProductById, titanProductsList, TitanProduct } from '../../data/titanPlatformData';

interface KatlProductDetailPageProps {
  productId?: string;
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (productName?: string) => void;
  onSelectProduct?: (productId: string) => void;
  onOpenVideo?: () => void;
}

export const KatlProductDetailPage: React.FC<KatlProductDetailPageProps> = ({
  productId = 'catl-tener-h',
  onNavigate,
  onOpenRfq,
  onSelectProduct,
  onOpenVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'arch' | 'models' | 'apps' | 'docs'>('overview');
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'photo'>('3d');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [pimData, setPimData] = useState<{
    provenance?: {
      sourceUrl?: string;
      verifiedAt?: string;
      verifiedBy?: string;
      confidence?: string;
    };
  } | null>(null);

  const product = getTitanProductById(productId);

  useEffect(() => {
    fetch(`/api/v1/products/${productId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.provenance) {
          setPimData(d);
        }
      })
      .catch(() => {});
  }, [productId]);

  const viewAngles = [
    { title: 'Ізометричний вигляд', note: 'Загальна компоновка 20ft / Outdoor' },
    { title: 'Фронтальний доступ', note: 'Обслуговування без демонтажу' },
    { title: 'Внутрішні стійки LFP', note: 'Прецизійні модулі Cell-to-Pack' },
    { title: 'Рідкісний термоконтур', note: 'Двоконтурна система охолодження' },
  ];

  const handleTabClick = (tabId: 'overview' | 'specs' | 'arch' | 'models' | 'apps' | 'docs') => {
    setActiveTab(tabId);
    const elementMap: Record<string, string> = {
      overview: 'section-overview',
      specs: 'section-specs',
      arch: 'section-arch',
      models: 'section-models',
      apps: 'section-apps',
      docs: 'section-docs',
    };
    const targetEl = document.getElementById(elementMap[tabId]);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      
      {/* 1. Dark Hero Section */}
      <section className="bg-gradient-to-b from-[#080d19] via-[#091122] to-[#070b14] text-white border-b border-white/10 pt-8 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-6 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">Головна</button>
            <span>/</span>
            <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors cursor-pointer">Продукти</button>
            <span>/</span>
            <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors cursor-pointer">{product.category}</button>
            <span>/</span>
            <span className="text-white font-bold">{product.name}</span>
          </div>

          {/* Hero Main Info */}
          <div className="max-w-3xl space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>{product.category}</span>
                <span>·</span>
                <span className="font-bold">{product.family}</span>
              </div>

              {pimData?.provenance && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>PIM Verified: {pimData.provenance.verifiedBy}</span>
                </div>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              {product.name}
            </h1>

            <div className="text-base sm:text-xl font-bold text-blue-400 font-display">
              {product.highlight}
            </div>

            <p className="text-xs sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
              {product.shortDesc} Повна інтеграція в енергетичну інфраструктуру підприємства, сертифікація за найвищими міжнародними стандартами безпеки.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onOpenRfq(`${product.name} (Комерційна пропозиція)`)}
                className="flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-500/25 min-h-[44px]"
              >
                <span>Запросити комерційну пропозицію</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  if (onOpenVideo) onOpenVideo();
                  else onOpenRfq(`Відео та технічний огляд ${product.name}`);
                }}
                className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 active:scale-[0.98] transition-colors cursor-pointer min-h-[44px]"
              >
                <Play className="h-3.5 w-3.5 fill-current text-white" />
                <span>Дивитись відео (2 хв)</span>
              </button>
            </div>
          </div>

          {/* 7 Stats Horizontal Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-6 border-t border-white/10 text-xs font-medium text-neutral-300">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.energySpecs.nominalCapacity}</span>
                номінальна ємність
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.cellSpecs.chemistry}</span>
                безпека комірок
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <RotateCw className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.energySpecs.efficiencyRoundTrip}</span>
                ККД (Round-Trip)
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.cellSpecs.cycleLife}</span>
                ресурс системи
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <Box className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.thermalSpecs.coolingMethod.split(' ')[0]}</span>
                охолодження
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.energySpecs.nominalVoltage}</span>
                робоча напруга
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-[#0077ff] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate">{product.mechanicalSpecs.protectionRating}</span>
                захист оболонки
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Product Detail Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 overflow-x-auto">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
              {[
                { id: 'overview', label: 'Огляд' },
                { id: 'specs', label: 'Технічні характеристики' },
                { id: 'arch', label: 'Архітектура' },
                { id: 'models', label: 'Інші моделі CATL' },
                { id: 'apps', label: 'Застосування' },
                { id: 'docs', label: 'Документи' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer min-h-[38px] ${
                    activeTab === tab.id
                      ? 'bg-[#0077ff] text-white shadow-sm font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenRfq(`Консультація інженера по ${product.name}`)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#0077ff] hover:underline cursor-pointer ml-4 whitespace-nowrap"
            >
              <span>Консультація інженера</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Product Deep Dive Section */}
      <div id="section-overview" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top 3-Zone Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* Left 4 Cols: "Що таке [Product]?" & Checklist */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="font-display text-xl font-black text-slate-900 mb-2">
                Що таке {product.name}?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.shortDesc} Завдяки модульній технології та перевіреній системі безпеки CATL рішення забезпечує найнижчу нормовану вартість зберігання енергії (LCOS).
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs text-slate-700">
              {[
                `Номінальна ємність: ${product.energySpecs.nominalCapacity}`,
                `Хімічний склад: ${product.cellSpecs.chemistry} з високою термостабільністю`,
                `Охолодження: ${product.thermalSpecs.coolingMethod}`,
                `Ресурс: ${product.cellSpecs.cycleLife}`,
                `Газове та аерозольне пожежогасіння: ${product.safetySpecs.fireSuppression.split('+')[0]}`,
                'Повна адаптація до стандартів енергомережі України',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-[#0077ff] shrink-0 mt-0.5">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Document and 3D Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onOpenRfq(`Завантажити паспорт ${product.name}`)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Завантажити технічний паспорт (PDF)</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('3d')}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer min-h-[40px]"
              >
                <Box className="h-3.5 w-3.5 text-[#0077ff]" />
                <span>3D інтерактивна візуалізація</span>
              </button>
            </div>
          </div>

          {/* Center 5 Cols: Container Interactive 3D / Photo Stage */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs font-semibold">
                <span className="text-slate-900 font-bold">
                  {viewAngles[activePhotoIdx].title}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaTab('3d')}
                    className={`px-3 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                      activeMediaTab === '3d' ? 'bg-[#0077ff] text-white font-bold' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    3D Render
                  </button>
                  <button
                    onClick={() => setActiveMediaTab('photo')}
                    className={`px-3 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                      activeMediaTab === 'photo' ? 'bg-[#0077ff] text-white font-bold' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Ракурси
                  </button>
                </div>
              </div>

              {/* Graphic Stage */}
              <div className="h-64 sm:h-72 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-100 flex items-center justify-center relative overflow-hidden group p-4">
                <CatlContainerGraphic type={product.type as any} className="w-full h-56 transition-transform duration-500 group-hover:scale-105" />

                {/* 360 degree / 3D badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-mono font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                  <RotateCw className="h-3 w-3 text-[#0077ff] animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{viewAngles[activePhotoIdx].note}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 mt-4">
              {viewAngles.map((angle, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-16 rounded-lg border flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                    activePhotoIdx === idx ? 'border-[#0077ff] bg-blue-50/50 shadow-sm ring-1 ring-blue-500' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                  title={angle.title}
                >
                  <CatlContainerGraphic type={product.type as any} className="w-full h-8 opacity-80" />
                  <span className="text-[9px] font-mono text-slate-600 truncate max-w-full px-1">
                    {angle.title.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right 3 Cols: Key Parameters Specification Table */}
          <div id="section-specs" className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Параметри системи</span>
              <span className="text-[10px] font-mono text-[#0077ff]">CATL Spec</span>
            </div>

            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Ємність (Nominal):</span>
                <span className="font-bold text-slate-900">{product.energySpecs.nominalCapacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Корисна ємність:</span>
                <span className="font-bold text-blue-600">{product.energySpecs.usableCapacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Номінальна напруга:</span>
                <span className="font-bold text-slate-900">{product.energySpecs.nominalVoltage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">С-Rate (розряд):</span>
                <span className="font-bold text-slate-900">{product.energySpecs.cRate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Технологія комірок:</span>
                <span className="font-bold text-[#0077ff]">{product.cellSpecs.chemistry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Модель комірки:</span>
                <span className="font-bold text-slate-900">{product.cellSpecs.cellModel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">ККД (Round-Trip):</span>
                <span className="font-bold text-emerald-600">{product.energySpecs.efficiencyRoundTrip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Охолодження:</span>
                <span className="font-bold text-slate-900">{product.thermalSpecs.coolingMethod.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Ступінь захисту:</span>
                <span className="font-bold text-slate-900">{product.mechanicalSpecs.protectionRating}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Температурний режим:</span>
                <span className="font-bold text-slate-900">{product.thermalSpecs.operatingTempRange}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-sans">Габарити:</span>
                <span className="text-slate-900 font-bold text-[10px] truncate max-w-[130px]">{product.mechanicalSpecs.dimensions}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenRfq(`Повний паспорт ${product.name}`)}
                className="w-full py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#0077ff] font-bold text-center text-xs transition-colors cursor-pointer min-h-[38px]"
              >
                Отримати офіційний Datasheet
              </button>
            </div>
          </div>

        </div>

        {/* 4. Габарити та модульна конфігурація */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-4">
            <div>
              <h3 className="font-display text-lg font-black text-slate-900">
                Габарити та компонування {product.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Масштабування від одиничного блоку до енергетичного парку на сотні МВт·год
              </p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-[#0077ff] text-xs font-mono font-bold">
                {product.mechanicalSpecs.containerStandard}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Dimensions graphic */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <CatlContainerGraphic type={product.type as any} className="w-full h-44" />
              <div className="flex flex-wrap justify-around text-xs font-mono text-slate-700 mt-3 border-t border-slate-200 pt-3 gap-2">
                <div>Габарити: <strong className="text-slate-900">{product.mechanicalSpecs.dimensions}</strong></div>
                <div>Маса: <strong className="text-slate-900">{product.mechanicalSpecs.weight}</strong></div>
              </div>
            </div>

            {/* Modular Options */}
            <div className="lg:col-span-6 space-y-4">
              <div className="font-bold text-slate-900 text-sm">
                Конфігурації підключення:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="font-bold text-xs text-slate-900">Одиничний модуль</div>
                  <div className="font-mono text-sm text-[#0077ff] font-bold">{product.energySpecs.nominalCapacity}</div>
                  <div className="text-[10px] text-slate-500">Автономний вузол</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="font-bold text-xs text-slate-900">Кластер (×4)</div>
                  <div className="font-mono text-sm text-[#0077ff] font-bold">Паралельна робота</div>
                  <div className="text-[10px] text-slate-500">Для великих виробництв</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-1">
                  <div className="font-bold text-xs text-blue-900">Енергопарк</div>
                  <div className="font-mono text-sm text-[#0077ff] font-bold">50+ МВт·год</div>
                  <div className="text-[10px] text-blue-700">Utility-scale проекти</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div><strong>Сумісні PCS інвертори:</strong> {product.compatibility.pcs.join(', ')}</div>
                <div><strong>Сумісні EMS системи:</strong> {product.compatibility.ems.join(', ')}</div>
                <div><strong>Трансформатор:</strong> {product.compatibility.transformer}</div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. Архітектура системи */}
        <div id="section-arch" className="mb-14">
          <div className="mb-6">
            <h3 className="font-display text-xl font-black text-slate-900">
              Архітектура інтеграції {product.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Повний ланцюг: акумуляторний блок CATL → двонаправлений PCS → блоковий ТМГ → РУ-10(35) кВ
            </p>
          </div>

          <ArchitectureFlowGraphic />
        </div>

        {/* 6. Switch to Other CATL Models */}
        <div id="section-models" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-black text-slate-900">
                Інші моделі лінійки CATL BESS
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Оберіть іншу систему для перегляду її специфікації або порівняння
              </p>
            </div>
            <button
              onClick={() => onNavigate('compare')}
              className="text-xs font-bold text-[#0077ff] hover:underline cursor-pointer"
            >
              Зведена таблиця порівняння →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {titanProductsList.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (onSelectProduct) onSelectProduct(p.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  p.id === product.id
                    ? 'border-[#0077ff] bg-blue-50/40 ring-1 ring-blue-500 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div>
                  <div className="h-24 flex items-center justify-center mb-2">
                    <CatlContainerGraphic type={p.type as any} className="w-full h-20" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <h4 className="font-display text-sm font-bold text-slate-900 mt-1 mb-0.5 group-hover:text-[#0077ff] transition-colors">
                    {p.name}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-500">
                    {p.energySpecs.nominalCapacity}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-xs font-bold text-[#0077ff]">
                  <span>{p.id === product.id ? 'Поточна модель' : 'Переглянути'}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Застосування в галузях */}
        <div id="section-apps" className="bg-gradient-to-br from-[#091122] to-[#070b14] text-white p-6 sm:p-8 rounded-2xl border border-white/10 shadow-sm mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="font-display text-lg font-black text-white">
                Цільові сценарії застосування {product.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Найбільша економічна ефективність досягається у наступних сферах
              </p>
            </div>
            <button
              onClick={() => onNavigate('solutions')}
              className="text-xs font-bold text-blue-400 hover:text-white transition-colors cursor-pointer"
            >
              Перейти до Хабу рішень →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <Sun className="h-5 w-5 text-amber-400" />
              <div className="font-bold text-sm text-white">СЕС та ВЕС генерація</div>
              <div className="text-xs text-neutral-300 leading-relaxed">
                Накопичення профіциту генерації, усунення небалансів, стабільна віддача енергії у вечірній піковий тариф.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <Building className="h-5 w-5 text-blue-400" />
              <div className="font-bold text-sm text-white">Промислові фабрики та заводи</div>
              <div className="text-xs text-neutral-300 leading-relaxed">
                Зрізання пікового споживання (Peak Shaving), безперебійна робота при перепадах напруги та лімітах потужності.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <Server className="h-5 w-5 text-emerald-400" />
              <div className="font-bold text-sm text-white">Дата-центри та критичні об'єкти</div>
              <div className="text-xs text-neutral-300 leading-relaxed">
                Миттєвий перехід на батареї без просідання напруги, повне резервування серверного обладнання.
              </div>
            </div>
          </div>
        </div>

        {/* 8. Документи та сертифікати */}
        <div id="section-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h3 className="font-display text-lg font-black text-slate-900">
              Документи та офіційні сертифікати {product.name}
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Сертифікація: {product.safetySpecs.certifications.join(', ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: `Технічний паспорт ${product.name} (Datasheet)`, size: '3.4 MB', type: 'PDF' },
              { title: `Габаритні креслення ${product.name} (DWG/AutoCAD)`, size: '2.1 MB', type: 'DWG' },
              { title: `BIM 3D модель (Revit RFA)`, size: '24.8 MB', type: 'RFA' },
              { title: 'Звіт пожежної безпеки NFPA 855 / UL 9540A', size: '5.6 MB', type: 'PDF' },
              { title: 'Декларація відповідності ДСТУ EN 62619', size: '1.4 MB', type: 'PDF' },
              { title: 'Посібник з монтажу та експлуатації (O&M Manual)', size: '4.8 MB', type: 'PDF' },
            ].map((doc, idx) => (
              <div
                key={idx}
                onClick={() => onOpenRfq(`Запит документа: ${doc.title}`)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#0077ff] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#0077ff] transition-colors">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{doc.type} · {doc.size}</div>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-[#0077ff] transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
