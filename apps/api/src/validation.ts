import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

export const createRfqSchema = z.object({
  companyName: z.string().trim().min(2).max(255),
  contactPerson: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(5).max(64),
  email: z.string().trim().email().max(255),
  country: optionalText(2),
  region: optionalText(128),
  industry: optionalText(128),
  location: optionalText(255),
  powerKw: z.coerce.number().positive().max(10_000_000).optional(),
  capacityKwh: z.coerce.number().positive().max(1_000_000_000).optional(),
  durationHours: z.coerce.number().positive().max(168).optional(),
  selectedSeries: optionalText(128),
  selectedProducts: z.array(z.string().max(64)).max(20).optional(),
  useCase: optionalText(128),
  details: optionalText(10_000),
  calculationId: z.string().uuid().optional().or(z.literal('')),
  locale: optionalText(10),
  utmSource: optionalText(128),
  utmMedium: optionalText(128),
  utmCampaign: optionalText(128),
  utmContent: optionalText(128),
  utmTerm: optionalText(128),
  landingPage: optionalText(2048),
}).strict();

export const rfqStatusSchema = z.enum([
  'NEW', 'QUALIFICATION', 'ENGINEERING', 'PRICING', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED',
]);

const pimJsonGroup = z.record(z.string(), z.unknown());
const pimFactSource = z.object({
  pageSection: z.string().trim().min(1).max(255),
  excerpt: z.string().trim().min(5).max(2000),
}).strict();
const pimSourceUrl = z.string().url().refine((value) => {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && (host === 'catl.com' || host.endsWith('.catl.com') || host === 'catl.com.cn' || host.endsWith('.catl.com.cn'));
  } catch { return false; }
}, 'Use an official HTTPS CATL source URL.');
export const PIM_ALLOWED_CATEGORIES = [
  'Utility-scale ESS', 'C&I ESS', 'Residential ESS', 'Data Center ESS', 'Sodium-ion ESS',
  'Battery Cells', 'Battery Modules & Racks', 'PCS & Inverters', 'BMS', 'EMS', 'SCADA',
  'Transformers & Switchgear', 'Thermal Management', 'Fire Safety', 'Accessories',
] as const;
export const pimDraftSchema = z.object({
  id: z.string().trim().min(2).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2).max(255),
  family: z.string().trim().min(2).max(100),
  category: z.enum(PIM_ALLOWED_CATEGORIES),
  productType: z.string().trim().min(2).max(64),
  shortDesc: z.string().trim().max(4000).default(''),
  highlight: z.string().trim().max(4000).default(''),
  sourceUrl: pimSourceUrl,
  energySpecs: pimJsonGroup.default({}),
  cellSpecs: pimJsonGroup.default({}),
  mechanicalSpecs: pimJsonGroup.default({}),
  thermalSpecs: pimJsonGroup.default({}),
  safetySpecs: pimJsonGroup.default({}),
  compatibility: pimJsonGroup.default({}),
  factSources: z.record(z.string().min(2).max(512), pimFactSource).optional().default({}),
}).strict();

export const bessSizingSchema = z.object({
  solarMw: z.number().finite().min(0).max(100_000).default(0),
  loadMw: z.number().finite().gt(0).max(100_000),
  durationHours: z.number().finite().gt(0).max(168),
  reservePct: z.number().finite().min(0).max(50).default(0),
  locale: z.enum(['uk-UA','en','zh-CN']).optional(),
}).strict();

export const lcosSchema = z.object({
  capexUsd: z.number().finite().min(0).max(10_000_000_000),
  annualOpexUsd: z.number().finite().min(0).max(1_000_000_000),
  capacityKwh: z.number().finite().gt(0).max(10_000_000_000),
  cyclesPerYear: z.number().finite().gt(0).max(3650),
  degradationPct: z.number().finite().min(0).max(100),
  lifetimeYears: z.number().int().min(1).max(50),
  roundTripEfficiencyPct: z.number().finite().gt(0).max(100),
  discountRatePct: z.number().finite().min(0).max(100),
}).strict();

export const aiTaskSchema = z.object({
  task: z.enum([
    'bess_advisor', 'extract_datasheet_specs', 'translate_technical_content',
    'generate_seo_metadata', 'classify_lead_rfq', 'structured_extraction', 'technical_summary',
  ]),
  prompt: z.string().trim().min(1).max(20_000),
  context: z.record(z.unknown()).optional(),
  preferredModel: z.string().max(128).optional(),
  maxTokens: z.number().int().min(1).max(8192).optional(),
  timeoutMs: z.number().int().min(1000).max(120_000).optional(),
}).strict();
