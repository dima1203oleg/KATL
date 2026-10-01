# ADR-004: Centralized AI Provider Gateway & Server-Side Execution

## Status
Accepted (2026-10-01)

## Context
Multiple business modules require AI capabilities: Energy Advisor, spec extraction from PDF datasheets, translation assistance, and SEO generation. Calling AI providers directly from client components exposes API secrets, prevents token accounting, and binds business logic to specific proprietary SDKs.

## Decision
1. Implement a unified **AI Provider Gateway** residing entirely on the backend (`src/server/ai-gateway` and `packages/ai-gateway`).
2. Business modules only invoke the unified `aiGateway.executeTask({ task, input, context })` contract.
3. Keep all credentials (API keys) on the server.
4. Support multi-provider adapter interfaces (Gemini, Claude, OpenAI, DeepSeek) with automated failover, token cost tracking, and budget enforcement.

## Consequences
- Total protection of API keys.
- Full visibility into token usage, latency, and operational cost.
- Ability to switch underlying models or providers with zero frontend code changes.
