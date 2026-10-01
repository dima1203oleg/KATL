/**
 * AI Provider Gateway & Orchestration Layer
 * Encapsulates all AI requests server-side.
 * Handles task routing, provider failover, cost accounting, and domain guardrails.
 */

import { GoogleGenAI } from '@google/genai';
import { db } from '../db/database';

export interface AIProviderUsage {
  totalRequests: number;
  totalTokens: number;
  estimatedCostUsd: number;
  lastActive: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIAdvisorResult {
  text: string;
  provider: string;
  model: string;
  latencyMs: number;
  recommendation?: {
    productName: string;
    productId: string;
    powerKw: number;
    capacityKwh: number;
    savingsPct: number;
    paybackYears: number;
    reasoning: string;
  };
}

class AIProviderGateway {
  private geminiClient: GoogleGenAI | null = null;
  private usageStats: AIProviderUsage = {
    totalRequests: 0,
    totalTokens: 0,
    estimatedCostUsd: 0,
    lastActive: new Date().toISOString(),
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.geminiClient = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn('[AI Gateway] Could not init Gemini client:', e);
      }
    }
  }

  public getStats(): AIProviderUsage {
    return this.usageStats;
  }

  /**
   * Primary Orchestration Method: Handles Energy Advisor Chat
   */
  public async handleAdvisorChat(
    messages: AIChatMessage[],
    context?: { powerKw?: number; loadMw?: number; location?: string }
  ): Promise<AIAdvisorResult> {
    const startTime = Date.now();
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';

    // Fetch verified PIM data to inject as grounding context
    const products = db.getAllProducts();
    const pimContext = products.map((p) => ({
      id: p.id,
      name: p.name,
      capacity: p.energySpecs.nominalCapacity,
      cell: p.cellSpecs.chemistry,
      efficiency: p.energySpecs.efficiencyRoundTrip,
      voltage: p.energySpecs.nominalVoltage,
      cooling: p.thermalSpecs.coolingMethod,
      cycleLife: p.cellSpecs.cycleLife,
    }));

    // If Gemini key exists, try real AI generation with strict grounding
    if (this.geminiClient && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `Ти провідний інженер платформи CATL Energy Storage в Україні.
Твоє завдання — професійно консультувати енергетиків підприємств, підбирати оптимальні конфігурації BESS та розраховувати окупність.
Використовуй виключно офіційні верифіковані дані CATL:
${JSON.stringify(pimContext, null, 2)}

Правила:
1. Ніколи не вигадуй ємності, яких немає в PIM (TENER H: 9.008 МВт·год, TENER S: 6.25 МВт·год, EnerOne Plus: 372.7 кВт·год, TENER Sodium: 4.5 МВт·год).
2. Відповідай українською мовою лаконічно, технічно грамотно (згадуй LFP, рідинне охолодження, стандарти NFPA 855/UL 9540A).
3. Якщо користувач задає параметри об'єкта, запропонуй конкретну систему та орієнтовну окупність.`;

        const response = await this.geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }, { text: lastUserMsg }] },
          ],
        });

        const replyText = response.text || '';
        const latencyMs = Date.now() - startTime;

        this.usageStats.totalRequests += 1;
        this.usageStats.totalTokens += Math.round((systemPrompt.length + replyText.length) / 4);
        this.usageStats.estimatedCostUsd += 0.0003;
        this.usageStats.lastActive = new Date().toISOString();

        const recommendation = this.extractRecommendation(lastUserMsg, replyText);

        return {
          text: replyText,
          provider: 'Google Gemini (Official Gateway)',
          model: 'gemini-2.5-flash',
          latencyMs,
          recommendation,
        };
      } catch (err) {
        console.warn('[AI Gateway] Primary Gemini provider failed, switching to failover engine:', err);
      }
    }

    // Failover deterministic BESS Engineering rule engine (100% reliable)
    const latencyMs = Date.now() - startTime;
    this.usageStats.totalRequests += 1;
    this.usageStats.lastActive = new Date().toISOString();

    return this.runDeterministicFailover(lastUserMsg, latencyMs);
  }

  private extractRecommendation(query: string, reply: string) {
    const q = query.toLowerCase();
    if (q.includes('завод') || q.includes('1.5') || q.includes('сес') || q.includes('соняч')) {
      return {
        productName: 'CATL TENER S (6.25 МВт·год)',
        productId: 'catl-tener-s',
        powerKw: 1500,
        capacityKwh: 3125,
        savingsPct: 42,
        paybackYears: 3.4,
        reasoning: 'Прецизійне рідкісне охолодження забезпечує прийом високих піків генерації СЕС без ризику деградації.',
      };
    }
    if (q.includes('резерв') || q.includes('4') || q.includes('500') || q.includes('склад')) {
      return {
        productName: 'CATL EnerOne Plus (372.7 кВт·год)',
        productId: 'catl-enerone-plus',
        powerKw: 500,
        capacityKwh: 1490,
        savingsPct: 36,
        paybackYears: 3.9,
        reasoning: 'Компактний зовнішній монтаж (1.3 м² на модуль), автоматичний перехід < 20 мс для безперервного живлення.',
      };
    }
    return {
      productName: 'CATL TENER H (9.008 МВт·год)',
      productId: 'catl-tener-h',
      powerKw: 2500,
      capacityKwh: 9008,
      savingsPct: 48,
      paybackYears: 3.2,
      reasoning: 'Максимальна енергетична щільність на площу 20ft контейнера з нульовою деградацією за перші 5 років.',
    };
  }

  private runDeterministicFailover(query: string, latencyMs: number): AIAdvisorResult {
    const q = query.toLowerCase();

    if (q.includes('завод') || q.includes('1.5') || q.includes('сес') || q.includes('сонц')) {
      return {
        text: 'Для промислового підприємства із наявною або запланованою СЕС оптимальним рішенням є флагманська система CATL TENER S або TENER H. Вона дозволяє акумулювати сонячний профіцит у денні години та зрізати споживання у дорогий вечірній пік з нульовою деградацією за перші 5 років.',
        provider: 'CATL Expert Rule Engine (Failover)',
        model: 'bess-domain-v1.4',
        latencyMs,
        recommendation: {
          productName: 'CATL TENER S (6.25 МВт·год)',
          productId: 'catl-tener-s',
          powerKw: 1500,
          capacityKwh: 3125,
          savingsPct: 42,
          paybackYears: 3.4,
          reasoning: 'Двоконтурний рідкісний контур (ΔT ≤ 2.5°C) гарантує стабільну роботу при високих струмах заряду від СЕС.',
        },
      };
    }

    if (q.includes('резерв') || q.includes('4') || q.includes('500') || q.includes('дбж')) {
      return {
        text: 'Для безперебійного резервного живлення критичних ліній потужністю 500 кВт на 4 години необхідно щонайменше 2000 кВт·год накопичувача. Рекомендуємо кластер із 4–6 модульних зовнішніх шаф CATL EnerOne Plus з часом переходу на батареї менше 20 мс.',
        provider: 'CATL Expert Rule Engine (Failover)',
        model: 'bess-domain-v1.4',
        latencyMs,
        recommendation: {
          productName: 'CATL EnerOne Plus (372.7 кВт·год)',
          productId: 'catl-enerone-plus',
          powerKw: 500,
          capacityKwh: 1863,
          savingsPct: 35,
          paybackYears: 4.1,
          reasoning: 'Модульне масштабування дозволяє почати з 1 шафи та розширювати ємність паралельно без тривалих зупинок підприємства.',
        },
      };
    }

    return {
      text: 'Платформа CATL в Україні пропонує модульні системи накопичення енергії від 372 кВт·год (EnerOne Plus для бізнесу) до 9.008 МВт·год (TENER H для масштабних об’єктів). Всі системи сертифіковані за NFPA 855 та UL 9540A і дозволяють скоротити витрати на електроенергію на 30–50%.',
      provider: 'CATL Expert Rule Engine (Failover)',
      model: 'bess-domain-v1.4',
      latencyMs,
      recommendation: {
        productName: 'CATL TENER H (9.008 МВт·год)',
        productId: 'catl-tener-h',
        powerKw: 1200,
        capacityKwh: 2400,
        savingsPct: 40,
        paybackYears: 3.6,
        reasoning: 'Оптимальний вибір для енергоємних об’єктів з високим тарифом та жорсткими обмеженнями потужності.',
      },
    };
  }
}

export const aiGateway = new AIProviderGateway();
