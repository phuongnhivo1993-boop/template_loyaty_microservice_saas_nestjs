import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TokenBlacklistService {
  private readonly logger = new Logger(TokenBlacklistService.name);
  private readonly client: Redis;
  private readonly memoryBlacklist = new Set<string>();

  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(url, {
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    this.client.on('error', (err) => {
      this.logger.warn(`Redis error in TokenBlacklist: ${err.message}`);
    });
    this.client.connect().catch((err) => {
      this.logger.warn(`Redis unavailable for token blacklist: ${err.message}. Using memory fallback.`);
    });
  }

  private getKey(jti: string): string {
    return `blacklisted:token:${jti}`;
  }

  async add(jti: string, expiresAt: Date): Promise<void> {
    const ttlSeconds = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
    try {
      await this.client.set(this.getKey(jti), '1', 'EX', ttlSeconds);
    } catch {
      this.memoryBlacklist.add(jti);
      setTimeout(() => this.memoryBlacklist.delete(jti), ttlSeconds * 1000);
    }
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    if (this.memoryBlacklist.has(jti)) return true;
    try {
      const val = await this.client.get(this.getKey(jti));
      return val === '1';
    } catch {
      return this.memoryBlacklist.has(jti);
    }
  }
}
