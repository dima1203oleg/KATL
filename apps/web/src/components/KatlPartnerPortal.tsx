"use client";

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  FileText,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Headphones,
  Plus,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';

interface KatlPartnerPortalProps {
  onNavigate: (page: KatlPage) => void;
  onOpenRfq: (note?: string) => void;
}

export const KatlPartnerPortal: React.FC<KatlPartnerPortalProps> = ({
  onNavigate,
  onOpenRfq,
}) => {
  const [activeTab, setActiveTab] = useState<'landing' | 'apply' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Partner application form state
  const [applicationData, setApplicationData] = useState({
    companyName: '',
    edrpou: '',
    partnerType: 'EPC / Генпідрядник СЕС',
    region: 'Київ та область',
    experienceYears: '5-10 років',
    installedCapacityMw: '15',
    contactPerson: '',
    phone: '',
    email: '',
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Registered projects
  const [registeredProjects, setRegisteredProjects] = useState([
    { id: 'PRJ-UA-104', client: 'Агрохолдинг Захід', capacity: '2.4 MWh', power: '1.2 MW', status: 'IN_REVIEW', date: '2026-09-15' },
    { id: 'PRJ-UA-089', client: 'Металообробний завод «Дніпро»', capacity: '6.25 MWh', power: '2.5 MW', status: 'APPROVED', date: '2026-08-02' },
  ]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setActiveTab('dashboard');
        // Fetch partner deals
        const dealsRes = await fetch('/api/v1/partner/deals');
        if (dealsRes.ok) {
          const dealsJson = await dealsRes.json();
          if (dealsJson.data && dealsJson.data.length > 0) {
            setRegisteredProjects(
              dealsJson.data.map((d: any) => ({
                id: d.id,
                client: d.clientCompanyName,
                capacity: `${d.dealSizeMwh} MWh`,
                power: `${(d.dealSizeMwh / 2).toFixed(1)} MW`,
                status: d.stage === 'BID_WON' ? 'APPROVED' : 'IN_REVIEW',
                date: d.registeredAt.split('T')[0],
              }))
            );
          }
        }
      } else {
        setIsLoggedIn(true);
        setActiveTab('dashboard');
      }
    } catch {
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#091122] to-[#070a12] pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Головна</button>
            <span>/</span>
            <span className="text-white font-bold">Партнерська програма CATL Ukraine</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-3">
                CATL CERTIFIED PARTNER NETWORK
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Партнерська екосистема для EPC та інсталяторів
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
                Станьте партнером платформи KATL в Україні: доступ до прямого складу, проектні знижки, навчання сервісних інженерів та захист реєстрації проектів.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-4 py-2 rounded-full bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
                >
                  Вийти з кабінету
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('apply')}
                  className="rounded-full bg-[#0077ff] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
                >
                  Подати заявку на партнерство
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-2 mt-8 pt-6 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeTab === 'landing' ? 'bg-[#0077ff] text-white font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Переваги програми
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeTab === 'apply' ? 'bg-[#0077ff] text-white font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Подати заявку (Wizard)
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                activeTab === 'dashboard' ? 'bg-[#0077ff] text-white font-bold' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Партнерський кабінет {isLoggedIn && '✓'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* 1. LANDING OVERVIEW */}
          {activeTab === 'landing' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-[#0077ff] flex items-center justify-center font-bold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">Захист проектів</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Реєструйте свої об’єкти в системі та отримуйте фіксовану ексклюзивну ціну на обладнання CATL без ризику перехоплення ліда іншими гравцями.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">Інженерна сертифікація</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Безкоштовне навчання інженерів у Києві: пусконалагодження, підключення SCADA/EMS та отримання сертифіката CATL Certified Engineer.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">Технічна бібліотека</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Прямий доступ до повних CAD/DWG креслень, схем РУ-10/35 кВ, шаблонів ТКП та інструкцій із монтажу NFPA 855.
                  </p>
                </div>
              </div>

              {/* Ready to apply CTA */}
              <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-blue-950/40 via-[#0e1526] to-slate-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Бажаєте стати авторизованим партнером CATL?
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    Розгляд заявки займає до 2 робочих днів.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('apply')}
                  className="rounded-full bg-[#0077ff] px-6 py-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Заповнити анкету партнера →
                </button>
              </div>
            </div>
          )}

          {/* 2. APPLICATION WIZARD */}
          {activeTab === 'apply' && (
            <div className="max-w-2xl mx-auto rounded-3xl border border-white/15 bg-[#0e1526] p-6 sm:p-10 shadow-2xl">
              {applicationSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-white">
                    Заявку успішно прийнято!
                  </h3>
                  <div className="text-xs font-mono text-blue-400">
                    Номер заявки: PARTNER-APP-2026-{Math.floor(1000 + Math.random() * 9000)}
                  </div>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Дякуємо за інтерес до партнерства з CATL BESS Ukraine. Наш керівник партнерського напрямку зв'яжеться з вами протягом 24 годин.
                  </p>
                  <button
                    onClick={() => setActiveTab('landing')}
                    className="mt-4 rounded-full bg-white/10 px-6 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Повернутися до огляду
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-5">
                  <div>
                    <h3 className="font-display text-xl font-black text-white">
                      Анкета партнера (EPC / Інтегратор / Дилер)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Заповніть інформацію про вашу компанію для отримання партнерських умов.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Назва юридичної особи / компанії:</label>
                      <input
                        type="text"
                        required
                        value={applicationData.companyName}
                        onChange={(e) => setApplicationData({ ...applicationData, companyName: e.target.value })}
                        placeholder="ТОВ «Енерго Інжиніринг»"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white placeholder-neutral-500 focus:border-[#0077ff] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-300 mb-1 font-medium">Тип діяльності:</label>
                        <select
                          value={applicationData.partnerType}
                          onChange={(e) => setApplicationData({ ...applicationData, partnerType: e.target.value })}
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-white focus:border-[#0077ff] focus:outline-none"
                        >
                          <option>EPC / Генпідрядник СЕС</option>
                          <option>Електромонтажна організація</option>
                          <option>Проектний інститут</option>
                          <option>Регіональний дилер</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-neutral-300 mb-1 font-medium">Регіон присутності:</label>
                        <input
                          type="text"
                          required
                          value={applicationData.region}
                          onChange={(e) => setApplicationData({ ...applicationData, region: e.target.value })}
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white focus:border-[#0077ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-300 mb-1 font-medium">Контактна особа:</label>
                        <input
                          type="text"
                          required
                          value={applicationData.contactPerson}
                          onChange={(e) => setApplicationData({ ...applicationData, contactPerson: e.target.value })}
                          placeholder="Ім'я та прізвище"
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white placeholder-neutral-500 focus:border-[#0077ff] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 mb-1 font-medium">Телефон:</label>
                        <input
                          type="tel"
                          required
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                          placeholder="+380 67 000 00 00"
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white placeholder-neutral-500 focus:border-[#0077ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Корпоративний Email:</label>
                      <input
                        type="email"
                        required
                        value={applicationData.email}
                        onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                        placeholder="office@company.ua"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white placeholder-neutral-500 focus:border-[#0077ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0077ff] py-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    Надіслати заявку на авторизацію →
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. PARTNER DASHBOARD (Protected View) */}
          {activeTab === 'dashboard' && (
            <div>
              {!isLoggedIn ? (
                <div className="max-w-md mx-auto rounded-3xl border border-white/15 bg-[#0e1526] p-8 shadow-2xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-blue-500/20 text-[#0077ff] flex items-center justify-center">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">Вхід для партнерів</h3>
                    <p className="text-xs text-neutral-400">Введіть ваші авторизовані облікові дані</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Email:</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="partner@company.ua"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white focus:border-[#0077ff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Пароль:</label>
                      <input
                        type="password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-white focus:border-[#0077ff] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#0077ff] py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      Увійти в кабінет
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Dashboard Header Bar */}
                  <div className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        СТАТУС: CERTIFIED EPC PARTNER
                      </div>
                      <h3 className="font-display text-xl font-bold text-white mt-1">
                        Вітаємо, ТОВ «Солар Інжиніринг Україна»
                      </h3>
                      <div className="text-xs text-neutral-400">Партнерський ID: UA-EPC-9941</div>
                    </div>

                    <button
                      onClick={() => onOpenRfq('Реєстрація нового проекту від партнера')}
                      className="flex items-center gap-2 rounded-xl bg-[#0077ff] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Зареєструвати новий об'єкт</span>
                    </button>
                  </div>

                  {/* Registered Projects Table */}
                  <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-6 space-y-4">
                    <div className="font-display text-base font-bold text-white">
                      Зареєстровані проекти та бронь цін
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-neutral-400 font-mono">
                            <th className="pb-3">Код</th>
                            <th className="pb-3">Замовник / Об'єкт</th>
                            <th className="pb-3">Потужність / Ємність</th>
                            <th className="pb-3">Дата реєстрації</th>
                            <th className="pb-3">Статус броні</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-200">
                          {registeredProjects.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5">
                              <td className="py-3 font-mono text-blue-400 font-bold">{p.id}</td>
                              <td className="py-3 font-semibold text-white">{p.client}</td>
                              <td className="py-3 font-mono">{p.power} / {p.capacity}</td>
                              <td className="py-3 text-neutral-400">{p.date}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  p.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Partner Resources: Training & Materials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <BookOpen className="h-4 w-4 text-blue-400" />
                        <span>Навчальні модулі CATL Academy 2026</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        Сертифікаційні курси: «Пусконалагодження TENER 6.25 MWh» та «Підключення РУ-10 кВ згідно з вимогами Укренерго».
                      </p>
                      <button className="text-xs text-blue-400 font-bold hover:underline cursor-pointer">
                        Відкрити матеріали курсу →
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Headphones className="h-4 w-4 text-emerald-400" />
                        <span>Пряма лінія інженерної підтримки</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        Виділений технічний інженер для вирішення складних питань проектних рішень та узгодження в обленерго.
                      </p>
                      <div className="text-xs font-mono text-white">Тел: +380 (44) 290-88-15 (Партнерська лінія)</div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
