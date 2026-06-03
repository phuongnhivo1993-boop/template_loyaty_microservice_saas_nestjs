import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis;
  private readonly defaultTtl = 300;

  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(url, {
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.warn('Redis connection failed after 3 retries, cache disabled');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });
    this.client.on('error', (err) => {
      this.logger.warn(`Redis error: ${err.message}`);
    });
    this.client.connect().catch((err) => {
      this.logger.warn(`Redis connection failed: ${err.message}. Cache will be disabled.`);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const val = await this.client.get(key);
      if (val) return JSON.parse(val) as T;
    } catch {}
    return null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const ttl = ttlSeconds ?? this.defaultTtl;
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch {}
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch {}
  }

  onModuleDestroy() {
    this.client.quit().catch(() => {});
  }
}
