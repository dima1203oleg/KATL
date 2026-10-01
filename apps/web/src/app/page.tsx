import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Battery, ShieldCheck } from 'lucide-react';

export default function WebHomePage() {
  return (
    <main className="min-h-screen bg-[#080d19] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Next.js App Router · Monorepo Web Application</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
          CATL BESS <span className="text-blue-500">Ukraine</span>
        </h1>

        <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Офіційна інженерна платформа промислових систем накопичення енергії CATL.
          Контрольний vertical slice розгорнуто для перевірки серверного рендерингу (SSR) та PIM архітектури.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            href="/products/catl-tener-h"
            className="inline-flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
          >
            <span>Переглянути контрольний зріз: CATL TENER H</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/en/products/catl-tener-h"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
          >
            <span>English Locale View</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
