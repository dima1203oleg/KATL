import Redis, { RedisOptions } from 'ioredis';

let redisClient: Redis | null = null;

export const REDIS_KEYS = {
  PIM_PRODUCT: (id: string) => `pim:product:${id}`,
  PIM_CATALOG: 'pim:catalog:all',
  CALC_CACHE: (hash: string) => `calc:scenario:${hash}`,
  AI_TOKEN_USAGE: (dateStr: string) => `ai:tokens:${dateStr}`,
  QUEUE_SYNC: 'queue:catl_sync',
  QUEUE_RFQ: 'queue:rfq_dispatch',
} as const;

export function getRedisClient(options?: RedisOptions): Redis {
  if (!redisClient) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      ...options,
    });

    redisClient.on('error', (err) => {
      console.warn('[Redis Client Warning]:', err.message);
    });
  }

  return redisClient;
}

export class KatlCacheService {
  private redis = getRedisClient();

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn('[Cache Set Error]:', err);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      console.warn('[Cache Del Error]:', err);
    }
  }
}

export const katlCache = new KatlCacheService();
