import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Phone, Mail, MapPin, Clock, ShieldCheck, FileCheck, ArrowUpRight } from 'lucide-react';

interface BessRfqSectionProps {
  prefilledSummary?: string;
  prefilledProduct?: string;
  prefilledPowerKw?: number;
  prefilledCapacityKwh?: number;
  isModal?: boolean;
}

export const BessRfqSection: React.FC<BessRfqSectionProps> = ({
  prefilledSummary = '',
  prefilledProduct = '',
  prefilledPowerKw,
  prefilledCapacityKwh,
  isModal = false,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: '',
    currentPowerKw: prefilledPowerKw ? String(prefilledPowerKw) : '500',
    selectedSeries: prefilledProduct || 'CATL EnerOne Plus',
    useCase: 'Peak Shaving (Зрізання піків)',
    details: prefilledSummary || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledSummary || prefilledProduct || prefilledPowerKw) {
      setFormData((prev) => ({
        ...prev,
        details: prefilledSummary || prev.details,
        selectedSeries: prefilledProduct || prev.selectedSeries,
        currentPowerKw: prefilledPowerKw ? String(prefilledPowerKw) : prev.currentPowerKw,
      }));
    }
  }, [prefilledSummary, prefilledProduct, prefilledPowerKw]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      location: '',
      currentPowerKw: '500',
      selectedSeries: 'CATL EnerOne Plus',
      useCase: 'Peak Shaving (Зрізання піків)',
      details: '',
    });
  };

  return (
    <section id="rfq" className={isModal ? 'py-2 bg-transparent' : 'py-20 md:py-28 border-b border-white/5 bg-[#08090d]'}>
      <div className={isModal ? 'w-full' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
        
        {/* Header */}
        {!isModal && (
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Комерційний запит (RFQ)
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              Запит розрахунку проєкту під ключ
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Надішліть параметри вашого об'єкта або графік навантаження. Інженери підготують техніко-економічне обґрунтування (ТЕО) та однолінійну схему підключення.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Запит на розрахунок BESS прийнято!
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Наш провідний інженер з систем накопичення енергії проаналізує вихідні дані та зв’яжеться з вами протягом 2 годин у робочий час.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
                  >
                    Подати новий розрахунок
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Назва компанії / Заводу <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="ТОВ «ПромЕнергоМаш»"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Контактна особа <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="Олександр Василенко, Головний енергетик"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Телефон для зв’язку <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+380 50 123 45 67"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Корпоративний Email <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="energy@promenergomash.ua"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Орієнтовна потужність (кВт або МВт)
                      </label>
                      <input
                        type="text"
                        value={formData.currentPowerKw}
                        onChange={(e) => setFormData({ ...formData, currentPowerKw: e.target.value })}
                        placeholder="500 кВт"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Бажана лінійка CATL
                      </label>
                      <select
                        value={formData.selectedSeries}
                        onChange={(e) => setFormData({ ...formData, selectedSeries: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#0e1017] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="CATL EnerOne Plus">CATL EnerOne Plus (Модульні шафи 372.7 кВт·год)</option>
                        <option value="CATL TENER (6.25 МВт·год)">CATL TENER (6.25 МВт·год Container)</option>
                        <option value="CATL EnerC Plus (3.72 МВт·год)">CATL EnerC Plus (3.72 МВт·год Container)</option>
                        <option value="Потрібна інженерна консультація">Потрібна інженерна консультація</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Додаткові параметри, графік навантаження або ТЗ
                    </label>
                    <textarea
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Вкажіть клас напруги підключення (0.4 / 10 / 35 кВ), наявність власної СЕС або прикріпіть параметри..."
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs font-mono text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-400 py-3.5 px-4 text-xs sm:text-sm font-bold text-black hover:bg-emerald-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-emerald-400/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Передаємо дані інженеру...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Надіслати запит на інженерний розрахунок</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Підписання двостороннього договору NDA перед аналізом схем підприємства</span>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Direct Engineering Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-7 space-y-5">
              <h3 className="font-display text-lg font-bold text-white border-b border-white/10 pb-3">
                Офіційний інженерний центр
              </h3>

              <div className="space-y-4 text-sm text-neutral-300">
                <a
                  href="tel:+380442908812"
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">Гаряча лінія BESS в Україні</div>
                    <div className="font-medium text-white font-mono">+380 44 290 88 12</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-400" />
                </a>

                <a
                  href="mailto:bess@catl-energy.ua"
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">Технічна та комерційна дирекція</div>
                    <div className="font-medium text-white font-mono">bess@catl-energy.ua</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-400" />
                </a>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Київ, вул. Володимирська, 49А (Інженерний офіс)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Пн-Пт: 09:00 — 18:30 (Аварійна диспетчеризація 24/7)</span>
                </div>
              </div>
            </div>

            {/* Standard Compliance Card */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2 text-xs text-neutral-300">
              <div className="font-bold text-white flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>Сертифікований монтаж та введення в експлуатацію</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Повний цикл інжинірингу: проект землеустрою, фундаменти, підключення до РУ-0.4/10/35 кВ, параметризація EMS та погодження з оператором системи розподілу (ОСР).
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
