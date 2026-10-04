/**
 * Pure helpers that turn a PIM product into display-ready, *honest* spec data.
 *
 * Rules enforced here (single place, so every product page follows them):
 *  - never invent a value: a missing field is omitted, never replaced with a "typical" number;
 *  - commercial fields (price, pricing type, availability, warranty) never reach the public page;
 *  - derived numbers (duration, usable share) are computed deterministically and labelled as derived.
 */
import type { KatlProduct } from '@katl/shared-types';

export type Lang = 'uk-UA' | 'en' | 'zh-CN';
export const asLang = (l: string): Lang => (l === 'en' || l === 'zh-CN' ? l : 'uk-UA');
const ix = (l: Lang) => (l === 'en' ? 1 : l === 'zh-CN' ? 2 : 0);

/** Keys that are commercial or internal and must never be rendered publicly. */
const HIDDEN = /^(price|pricing|startingPrice|availability|warranty|leadTime|cost|margin|internal)/i;

export const LABELS: Record<string, [string, string, string]> = {
  nominalCapacity: ['Номінальна ємність', 'Nominal energy', '额定容量'],
  usableCapacity: ['Корисна ємність', 'Usable energy', '可用容量'],
  nominalVoltage: ['Номінальна напруга', 'Nominal voltage', '额定电压'],
  voltageRange: ['Діапазон напруги', 'Voltage range', '电压范围'],
  cRate: ['C-rate', 'C-rate', '充放电倍率'],
  maxContinuousPowerKw: ['Тривала потужність', 'Continuous power', '持续功率'],
  efficiencyRoundTrip: ['ККД циклу (RTE)', 'Round-trip efficiency', '往返效率 (RTE)'],
  chemistry: ['Хімія комірок', 'Cell chemistry', '电芯化学体系'],
  cellModel: ['Модель комірки', 'Cell model', '电芯型号'],
  cellCapacity: ['Ємність комірки', 'Cell capacity', '单体容量'],
  cycleLife: ['Циклічний ресурс', 'Cycle life', '循环寿命'],
  degradationFirstYears: ['Деградація у перші роки', 'Early-life degradation', '初期衰减'],
  dimensions: ['Габарити (Д×Ш×В)', 'Dimensions (L×W×H)', '外形尺寸 (长×宽×高)'],
  weight: ['Маса', 'Weight', '重量'],
  containerStandard: ['Формат корпусу', 'Enclosure format', '箱体形式'],
  protectionRating: ['Ступінь захисту', 'Ingress protection', '防护等级'],
  coolingMethod: ['Термоменеджмент', 'Thermal management', '热管理方式'],
  tempControlAccuracy: ['Рівномірність температури', 'Temperature uniformity', '温控精度'],
  operatingTempRange: ['Робочі температури', 'Operating temperature', '工作温度范围'],
  fireSuppression: ['Пожежогасіння', 'Fire suppression', '消防系统'],
  deflagrationProtection: ['Скидання тиску', 'Deflagration venting', '防爆泄压'],
  gasDetection: ['Газова детекція', 'Gas detection', '可燃气体探测'],
  certifications: ['Заявлені стандарти', 'Stated standards', '声明标准'],
  pcs: ['PCS для перевірки сумісності', 'PCS to check for compatibility', '待验证适配 PCS'],
  ems: ['Інтерфейси EMS / SCADA', 'EMS / SCADA interfaces', 'EMS / SCADA 接口'],
  transformer: ['Трансформатор', 'Transformer', '变压器'],
};

/** Spec keys that have a glossary entry — the spec sheet links them, building the knowledge graph. */
export const GLOSSARY: Record<string, string> = {
  cRate: 'c-rate', usableCapacity: 'usable-energy', efficiencyRoundTrip: 'rte', cycleLife: 'cycle-life',
  degradationFirstYears: 'degradation', pcs: 'pcs', ems: 'ems', chemistry: 'lfp', coolingMethod: 'liquid-cooling',
};

export const GROUPS: Array<{ id: string; key: keyof KatlProduct; title: [string, string, string] }> = [
  { id: 'electrical', key: 'energySpecs', title: ['Електричні параметри', 'Electrical', '电气参数'] },
  { id: 'cells', key: 'cellSpecs', title: ['Комірки та ресурс', 'Cells & lifetime', '电芯与寿命'] },
  { id: 'thermal', key: 'thermalSpecs', title: ['Термоменеджмент', 'Thermal management', '热管理'] },
  { id: 'mechanical', key: 'mechanicalSpecs', title: ['Механіка та корпус', 'Mechanical & enclosure', '机械与箱体'] },
  { id: 'safety', key: 'safetySpecs', title: ['Безпека', 'Safety', '安全'] },
  { id: 'integration', key: 'compatibility', title: ['Інтеграція', 'Integration', '系统集成'] },
];

export type SpecRow = { key: string; label: string; value: string; glossary?: string };
export type SpecGroup = { id: string; title: string; rows: SpecRow[] };

const show = (v: unknown) => v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0);
const asText = (v: unknown) => (Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? '' : String(v).trim());

export function label(key: string, lang: Lang) {
  return LABELS[key]?.[ix(lang)] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

export function specGroups(product: KatlProduct, lang: Lang): SpecGroup[] {
  return GROUPS.map(({ id, key, title }) => {
    const raw = (product[key] ?? {}) as Record<string, unknown>;
    const rows = Object.entries(raw)
      .filter(([k, v]) => !HIDDEN.test(k) && show(v) && asText(v))
      // keep a stable, meaningful order: known labels first in declaration order
      .sort(([a], [b]) => order(a) - order(b))
      .map(([k, v]) => ({ key: k, label: label(k, lang), value: asText(v), glossary: glossaryFor(k, asText(v)) }));
    return { id, title: title[ix(lang)], rows };
  }).filter((g) => g.rows.length > 0);
}

const ORDER = Object.keys(LABELS);
const order = (k: string) => { const i = ORDER.indexOf(k); return i === -1 ? 999 : i; };
function glossaryFor(key: string, value: string) {
  if (key === 'chemistry' && !/LFP|LiFePO|фосфат/i.test(value)) return /sodium|натр|钠/i.test(value) ? 'sodium-ion' : undefined;
  if (key === 'coolingMethod' && !/liquid|рідин|液/i.test(value)) return undefined;
  return GLOSSARY[key];
}

/* ------------------------------------------------------------------ value parsing */

/** Split "6.25 МВт·год (6250 кВт·год)" into a display number, unit and remainder. */
export function splitValue(value?: string): { num: string; unit: string; rest: string } | null {
  if (!value) return null;
  const m = value.trim().match(/^([≥≤~≈]?\s?\d[\d\s.,]*)\s*([^\s(/]+)?\s*(.*)$/u);
  if (!m) return null;
  return { num: m[1].trim(), unit: (m[2] ?? '').trim(), rest: (m[3] ?? '').trim() };
}

const toNumber = (s: string) => Number(s.replace(/[\s ]/g, '').replace(',', '.'));

/** Energy in kWh, from strings like "6.25 МВт·год (6250 кВт·год)", "372 kWh", "5 MWh". */
export function energyKwh(value?: string): number | null {
  if (!value) return null;
  const kwh = value.match(/(\d[\d\s.,]*)\s*(кВт·?\s?год|kWh|千瓦时)/iu);
  if (kwh) return toNumber(kwh[1]);
  const mwh = value.match(/(\d[\d\s.,]*)\s*(МВт·?\s?год|MWh|兆瓦时)/iu);
  if (mwh) return toNumber(mwh[1]) * 1000;
  return null;
}

/** Power in kW from "3125 кВт", "1.5 MW", "1250 kW (1375 kVA)". */
export function powerKw(value?: string): number | null {
  if (!value) return null;
  const kw = value.match(/(\d[\d\s.,]*)\s*(кВт|kW)(?!·|\s?год|h)/iu);
  if (kw) return toNumber(kw[1]);
  const mw = value.match(/(\d[\d\s.,]*)\s*(МВт|MW)(?!·|\s?год|h)/iu);
  if (mw) return toNumber(mw[1]) * 1000;
  return null;
}

export function percent(value?: string): number | null {
  const m = value?.match(/(\d+(?:[.,]\d+)?)\s*%/);
  return m ? toNumber(m[1]) : null;
}

/** "-30 °C … +55 °C" → [-30, 55] */
export function tempRange(value?: string): [number, number] | null {
  const nums = value?.match(/[-−+]?\d+(?:[.,]\d+)?(?=\s*°)/g);
  if (!nums || nums.length < 2) return null;
  const [a, b] = nums.map((n) => Number(n.replace('−', '-').replace(',', '.')));
  return a < b ? [a, b] : [b, a];
}

export function standards(product: KatlProduct): string[] {
  const list = product.safetySpecs?.certifications;
  return Array.isArray(list) ? list.map(String).map((s) => s.trim()).filter(Boolean) : [];
}

/** Products that are a complete storage system (not a cell, PCS, chiller...) get the integration story. */
export function isSystem(product: KatlProduct): boolean {
  const kwh = energyKwh(product.energySpecs?.nominalCapacity);
  // The grid-connection chain (transformer, MV) is only meaningful for C&I and utility systems, not home batteries.
  return Boolean(kwh && kwh >= 200 && powerKw((product.energySpecs as unknown as Record<string, string>)?.maxContinuousPowerKw));
}

export function csv(groups: SpecGroup[], product: KatlProduct) {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [['group', 'parameter', 'value'].join(',')];
  for (const g of groups) for (const r of g.rows) lines.push([g.title, r.label, r.value].map(esc).join(','));
  lines.push(['meta', 'product', product.name].map(esc).join(','));
  if (product.provenance?.sourceUrl) lines.push(['meta', 'source', product.provenance.sourceUrl].map(esc).join(','));
  return lines.join('\n');
}
