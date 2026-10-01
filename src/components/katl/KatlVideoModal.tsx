import React from 'react';
import { X, Play, Shield, Battery, CheckCircle2, ExternalLink } from 'lucide-react';

interface KatlVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const KatlVideoModal: React.FC<KatlVideoModalProps> = ({
  isOpen,
  onClose,
  title = 'CATL TENER: Огляд технологій безпеки та нульової деградації',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-2xl border border-white/20 bg-[#0b101c] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-[#0077ff]">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video Player Mockup Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 border border-white/10 flex flex-col items-center justify-center text-center p-8 group">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#0077ff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0077ff] text-white shadow-xl shadow-blue-500/40 group-hover:scale-110 transition-transform cursor-pointer">
              <Play className="h-7 w-7 fill-current ml-1" />
            </div>

            <div>
              <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                CATL BESS GLOBAL OFFICIAL SHOWCASE
              </div>
              <h4 className="font-display text-lg sm:text-xl font-bold text-white mt-1">
                Zero Degradation in First 5 Years & 15 000 Cycles
              </h4>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Повний технічний розбір архітектури рідинного охолодження, пожежної безпеки NFPA 855 та системи AI BMS для промислових парків.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-300 pt-2">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-blue-400" /> UL 9540A Verified</span>
              <span className="flex items-center gap-1.5"><Battery className="h-3.5 w-3.5 text-emerald-400" /> LFP 575 Ah Cells</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> 6.25 — 9.0 МВт·год</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-neutral-400 bg-black/60 backdrop-blur-md py-2 px-4 rounded-lg">
            <span>02:18 / 02:18 (HD 1080p)</span>
            <span className="text-blue-400 font-bold">Офіційний відеоматеріал CATL Energy Storage</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 pt-2">
          <span>Мова: Українська (з субтитрами та інженерними коментарями)</span>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20 cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
