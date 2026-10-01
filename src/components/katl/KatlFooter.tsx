import React, { useState } from 'react';
import { ArrowRight, Send, CheckCircle2, Shield, Lock, FileCheck2, Activity } from 'lucide-react';
import { KatlPage } from './KatlNavbar';

interface KatlFooterProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
  onOpenSeoCenter?: () => void;
  onOpenRegistry?: () => void;
}

export const KatlFooter: React.FC<KatlFooterProps> = ({
  onNavigate,
  onOpenRfq,
  onOpenSeoCenter,
  onOpenRegistry,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#06080e] pt-16 pb-12 text-neutral-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid (TITAN Section 2 Compliant) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16 items-start">
          
          {/* Col 1: Brand & Logo */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-3">
            <div
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="font-display text-2xl font-black tracking-wider text-white">
                KATL
              </span>
              <div className="h-5 w-[1px] bg-white/20" />
              <div className="flex flex-col text-[9px] leading-tight font-bold tracking-wider text-neutral-300">
                <span>ENERGY STORAGE</span>
                <span className="text-neutral-500 font-medium">SOLUTIONS</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
              Офіційні технології промислових систем накопичення енергії CATL в Україні. Проектування, поставка, монтаж РУ-10 кВ та сервісне обслуговування.
            </p>
            <div className="text-[11px] font-mono text-neutral-500 pt-2">
              Київ, вул. Володимирська, 49А
              <br />+380 (44) 290-88-12
            </div>
          </div>

          {/* Col 2: Продукти */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Продукти
            </div>
            <div>
              <button onClick={() => onNavigate('product')} className="hover:text-white transition-colors cursor-pointer">
                CATL TENER H (9 MWh)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors cursor-pointer">
                CATL TENER S (6.25 MWh)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors cursor-pointer">
                CATL EnerOne Plus
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('safety')} className="hover:text-white transition-colors cursor-pointer">
                Sodium-ion (Натрій)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('compare')} className="hover:text-blue-400 transition-colors cursor-pointer font-semibold">
                Порівняння моделей →
              </button>
            </div>
          </div>

          {/* Col 3: Рішення */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Рішення
            </div>
            <div>
              <button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors cursor-pointer">
                Зрізання піків (Peak Shaving)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors cursor-pointer">
                СЕС + Накопичення
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors cursor-pointer">
                Резервне живлення (UPS)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors cursor-pointer">
                Енергетичний арбітраж
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors cursor-pointer">
                Дата-центри та AI
              </button>
            </div>
          </div>

          {/* Col 4: Галузі */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Галузі
            </div>
            <div>
              <button onClick={() => onNavigate('industries')} className="hover:text-white transition-colors cursor-pointer">
                Важка промисловість
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('industries')} className="hover:text-white transition-colors cursor-pointer">
                Агрохолдинги та елеватори
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('industries')} className="hover:text-white transition-colors cursor-pointer">
                Логістика та склади
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('industries')} className="hover:text-white transition-colors cursor-pointer">
                Торгово-розважальні центри
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('industries')} className="hover:text-white transition-colors cursor-pointer">
                Телекомунікації
              </button>
            </div>
          </div>

          {/* Col 5: Інженерія & Портали */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Інженерія & Портали
            </div>
            <div>
              <button onClick={() => onNavigate('tech')} className="hover:text-white transition-colors cursor-pointer">
                Однолінійна схема (SLD)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('safety')} className="hover:text-white transition-colors cursor-pointer">
                5-Рівнева система безпеки
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('partners')} className="hover:text-blue-400 transition-colors cursor-pointer">
                Партнерський портал (EPC)
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('customer')} className="hover:text-blue-400 transition-colors cursor-pointer">
                Кабінет замовника
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('admin')} className="text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                <Lock className="h-3 w-3" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          {/* Col 6: Підписка на бюлетень */}
          <div className="space-y-3">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Новини інженерії BESS
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Отримуйте аналітику ринку електроенергії України, звіти по прайс-кепам та оновлення CATL.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#0077ff] focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0077ff] text-white hover:bg-[#0066ee] shrink-0 cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            {subscribed && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Дякуємо за підписку!</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom copyright & Governance line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2026 KATL. Всі права захищені. Офіційна інженерна платформа систем накопичення енергії CATL в Україні.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => onOpenRfq('Політика конфіденційності')} className="hover:text-neutral-300 transition-colors cursor-pointer">
              Політика конфіденційності
            </button>
            <span>·</span>
            <button onClick={() => onOpenRfq('Умови використання')} className="hover:text-neutral-300 transition-colors cursor-pointer">
              Умови використання
            </button>
            {onOpenRegistry && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenRegistry}
                  className="text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-mono"
                >
                  <FileCheck2 className="h-3 w-3 text-emerald-400" />
                  <span>Page Registry (100%)</span>
                </button>
              </>
            )}
            {onOpenSeoCenter && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenSeoCenter}
                  className="text-neutral-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 font-mono"
                >
                  <Activity className="h-3 w-3 text-cyan-400" />
                  <span>SEO Center</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
