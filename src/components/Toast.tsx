import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-amber-400/30 bg-[#151722]/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-neutral-400 hover:text-white"
        aria-label="Dismiss toast"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
