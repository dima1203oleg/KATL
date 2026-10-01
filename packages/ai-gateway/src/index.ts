/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AiTaskType = 
  | 'bess_advisor'
  | 'extract_datasheet_specs'
  | 'translate_technical_content'
  | 'generate_seo_metadata'
  | 'classify_lead_rfq'
  | 'structured_extraction'
  | 'technical_summary';

export type ProviderHealthStatus = 
  | 'ACTIVE' 
  | 'NOT_CONFIGURED' 
  | 'DEGRADED' 
  | 'RATE_LIMITED' 
  | 'CIRCUIT_OPEN';

export interface AiTaskRequest {
  task: AiTaskType;
  prompt: string;
  context?: Record<string, unknown>;
  preferredProviders?: string[];
  preferredModel?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  budgetUsd?: number;
}

export interface AiTaskResponse {
  requestId: string;
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
  finishReason: 'stop' | 'length' | 'content_filter' | 'fallback';
  completedAt: string;
}

export interface AiProviderDefinition {
  id: string;
  name: string;
  envKeyName?: string;
  endpoint?: string;
  models: string[];
  defaultModel: string;
  costPer1kInputTokensUsd: number;
  costPer1kOutputTokensUsd: number;
  supportedTasks: AiTaskType[];
  status: ProviderHealthStatus;
  lastHealthCheck?: string;
  latencyAvgMs?: number;
}

export const SUPPORTED_AI_PROVIDERS: AiProviderDefinition[] = [
  {
    id: 'google-gemini',
    name: 'Google Gemini (Native SDK)',
    envKeyName: 'GEMINI_API_KEY',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
    defaultModel: 'gemini-2.5-flash',
    costPer1kInputTokensUsd: 0.0001,
    costPer1kOutputTokensUsd: 0.0004,
    supportedTasks: ['bess_advisor', 'extract_datasheet_specs', 'translate_technical_content', 'generate_seo_metadata', 'classify_lead_rfq', 'structured_extraction', 'technical_summary'],
    status: 'ACTIVE',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    envKeyName: 'OPENAI_API_KEY',
    models: ['gpt-4o', 'gpt-4o-mini'],
    defaultModel: 'gpt-4o-mini',
    costPer1kInputTokensUsd: 0.00015,
    costPer1kOutputTokensUsd: 0.0006,
    supportedTasks: ['bess_advisor', 'extract_datasheet_specs', 'translate_technical_content', 'generate_seo_metadata', 'classify_lead_rfq'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    envKeyName: 'ANTHROPIC_API_KEY',
    models: ['claude-3-7-sonnet', 'claude-3-5-haiku'],
    defaultModel: 'claude-3-5-haiku',
    costPer1kInputTokensUsd: 0.0008,
    costPer1kOutputTokensUsd: 0.004,
    supportedTasks: ['bess_advisor', 'extract_datasheet_specs', 'technical_summary'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'google-vertex',
    name: 'Google Vertex AI',
    envKeyName: 'GOOGLE_APPLICATION_CREDENTIALS',
    models: ['gemini-2.5-pro@vertex'],
    defaultModel: 'gemini-2.5-pro@vertex',
    costPer1kInputTokensUsd: 0.000125,
    costPer1kOutputTokensUsd: 0.0005,
    supportedTasks: ['bess_advisor', 'extract_datasheet_specs'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI Service',
    envKeyName: 'AZURE_OPENAI_API_KEY',
    models: ['gpt-4o-azure'],
    defaultModel: 'gpt-4o-azure',
    costPer1kInputTokensUsd: 0.00015,
    costPer1kOutputTokensUsd: 0.0006,
    supportedTasks: ['bess_advisor', 'translate_technical_content'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    envKeyName: 'MISTRAL_API_KEY',
    models: ['mistral-large-latest', 'codestral-latest'],
    defaultModel: 'mistral-large-latest',
    costPer1kInputTokensUsd: 0.0002,
    costPer1kOutputTokensUsd: 0.0006,
    supportedTasks: ['translate_technical_content', 'technical_summary'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    envKeyName: 'COHERE_API_KEY',
    models: ['command-r-plus'],
    defaultModel: 'command-r-plus',
    costPer1kInputTokensUsd: 0.0004,
    costPer1kOutputTokensUsd: 0.0016,
    supportedTasks: ['bess_advisor', 'structured_extraction'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    envKeyName: 'XAI_API_KEY',
    models: ['grok-2', 'grok-2-mini'],
    defaultModel: 'grok-2-mini',
    costPer1kInputTokensUsd: 0.0002,
    costPer1kOutputTokensUsd: 0.001,
    supportedTasks: ['bess_advisor', 'classify_lead_rfq'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'groq',
    name: 'Groq LPU Acceleration',
    envKeyName: 'GROQ_API_KEY',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.3-70b-versatile',
    costPer1kInputTokensUsd: 0.000059,
    costPer1kOutputTokensUsd: 0.000079,
    supportedTasks: ['classify_lead_rfq', 'generate_seo_metadata', 'bess_advisor'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'together-ai',
    name: 'Together AI',
    envKeyName: 'TOGETHER_API_KEY',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo'],
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    costPer1kInputTokensUsd: 0.00018,
    costPer1kOutputTokensUsd: 0.00018,
    supportedTasks: ['bess_advisor', 'translate_technical_content'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter Gateway',
    envKeyName: 'OPENROUTER_API_KEY',
    models: ['anthropic/claude-3.5-haiku', 'meta-llama/llama-3.3-70b-instruct'],
    defaultModel: 'meta-llama/llama-3.3-70b-instruct',
    costPer1kInputTokensUsd: 0.0002,
    costPer1kOutputTokensUsd: 0.0005,
    supportedTasks: ['bess_advisor', 'classify_lead_rfq', 'translate_technical_content'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    envKeyName: 'AWS_ACCESS_KEY_ID',
    models: ['anthropic.claude-v2'],
    defaultModel: 'anthropic.claude-v2',
    costPer1kInputTokensUsd: 0.0008,
    costPer1kOutputTokensUsd: 0.0024,
    supportedTasks: ['bess_advisor', 'technical_summary'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local On-Premises)',
    endpoint: 'http://localhost:11434',
    models: ['llama3.2', 'mistral', 'qwen2.5'],
    defaultModel: 'llama3.2',
    costPer1kInputTokensUsd: 0,
    costPer1kOutputTokensUsd: 0,
    supportedTasks: ['bess_advisor', 'classify_lead_rfq', 'generate_seo_metadata'],
    status: 'NOT_CONFIGURED',
  },
  {
    id: 'vllm',
    name: 'vLLM Private Cluster',
    endpoint: 'http://localhost:8000/v1',
    models: ['meta-llama/Meta-Llama-3.1-70B-Instruct'],
    defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
    costPer1kInputTokensUsd: 0,
    costPer1kOutputTokensUsd: 0,
    supportedTasks: ['bess_advisor', 'extract_datasheet_specs'],
    status: 'NOT_CONFIGURED',
  },
];
