'use client';

import { FormEvent, Fragment, useCallback, useEffect, useState } from 'react';
import { Archive, Check, FilePlus2, Pencil, RotateCw, Save, Send, Upload, X } from 'lucide-react';

type Product = {
  id: string; name: string; family: string; category: string; product_type: string; short_desc: string; highlight: string; status: string;
  source_url: string; confidence: string; verified_at: string | null; verified_by: string | null; revision: number; updated_at: string; latest_source_snapshot_id: string | null;
  energy_specs: Record<string, unknown>; cell_specs: Record<string, unknown>; mechanical_specs: Record<string, unknown>;
  thermal_specs: Record<string, unknown>; safety_specs: Record<string, unknown>; compatibility: Record<string, unknown>;
  fact_sources: Record<string, { pageSection: string; excerpt: string; status?: string; sourceSnapshotId?: string }>;
  staged_revision_id?: string | null; staged_revision_status?: string | null; staged_base_revision?: number | null; staged_created_by_id?: string | null;
};
type FactEvidence = { pageSection: string; excerpt: string };
type Revision = { revision: number; event: string; actor: string; note: string | null; source_snapshot_id: string | null; created_at: string };
type Form = {
  id: string; name: string; family: string; category: string; productType: string; shortDesc: string; highlight: string; sourceUrl: string;
  energySpecs: string; cellSpecs: string; mechanicalSpecs: string; thermalSpecs: string; safetySpecs: string; compatibility: string;
  factSources: Record<string, FactEvidence>;
};

const blank: Form = { id: '', name: '', family: '', category: '', productType: '', shortDesc: '', highlight: '', sourceUrl: '', energySpecs: '{}', cellSpecs: '{}', mechanicalSpecs: '{}', thermalSpecs: '{}', safetySpecs: '{}', compatibility: '{}', factSources: {} };
const fieldGroups = [
  ['energySpecs', 'Енергія та потужність'], ['cellSpecs', 'Акумуляторні елементи'], ['mechanicalSpecs', 'Механіка'],
  ['thermalSpecs', 'Терморегулювання'], ['safetySpecs', 'Безпека'], ['compatibility', 'Сумісність'],
] as const;
const categories = ['Utility-scale ESS', 'C&I ESS', 'Residential ESS', 'Data Center ESS', 'Sodium-ion ESS', 'Battery Cells', 'Battery Modules & Racks', 'PCS & Inverters', 'BMS', 'EMS', 'SCADA', 'Transformers & Switchgear', 'Thermal Management', 'Fire Safety', 'Accessories'];

function factPointerSegment(value: string) { return value.replace(/~/g, '~0').replace(/\//g, '~1'); }
function technicalFacts(form: Form) {
  const facts: Array<{ path: string; value: unknown }> = [];
  const visit = (path: string, value: unknown) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) { value.forEach((item,index) => visit(`${path}/${index}`,item)); return; }
    if (typeof value === 'object') { for (const [key,child] of Object.entries(value as Record<string,unknown>)) visit(`${path}/${factPointerSegment(key)}`,child); return; }
    facts.push({ path,value });
  };
  for (const [key] of fieldGroups) {
    try { visit(`/${key.replace(/[A-Z]/g,(letter)=>`_${letter.toLowerCase()}`)}`,JSON.parse(form[key])); } catch { /* The JSON editor displays its own validation on save. */ }
  }
  return facts.slice(0,500);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1/${path}`, { ...init, cache: 'no-store', headers: { ...(init?.body ? { 'content-type': 'application/json' } : {}), ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || data?.error || `Запит не виконано (${response.status}).`);
  return data as T;
}

function asJson(value: string, label: string) {
  try { const parsed = JSON.parse(value); if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error(); return parsed; }
  catch { throw new Error(`Поле «${label}» має містити коректний JSON-об’єкт.`); }
}

export function PimManager({ userRole, userId }: { userRole: string; userId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Form>(blank);
  const [editing, setEditing] = useState(false);
  const [publishedEdit, setPublishedEdit] = useState(false);
  const [stagedRevisionId, setStagedRevisionId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState<Record<string, Revision[]>>({});
  const [activeSnapshotId, setActiveSnapshotId] = useState('');

  const load = useCallback(async (q = query) => {
    setBusy(true); setError('');
    try { const result = await request<{ data: Product[] }>(`admin/products${q ? `?q=${encodeURIComponent(q)}` : ''}`); setProducts(result.data); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити PIM.'); }
    finally { setBusy(false); }
  }, [query]);

  useEffect(() => { void load(''); }, []); // Load once when the PIM panel opens.

  function edit(product: Product) {
    setEditing(true); setPublishedEdit(product.status === 'PUBLISHED'); setStagedRevisionId(null); setNotice(''); setError('');
    setActiveSnapshotId(product.latest_source_snapshot_id || '');
    setForm({ id: product.id, name: product.name, family: product.family, category: product.category, productType: product.product_type, shortDesc: product.short_desc || '', highlight: product.highlight || '', sourceUrl: product.source_url || '', factSources: Object.fromEntries(Object.entries(product.fact_sources || {}).map(([path,evidence]) => [path,{pageSection:evidence.pageSection,excerpt:evidence.excerpt}])), ...Object.fromEntries(fieldGroups.map(([key]) => [key, JSON.stringify(product[key as keyof Product] || {}, null, 2)])) } as Form);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const payload: Record<string, unknown> = { ...form };
      for (const [key, label] of fieldGroups) payload[key] = asJson(form[key], label);
      const validPaths = new Set(technicalFacts(form).map((fact) => fact.path));
      payload.factSources = Object.fromEntries(Object.entries(form.factSources).filter(([path]) => validPaths.has(path)));
      const result = await request<{ data: { id: string; status: string; revision?: number; base_revision?: number } }>(publishedEdit
        ? `admin/products/${encodeURIComponent(form.id)}/staged-revisions`
        : stagedRevisionId ? `admin/products/${encodeURIComponent(form.id)}/staged-revisions/${encodeURIComponent(stagedRevisionId)}`
        : editing ? `admin/products/${encodeURIComponent(form.id)}` : 'admin/products', {
        method: publishedEdit || !editing ? 'POST' : 'PUT', body: JSON.stringify(payload),
      });
      setNotice(publishedEdit
        ? `Окрему чернетку ревізії для ${form.id} створено від live-р${result.data.base_revision}. Опубліковані дані не змінено.`
        : `Чернетку ${result.data.id} збережено · ревізія ${result.data.revision}. Статус залишається DRAFT до окремої перевірки.`);
      if (publishedEdit) setStagedRevisionId(result.data.id);
      setForm(blank); setEditing(false); setPublishedEdit(false); setActiveSnapshotId(''); await load('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Чернетку не збережено.'); }
    finally { setBusy(false); }
  }

  async function archive(product: Product) {
    if (!window.confirm(`Перенести чернетку «${product.name}» до архіву? Вона залишиться в PIM та журналі аудиту й буде вилучена з Sync Sources.`)) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await request<{ data: { id: string; revision: number } }>(`admin/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' });
      setNotice(`Чернетку ${result.data.id} заархівовано · ревізія ${result.data.revision}.`); await load('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Чернетку не заархівовано.'); }
    finally { setBusy(false); }
  }

  async function transition(product: Product, action: 'submit-review' | 'review/approve' | 'review/reject' | 'publish' | 'staged-submit-review' | 'staged-approve' | 'staged-reject' | 'staged-publish') {
    const note = action === 'review/approve' || action === 'staged-approve' ? window.prompt('Опишіть, що звірили з офіційним знімком CATL (щонайменше 20 символів):')
      : action === 'review/reject' || action === 'staged-reject' ? window.prompt('Причина відхилення (щонайменше 10 символів):')
        : action === 'publish' ? window.prompt('Примітка до публікації (необов’язково):') : null;
    if ((action === 'review/approve' || action === 'review/reject' || action === 'staged-approve' || action === 'staged-reject') && note === null) return;
    if (action === 'publish' && note === null) return;
    const labels = { 'submit-review': 'подати на інженерну перевірку', 'review/approve': 'погодити', 'review/reject': 'відхилити', publish: 'опублікувати', 'staged-submit-review': 'подати staged-ревізію на інженерну перевірку', 'staged-approve': 'погодити staged-ревізію', 'staged-reject': 'відхилити staged-ревізію', 'staged-publish': 'опублікувати staged-ревізію' };
    if (!window.confirm(`Ви впевнені, що хочете ${labels[action]} «${product.name}»?`)) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const stagedAction = action.startsWith('staged-');
      const stagedRoute = action === 'staged-submit-review' ? 'submit-review' : action === 'staged-approve' ? 'approve' : action === 'staged-reject' ? 'reject' : 'publish';
      const route = stagedAction
        ? `admin/products/${encodeURIComponent(product.id)}/staged-revisions/${encodeURIComponent(product.staged_revision_id || '')}/${stagedRoute}`
        : `admin/products/${encodeURIComponent(product.id)}/${action}`;
      const result = await request<{ data: { id: string; status: string; revision?: number } }>(
        route,
        { method: 'POST', body: JSON.stringify(note === null ? {} : { note }) },
      );
      setNotice(`${result.data.id}: ${result.data.status}${result.data.revision ? ` · ревізія ${result.data.revision}` : ''}.`);
      await load('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Перехід стану не виконано.'); }
    finally { setBusy(false); }
  }

  async function toggleHistory(product: Product) {
    if (history[product.id]) {
      setHistory((current) => { const next = { ...current }; delete next[product.id]; return next; });
      return;
    }
    setBusy(true); setError('');
    try {
      const result = await request<{ data: Revision[] }>(`admin/products/${encodeURIComponent(product.id)}/revisions`);
      setHistory((current) => ({ ...current, [product.id]: result.data }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити історію ревізій.'); }
    finally { setBusy(false); }
  }

  async function cancelStagedRevision(product: Product) {
    if (!product.staged_revision_id || !window.confirm(`Скасувати чернетку зміни для «${product.name}»? Live-версія залишиться без змін; скасування потрапить до аудиту.`)) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await request<{ data: { id: string; status: string } }>(
        `admin/products/${encodeURIComponent(product.id)}/staged-revisions/${encodeURIComponent(product.staged_revision_id)}/cancel`,
        { method: 'POST', body: '{}' },
      );
      setNotice(`Чернетку зміни ${result.data.id} скасовано. Опублікована версія не змінювалася.`);
      await load('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Чернетку зміни не скасовано.'); }
    finally { setBusy(false); }
  }

  return <div className="pim-workspace">
    <section className="admin-card"><div className="admin-section-title"><div><h2>{publishedEdit ? `Нова staged-ревізія · ${form.id}` : editing ? `${stagedRevisionId ? 'Редагування staged-зміни' : 'Редагування чернетки'} · ${form.id}` : 'Нова картка продукту'}</h2><p>{publishedEdit || stagedRevisionId ? 'Live-версія не зміниться, доки інженер не погодить і адміністратор не опублікує ревізію.' : 'Потрібне офіційне джерело CATL. Збережений запис не публікується автоматично.'}</p></div>{editing && <button className="admin-link" type="button" onClick={() => { setForm(blank); setEditing(false); setPublishedEdit(false); setStagedRevisionId(null); setActiveSnapshotId(''); }}>Скасувати</button>}</div>
      {error && <div className="admin-alert" role="alert">{error}</div>}{notice && <div className="admin-notice" role="status">{notice}</div>}
      <form className="pim-form" onSubmit={submit}>
        <div className="pim-fields"><label>ID / slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={2} maxLength={64} value={form.id} disabled={editing} onChange={(event) => setForm({ ...form, id: event.target.value })} placeholder="tener-h"/></label><label>Назва<input required minLength={2} maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></label><label>Сімейство<input required value={form.family} onChange={(event) => setForm({ ...form, family: event.target.value })} placeholder="TENER"/></label><label>Категорія<select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="" disabled>Оберіть категорію</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Тип продукту<input required value={form.productType} onChange={(event) => setForm({ ...form, productType: event.target.value })}/></label><label className="pim-wide">Офіційне джерело CATL<input required type="url" value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder="https://www.catl.com/..."/><small>API приймає HTTPS-домени catl.com і catl.com.cn. Інші джерела не можуть бути джерелом істини PIM.</small></label><label className="pim-wide">Короткий опис<textarea maxLength={4000} value={form.shortDesc} onChange={(event) => setForm({ ...form, shortDesc: event.target.value })}/></label><label className="pim-wide">Ключове позиціонування<textarea maxLength={4000} value={form.highlight} onChange={(event) => setForm({ ...form, highlight: event.target.value })}/></label></div>
        <details className="pim-spec-editor"><summary>Групи характеристик (JSON)</summary><p>Характеристики зберігаються у чернетці. Перед публікацією кожне технічне твердження потребує окремого підтвердження джерелом та інженерного погодження.</p><div className="pim-fields">{fieldGroups.map(([key, label]) => <label key={key}>{label}<textarea className="pim-json" spellCheck={false} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })}/></label>)}</div></details>
        {editing && <section className="pim-fact-editor" aria-label="Джерела технічних фактів"><div><h3>Джерело для кожної характеристики</h3><p>Вкажіть розділ і точну цитату. Сервер звіряє цитату та значення з незмінним знімком офіційної CATL-сторінки.</p></div>{!activeSnapshotId ? <div className="admin-alert">Для цієї URL ще немає знімка. Запустіть CATL Sync, оновіть список і відкрийте картку знову.</div> : <small className="pim-snapshot-id">Знімок CATL: {activeSnapshotId}</small>}{technicalFacts(form).length ? <div className="pim-fact-grid">{technicalFacts(form).map(({path,value})=>{const evidence=form.factSources[path]||{pageSection:'',excerpt:''};return <article className="pim-fact-item" key={path}><div className="pim-fact-heading"><code>{path}</code><strong>{JSON.stringify(value)}</strong></div><label>Розділ документа<input aria-label={`Розділ джерела ${path}`} value={evidence.pageSection} onChange={(event)=>setForm({...form,factSources:{...form.factSources,[path]:{...evidence,pageSection:event.target.value}}})} placeholder="Технічні характеристики"/></label><label>Точна цитата CATL<textarea aria-label={`Цитата CATL ${path}`} value={evidence.excerpt} onChange={(event)=>setForm({...form,factSources:{...form.factSources,[path]:{...evidence,excerpt:event.target.value}}})} placeholder="Вставте фрагмент, який містить це значення"/></label></article>;})}</div> : <p className="field-hint">Додайте характеристики у JSON, щоб додати джерела.</p>}</section>}
        <div className="pim-form-actions"><span className="admin-badge">Чернетка · не відображається публічно</span><button className="button" disabled={busy}>{busy ? <RotateCw size={15} className="spin-icon"/> : editing ? <Save size={15}/> : <FilePlus2 size={15}/>} {editing ? 'Зберегти ревізію' : 'Створити чернетку'}</button></div>
      </form>
    </section>
    <section className="admin-card"><div className="admin-section-title"><div><h2>Реєстр продуктів</h2><p>Чернетки й опубліковані записи з поточної бази PIM.</p></div><span className="admin-count">{products.length} записів</span></div><form className="pim-search" onSubmit={(event) => { event.preventDefault(); void load(query); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва, slug або сімейство" aria-label="Пошук PIM"/><button className="button button-secondary" disabled={busy}>Знайти</button><button className="admin-link" type="button" onClick={() => { setQuery(''); void load(''); }}>Скинути</button></form>
      {products.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Продукт</th><th>Сімейство / категорія</th><th>Статус</th><th>Джерело / перевірка</th><th>Ревізія</th><th>Дія</th></tr></thead><tbody>{products.map((product) => <Fragment key={product.id}><tr><td><strong>{product.name}</strong><small>{product.id}</small></td><td>{product.family}<small>{product.category} · {product.product_type}</small></td><td><span className={`pim-status pim-${product.status.toLowerCase()}`}>{product.status}</span><small>{product.confidence}</small>{product.staged_revision_status && <small>Зміна: {product.staged_revision_status} · від r{product.staged_base_revision}</small>}</td><td>{product.source_url ? <a href={product.source_url} target="_blank" rel="noreferrer">Офіційне джерело →</a> : 'Немає джерела'}<small>{product.verified_at ? `Перевірив ${product.verified_by}` : product.latest_source_snapshot_id ? 'Офіційний знімок отримано' : 'Знімка ще немає'}</small></td><td>r{product.revision}<small>{new Date(product.updated_at).toLocaleDateString('uk-UA')}</small></td><td><div className="pim-row-actions">{product.status === 'PUBLISHED' && !product.staged_revision_id && <button className="admin-link" type="button" onClick={() => edit(product)}><Pencil size={14}/> Нова ревізія</button>}{product.staged_revision_status === 'DRAFT' && <><button className="admin-link" type="button" onClick={async () => { try { const r=await request<{data:{payload:Record<string,any>}}>(`admin/products/${encodeURIComponent(product.id)}/staged-revisions/${product.staged_revision_id}`); const p=r.data.payload; setForm({id:product.id,name:p.name,family:p.family,category:p.category,productType:p.productType,shortDesc:p.shortDesc||'',highlight:p.highlight||'',sourceUrl:p.sourceUrl,factSources:p.factSources||{},...Object.fromEntries(fieldGroups.map(([k])=>[k,JSON.stringify(p[k]||{},null,2)]))} as Form);setEditing(true);setPublishedEdit(false);setStagedRevisionId(product.staged_revision_id || null);setActiveSnapshotId(product.latest_source_snapshot_id||'');window.scrollTo({top:0,behavior:'smooth'});} catch(e){setError(e instanceof Error?e.message:'Не вдалося відкрити staged-ревізію.');} }}><Pencil size={14}/> Редагувати зміну</button><button className="admin-link" type="button" disabled={busy || !product.latest_source_snapshot_id} onClick={() => transition(product,'staged-submit-review')}><Send size={14}/> На перевірку</button>{(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || product.staged_created_by_id === userId) && <button className="admin-link danger" type="button" disabled={busy} onClick={() => cancelStagedRevision(product)}><X size={14}/> Скасувати чернетку</button>}</>}{product.staged_revision_status === 'REVIEW' && ['SUPER_ADMIN','ADMIN','ENGINEER'].includes(userRole) && <><button className="admin-link" type="button" onClick={() => transition(product,'staged-approve')} disabled={busy}><Check size={14}/> Погодити зміну</button><button className="admin-link danger" type="button" onClick={() => transition(product,'staged-reject')} disabled={busy}><X size={14}/> Відхилити зміну</button></>}{product.staged_revision_status === 'APPROVED' && ['SUPER_ADMIN','ADMIN'].includes(userRole) && <button className="admin-link" type="button" onClick={() => transition(product,'staged-publish')} disabled={busy}><Upload size={14}/> Опублікувати зміну</button>}{product.status === 'DRAFT' && <><button className="admin-link" type="button" onClick={() => edit(product)}><Pencil size={14}/> Редагувати</button><button className="admin-link" type="button" disabled={busy || !product.latest_source_snapshot_id} onClick={() => transition(product, 'submit-review')}><Send size={14}/> На перевірку</button><button className="admin-link danger" type="button" onClick={() => archive(product)} disabled={busy}><Archive size={14}/> Архів</button></>}{product.status === 'REVIEW' && ['SUPER_ADMIN','ADMIN','ENGINEER'].includes(userRole) && <><button className="admin-link" type="button" onClick={() => transition(product, 'review/approve')} disabled={busy}><Check size={14}/> Погодити</button><button className="admin-link danger" type="button" onClick={() => transition(product, 'review/reject')} disabled={busy}><X size={14}/> Відхилити</button></>}{product.status === 'APPROVED' && ['SUPER_ADMIN','ADMIN'].includes(userRole) && <button className="admin-link" type="button" onClick={() => transition(product, 'publish')} disabled={busy}><Upload size={14}/> Опублікувати зміну</button>}{product.status === 'PUBLISHED' && <span className="admin-badge">На сайті</span>}<button className="admin-link" type="button" onClick={() => toggleHistory(product)} disabled={busy}>{history[product.id] ? 'Сховати історію' : 'Історія ревізій'}</button></div></td></tr>{history[product.id] && <tr><td colSpan={6}><div className="pim-revision-history"><strong>Історія ревізій · {product.id}</strong>{history[product.id].length ? history[product.id].map((entry) => <div className="pim-revision-item" key={`${entry.revision}-${entry.event}`}><span>r{entry.revision} · {entry.event}</span><span>{entry.actor} · {new Date(entry.created_at).toLocaleString('uk-UA')}</span>{entry.note && <p>{entry.note}</p>}{entry.source_snapshot_id && <small>Source snapshot: {entry.source_snapshot_id}</small>}</div>) : <p>Для старих записів історія змін ще не була збережена.</p>}</div></td></tr>}</Fragment>)}</tbody></table></div> : <div className="admin-empty"><FilePlus2 size={19}/><p>{busy ? 'Завантажуємо PIM…' : 'Записів PIM немає. Додайте продукт із підтвердженим офіційним джерелом.'}</p></div>}
    </section>
  </div>;
}
