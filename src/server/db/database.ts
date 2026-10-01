/**
 * Production Database & PIM Repository Layer
 * Persistent storage for Products, Users & RBAC, RFQs, Customer Projects, Partner Deals, Sync ChangeSets, and Audit Logs.
 */

import fs from 'fs';
import path from 'path';
import { TitanProduct, titanProductsList } from '../../data/titanPlatformData';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'ENGINEER' 
  | 'SALES' 
  | 'PARTNER' 
  | 'CUSTOMER' 
  | 'READ_ONLY';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  passwordHash?: string;
  sessionToken?: string;
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface CustomerProjectRecord {
  id: string;
  userId: string;
  customerName: string;
  projectName: string;
  location: string;
  powerKw: number;
  capacityKwh: number;
  productSlug: string;
  status: 'DRAFT' | 'ENGINEERING_REVIEW' | 'PROPOSAL_READY' | 'CONTRACTED' | 'COMMISSIONED';
  lcosUsdPerKwh: number;
  capexUsd: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerDealRecord {
  id: string;
  partnerId: string;
  partnerCompanyName: string;
  clientCompanyName: string;
  dealSizeMwh: number;
  estimatedVolumeUsd: number;
  stage: 'DEAL_REGISTRATION' | 'TECHNICAL_QUALIFICATION' | 'PROPOSAL_GENERATED' | 'BID_WON' | 'DELIVERY';
  productInterest: string;
  commissionRatePercent: number;
  registeredAt: string;
}

export interface PimProductRecord extends TitanProduct {
  provenance: {
    sourceUrl: string;
    verifiedAt: string;
    verifiedBy: string;
    confidence: 'OFFICIAL_CATL' | 'DISTRIBUTOR_VERIFIED' | 'PRE_RELEASE';
    revision: number;
    lastUpdated: string;
  };
}

export interface RfqRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  location?: string;
  country?: string;
  region?: string;
  industry?: string;
  powerKw?: number;
  capacityKwh?: number;
  durationHours?: number;
  selectedSeries: string;
  useCase: string;
  details?: string;
  attachments?: string[];
  status: 'NEW' | 'QUALIFICATION' | 'ENGINEERING' | 'PRICING' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST' | 'ARCHIVED';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string[];
  crmSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';
}

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

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  timestamp: string;
  details: Record<string, any>;
}

// In-memory + file-backed persistent store
class KatlDatabase {
  private dbFilePath = path.resolve(process.cwd(), '.katl_db.json');
  private products: Map<string, PimProductRecord> = new Map();
  private users: Map<string, UserRecord> = new Map();
  private rfqs: Map<string, RfqRecord> = new Map();
  private customerProjects: Map<string, CustomerProjectRecord> = new Map();
  private partnerDeals: Map<string, PartnerDealRecord> = new Map();
  private syncSources: SyncSourceItem[] = [];
  private syncChanges: SyncChangeItem[] = [];
  private auditLogs: AuditLogItem[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    let loaded = false;
    if (fs.existsSync(this.dbFilePath)) {
      try {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const data = JSON.parse(raw);
        if (data.products && Array.isArray(data.products)) {
          data.products.forEach((p: PimProductRecord) => this.products.set(p.id, p));
        }
        if (data.users && Array.isArray(data.users)) {
          data.users.forEach((u: UserRecord) => this.users.set(u.id, u));
        }
        if (data.rfqs && Array.isArray(data.rfqs)) {
          data.rfqs.forEach((r: RfqRecord) => this.rfqs.set(r.id, r));
        }
        if (data.customerProjects && Array.isArray(data.customerProjects)) {
          data.customerProjects.forEach((cp: CustomerProjectRecord) => this.customerProjects.set(cp.id, cp));
        }
        if (data.partnerDeals && Array.isArray(data.partnerDeals)) {
          data.partnerDeals.forEach((pd: PartnerDealRecord) => this.partnerDeals.set(pd.id, pd));
        }
        if (data.syncSources) this.syncSources = data.syncSources;
        if (data.syncChanges) this.syncChanges = data.syncChanges;
        if (data.auditLogs) this.auditLogs = data.auditLogs;
        loaded = true;
      } catch (err) {
        console.warn('[DB] Could not load persisted data, fallback to bootstrap seed.');
      }
    }

    if (!loaded || this.products.size === 0 || this.users.size === 0) {
      this.seedBootstrap();
    }
  }

  private persist() {
    try {
      const payload = {
        products: Array.from(this.products.values()),
        users: Array.from(this.users.values()),
        rfqs: Array.from(this.rfqs.values()),
        customerProjects: Array.from(this.customerProjects.values()),
        partnerDeals: Array.from(this.partnerDeals.values()),
        syncSources: this.syncSources,
        syncChanges: this.syncChanges,
        auditLogs: this.auditLogs,
      };
      fs.writeFileSync(this.dbFilePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Persist error:', e);
    }
  }

  private seedBootstrap() {
    // 1. Seed PIM Products from titanProductsList with official provenance
    titanProductsList.forEach((prod) => {
      const pimRecord: PimProductRecord = {
        ...prod,
        provenance: {
          sourceUrl: 'https://www.catl.com/en/ess/',
          verifiedAt: '2026-09-15T10:00:00Z',
          verifiedBy: 'Senior BESS Systems Engineer',
          confidence: 'OFFICIAL_CATL',
          revision: 1,
          lastUpdated: '2026-10-01T08:00:00Z',
        },
      };
      this.products.set(prod.id, pimRecord);
    });

    // 2. Seed Initial Users & RBAC
    const defaultUsers: UserRecord[] = [
      {
        id: 'usr-admin-01',
        email: 'admin@katl-energy.com.ua',
        name: 'Олександр Коваленко (Головний адміністратор)',
        role: 'SUPER_ADMIN',
        company: 'CATL BESS Ukraine Engineering',
        sessionToken: 'token-admin-session-2026',
        permissions: ['*'],
        createdAt: '2026-01-10T08:00:00Z',
        lastLoginAt: '2026-10-01T09:00:00Z',
      },
      {
        id: 'usr-eng-01',
        email: 'engineer@katl-energy.com.ua',
        name: 'Дмитро Мельник (Головний інженер-електрик)',
        role: 'ENGINEER',
        company: 'CATL BESS Ukraine Engineering',
        sessionToken: 'token-engineer-session-2026',
        permissions: ['products:read', 'products:edit', 'sync:review', 'sync:approve', 'calculations:execute'],
        createdAt: '2026-02-15T09:30:00Z',
        lastLoginAt: '2026-10-01T08:45:00Z',
      },
      {
        id: 'usr-partner-01',
        email: 'partner@energo-systems.ua',
        name: 'Віталій Савченко (Генпідрядник EPC)',
        role: 'PARTNER',
        company: 'ТОВ «Енерго-Системи Інжиніринг»',
        sessionToken: 'token-partner-session-2026',
        permissions: ['partner:read', 'partner:register_deal', 'documents:download_protected'],
        createdAt: '2026-05-20T11:00:00Z',
        lastLoginAt: '2026-10-01T07:20:00Z',
      },
      {
        id: 'usr-customer-01',
        email: 'energy.director@mhp-industrial.ua',
        name: 'Сергій Шевченко (Директор з енергетики)',
        role: 'CUSTOMER',
        company: 'ПрАТ «Індустріал-Агро Плюс»',
        sessionToken: 'token-customer-session-2026',
        permissions: ['customer:read', 'projects:create', 'calculations:save', 'proposals:view'],
        createdAt: '2026-06-12T14:15:00Z',
        lastLoginAt: '2026-10-01T09:15:00Z',
      },
    ];
    defaultUsers.forEach((u) => this.users.set(u.id, u));

    // 3. Seed Customer Projects
    const defaultCustomerProjects: CustomerProjectRecord[] = [
      {
        id: 'proj-agro-01',
        userId: 'usr-customer-01',
        customerName: 'ПрАТ «Індустріал-Агро Плюс»',
        projectName: 'BESS 3.0 МВт / 6.0 МВт·год (Peak Shaving Елеватор)',
        location: 'Полтавська обл., м. Лубни',
        powerKw: 3000,
        capacityKwh: 6000,
        productSlug: 'catl-tener-h',
        status: 'PROPOSAL_READY',
        lcosUsdPerKwh: 0.058,
        capexUsd: 1450000,
        createdAt: '2026-09-10T10:00:00Z',
        updatedAt: '2026-09-28T16:00:00Z',
      },
      {
        id: 'proj-agro-02',
        userId: 'usr-customer-01',
        customerName: 'ПрАТ «Індустріал-Агро Плюс»',
        projectName: 'Резервне живлення біогазового комплексу 1.0 МВт·год',
        location: 'Вінницька обл., смт Ладижин',
        powerKw: 500,
        capacityKwh: 1000,
        productSlug: 'catl-enerone-plus',
        status: 'ENGINEERING_REVIEW',
        lcosUsdPerKwh: 0.064,
        capexUsd: 290000,
        createdAt: '2026-09-22T11:30:00Z',
        updatedAt: '2026-09-30T12:00:00Z',
      },
    ];
    defaultCustomerProjects.forEach((p) => this.customerProjects.set(p.id, p));

    // 4. Seed Partner Deals
    const defaultPartnerDeals: PartnerDealRecord[] = [
      {
        id: 'deal-partner-01',
        partnerId: 'usr-partner-01',
        partnerCompanyName: 'ТОВ «Енерго-Системи Інжиніринг»',
        clientCompanyName: 'ТОВ «Логістик-Термінал Захід»',
        dealSizeMwh: 18.016,
        estimatedVolumeUsd: 4200000,
        stage: 'PROPOSAL_GENERATED',
        productInterest: '2x CATL TENER H (9.008 МВт·год)',
        commissionRatePercent: 4.5,
        registeredAt: '2026-09-18T14:00:00Z',
      },
    ];
    defaultPartnerDeals.forEach((d) => this.partnerDeals.set(d.id, d));

    // 5. Seed Initial Sources
    this.syncSources = [
      {
        id: 'src-catl-tener',
        name: 'CATL TENER Utility ESS Official Portal',
        url: 'https://www.catl.com/en/ess/tener/',
        sourceType: 'OFFICIAL_WEB',
        pollIntervalMinutes: 360,
        lastChecked: new Date().toISOString(),
        lastHash: 'sha256-a83f98c211e4',
        enabled: true,
      },
      {
        id: 'src-catl-enerone',
        name: 'CATL EnerOne Plus Product Datasheet (PDF)',
        url: 'https://www.catl.com/en/uploads/datasheet-enerone-plus-2026.pdf',
        sourceType: 'DATASHEET_PDF',
        pollIntervalMinutes: 720,
        lastChecked: new Date().toISOString(),
        lastHash: 'sha256-42fbc9e71881',
        enabled: true,
      },
    ];

    // 6. Seed Demo RFQ for admin verification
    const demoRfq: RfqRecord = {
      id: 'RFQ-UA-2026-1001',
      companyName: 'ТОВ «Агро-Енергія Захід»',
      contactPerson: 'Олег Василенко (Технічний директор)',
      phone: '+380 (67) 420-11-22',
      email: 'o.vasylenko@agro-energy.ua',
      location: 'Львівська обл., м. Стрий',
      powerKw: 1500,
      capacityKwh: 3000,
      durationHours: 2,
      industry: 'Агропромисловість',
      selectedSeries: 'CATL TENER S (6.25 МВт·год)',
      useCase: 'Peak Shaving (Зрізання піків споживання)',
      details: 'Приєднання до РУ-10 кВ елеватора, власна СЕС 2.2 МВт.',
      status: 'QUALIFICATION',
      utmSource: 'google_search',
      utmMedium: 'cpc',
      utmCampaign: 'bess_ukraine_autumn_2026',
      createdAt: '2026-10-01T07:15:00Z',
      updatedAt: '2026-10-01T08:30:00Z',
      notes: ['Клієнт передав погодинний графік навантаження. Інженер готує попередню схему.'],
      crmSyncStatus: 'SYNCED',
    };
    this.rfqs.set(demoRfq.id, demoRfq);

    this.persist();
  }

  // User & Authentication Queries
  public authenticateUser(email: string): UserRecord | null {
    const normalized = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === normalized) {
        u.lastLoginAt = new Date().toISOString();
        u.sessionToken = `token-${u.id}-${Date.now()}`;
        this.logAudit('USER_LOGIN', 'User', u.id, u.name, { role: u.role });
        this.persist();
        return u;
      }
    }
    return null;
  }

  public getUserByToken(token: string): UserRecord | null {
    for (const u of this.users.values()) {
      if (u.sessionToken === token) return u;
    }
    return null;
  }

  public getAllUsers(): UserRecord[] {
    return Array.from(this.users.values());
  }

  public getUserByEmail(email: string): UserRecord | null {
    const cleanEmail = email.toLowerCase().trim();
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === cleanEmail) || null;
  }

  public updateUserRole(userId: string, newRole: UserRole, actor: string): UserRecord | null {
    const user = this.users.get(userId);
    if (!user) return null;
    const oldRole = user.role;
    user.role = newRole;
    this.logAudit('USER_ROLE_CHANGED', 'User', userId, actor, { oldRole, newRole });
    this.persist();
    return user;
  }

  // Customer Projects
  public getCustomerProjects(userId?: string): CustomerProjectRecord[] {
    const all = Array.from(this.customerProjects.values());
    if (userId) {
      return all.filter((p) => p.userId === userId);
    }
    return all;
  }

  public createCustomerProject(data: Omit<CustomerProjectRecord, 'id' | 'createdAt' | 'updatedAt'>): CustomerProjectRecord {
    const id = `proj-${Date.now().toString().slice(-6)}`;
    const project: CustomerProjectRecord = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customerProjects.set(id, project);
    this.logAudit('CUSTOMER_PROJECT_CREATED', 'Project', id, data.customerName, { projectName: data.projectName });
    this.persist();
    return project;
  }

  // Partner Deals
  public getPartnerDeals(partnerId?: string): PartnerDealRecord[] {
    const all = Array.from(this.partnerDeals.values());
    if (partnerId) {
      return all.filter((d) => d.partnerId === partnerId);
    }
    return all;
  }

  public createPartnerDeal(data: Omit<PartnerDealRecord, 'id' | 'registeredAt'>): PartnerDealRecord {
    const id = `deal-${Date.now().toString().slice(-6)}`;
    const deal: PartnerDealRecord = {
      ...data,
      id,
      registeredAt: new Date().toISOString(),
    };
    this.partnerDeals.set(id, deal);
    this.logAudit('PARTNER_DEAL_REGISTERED', 'PartnerDeal', id, data.partnerCompanyName, { client: data.clientCompanyName, volume: data.dealSizeMwh });
    this.persist();
    return deal;
  }

  // PIM Queries
  public getAllProducts(): PimProductRecord[] {
    return Array.from(this.products.values());
  }

  public getProductById(id: string): PimProductRecord | undefined {
    return this.products.get(id);
  }

  public updateProduct(id: string, updates: Partial<PimProductRecord>, actor: string): PimProductRecord | null {
    const existing = this.products.get(id);
    if (!existing) return null;

    const updated: PimProductRecord = {
      ...existing,
      ...updates,
      provenance: {
        ...existing.provenance,
        revision: existing.provenance.revision + 1,
        lastUpdated: new Date().toISOString(),
        verifiedBy: actor,
      },
    };

    this.products.set(id, updated);
    this.logAudit('PRODUCT_UPDATE', 'Product', id, actor, { updates });
    this.persist();
    return updated;
  }

  // RFQ Queries
  public createRfq(data: Omit<RfqRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>): RfqRecord {
    const id = `RFQ-UA-${Date.now().toString().slice(-6)}`;
    const rfq: RfqRecord = {
      ...data,
      id,
      status: 'NEW',
      crmSyncStatus: 'SYNCED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rfqs.set(id, rfq);
    this.logAudit('RFQ_CREATED', 'RFQ', id, data.contactPerson, {
      company: data.companyName,
      series: data.selectedSeries,
      utmSource: data.utmSource,
    });
    this.persist();
    return rfq;
  }

  public getAllRfqs(): RfqRecord[] {
    return Array.from(this.rfqs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public updateRfqStatus(id: string, status: RfqRecord['status'], actor: string, note?: string): RfqRecord | null {
    const rfq = this.rfqs.get(id);
    if (!rfq) return null;
    rfq.status = status;
    rfq.updatedAt = new Date().toISOString();
    this.logAudit('RFQ_STATUS_CHANGE', 'RFQ', id, actor, { newStatus: status, note });
    this.persist();
    return rfq;
  }

  // CATL Sync Queries
  public getSyncSources(): SyncSourceItem[] {
    return this.syncSources;
  }

  public getSyncChanges(): SyncChangeItem[] {
    return this.syncChanges;
  }

  public addSyncChange(change: Omit<SyncChangeItem, 'id' | 'detectedAt' | 'status'>): SyncChangeItem {
    const id = `CHG-${Date.now()}`;
    const item: SyncChangeItem = {
      ...change,
      id,
      detectedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
    };
    this.syncChanges.push(item);
    this.persist();
    return item;
  }

  public approveSyncChange(changeId: string, actor: string): boolean {
    const change = this.syncChanges.find((c) => c.id === changeId);
    if (!change || change.status !== 'PENDING_REVIEW') return false;

    change.status = 'APPROVED';
    change.reviewedBy = actor;
    change.reviewedAt = new Date().toISOString();

    // Apply change to PIM Product
    const product = this.products.get(change.productId);
    if (product) {
      (product as any)[change.field] = change.newValue;
      product.provenance.lastUpdated = new Date().toISOString();
      product.provenance.verifiedBy = actor;
      product.provenance.revision += 1;
    }

    this.logAudit('SYNC_CHANGE_APPROVED', 'PIM', change.productId, actor, { field: change.field, newValue: change.newValue });
    this.persist();
    return true;
  }

  public rejectSyncChange(changeId: string, actor: string): boolean {
    const change = this.syncChanges.find((c) => c.id === changeId);
    if (!change) return false;
    change.status = 'REJECTED';
    change.reviewedBy = actor;
    change.reviewedAt = new Date().toISOString();
    this.logAudit('SYNC_CHANGE_REJECTED', 'PIM', change.productId, actor, { field: change.field });
    this.persist();
    return true;
  }

  // Audit Logs
  public logAudit(action: string, entity: string, entityId: string, actor: string, details: Record<string, any>) {
    this.auditLogs.unshift({
      id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      entity,
      entityId,
      actor,
      timestamp: new Date().toISOString(),
      details,
    });
    if (this.auditLogs.length > 500) {
      this.auditLogs = this.auditLogs.slice(0, 500);
    }
  }

  public getAuditLogs(): AuditLogItem[] {
    return this.auditLogs;
  }
}

export const db = new KatlDatabase();
