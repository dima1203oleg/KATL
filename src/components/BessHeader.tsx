import React, { useState } from 'react';
import { Menu, X, Shield, Activity, FileText, Layers, Calculator, PhoneCall } from 'lucide-react';

interface BessHeaderProps {
  onOpenSeoCenter: () => void;
  onOpenRfq: () => void;
  onOpenWorkspace?: () => void;
}

export const BessHeader: React.FC<BessHeaderProps> = ({
  onOpenSeoCenter,
  onOpenRfq,
  onOpenWorkspace,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0c10]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2.5 font-display text-lg sm:text-xl font-bold tracking-tight text-white"
        >
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
          <span>CATL BESS UA</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links (Top Bar Contract compliant) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <button
            onClick={() => scrollTo('products')}
            className="hover:text-emerald-400 transition-colors cursor-pointer py-1"
          >
            Продукти
          </button>
          <button
            onClick={() => scrollTo('compare')}
            className="hover:text-emerald-400 transition-colors cursor-pointer py-1"
          >
            Порівняння
          </button>
          <button
            onClick={() => scrollTo('designer')}
            className="hover:text-emerald-400 transition-colors cursor-pointer py-1 flex items-center gap-1.5 text-emerald-400"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>BESS Designer</span>
          </button>
          <button
            onClick={() => scrollTo('solutions')}
            className="hover:text-emerald-400 transition-colors cursor-pointer py-1"
          >
            Рішення
          </button>
          <button
            onClick={() => scrollTo('knowledge')}
            className="hover:text-emerald-400 transition-colors cursor-pointer py-1"
          >
            База знань
          </button>
          <button
            onClick={onOpenSeoCenter}
            className="hover:text-cyan-400 transition-colors cursor-pointer py-1 flex items-center gap-1 text-cyan-400/90"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>SEO Center</span>
          </button>
          {onOpenWorkspace && (
            <button
              onClick={onOpenWorkspace}
              className="hover:text-emerald-400 transition-colors cursor-pointer py-1 flex items-center gap-1 text-emerald-400/90 font-bold"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Workspace</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollTo.bind(null, 'rfq')}
            className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shadow-sm shadow-emerald-400/20"
          >
            <span>Запит КП (RFQ)</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-neutral-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0e1017] px-6 py-6 transition-all">
          <nav className="flex flex-col space-y-4 text-sm font-medium text-neutral-200">
            <button
              onClick={() => scrollTo('products')}
              className="text-left py-2 hover:text-emerald-400 transition-colors"
            >
              Продукти CATL (TENER, EnerOne, EnerC)
            </button>
            <button
              onClick={() => scrollTo('solutions')}
              className="text-left py-2 hover:text-emerald-400 transition-colors"
            >
              Рішення & Сценарії застосування
            </button>
            <button
              onClick={() => scrollTo('designer')}
              className="text-left py-2 text-emerald-400 font-bold hover:underline"
            >
              BESS Designer (Калькулятор ємності)
            </button>
            <button
              onClick={() => scrollTo('industries')}
              className="text-left py-2 hover:text-emerald-400 transition-colors"
            >
              Галузеві рішення
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSeoCenter();
              }}
              className="text-left py-2 text-cyan-400 font-semibold"
            >
              SEO Command Center & Semantic Core
            </button>
            <div className="pt-2">
              <button
                onClick={() => scrollTo('rfq')}
                className="w-full rounded-md bg-emerald-400 py-2.5 text-center text-xs font-bold text-black hover:bg-emerald-300"
              >
                Замовити розрахунок проєкту (RFQ)
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
