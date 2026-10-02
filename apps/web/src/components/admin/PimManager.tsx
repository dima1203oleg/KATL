'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Archive, FilePlus2, Pencil, RotateCw, Save } from 'lucide-react';

type Product = {
  id: string; name: string; family: string; category: string; product_type: string; short_desc: string; highlight: string; status: string;
  source_url: string; confidence: string; verified_at: string | null; verified_by: string | null; revision: number; updated_at: string;
  energy_specs: Record<string, unknown>; cell_specs: Record<string, unknown>; mechanical_specs: Record<string, unknown>;
  thermal_specs: Record<string, unknown>; safety_specs: Record<string, unknown>; compatibility: Record<string, unknown>;
};
type Form = {
  id: string; name: string; family: string; category: string; productType: string; shortDesc: string; highlight: string; sourceUrl: string;
  energySpecs: string; cellSpecs: string; mechanicalSpecs: string; thermalSpecs: string; safetySpecs: string; compatibility: string;
};

const blank: Form = { id: '', name: '', family: '', category: '', productType: '', shortDesc: '', highlight: '', sourceUrl: '', energySpecs: '{}', cellSpecs: '{}', mechanicalSpecs: '{}', thermalSpecs: '{}', safetySpecs: '{}', compatibility: '{}' };
const fieldGroups = [
  ['energySpecs', 'Енергія та потужність'], ['cellSpecs', 'Акумуляторні елементи'], ['mechanicalSpecs', 'Механіка'],
  ['thermalSpecs', 'Терморегулювання'], ['safetySpecs', 'Безпека'], ['compatibility', 'Сумісність'],
] as const;
const categories = ['Utility-scale ESS', 'C&I ESS', 'Residential ESS', 'Data Center ESS', 'Sodium-ion ESS', 'Battery Cells', 'Battery Modules & Racks', 'PCS & Inverters', 'BMS', 'EMS', 'SCADA', 'Transformers & Switchgear', 'Thermal Management', 'Fire Safety', 'Accessories'];

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

export function PimManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Form>(blank);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async (q = query) => {
    setBusy(true); setError('');
    try { const result = await request<{ data: Product[] }>(`admin/products${q ? `?q=${encodeURIComponent(q)}` : ''}`); setProducts(result.data); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити PIM.'); }
    finally { setBusy(false); }
  }, [query]);

  useEffect(() => { void load(''); }, []); // Load once when the PIM panel opens.

  function edit(product: Product) {
    setEditing(true); setNotice(''); setError('');
    setForm({ id: product.id, name: product.name, family: product.family, category: product.category, productType: product.product_type, shortDesc: product.short_desc || '', highlight: product.highlight || '', sourceUrl: product.source_url || '', ...Object.fromEntries(fieldGroups.map(([key]) => [key, JSON.stringify(product[key as keyof Product] || {}, null, 2)])) } as Form);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const payload: Record<string, unknown> = { ...form };
      for (const [key, label] of fieldGroups) payload[key] = asJson(form[key], label);
      const result = await request<{ data: { id: string; status: string; revision: number } }>(editing ? `admin/products/${encodeURIComponent(form.id)}` : 'admin/products', {
        method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload),
      });
      setNotice(`Чернетку ${result.data.id} збережено · ревізія ${result.data.revision}. Статус залишається DRAFT до окремої перевірки.`);
      setForm(blank); setEditing(false); await load('');
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

  return <div className="pim-workspace">
    <section className="admin-card"><div className="admin-section-title"><div><h2>{editing ? `Редагування чернетки · ${form.id}` : 'Нова картка продукту'}</h2><p>Потрібне офіційне джерело CATL. Збережений запис не публікується автоматично.</p></div>{editing && <button className="admin-link" type="button" onClick={() => { setForm(blank); setEditing(false); }}>Скасувати</button>}</div>
      {error && <div className="admin-alert" role="alert">{error}</div>}{notice && <div className="admin-notice" role="status">{notice}</div>}
      <form className="pim-form" onSubmit={submit}>
        <div className="pim-fields"><label>ID / slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={2} maxLength={64} value={form.id} disabled={editing} onChange={(event) => setForm({ ...form, id: event.target.value })} placeholder="tener-h"/></label><label>Назва<input required minLength={2} maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></label><label>Сімейство<input required value={form.family} onChange={(event) => setForm({ ...form, family: event.target.value })} placeholder="TENER"/></label><label>Категорія<select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="" disabled>Оберіть категорію</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Тип продукту<input required value={form.productType} onChange={(event) => setForm({ ...form, productType: event.target.value })}/></label><label className="pim-wide">Офіційне джерело CATL<input required type="url" value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder="https://www.catl.com/..."/><small>API приймає HTTPS-домени catl.com і catl.com.cn. Інші джерела не можуть бути джерелом істини PIM.</small></label><label className="pim-wide">Короткий опис<textarea maxLength={4000} value={form.shortDesc} onChange={(event) => setForm({ ...form, shortDesc: event.target.value })}/></label><label className="pim-wide">Ключове позиціонування<textarea maxLength={4000} value={form.highlight} onChange={(event) => setForm({ ...form, highlight: event.target.value })}/></label></div>
        <details className="pim-spec-editor"><summary>Групи характеристик (JSON)</summary><p>Характеристики зберігаються у чернетці. Перед публікацією кожне технічне твердження потребує окремого підтвердження джерелом та інженерного погодження.</p><div className="pim-fields">{fieldGroups.map(([key, label]) => <label key={key}>{label}<textarea className="pim-json" spellCheck={false} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })}/></label>)}</div></details>
        <div className="pim-form-actions"><span className="admin-badge">Чернетка · не відображається публічно</span><button className="button" disabled={busy}>{busy ? <RotateCw size={15} className="spin-icon"/> : editing ? <Save size={15}/> : <FilePlus2 size={15}/>} {editing ? 'Зберегти ревізію' : 'Створити чернетку'}</button></div>
      </form>
    </section>
    <section className="admin-card"><div className="admin-section-title"><div><h2>Реєстр продуктів</h2><p>Чернетки й опубліковані записи з поточної бази PIM.</p></div><span className="admin-count">{products.length} записів</span></div><form className="pim-search" onSubmit={(event) => { event.preventDefault(); void load(query); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва, slug або сімейство" aria-label="Пошук PIM"/><button className="button button-secondary" disabled={busy}>Знайти</button><button className="admin-link" type="button" onClick={() => { setQuery(''); void load(''); }}>Скинути</button></form>
      {products.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Продукт</th><th>Сімейство / категорія</th><th>Статус</th><th>Джерело / перевірка</th><th>Ревізія</th><th>Дія</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.id}</small></td><td>{product.family}<small>{product.category} · {product.product_type}</small></td><td><span className={`pim-status pim-${product.status.toLowerCase()}`}>{product.status}</span><small>{product.confidence}</small></td><td>{product.source_url ? <a href={product.source_url} target="_blank" rel="noreferrer">Офіційне джерело →</a> : 'Немає джерела'}<small>{product.verified_at ? `Перевірив ${product.verified_by}` : 'Не перевірено'}</small></td><td>r{product.revision}<small>{new Date(product.updated_at).toLocaleDateString('uk-UA')}</small></td><td>{['DRAFT','REVIEW'].includes(product.status) ? <div className="pim-row-actions"><button className="admin-link" type="button" onClick={() => edit(product)}><Pencil size={14}/> Редагувати</button><button className="admin-link danger" type="button" onClick={() => archive(product)} disabled={busy}><Archive size={14}/> Архів</button></div> : 'Захищено'}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><FilePlus2 size={19}/><p>{busy ? 'Завантажуємо PIM…' : 'Записів PIM немає. Додайте продукт із підтвердженим офіційним джерелом.'}</p></div>}
    </section>
  </div>;
}
