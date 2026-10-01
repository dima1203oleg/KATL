import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { BessRfqSection } from '../BessRfqSection';

interface KatnRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProduct?: string;
  prefilledSummary?: string;
  prefilledPowerKw?: number;
  prefilledCapacityKwh?: number;
}

export const KatlRfqModal: React.FC<KatnRfqModalProps> = ({
  isOpen,
  onClose,
  prefilledProduct,
  prefilledSummary,
  prefilledPowerKw,
  prefilledCapacityKwh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl border border-white/20 bg-[#070b16] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#070b16]/95 backdrop-blur-md px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0077ff] animate-pulse" />
            <h3 className="font-display text-base sm:text-lg font-bold text-white">
              Запит комерційної та інженерної пропозиції CATL (RFQ)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            aria-label="Закрити"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          <BessRfqSection
            prefilledProduct={prefilledProduct}
            prefilledSummary={prefilledSummary}
            prefilledPowerKw={prefilledPowerKw}
            prefilledCapacityKwh={prefilledCapacityKwh}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
};
