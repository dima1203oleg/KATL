'use client';

import React, { useState } from 'react';
import {
  Download,
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
  ChevronRight,
  Sun,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { KatlProduct } from '@katl/shared-types';

interface TenerProductDetailViewProps {
  product: KatlProduct;
  locale?: string;
}

export const TenerProductDetailView: React.FC<TenerProductDetailViewProps> = ({
  product,
  locale = 'uk',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'arch' | 'models' | 'apps' | 'docs'>('overview');
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'photo'>('3d');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* 1. Dark Hero Section */}
      <section className="bg-gradient-to-b from-[#080d19] via-[#091122] to-[#070b14] text-white border-b border-white/10 pt-8 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-6 font-mono">
            <a href="/" className="hover:text-white transition-colors">Головна</a>
            <span>/</span>
            <a href="/products" className="hover:text-white transition-colors">Каталог</a>
            <span>/</span>
            <span className="text-neutral-400">{product.category}</span>
            <span>/</span>
            <span className="text-white font-bold">{product.name}</span>
          </nav>

          {/* Hero Main Info */}
          <div className="max-w-3xl space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>{product.category}</span>
              <span>·</span>
              <span className="font-bold">{product.family}</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">PIM Verified (Rev {product.provenance.revision})</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              {product.name}
            </h1>

            <div className="text-base sm:text-xl font-bold text-blue-400">
              {product.highlight}
            </div>

            <p className="text-xs sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              {product.shortDesc} Повна інтеграція в енергетичну інфраструктуру підприємства, сертифікація за найвищими міжнародними стандартами безпеки NFPA 855 та UL 9540A.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href={`#section-rfq`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 min-h-[44px]"
              >
                <span>Отримати ТКП / Розрахунок</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={product.provenance.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-all min-h-[44px]"
              >
                <Download className="h-4 w-4 text-blue-400" />
                <span>Datasheet (PDF)</span>
              </a>
            </div>
          </div>

          {/* Interactive 3D / Visual Container View */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1220]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-neutral-300">
                  Інтерактивна модель 20ft High Cube ISO Container · BESS 9.008 MWh
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10 text-xs">
                <button
                  onClick={() => setActiveMediaTab('3d')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeMediaTab === '3d' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  3D Огляд
                </button>
                <button
                  onClick={() => setActiveMediaTab('photo')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeMediaTab === 'photo' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Фото обладнання
                </button>
              </div>
            </div>

            {/* Container Graphic Rendering */}
            <div className="relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] bg-[#050811] rounded-xl border border-white/5 p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,119,255,0.12)_0%,transparent_70%)]" />

              <div className="relative z-10 w-full max-w-2xl py-6">
                {/* SVG Visual Model */}
                <div className="w-full h-44 sm:h-56 bg-gradient-to-r from-[#1a233a] via-[#223050] to-[#161f33] rounded-lg border-2 border-blue-500/40 p-4 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400">CATL TENER</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                        9.008 MWh / 1500V DC
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-300">SYSTEM READY</span>
                    </div>
                  </div>

                  {/* Internal cell racks representation */}
                  <div className="grid grid-cols-8 gap-1.5 my-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((rack) => (
                      <div
                        key={rack}
                        className="h-16 rounded bg-[#0b101d] border border-blue-400/20 flex flex-col justify-around p-1"
                      >
                        <div className="h-1.5 w-full bg-blue-500/40 rounded-sm" />
                        <div className="h-1.5 w-full bg-blue-500/40 rounded-sm" />
                        <div className="h-1.5 w-full bg-blue-500/40 rounded-sm" />
                        <div className="h-1 w-full bg-emerald-500/60 rounded-sm" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/10 pt-2">
                    <span>ISO 668 1CC (20ft HC) · Liquid Cooled</span>
                    <span>Fire Suppression: Novec 1230 · NFPA 68</span>
                  </div>
                </div>
              </div>

              {/* View Angles Switcher */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-4">
                {viewAngles.map((angle, idx) => (
                  <button
                    key={angle.title}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      activePhotoIdx === idx
                        ? 'border-blue-500 bg-blue-950/40 text-white'
                        : 'border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold">{angle.title}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{angle.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Номінальна ємність</div>
                <div className="text-lg font-bold text-white mt-1">{product.energySpecs.nominalCapacity}</div>
                <div className="text-[10px] text-blue-400 mt-0.5">{product.energySpecs.usableCapacity}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Напруга системи</div>
                <div className="text-lg font-bold text-white mt-1">{product.energySpecs.nominalVoltage}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{product.energySpecs.voltageRange}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Комірки & Ресурс</div>
                <div className="text-lg font-bold text-white mt-1">{product.cellSpecs.cellCapacity}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">{product.cellSpecs.cycleLife}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Деградація</div>
                <div className="text-lg font-bold text-white mt-1">0%</div>
                <div className="text-[10px] text-blue-300 mt-0.5">{product.cellSpecs.degradationFirstYears}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono uppercase text-neutral-400">ККД (Round-Trip)</div>
                <div className="text-lg font-bold text-white mt-1">{product.energySpecs.efficiencyRoundTrip}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">DC-DC System Level</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Tab Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'Огляд' },
              { id: 'specs', label: 'Технічні характеристики' },
              { id: 'arch', label: 'Топологія та Інтеграція' },
              { id: 'apps', label: 'Застосування' },
              { id: 'docs', label: 'Сертифікати & Документи' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as any)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0077ff] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Detailed Specifications Matrix Section */}
      <section id="section-specs" className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
              Engineering Specification Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Повні паспортні дані {product.name}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Дані верифіковано інженерним департаментом CATL. Джерело: {product.provenance.sourceUrl}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Energy & Electrical */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
                <Zap className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Електричні та енергетичні параметри</h3>
              </div>
              <dl className="divide-y divide-slate-200 text-sm">
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Номінальна ємність</dt>
                  <dd className="font-semibold text-slate-900">{product.energySpecs.nominalCapacity}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Корисна ємність (Usable)</dt>
                  <dd className="font-semibold text-slate-900">{product.energySpecs.usableCapacity}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Номінальна напруга</dt>
                  <dd className="font-semibold text-slate-900">{product.energySpecs.nominalVoltage}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Діапазон робочої напруги</dt>
                  <dd className="font-semibold text-slate-900">{product.energySpecs.voltageRange}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Коефіцієнт розряду (C-Rate)</dt>
                  <dd className="font-semibold text-slate-900">{product.energySpecs.cRate}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Ефективність DC-DC</dt>
                  <dd className="font-semibold text-slate-900">{product.energySpecs.efficiencyRoundTrip}</dd>
                </div>
              </dl>
            </div>

            {/* Column 2: Cell Chemistry & Longevity */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
                <Battery className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Акумуляторні комірки & Деградація</h3>
              </div>
              <dl className="divide-y divide-slate-200 text-sm">
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Хімічний тип</dt>
                  <dd className="font-semibold text-slate-900">{product.cellSpecs.chemistry}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Модель комірки</dt>
                  <dd className="font-semibold text-slate-900">{product.cellSpecs.cellModel}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Ємність однієї комірки</dt>
                  <dd className="font-semibold text-slate-900">{product.cellSpecs.cellCapacity}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Кількість циклів (Cycle Life)</dt>
                  <dd className="font-semibold text-emerald-600">{product.cellSpecs.cycleLife}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Деградація у перші роки</dt>
                  <dd className="font-semibold text-blue-600">{product.cellSpecs.degradationFirstYears}</dd>
                </div>
              </dl>
            </div>

            {/* Column 3: Thermal & Safety */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
                <Shield className="h-5 w-5 text-rose-600" />
                <h3 className="font-bold text-slate-900">Терморегуляція та Багаторівнева Безпека</h3>
              </div>
              <dl className="divide-y divide-slate-200 text-sm">
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Система охолодження</dt>
                  <dd className="font-semibold text-slate-900">{product.thermalSpecs.coolingMethod}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Точність контролю ΔT</dt>
                  <dd className="font-semibold text-slate-900">{product.thermalSpecs.tempControlAccuracy}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Робочий температурний діапазон</dt>
                  <dd className="font-semibold text-slate-900">{product.thermalSpecs.operatingTempRange}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Пожежогасіння</dt>
                  <dd className="font-semibold text-slate-900">{product.safetySpecs.fireSuppression}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Газовий моніторинг</dt>
                  <dd className="font-semibold text-slate-900">{product.safetySpecs.gasDetection}</dd>
                </div>
              </dl>
            </div>

            {/* Column 4: Mechanical & Compatibility */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
                <Box className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-slate-900">Габарити, Вага & Сумісність</h3>
              </div>
              <dl className="divide-y divide-slate-200 text-sm">
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Габаритні розміри</dt>
                  <dd className="font-semibold text-slate-900">{product.mechanicalSpecs.dimensions}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Споряджена маса</dt>
                  <dd className="font-semibold text-slate-900">{product.mechanicalSpecs.weight}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Клас захисту оболонки</dt>
                  <dd className="font-semibold text-slate-900">{product.mechanicalSpecs.protectionRating}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Сумісні PCS (інвертори)</dt>
                  <dd className="font-semibold text-slate-900">{product.compatibility.pcs.join(', ')}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-500">Підтримувані EMS / SCADA</dt>
                  <dd className="font-semibold text-slate-900">{product.compatibility.ems.join(', ')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RFQ Request Section Anchor */}
      <section id="section-rfq" className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono uppercase text-blue-400 font-bold">Офіційне замовлення</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold mt-2">
            Замовити техніко-економічне обґрунтування для {product.name}
          </h2>
          <p className="text-neutral-300 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Отримайте розрахунок CAPEX, OPEX, LCOS та терміну окупності системи накопичення під ваш профіль генерації або споживання.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/rfq"
              className="inline-flex items-center gap-2 rounded-full bg-[#0077ff] px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
            >
              <span>Заповнити опитувальний лист BESS</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:energy@catl-ukraine.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <span>Зв’язатися з головним інженером</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
