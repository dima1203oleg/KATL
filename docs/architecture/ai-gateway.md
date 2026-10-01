# AI Provider Gateway Architecture

## Architectural Principles
1. **Zero Client-Side SDKs**: Frontend never imports `@google/genai`, `openai`, `anthropic`, or holds API keys.
2. **Standardized Internal Contract**:
```typescript
interface AIRequest {
  task: 'advisor' | 'specs_extraction' | 'translation' | 'sizing_assistance';
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  context?: Record<string, any>;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
  };
  latencyMs: number;
}
```

3. **Provider Failover Chain**:
```
Primary: Google Gemini (Server-side API)
   ↓ (fail / rate-limit / timeout)
Fallback: OpenAI / Azure / Anthropic
   ↓ (fail)
Deterministic Heuristic Rule Engine (BESS Knowledge Base)
```

4. **Safety & Hallucination Guardrails**:
- AI не має права генерувати вигадані технічні характеристики або довільні ємності акумуляторних комірок.
- Перед видачею рекомендацій системні промпти підсилюються підтвердженими даними з PIM (RAG context).
