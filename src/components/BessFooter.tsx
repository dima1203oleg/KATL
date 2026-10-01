import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';

interface BessFooterProps {
  onOpenSeoCenter: () => void;
}

export const BessFooter: React.FC<BessFooterProps> = ({ onOpenSeoCenter }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#06070a] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="font-display text-lg font-bold tracking-tight text-white">CATL BESS UA</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Інженерна платформа систем накопичення енергії CATL в Україні. Офіційні рішення для промислових підприємств, сонячних електростанцій та енергопарків.
            </p>
            <div className="pt-2 text-xs text-emerald-400/90 font-medium">
              Відповідність протипожежним стандартам NFPA 855 та UL 9540A 🇺🇦
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Обладнання & Системи
              </div>
              <div><a href="#products" className="text-neutral-400 hover:text-white transition-colors">CATL TENER (6.25 MWh)</a></div>
              <div><a href="#products" className="text-neutral-400 hover:text-white transition-colors">CATL EnerOne Plus</a></div>
              <div><a href="#products" className="text-neutral-400 hover:text-white transition-colors">CATL EnerC Plus</a></div>
              <div><a href="#designer" className="text-emerald-400 hover:underline">BESS Designer</a></div>
            </div>

            <div className="space-y-2.5">
              <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Рішення & Аудит
              </div>
              <div><a href="#solutions" className="text-neutral-400 hover:text-white transition-colors">Peak Shaving</a></div>
              <div><a href="#solutions" className="text-neutral-400 hover:text-white transition-colors">Енергетичний арбітраж</a></div>
              <div><a href="#industries" className="text-neutral-400 hover:text-white transition-colors">Галузеві рішення</a></div>
              <div><button onClick={onOpenSeoCenter} className="text-cyan-400 hover:underline cursor-pointer">SEO Command Center</button></div>
            </div>
          </div>

          {/* Back to top */}
          <div className="md:col-span-3 flex md:justify-end">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Вгору</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © 2026 CATL BESS Ukraine Platform. Всі технічні дані верифіковані відповідно до специфікацій CATL.
          </div>
          <div className="flex items-center gap-6">
            <a href="#rfq" className="text-neutral-400 hover:text-white transition-colors">
              Запит розрахунку (RFQ)
            </a>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400">
              Київ, Україна
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
