import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, MessageSquare, Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface ContactSectionProps {
  lang: Language;
  prefilledBrief?: string;
  prefilledBudget?: string;
  prefilledType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  prefilledBrief = '',
  prefilledBudget = '',
  prefilledType = '',
}) => {
  const t = content[lang].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: prefilledType || 'Вебсервіс / SaaS',
    budget: prefilledBudget || '$2,000 – $4,000',
    message: prefilledBrief || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update form if prefilled props change from calculator
  useEffect(() => {
    if (prefilledBrief || prefilledBudget || prefilledType) {
      setFormData((prev) => ({
        ...prev,
        message: prefilledBrief ? `${prefilledBrief}\n\nКоментар: ` : prev.message,
        budget: prefilledBudget || prev.budget,
        projectType: prefilledType || prev.projectType,
      }));
    }
  }, [prefilledBrief, prefilledBudget, prefilledType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg(lang === 'ua' ? 'Будь ласка, вкажіть ваше ім’я' : 'Please provide your name');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg(lang === 'ua' ? 'Введіть коректну електронну адресу' : 'Please provide a valid email');
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable local submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: 'Вебсервіс / SaaS',
      budget: '$2,000 – $4,000',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {lang === 'ua' ? 'Зв’язок & Бриф' : 'Contact & Briefing'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-neutral-300 mt-3 leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#13151f] p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {t.successTitle}
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    {t.successDesc}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {t.resetBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t.nameLabel} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.namePlaceholder}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t.emailLabel} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.emailPlaceholder}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t.phoneLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t.phonePlaceholder}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t.budgetLabel}
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#0e1017] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none transition-colors"
                      >
                        {t.budgets.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      {t.messageLabel}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.messagePlaceholder}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none transition-colors font-mono text-xs sm:text-sm leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-400 py-3 px-4 text-sm font-bold text-black hover:bg-amber-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-amber-400/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t.submitting}</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{t.submitBtn}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>{lang === 'ua' ? 'Відповідь протягом 2 годин у робочий час' : 'Response guaranteed in under 2 business hours'}</span>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Direct Inquiries and Trust Signals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#13151f] p-6 sm:p-7 space-y-5">
              <h3 className="font-display text-lg font-bold text-white border-b border-white/10 pb-3">
                {t.directContactTitle}
              </h3>

              <div className="space-y-4 text-sm text-neutral-300">
                <a
                  href="https://t.me/obriy_studio"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">Telegram Messenger</div>
                    <div className="font-medium text-white">@obriy_studio</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-amber-400" />
                </a>

                <a
                  href="mailto:hello@obriy.studio"
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">Email Address</div>
                    <div className="font-medium text-white">hello@obriy.studio</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-amber-400" />
                </a>

                <a
                  href="tel:+380442908812"
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">{lang === 'ua' ? 'Прямий телефон' : 'Phone Line'}</div>
                    <div className="font-medium text-white font-mono">+380 44 290 88 12</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-amber-400" />
                </a>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{t.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{t.workingHours}</span>
                </div>
              </div>
            </div>

            {/* NDA & Security Badge */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 flex items-center gap-3 text-xs text-neutral-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span>
                {lang === 'ua'
                  ? 'Підписуємо договір NDA про нерозголошення перед початком будь-яких робіт за вашим запитом.'
                  : 'We execute a mutual Non-Disclosure Agreement (NDA) prior to review upon request.'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
