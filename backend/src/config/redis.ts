import { logger } from '../utils/logger';

// In-Memory Redis Cache Engine Fallback for rapid high-performance deployment
class RedisCacheService {
  private cacheStore = new Map<string, { value: string; expiresAt?: number }>();

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cacheStore.set(key, { value, expiresAt });
    logger.info(`[REDIS CACHE SET]: Key "${key}" stored (TTL: ${ttlSeconds || 'Indefinite'}s)`);
  }

  public async get(key: string): Promise<string | null> {
    const data = this.cacheStore.get(key);
    if (!data) return null;
    if (data.expiresAt && Date.now() > data.expiresAt) {
      this.cacheStore.delete(key);
      logger.info(`[REDIS CACHE EXPIRED]: Key "${key}" evicting`);
      return null;
    }
    return data.value;
  }

  public async del(key: string): Promise<void> {
    this.cacheStore.delete(key);
  }

  public async flush(): Promise<void> {
    this.cacheStore.clear();
  }
}

export const redisCache = new RedisCacheService();
