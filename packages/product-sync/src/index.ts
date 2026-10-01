/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CatlSourceDefinition {
  id: string;
  name: string;
  url: string;
  sourceType: 'OFFICIAL_WEB' | 'OFFICIAL_PDF' | 'DATASHEET' | 'CERTIFICATE';
  pollIntervalHours: number;
  enabled: boolean;
  lastChecked?: string;
  contentHash?: string;
}

export interface SourceSnapshot {
  id: string;
  sourceId: string;
  timestamp: string;
  rawPayload: string;
  contentHash: string;
  httpStatus: number;
}

export interface SpecDifference {
  attributeName: string;
  currentPimValue: unknown;
  detectedSourceValue: unknown;
  confidence: number;
}

export interface ProductChangeSet {
  id: string;
  sourceId: string;
  snapshotId: string;
  productSlug: string;
  detectedDifferences: SpecDifference[];
  status: 'DETECTED' | 'REVIEW_REQUIRED' | 'ENGINEER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
