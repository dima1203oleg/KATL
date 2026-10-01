import React, { useState } from 'react';
import { Search, X, ArrowRight, Battery, FileText, Cpu, ShieldCheck } from 'lucide-react';
import { KatlPage } from './KatlNavbar';

interface KatlSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
  onSelectProduct?: (productId: string) => void;
}

interface SearchItem {
  title: string;
  type: string;
  page: KatlPage;
  tag: string;
  productId?: string;
  keywords?: string;
}

export const KatlSearchModal: React.FC<KatlSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenRfq,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const searchIndex: SearchItem[] = [
    { title: 'CATL TENER H (9.008 МВт·год)', type: 'Продукт', page: 'product', tag: 'Utility-scale', productId: 'catl-tener-h', keywords: '9.008 575Ah lfp 1500V 20ft' },
    { title: 'CATL TENER S (6.25 МВт·год)', type: 'Продукт', page: 'product', tag: 'Utility-scale', productId: 'catl-tener-s', keywords: '6.25 314Ah 0% деградація' },
    { title: 'CATL TENER Stack (До 9 МВт·год)', type: 'Продукт', page: 'product', tag: 'Utility-scale', productId: 'catl-tener-stack', keywords: 'stack modular шафи' },
    { title: 'CATL EnerOne Plus (372.7 кВт·год)', type: 'Продукт', page: 'product', tag: 'C&I', productId: 'catl-enerone-plus', keywords: '372 372.7 outdoor c&i шафа' },
    { title: 'CATL TENER Sodium (Na-ion 4.5 МВт·год)', type: 'Продукт', page: 'product', tag: 'Sodium-ion', productId: 'catl-tener-sodium', keywords: 'натрій sodium 2027 -40C' },
    { title: 'Однолінійна електрична схема РУ-10 кВ (SLD)', type: 'Інженерія', page: 'tech', tag: 'SLD', keywords: 'схема sld 10кв трансформатор тмг pcs' },
    { title: '24-годинний профіль навантаження (Peak Shaving)', type: 'Інженерія', page: 'tech', tag: 'Simulation', keywords: 'графік профіль піки симуляція' },
    { title: 'LCOS симулятор собівартості збереження енергії', type: 'Інженерія', page: 'tech', tag: 'Фінанси', keywords: 'lcos capex opex окупність irr' },
    { title: '5-Рівнева система пожежної безпеки NFPA 855', type: 'Безпека', page: 'safety', tag: 'Safety', keywords: 'nfpa 855 ul 9540a novec пожежогасіння' },
    { title: 'Порівняльна таблиця характеристик CATL', type: 'Аналіз', page: 'compare', tag: 'Matrix', keywords: 'порівняння таблиця характеристики' },
    { title: 'Рішення: Зрізання піків (Peak Shaving)', type: 'Рішення', page: 'solutions', tag: 'Solutions', keywords: 'пікові тарифи ліміти' },
    { title: 'Рішення: СЕС + BESS накопичення', type: 'Рішення', page: 'solutions', tag: 'Solutions', keywords: 'сонце сонячна станція вечірній пік' },
    { title: 'Партнерська програма (EPC / Інтегратори)', type: 'Партнери', page: 'partners', tag: 'Partners', keywords: 'epc партнер дилер навчання' },
    { title: 'Особистий кабінет замовника (Проєкти & ТКП)', type: 'Кабінет', page: 'customer', tag: 'Portal', keywords: 'кабінет розрахунки збережені' },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? searchIndex.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tag.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          (r.keywords && r.keywords.toLowerCase().includes(q))
      )
    : searchIndex;

  const handleItemClick = (item: SearchItem) => {
    if (item.productId && onSelectProduct) {
      onSelectProduct(item.productId);
    }
    onNavigate(item.page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0e1424] p-5 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-3">
          <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Шукати обладнання, моделі TENER, стандарти NFPA, схеми..."
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1"
            >
              Очистити
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Закрити"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[60vh]">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Результати ({filtered.length}):</span>
            <span className="text-[10px] text-neutral-500">Швидка навігація</span>
          </div>

          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemClick(item)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-[#0077ff] shrink-0">
                  {item.type === 'Продукт' ? <Battery className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {item.type} · {item.tag}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-neutral-400 text-xs space-y-3">
              <p>Нічого не знайдено за запитом "{query}".</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenRfq(`Консультація за пошуковим запитом: ${query}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0077ff] text-white font-bold text-xs hover:bg-blue-600"
              >
                <span>Запитати у провідного інженера</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <span>Натисніть Esc для закриття</span>
          <button
            onClick={() => {
              onClose();
              onOpenRfq('Запит з вікна швидкого пошуку');
            }}
            className="text-[#0077ff] font-bold hover:underline cursor-pointer"
          >
            Замовити розрахунок інженера →
          </button>
        </div>
      </div>
    </div>
  );
};
