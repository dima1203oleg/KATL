import React from 'react';
import { ArrowUp, Github, Linkedin, MessageSquare, Twitter } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = content[lang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#08090d] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-display text-lg font-bold tracking-tight text-white">OBRIY</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              {t.tagline}. Інженерія швидких інтерфейсів, SaaS платформ та рішень електронної комерції для амбітних компаній.
            </p>
            <div className="pt-2 text-xs text-amber-400/90 font-medium">
              {t.madeIn}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                {lang === 'ua' ? 'Навігація' : 'Navigation'}
              </div>
              <div><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Послуги</a></div>
              <div><a href="#cases" className="text-neutral-400 hover:text-white transition-colors">Проєкти</a></div>
              <div><a href="#estimator" className="text-neutral-400 hover:text-white transition-colors">Калькулятор</a></div>
              <div><a href="#process" className="text-neutral-400 hover:text-white transition-colors">Процес</a></div>
            </div>

            <div className="space-y-2.5">
              <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                {lang === 'ua' ? 'Контакти' : 'Contact'}
              </div>
              <div><a href="https://t.me/obriy_studio" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">Telegram</a></div>
              <div><a href="mailto:hello@obriy.studio" className="text-neutral-400 hover:text-white transition-colors">hello@obriy.studio</a></div>
              <div><a href="tel:+380442908812" className="text-neutral-400 hover:text-white transition-colors">+380 44 290 88 12</a></div>
              <div><span className="text-neutral-500">Київ, Україна</span></div>
            </div>
          </div>

          {/* Back to Top */}
          <div className="md:col-span-3 flex md:justify-end">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>{lang === 'ua' ? 'Вгору' : 'Back to top'}</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div>{t.copyright}</div>
          <div className="flex items-center gap-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300 transition-colors">
              {t.privacy}
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300 transition-colors">
              {t.terms}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
