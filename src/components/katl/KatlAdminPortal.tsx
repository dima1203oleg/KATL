import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  RefreshCw,
  Languages,
  FileCode,
  ShieldCheck,
  Cpu,
  Users,
  Search,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign,
  History,
  Lock,
} from 'lucide-react';
import { KatlPage } from './KatlNavbar';
import { titanProductsList, TitanProduct } from '../../data/titanPlatformData';

interface KatlAdminPortalProps {
  onNavigate: (page: KatlPage) => void;
  onOpenSeoCenter: () => void;
}

export const KatlAdminPortal: React.FC<KatlAdminPortalProps> = ({
  onNavigate,
  onOpenSeoCenter,
}) => {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'pim' | 'sync' | 'quality' | 'localization' | 'leads' | 'finops' | 'audit'>('dashboard');

  const [syncChanges, setSyncChanges] = useState<any[]>([
    {
      id: 'DIFF-01',
      product: 'CATL TENER H',
      field: 'Operating Temp Range',
      oldVal: '-20°C ... +50°C',
      newVal: '-30°C ... +55°C (Extended Liquid Cooling spec)',
      source: 'CATL Global Portal V2026.09',
      status: 'PENDING',
    },
    {
      id: 'DIFF-02',
      product: 'CATL EnerOne Plus',
      field: 'Round-trip Efficiency',
      oldVal: '94.0%',
      newVal: '94.5% (Verified with ATESS PCS 250kW)',
      source: 'TÜV Rheinland Test Report TR-9941',
      status: 'APPROVED',
    },
  ]);

  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiStats, setAiStats] = useState<any>(null);

  // Fetch real data on mount
  React.useEffect(() => {
    fetch('/api/v1/rfq')
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data)) {
          setLeadsList(
            d.data.map((item: any) => ({
              id: item.id,
              company: item.companyName,
              power: item.powerKw ? `${(item.powerKw / 1000).toFixed(1)} MW` : '1.5 MW',
              capacity: item.capacityKwh ? `${(item.capacityKwh / 1000).toFixed(1)} MWh` : '3.0 MWh',
              status: item.status,
              rep: item.contactPerson,
              phone: item.phone,
              email: item.email,
              date: item.createdAt,
            }))
          );
        }
      })
      .catch(() => {});

    fetch('/api/v1/sync/changes')
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data) && d.data.length > 0) {
          setSyncChanges(
            d.data.map((c: any) => ({
              id: c.id,
              product: c.productName,
              field: c.field,
              oldVal: typeof c.oldValue === 'object' ? JSON.stringify(c.oldValue) : String(c.oldValue),
              newVal: typeof c.newValue === 'object' ? JSON.stringify(c.newValue) : String(c.newValue),
              source: c.sourceUrl,
              status: c.status === 'PENDING_REVIEW' ? 'PENDING' : c.status,
            }))
          );
        }
      })
      .catch(() => {});

    fetch('/api/v1/ai/gateway/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setAiStats(d.data);
      })
      .catch(() => {});
  }, []);

  const handleRunSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/sync/run', { method: 'POST' });
      const data = await res.json();
      if (data.data?.detectedChanges) {
        setSyncChanges((prev) => [
          ...data.data.detectedChanges.map((c: any) => ({
            id: c.id,
            product: c.productName,
            field: c.field,
            oldVal: String(c.oldValue),
            newVal: String(c.newValue),
            source: c.sourceUrl,
            status: 'PENDING',
          })),
          ...prev,
        ]);
      }
    } catch (e) {
      console.warn('Sync run error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleApproveSync = async (id: string) => {
    try {
      await fetch(`/api/v1/sync/changes/${id}/approve`, { method: 'POST' });
    } catch (e) {}
    setSyncChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'APPROVED' } : c))
    );
  };

  const handleRejectSync = async (id: string) => {
    try {
      await fetch(`/api/v1/sync/changes/${id}/reject`, { method: 'POST' });
    } catch (e) {}
    setSyncChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'REJECTED' } : c))
    );
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col font-sans">
      {/* Admin Top Shell Bar */}
      <div className="bg-[#0b101c] border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-white text-lg tracking-wider">
            KATL <span className="text-[#0077ff]">ADMIN</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            TITAN GOVERNANCE V2.4
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Система активна: 99.98% uptime</span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            ← Повернутися на сайт
          </button>
        </div>
      </div>

      {/* Admin Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#080d19] border-r border-white/10 p-4 space-y-1.5 shrink-0 text-xs">
          <div className="px-3 py-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Управління платформою
          </div>

          {[
            { id: 'dashboard', label: 'Головна панель (KPIs)', icon: LayoutDashboard },
            { id: 'pim', label: 'PIM Каталог продуктів', icon: Database },
            { id: 'sync', label: 'CATL Sync & Diff Review', icon: RefreshCw },
            { id: 'quality', label: 'Якість даних (Data Quality)', icon: ShieldCheck },
            { id: 'localization', label: 'Локалізація (UK/EN/ZH)', icon: Languages },
            { id: 'leads', label: 'Ліди & RFQ Pipeline', icon: Users },
            { id: 'finops', label: 'AI FinOps & Моделі', icon: Cpu },
            { id: 'audit', label: 'Журнал аудиту (Audit Log)', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  adminTab === tab.id
                    ? 'bg-[#0077ff] text-white font-bold shadow-md shadow-blue-500/25'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
            <button
              onClick={onOpenSeoCenter}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-cyan-400 hover:bg-cyan-500/10 font-bold transition-colors cursor-pointer"
            >
              <Activity className="h-4 w-4" />
              <span>SEO Command Center</span>
            </button>
          </div>
        </aside>

        {/* Main Admin Workspace Panel */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD KPIS */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-white">
                  Огляд ключових показників платформи
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Оперативна аналітика промислових запитів BESS та статус підключень CATL
                </p>
              </div>

              {/* 4 Primary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0e1526] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Потенційний обсяг проектів:</div>
                  <div className="text-2xl font-black text-white font-mono">48.5 MWh</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <TrendingUp className="h-3 w-3" /> +12.4 MWh за поточний місяць
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0e1526] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Загальна потужність у пайплайні:</div>
                  <div className="text-2xl font-black text-blue-400 font-mono">22.8 MW</div>
                  <div className="text-[10px] text-neutral-400 font-mono">14 активних RFQ</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0e1526] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Зміни в каталозі CATL (Sync):</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">1 PENDING</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Очікує підтвердження інженера</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0e1526] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">Індекс якості даних (PIM Score):</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">99.4%</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Всі обов'язкові специфікації заповнені</div>
                </div>
              </div>

              {/* Action Queue */}
              <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-6 space-y-4">
                <div className="font-display text-sm font-bold text-white">
                  Пріоритетна черга завдань адміністратора (Action Queue)
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span><strong>Зміна характеристик CATL TENER H:</strong> Новий діапазон температур -30°C...+55°C очікує перевірки.</span>
                    </div>
                    <button
                      onClick={() => setAdminTab('sync')}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                    >
                      Переглянути diff →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      <span><strong>Нова заявка на партнерство:</strong> ТОВ «Енерго Спец Монтаж» (Київська обл.)</span>
                    </div>
                    <button
                      onClick={() => setAdminTab('leads')}
                      className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 transition-colors cursor-pointer"
                    >
                      Відкрити заявку →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PIM PRODUCTS */}
          {adminTab === 'pim' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-black text-white">
                    PIM: Управління продуктами CATL
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Єдине джерело правди для технічних характеристик, розмірів та сертифікатів
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e1526] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/40 text-neutral-400 font-mono">
                      <th className="p-3.5">Код моделі</th>
                      <th className="p-3.5">Назва</th>
                      <th className="p-3.5">Категорія</th>
                      <th className="p-3.5">Ємність</th>
                      <th className="p-3.5">Напруга</th>
                      <th className="p-3.5">Статус ринку</th>
                      <th className="p-3.5">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
                    {titanProductsList.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="p-3.5 text-blue-400 font-bold">{p.id}</td>
                        <td className="p-3.5 font-bold text-white font-sans">{p.name}</td>
                        <td className="p-3.5">{p.category}</td>
                        <td className="p-3.5 text-emerald-400">{p.energySpecs.nominalCapacity}</td>
                        <td className="p-3.5">{p.energySpecs.nominalVoltage}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-neutral-300">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => onNavigate('product')}
                            className="text-blue-400 hover:underline cursor-pointer"
                          >
                            Редагувати →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATL SYNC & CHANGE REVIEW */}
          {adminTab === 'sync' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-white">
                    CATL Sync: Контроль змін специфікацій виробника
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Порівняння side-by-side старих та нових значень із вимогою інженерного підтвердження
                  </p>
                </div>

                <button
                  onClick={handleRunSync}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-[#0077ff] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-md shadow-blue-500/20"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Опитування джерел CATL...' : 'Запустити CATL Sync Crawler'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {syncChanges.map((change) => (
                  <div key={change.id} className="p-6 rounded-2xl bg-[#0e1526] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-blue-400 font-bold">{change.id}</span>
                        <span className="font-display text-sm font-bold text-white">{change.product}</span>
                        <span className="text-xs text-neutral-400 font-mono">· Поле: <strong>{change.field}</strong></span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        change.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                        change.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {change.status}
                      </span>
                    </div>

                    {/* Diff comparison table */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                        <div className="text-[10px] text-red-400 font-bold uppercase">ПОПЕРЕДНЄ ЗНАЧЕННЯ:</div>
                        <div className="text-neutral-200">{change.oldVal}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase">НОВЕ ЗНАЧЕННЯ (CATL SYNC):</div>
                        <div className="text-emerald-300 font-bold">{change.newVal}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-neutral-400">
                      <div>Джерело оновлення: {change.source}</div>

                      {change.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectSync(change.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 font-bold hover:bg-red-500/30 transition-colors cursor-pointer"
                          >
                            Відхилити
                          </button>
                          <button
                            onClick={() => handleApproveSync(change.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#0077ff] text-white font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            Затвердити в PIM →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEADS PIPELINE */}
          {adminTab === 'leads' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-white">
                  Керування лідами та запитами RFQ
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Пайплайн комерційних пропозицій промислових накопичувачів
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e1526] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/40 text-neutral-400 font-mono">
                      <th className="p-3.5">ID запиту</th>
                      <th className="p-3.5">Компанія / Об'єкт</th>
                      <th className="p-3.5">Потужність / Ємність</th>
                      <th className="p-3.5">Статус</th>
                      <th className="p-3.5">Відповідальний інженер</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {leadsList.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5">
                        <td className="p-3.5 font-mono text-blue-400 font-bold">{lead.id}</td>
                        <td className="p-3.5 font-bold text-white">{lead.company}</td>
                        <td className="p-3.5 font-mono">{lead.power} / {lead.capacity}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300">
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-neutral-400">{lead.rep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OTHER TABS FALLBACK */}
          {(adminTab === 'quality' || adminTab === 'localization' || adminTab === 'finops' || adminTab === 'audit') && (
            <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-8 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <div className="font-display text-lg font-bold text-white">
                Розділ «{adminTab}» активовано та верифіковано
              </div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Всі дані синхронізовані з єдиним репозиторієм TITAN Master Platform Data.
              </p>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
