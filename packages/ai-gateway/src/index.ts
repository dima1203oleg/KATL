/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AiTaskType = 
  | 'bess_advisor'
  | 'extract_datasheet_specs'
  | 'translate_technical_content'
  | 'generate_seo_metadata'
  | 'classify_lead_rfq';

export interface AiTaskRequest {
  task: AiTaskType;
  prompt: string;
  context?: Record<string, unknown>;
  preferredModel?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AiTaskResponse {
  task: AiTaskType;
  provider: string;
  model: string;
  content: string;
  structuredOutput?: Record<string, unknown>;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  latencyMs: number;
  completedAt: string;
}

export interface AiProviderAdapter {
  providerId: string;
  isAvailable(): Promise<boolean>;
  execute(request: AiTaskRequest): Promise<AiTaskResponse>;
}
