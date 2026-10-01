import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { content } from '../data/content';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  onOpenBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[lang].nav;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0c0d12]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          <span>OBRIY</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => scrollTo('services')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {t.services}
          </button>
          <button
            onClick={() => scrollTo('cases')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {t.cases}
          </button>
          <button
            onClick={() => scrollTo('estimator')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {t.estimator}
          </button>
          <button
            onClick={() => scrollTo('process')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {t.process}
          </button>
          <button
            onClick={() => scrollTo('reviews')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {t.reviews}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'ua' ? 'en' : 'ua')}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Mode Switch */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => scrollTo('contact')}
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shadow-sm shadow-amber-400/20"
          >
            {t.contact}
          </button>

          {/* Mobile Menu Button */}
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
        <div className="md:hidden border-b border-white/10 bg-[#0c0d12] px-6 py-6 transition-all">
          <nav className="flex flex-col space-y-4 text-base font-medium text-neutral-200">
            <button
              onClick={() => scrollTo('services')}
              className="text-left py-2 hover:text-amber-400 transition-colors"
            >
              {t.services}
            </button>
            <button
              onClick={() => scrollTo('cases')}
              className="text-left py-2 hover:text-amber-400 transition-colors"
            >
              {t.cases}
            </button>
            <button
              onClick={() => scrollTo('estimator')}
              className="text-left py-2 hover:text-amber-400 transition-colors"
            >
              {t.estimator}
            </button>
            <button
              onClick={() => scrollTo('process')}
              className="text-left py-2 hover:text-amber-400 transition-colors"
            >
              {t.process}
            </button>
            <button
              onClick={() => scrollTo('reviews')}
              className="text-left py-2 hover:text-amber-400 transition-colors"
            >
              {t.reviews}
            </button>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full rounded-md border border-white/20 py-2.5 text-center text-xs font-semibold text-white hover:bg-white/5"
              >
                {lang === 'ua' ? 'Забронювати дзвінок' : 'Book a Call'}
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="w-full rounded-md bg-amber-400 py-2.5 text-center text-xs font-bold text-black hover:bg-amber-300"
              >
                {t.contact}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
