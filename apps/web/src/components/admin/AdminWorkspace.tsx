'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Check, CircleAlert, FileClock, LogOut, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { PimManager } from './PimManager';

type User = { id: string; email: string; name: string; role: string };
type Rfq = { id: string; company_name: string; contact_person: string; email: string; phone: string; status: string; selected_series: string; use_case: string; created_at: string; power_kw: string | null; capacity_kwh: string | null; utm_source: string | null };
type Change = { id: string; product_id: string; product_name: string; field: string; old_value: unknown; new_value: unknown; source_url: string; evidence_excerpt: string | null; confidence: string; status: string; detected_at: string };
type SyncSource = { id: string; name: string; url: string; source_type: string; product_id: string | null; last_checked: string | null; enabled: boolean; created_at: string };
type Audit = { id: string; action: string; entity: string; entity_id: string; actor: string; timestamp: string; details: Record<string, unknown> };
type Tab = 'overview' | 'pim' | 'rfq' | 'sync' | 'audit';

const statuses = ['NEW', 'QUALIFICATION', 'ENGINEERING', 'PRICING', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED'];
const statusLabels: Record<string, string> = { NEW: 'Новий', QUALIFICATION: 'Кваліфікація', ENGINEERING: 'Інженерія', PRICING: 'Розрахунок ціни', PROPOSAL_SENT: 'Пропозицію надіслано', NEGOTIATION: 'Переговори', WON: 'Успішно', LOST: 'Закрито без угоди', ARCHIVED: 'Архів' };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1/${path}`, { ...init, cache: 'no-store', headers: { ...(init?.body ? { 'content-type': 'application/json' } : {}), ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) throw new Error('SESSION_REQUIRED');
    if (response.status === 403) throw new Error('ROLE_FORBIDDEN');
    throw new Error(data?.message || data?.error || `Запит не виконано (${response.status}).`);
  }
  return data as T;
}

function showValue(value: unknown) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

export function AdminWorkspace() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [sources, setSources] = useState<SyncSource[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [pimCount, setPimCount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);

  const privileged = useMemo(() => ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || ''), [user]);
  const canRfq = privileged || user?.role === 'SALES';
  const canSync = privileged || user?.role === 'ENGINEER';
  const canPim = privileged || user?.role === 'ENGINEER' || user?.role === 'PRODUCT_MANAGER';

  const loadTab = useCallback(async (next: Tab) => {
    if (!user) return;
    setError(''); setBusy(true);
    try {
      if (next === 'overview') {
        const [health, rfqData, syncData] = await Promise.all([
          api<{ database: string; redis: string; productsInPim: number }>('health/ready'),
          canRfq ? api<{ data: Rfq[] }>('rfq') : Promise.resolve({ data: [] as Rfq[] }),
          canSync ? api<{ data: Change[] }>('sync/changes') : Promise.resolve({ data: [] as Change[] }),
        ]);
        setRfqs(rfqData.data); setChanges(syncData.data); setPimCount(health.productsInPim);
        if (health.database !== 'CONNECTED' || health.redis !== 'CONNECTED') throw new Error('Одна або кілька служб не готові. Перевірте стан API та інфраструктури.');
      } else if (next === 'rfq') {
        const result = await api<{ data: Rfq[] }>('rfq'); setRfqs(result.data);
      } else if (next === 'sync') {
        const [changeResult, sourceResult] = await Promise.all([
          api<{ data: Change[] }>('sync/changes'), api<{ data: SyncSource[] }>('sync/sources'),
        ]);
        setChanges(changeResult.data); setSources(sourceResult.data);
      } else if (next === 'audit') {
        const result = await api<{ data: Audit[] }>('audit'); setAudit(result.data);
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Не вдалося завантажити дані.';
      if (message === 'SESSION_REQUIRED') setUser(null);
      else if (message === 'ROLE_FORBIDDEN') setError('Вашій ролі заборонено переглядати цей розділ.');
      else setError(message === 'Failed to fetch' ? 'API тимчасово недоступний. Спробуйте ще раз.' : message);
    } finally { setBusy(false); }
  }, [user, canRfq, canSync]);

  useEffect(() => {
    api<{ data: User }>('auth/me').then((data) => { setUser(data.data); setChecking(false); }).catch(() => setChecking(false));
  }, []);

  useEffect(() => { if (user && tab !== 'pim') void loadTab(tab); }, [user, tab, loadTab]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginBusy(true); setError('');
    try {
      const result = await api<{ user: User }>('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setUser(result.user); setPassword('');
    } catch (cause) { setError(cause instanceof Error && cause.message !== 'SESSION_REQUIRED' ? cause.message : 'Не вдалося увійти. Перевірте email і пароль.'); }
    finally { setLoginBusy(false); }
  }

  async function logout() {
    setBusy(true);
    try { await api('auth/logout', { method: 'POST', body: '{}' }); setUser(null); setTab('overview'); setNotice(''); }
    catch { setError('Не вдалося завершити сесію. Спробуйте ще раз.'); }
    finally { setBusy(false); }
  }

  async function updateRfq(id: string, status: string) {
    setBusy(true); setError(''); setNotice('');
    try { await api(`rfq/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); setNotice(`Статус запиту ${id} оновлено.`); await loadTab('rfq'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Статус не оновлено.'); }
    finally { setBusy(false); }
  }

  async function queueSync() {
    setBusy(true); setError(''); setNotice('');
    try { const result = await api<{ job: { id: string; status: string } }>('sync/run', { method: 'POST', body: '{}' }); setNotice(`Синхронізацію додано в чергу (${result.job.id}).`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Не вдалося запустити синхронізацію.'); }
    finally { setBusy(false); }
  }

  async function reviewChange(id: string, decision: 'approve' | 'reject') {
    setBusy(true); setError(''); setNotice('');
    try { await api(`sync/changes/${encodeURIComponent(id)}/${decision}`, { method: 'POST', body: '{}' }); setNotice(decision === 'approve' ? 'Зміну погоджено й записано в PIM.' : 'Зміну відхилено.'); await loadTab('sync'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Не вдалося опрацювати зміну.'); }
    finally { setBusy(false); }
  }

  if (checking) return <main className="admin-gate"><div className="admin-card" role="status">Перевіряємо захищену сесію…</div></main>;
  if (!user) return <main className="admin-gate"><form className="admin-login admin-card" onSubmit={login}>
    <div className="admin-brand"><span className="brand-wordmark">KATL</span><span>SECURE CONTROL CENTER</span></div>
    <ShieldCheck size={30} aria-hidden="true"/><h1>Вхід до адмінпанелі</h1><p>Доступ надається лише користувачам із призначеною адміністративною роллю.</p>
    {error && <div className="admin-alert" role="alert"><CircleAlert size={16}/>{error}</div>}
    <label>Email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
    <label>Пароль<input type="password" autoComplete="current-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
    <button className="button" disabled={loginBusy}>{loginBusy ? 'Перевіряємо…' : 'Увійти'}</button>
  </form></main>;

  if (!['SUPER_ADMIN', 'ADMIN', 'SALES', 'ENGINEER', 'PRODUCT_MANAGER'].includes(user.role)) return <main className="admin-gate"><section className="admin-card"><ShieldCheck/><h1>Доступ заборонено</h1><p>Обліковий запис має роль {user.role}, якій не надано доступ до контрольного центру.</p><button className="button button-secondary" onClick={logout}>Вийти</button></section></main>;

  const tabs: { id: Tab; label: string; allowed: boolean }[] = [
    { id: 'overview', label: 'Огляд', allowed: true }, { id: 'pim', label: 'PIM', allowed: canPim }, { id: 'rfq', label: 'Запити RFQ', allowed: canRfq },
    { id: 'sync', label: 'CATL Sync', allowed: canSync }, { id: 'audit', label: 'Журнал аудиту', allowed: privileged },
  ];
  return <main className="admin-app"><aside className="admin-sidebar">
    <a href="/uk-UA" className="admin-brand"><span className="brand-wordmark">KATL</span><span>CONTROL CENTER</span></a>
    <div className="admin-user"><span className="admin-avatar">{user.name.slice(0, 1).toUpperCase()}</span><span><strong>{user.name}</strong><small>{user.role}</small></span></div>
    <nav aria-label="Адміністративна навігація">{tabs.filter((item) => item.allowed).map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setNotice(''); setError(''); setTab(item.id); }}>{item.id === 'overview' ? <Activity size={17}/> : item.id === 'pim' ? <ShieldCheck size={17}/> : item.id === 'rfq' ? <ArrowRight size={17}/> : item.id === 'sync' ? <RefreshCw size={17}/> : <FileClock size={17}/>}<span>{item.label}</span></button>)}</nav>
    <button className="admin-logout" onClick={logout} disabled={busy}><LogOut size={16}/>Вийти</button>
  </aside><section className="admin-main">
    <header className="admin-topbar"><div><span className="eyebrow">KATL · ЗАХИЩЕНА ЗОНА</span><h1>{tabs.find((item) => item.id === tab)?.label}</h1></div><button className="button button-secondary" onClick={() => void loadTab(tab)} disabled={busy}><RefreshCw size={15}/>Оновити</button></header>
    {error && <div className="admin-alert" role="alert"><CircleAlert size={16}/>{error}</div>}{notice && <div className="admin-notice" role="status"><Check size={16}/>{notice}</div>}
    {busy && <div className="admin-progress" role="status">Оновлюємо дані…</div>}
    {tab === 'pim' && <PimManager/>}
    {tab === 'overview' && <>
      <div className="admin-metrics"><Metric label="Усі RFQ" value={canRfq ? rfqs.length : '—'} hint="Дані з PostgreSQL"/><Metric label="Нові запити" value={canRfq ? rfqs.filter((item) => item.status === 'NEW').length : '—'} hint="Очікують кваліфікації"/><Metric label="Зміни на перевірці" value={canSync ? changes.filter((item) => item.status === 'PENDING_REVIEW').length : '—'} hint="Потрібне рішення інженера"/><Metric label="PIM-записи" value={pimCount ?? '—'} hint="Опублікований каталог"/></div>
      <section className="admin-card"><div className="admin-section-title"><div><h2>Останні запити</h2><p>Останні запити, збережені у внутрішній CRM.</p></div>{canRfq && <button className="admin-link" onClick={() => setTab('rfq')}>Усі RFQ <ArrowRight size={15}/></button>}</div>{!canRfq ? <Empty text="Вашій ролі недоступні комерційні запити."/> : rfqs.length ? <RfqTable items={rfqs.slice(0, 6)} disabled={busy} onChange={updateRfq}/> : <Empty text="Нових запитів поки немає."/>}</section>
    </>}
    {tab === 'rfq' && <section className="admin-card"><div className="admin-section-title"><div><h2>Комерційна черга</h2><p>Перехід між етапами зберігається з історією та записом аудиту.</p></div><span className="admin-count">{rfqs.length} записів</span></div>{rfqs.length ? <RfqTable items={rfqs} disabled={busy} onChange={updateRfq}/> : <Empty text="Запитів RFQ поки немає."/>}</section>}
    {tab === 'sync' && <><section className="admin-card"><div className="admin-section-title"><div><h2>Офіційні джерела CATL</h2><p>Джерела прив’язуються до чернеток PIM. Перевірка створює знімок і пропозиції змін, але не публікує їх.</p></div><button className="button" onClick={queueSync} disabled={busy}><RefreshCw size={15}/>Запустити перевірку</button></div>{sources.length ? <div className="sync-source-list">{sources.map((source) => <article className="sync-source" key={source.id}><span className={source.enabled ? 'sync-source-dot is-enabled' : 'sync-source-dot'} aria-hidden="true"/><div><strong>{source.name}</strong><a href={source.url} target="_blank" rel="noreferrer">{source.url}</a></div><span>{source.last_checked ? `Перевірено ${new Date(source.last_checked).toLocaleString('uk-UA')}` : 'Ще не перевірено'}</span></article>)}</div> : <Empty text="Реєстр порожній. Додайте чернетку PIM з офіційним URL, щоб створити джерело."/>}</section><section className="admin-card"><div className="admin-section-title"><div><h2>Зміни, що очікують перевірки</h2><p>Перед погодженням звірте попереднє та нове значення з джерелом.</p></div></div>{changes.filter((item) => item.status === 'PENDING_REVIEW').length ? <div className="sync-review-list">{changes.filter((item) => item.status === 'PENDING_REVIEW').map((item) => <article className="sync-review" key={item.id}><div className="sync-review-heading"><div><span className="eyebrow">{item.product_name} · {item.field}</span><h3>{item.id}</h3></div><span className="admin-badge">{item.confidence} · {new Date(item.detected_at).toLocaleString('uk-UA')}</span></div><div className="sync-diff"><div><span>ПОПЕРЕДНЄ</span><pre>{showValue(item.old_value)}</pre></div><div><span>ЗНАЙДЕНО</span><pre>{showValue(item.new_value)}</pre></div></div>{item.evidence_excerpt && <blockquote>{item.evidence_excerpt}</blockquote>}<a href={item.source_url} target="_blank" rel="noreferrer">Відкрити джерело →</a><div className="sync-actions"><button className="button button-secondary" onClick={() => reviewChange(item.id, 'reject')} disabled={busy}><X size={15}/>Відхилити</button><button className="button" onClick={() => reviewChange(item.id, 'approve')} disabled={busy}><Check size={15}/>Погодити й оновити PIM</button></div></article>)}</div> : <Empty text="Немає змін, що очікують перевірки."/>}</section></>}
    {tab === 'audit' && <section className="admin-card"><div className="admin-section-title"><div><h2>Критичні дії</h2><p>Хто, що й коли змінив у системі.</p></div><span className="admin-count">Останні {audit.length}</span></div>{audit.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Час</th><th>Дія</th><th>Об’єкт</th><th>Користувач</th><th>Деталі</th></tr></thead><tbody>{audit.map((item) => <tr key={item.id}><td>{new Date(item.timestamp).toLocaleString('uk-UA')}</td><td><code>{item.action}</code></td><td>{item.entity} · {item.entity_id}</td><td>{item.actor}</td><td><pre>{JSON.stringify(item.details)}</pre></td></tr>)}</tbody></table></div> : <Empty text="Записів аудиту поки немає."/>}</section>}
  </section></main>;
}

function Metric({ label, value, hint }: { label: string; value: React.ReactNode; hint: string }) { return <article className="admin-metric"><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>; }
function Empty({ text }: { text: string }) { return <div className="admin-empty"><ShieldCheck size={19}/><p>{text}</p></div>; }
function RfqTable({ items, disabled, onChange }: { items: Rfq[]; disabled: boolean; onChange: (id: string, status: string) => void }) { return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Запит</th><th>Компанія / контакт</th><th>Система</th><th>Потужність / енергія</th><th>Джерело</th><th>Статус</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.id}</strong><small>{new Date(item.created_at).toLocaleString('uk-UA')}</small></td><td><strong>{item.company_name}</strong><small>{item.contact_person} · {item.email}</small><small>{item.phone}</small></td><td>{item.selected_series}<small>{item.use_case}</small></td><td>{item.power_kw ? `${item.power_kw} kW` : '—'} / {item.capacity_kwh ? `${item.capacity_kwh} kWh` : '—'}</td><td>{item.utm_source || 'Не визначено'}</td><td><select aria-label={`Статус ${item.id}`} value={item.status} disabled={disabled} onChange={(event) => onChange(item.id, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td></tr>)}</tbody></table></div>; }
