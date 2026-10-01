/**
 * @katl/shared-types
 * Core domain types and contracts for the KATL BESS Platform.
 */

export type KatlLocale = 'uk' | 'en' | 'zh-cn';

// ==========================================
// 1. PIM & Product Domain Types
// ==========================================

export interface EnergySpecs {
  nominalCapacity: string;
  usableCapacity: string;
  nominalVoltage: string;
  voltageRange: string;
  cRate: string;
  efficiencyRoundTrip: string;
}

export interface CellSpecs {
  chemistry: string;
  cellModel: string;
  cellCapacity: string;
  cycleLife: string;
  degradationFirstYears: string;
}

export interface MechanicalSpecs {
  dimensions: string;
  weight: string;
  containerStandard: string;
  protectionRating: string;
}

export interface ThermalSpecs {
  coolingMethod: string;
  tempControlAccuracy: string;
  operatingTempRange: string;
}

export interface SafetySpecs {
  fireSuppression: string;
  deflagrationProtection: string;
  gasDetection: string;
  certifications: string[];
}

export interface ProductCompatibility {
  pcs: string[];
  ems: string[];
  transformer: string;
}

export interface ProductProvenance {
  sourceUrl: string;
  verifiedAt: string;
  verifiedBy: string;
  confidence: 'OFFICIAL_CATL' | 'DISTRIBUTOR_VERIFIED' | 'PRE_RELEASE';
  revision: number;
  lastUpdated: string;
}

export interface KatlProduct {
  id: string;
  name: string;
  family: string;
  category: 'Utility Scale' | 'C&I Storage' | 'Telecom & Microgrid' | 'Residential';
  shortDesc: string;
  highlight: string;
  status: 'AVAILABLE' | 'PRE_ORDER' | 'DEVELOPMENT';
  type: string;
  energySpecs: EnergySpecs;
  cellSpecs: CellSpecs;
  mechanicalSpecs: MechanicalSpecs;
  thermalSpecs: ThermalSpecs;
  safetySpecs: SafetySpecs;
  compatibility: ProductCompatibility;
  provenance: ProductProvenance;
  localeData?: Record<KatlLocale, {
    name?: string;
    shortDesc?: string;
    highlight?: string;
  }>;
}

// ==========================================
// 2. RFQ (Request for Quotation) Models
// ==========================================

export type RfqStatus =
  | 'NEW'
  | 'QUALIFICATION'
  | 'ENGINEERING'
  | 'PROPOSAL_SENT'
  | 'WON'
  | 'LOST';

export interface RfqRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  location?: string;
  powerKw?: number;
  capacityKwh?: number;
  selectedSeries: string;
  useCase: string;
  details?: string;
  status: RfqStatus;
  utmSource?: string;
  utmCampaign?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string[];
}

export interface CreateRfqInput {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  location?: string;
  powerKw?: number;
  capacityKwh?: number;
  selectedSeries?: string;
  useCase?: string;
  details?: string;
  utmSource?: string;
  utmCampaign?: string;
}

// ==========================================
// 3. Engineering Calculations Models
// ==========================================

export interface SizingInput {
  solarMw: number;
  loadMw: number;
  durationHours: number;
  tariffUah?: number;
}

export interface SizingResult {
  algorithmVersion: string;
  calculatedCapacityMwh: number;
  recommendedPowerMw: number;
  recommendedProduct: {
    id: string;
    name: string;
    containerCount: number;
  };
  economics: {
    estimatedCapexUsd: number;
    annualSavingsUah: number;
    paybackYears: number;
    irrPercent: number;
    lcosCentPerKwh: number;
  };
  bom: Array<{
    category: string;
    item: string;
    quantity: number;
    unit: string;
  }>;
}

// ==========================================
// 4. CATL Product Sync Engine Models
// ==========================================

export interface SyncSourceItem {
  id: string;
  name: string;
  url: string;
  sourceType: 'OFFICIAL_WEB' | 'DATASHEET_PDF' | 'CERTIFICATE';
  pollIntervalMinutes: number;
  lastChecked: string;
  lastHash: string;
  enabled: boolean;
}

export interface SyncChangeItem {
  id: string;
  productId: string;
  productName: string;
  field: string;
  oldValue: any;
  newValue: any;
  sourceUrl: string;
  detectedAt: string;
  confidence: 'HIGH' | 'MEDIUM' | 'EXPERIMENTAL';
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
}

// ==========================================
// 5. AI Provider Gateway Models
// ==========================================

export interface GatewayChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GatewayChatResponse {
  message: string;
  provider: 'gemini' | 'anthropic' | 'openai' | 'deepseek';
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  grounding?: {
    verifiedProductIds: string[];
    specReferences: string[];
  };
}

// ==========================================
// 6. Audit Log Models
// ==========================================

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  timestamp: string;
  details: Record<string, any>;
}
