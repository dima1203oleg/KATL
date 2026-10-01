/**
 * Database schema mapping and table definitions
 */

export const TABLES = {
  PIM_PRODUCTS: 'pim_products',
  PIM_SPECIFICATIONS: 'pim_specifications',
  PIM_TRANSLATIONS: 'pim_product_translations',
  RFQ_RECORDS: 'rfq_records',
  SYNC_SOURCES: 'sync_sources',
  SYNC_SNAPSHOTS: 'sync_snapshots',
  SYNC_CHANGES: 'sync_changes',
  AUDIT_LOGS: 'audit_logs',
} as const;

export interface PimProductDbRow {
  id: string;
  name: string;
  family: string;
  category: string;
  short_desc: string;
  highlight: string;
  status: string;
  product_type: string;
  source_url: string | null;
  verified_at: string | null;
  verified_by: string | null;
  confidence: string | null;
  revision: number;
  created_at: string;
  updated_at: string;
}

export interface PimSpecificationDbRow {
  product_id: string;
  energy_specs: any;
  cell_specs: any;
  mechanical_specs: any;
  thermal_specs: any;
  safety_specs: any;
  compatibility: any;
  created_at: string;
  updated_at: string;
}
