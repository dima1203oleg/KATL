"use client";

import React, { useState } from 'react';
import {
  Search,
  Globe,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Shield,
  Layers,
  Lock,
  FileCheck2,
} from 'lucide-react';

export type KatlPage =
  | 'home'
  | 'catalog'
  | 'product'
  | 'compare'
  | 'solutions'
  | 'industries'
  | 'tech'
  | 'safety'
  | 'partners'
  | 'customer'
  | 'admin';

interface KatlNavbarProps {
  currentPage: KatlPage;
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
  onOpenSearch?: () => void;
  onOpenAiAdvisor?: () => void;
  onOpenRegistry?: () => void;
  onOpenDesigner?: () => void;
}

export const KatlNavbar: React.FC<KatlNavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenRfq,
  onOpenSearch,
  onOpenAiAdvisor,
  onOpenRegistry,
  onOpenDesigner,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'UA' | 'EN' | '中文'>('UA');
  const [openDropdown, setOpenDropdown] = useState<'products' | 'solutions' | 'industries' | null>(null);

  const handleDesignerClick = () => {
    if (onOpenDesigner) {
      onOpenDesigner();
    } else {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('bess-designer-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070a12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <span className="font-display text-2xl font-black tracking-wider text-white">
            CATL
          </span>
          <div className="h-6 w-[1px] bg-white/20" />
          <div className="flex flex-col text-[10px] leading-tight font-bold tracking-wider text-neutral-300">
            <span>ENERGY STORAGE</span>
            <span className="text-neutral-400 font-medium">SOLUTIONS</span>
          </div>
        </div>

        {/* Center Navigation Links (TITAN Spec compliant single-line) */}
        <nav
          className="hidden xl:flex items-center gap-5 text-xs font-semibold text-neutral-300"
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {/* Products Dropdown */}
          <div className="relative">
            <button
              onClick={() => onNavigate('catalog')}
              onMouseEnter={() => setOpenDropdown('products')}
              className={`transition-colors cursor-pointer py-1 flex items-center gap-1 relative ${
                currentPage === 'catalog' || currentPage === 'product'
                  ? 'text-white font-bold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span>Продукти</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
              {(currentPage === 'catalog' || currentPage === 'product') && (
                <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
              )}
            </button>

            {openDropdown === 'products' && (
              <div
                className="absolute top-8 left-0 w-72 rounded-2xl border border-white/15 bg-[#0b101c]/95 backdrop-blur-xl p-3 shadow-2xl space-y-1 z-50 text-left"
                onMouseEnter={() => setOpenDropdown('products')}
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Лінійка BESS CATL
                </div>
                <button
                  onClick={() => {
                    onNavigate('product');
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-[#0077ff]">
                    CATL TENER H (9.008 МВт·год)
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Флагманська utility-scale система
                  </div>
                </button>
                <button
                  onClick={() => {
                    onNavigate('catalog');
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-[#0077ff]">
                    CATL TENER S (6.25 МВт·год)
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    20-фут контейнер 1500 V DC
                  </div>
                </button>
                <button
                  onClick={() => {
                    onNavigate('catalog');
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-[#0077ff]">
                    CATL EnerOne Plus (372.7 кВт·год)
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    C&I шафи для підприємств
                  </div>
                </button>
                <button
                  onClick={() => {
                    onNavigate('compare');
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#0077ff] font-bold text-xs transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Порівняти всі моделі</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              onClick={() => onNavigate('solutions')}
              onMouseEnter={() => setOpenDropdown('solutions')}
              className={`transition-colors cursor-pointer py-1 flex items-center gap-1 relative ${
                currentPage === 'solutions' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span>Рішення</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
              {currentPage === 'solutions' && (
                <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
              )}
            </button>

            {openDropdown === 'solutions' && (
              <div
                className="absolute top-8 left-0 w-64 rounded-2xl border border-white/15 bg-[#0b101c]/95 backdrop-blur-xl p-3 shadow-2xl space-y-1 z-50 text-left"
                onMouseEnter={() => setOpenDropdown('solutions')}
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Сценарії оптимізації
                </div>
                {[
                  { name: 'Зрізання піків (Peak Shaving)', slug: 'peak-shaving' },
                  { name: 'СЕС + Накопичення (Solar)', slug: 'solar-storage' },
                  { name: 'Резервне живлення (UPS)', slug: 'backup-power' },
                  { name: 'Енергетичний арбітраж', slug: 'energy-arbitrage' },
                  { name: 'Дата-центри та AI', slug: 'datacenter' },
                ].map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      onNavigate('solutions');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Industries Link */}
          <button
            onClick={() => onNavigate('industries')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'industries' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Галузі</span>
            {currentPage === 'industries' && (
              <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
            )}
          </button>

          {/* Technology & Safety Hub */}
          <button
            onClick={() => onNavigate('safety')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'safety' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Технології & Безпека</span>
            {currentPage === 'safety' && (
              <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
            )}
          </button>

          {/* Engineering Hub */}
          <button
            onClick={() => onNavigate('tech')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'tech' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Інженерія (SLD)</span>
            {currentPage === 'tech' && (
              <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
            )}
          </button>

          {/* Comparison Matrix */}
          <button
            onClick={() => onNavigate('compare')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'compare' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Порівняння</span>
            {currentPage === 'compare' && (
              <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
            )}
          </button>

          {/* Partner Portal */}
          <button
            onClick={() => onNavigate('partners')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'partners' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Партнери</span>
            {currentPage === 'partners' && (
              <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
            )}
          </button>

          {/* Customer Workspace */}
          <button
            onClick={() => onNavigate('customer')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentPage === 'customer' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Кабінет</span>
            {currentPage === 'customer' && (
              <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0077ff] rounded-full" />
            )}
          </button>

          {/* Admin link */}
          <button
            onClick={() => onNavigate('admin')}
            className={`transition-colors cursor-pointer py-1 px-2 rounded-lg font-mono text-[11px] flex items-center gap-1 ${
              currentPage === 'admin' ? 'bg-blue-600/30 text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title="Адміністративна панель керування"
          >
            <Lock className="h-3 w-3" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right Actions: AI Advisor + Search + Language + Primary CTA Button */}
        <div className="flex items-center gap-3">
          
          {/* AI Advisor Button */}
          {onOpenAiAdvisor && (
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 text-xs font-semibold text-blue-200 hover:text-white hover:border-blue-400 transition-all cursor-pointer shadow-sm"
              title="Інтелектуальний підбір конфігурації"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#0077ff]" />
              <span className="hidden sm:inline">AI Підбір</span>
            </button>
          )}

          {/* Page Registry Audit Button */}
          {onOpenRegistry && (
            <button
              onClick={onOpenRegistry}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer"
              title="TITAN Page Registry & Completeness Audit"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Registry</span>
            </button>
          )}

          {/* Search button */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-300 font-medium px-2 py-1 rounded-md">
            <Globe className="h-3.5 w-3.5 text-neutral-400" />
            <button
              onClick={() => setCurrentLang('UA')}
              className={`hover:text-white cursor-pointer ${currentLang === 'UA' ? 'text-white font-bold' : 'text-neutral-400'}`}
            >
              UA
            </button>
            <span className="text-neutral-600">·</span>
            <button
              onClick={() => setCurrentLang('EN')}
              className={`hover:text-white cursor-pointer ${currentLang === 'EN' ? 'text-white font-bold' : 'text-neutral-400'}`}
            >
              EN
            </button>
            <span className="text-neutral-600">·</span>
            <button
              onClick={() => setCurrentLang('中文')}
              className={`hover:text-white cursor-pointer ${currentLang === '中文' ? 'text-white font-bold' : 'text-neutral-400'}`}
            >
              中文
            </button>
          </div>

          {/* Primary CTA Button: Розрахувати BESS (TITAN Section 1 Requirement) */}
          <button
            onClick={handleDesignerClick}
            className="hidden sm:flex items-center gap-2 rounded-full bg-[#0077ff] px-4 md:px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0066ee] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-500/20 whitespace-nowrap min-h-[40px]"
          >
            <span>Розрахувати BESS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex h-10 w-10 items-center justify-center rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/10 bg-[#0e121e] px-5 sm:px-6 py-5 space-y-3 text-sm font-medium text-neutral-200 max-h-[85dvh] overflow-y-auto">
          
          {/* Mobile Quick Action Tools */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            {onOpenAiAdvisor && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiAdvisor();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold"
              >
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>AI Advisor</span>
              </button>
            )}

            {onOpenSearch && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold"
              >
                <Search className="h-4 w-4 text-neutral-400" />
                <span>Пошук</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onNavigate('catalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Каталог продуктів CATL
          </button>
          <button
            onClick={() => {
              onNavigate('product');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Флагман CATL TENER H (9.008 MWh)
          </button>
          <button
            onClick={() => {
              onNavigate('solutions');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Хаб рішень (Solutions)
          </button>
          <button
            onClick={() => {
              onNavigate('industries');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Галузеві рішення (Industries)
          </button>
          <button
            onClick={() => {
              onNavigate('safety');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Технології & 5-рівнева безпека
          </button>
          <button
            onClick={() => {
              onNavigate('tech');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Інженерія та Однолінійна схема (SLD)
          </button>
          <button
            onClick={() => {
              onNavigate('compare');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Порівняння моделей CATL
          </button>
          <button
            onClick={() => {
              onNavigate('partners');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Партнерська програма (EPC / Дилери)
          </button>
          <button
            onClick={() => {
              onNavigate('customer');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff]"
          >
            Особистий кабінет замовника
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-[#0077ff] font-mono text-xs text-blue-400"
          >
            Панель адміністратора (Admin Portal)
          </button>

          {/* Language Switcher on mobile */}
          <div className="flex items-center gap-2 py-2 border-t border-white/10 text-xs text-neutral-400 font-medium">
            <Globe className="h-3.5 w-3.5" />
            <span>Мова:</span>
            {(['UA', 'EN', '中文'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLang(lang)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  currentLang === lang ? 'bg-blue-600/30 text-white font-bold' : 'hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDesignerClick();
              }}
              className="w-full rounded-full bg-[#0077ff] py-3 text-center text-xs font-bold text-white hover:bg-[#0066ee] shadow-lg shadow-blue-500/25 min-h-[44px]"
            >
              Розрахувати BESS у Designer →
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRfq('Запит з мобільного меню');
              }}
              className="w-full rounded-full bg-white/10 py-3 text-center text-xs font-semibold text-white hover:bg-white/20 min-h-[44px]"
            >
              Запросити комерційну пропозицію
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
