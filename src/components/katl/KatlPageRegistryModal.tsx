import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { titanPageRegistry, PageRegistryItem } from '../../data/titanPlatformData';
import { KatlPage } from './KatlNavbar';

interface KatlPageRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: KatlPage) => void;
}

export const KatlPageRegistryModal: React.FC<KatlPageRegistryModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = titanPageRegistry.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.route.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-3xl border border-white/20 bg-[#070b16] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#091122] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-[#0077ff]">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <div>
              <div className="font-display text-sm font-bold text-white flex items-center gap-2">
                <span>TITAN PAGE REGISTRY & ROUTE GOVERNANCE</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  100% IMPLEMENTED
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Центральний реєстр сторінок, SEO-інтенту, аналітичних подій та статусів готовності
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Закрити"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter and Stats Bar */}
        <div className="p-4 bg-[#0a0f1d] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['all', 'Public', 'Engineering', 'Commercial', 'Portals', 'Admin', 'SEO'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#0077ff] text-white font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Всі сторінки (17)' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Швидкий фільтр маршрутів..."
              className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#0077ff]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-neutral-400 font-mono">
                <th className="p-3">ID</th>
                <th className="p-3">Маршрут / Шаблон</th>
                <th className="p-3">Категорія</th>
                <th className="p-3">Призначення & Дані</th>
                <th className="p-3">SEO Інтент</th>
                <th className="p-3">Analytics Event</th>
                <th className="p-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono text-blue-400 font-bold">{item.id}</td>
                  <td className="p-3">
                    <div className="font-bold text-white font-display">{item.name}</div>
                    <div className="text-[11px] font-mono text-neutral-400">{item.route}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-neutral-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="text-[11px] text-neutral-200">{item.purpose}</div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">Джерело: {item.dataSource}</div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-neutral-300">{item.seoIntent}</td>
                  <td className="p-3 font-mono text-[11px] text-cyan-400">{item.analyticsEvent}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="h-3 w-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-[#091122] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <div className="font-mono">
            Всього шаблонів: <strong className="text-white">17</strong> · Реалізовано: <strong className="text-emerald-400">17 (100%)</strong> · Помилок: <strong className="text-white">0</strong>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
            >
              Закрити реєстр
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
