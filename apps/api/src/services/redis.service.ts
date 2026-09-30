import { redisClient, isRedisReady } from "../config/redis";

// In-memory fallback cache store for testing and when Redis server is offline
interface MemoryCacheItem {
  value: string;
  expiresAt?: number;
}
const memoryStore = new Map<string, MemoryCacheItem>();

export class RedisService {
  /**
   * Retrieves a cached JSON value by key
   */
  static async get<T = any>(key: string): Promise<T | null> {
    try {
      if (isRedisReady()) {
        const raw = await redisClient.get(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
      }
    } catch {
      // Fall through to memory store on error
    }

    // Memory fallback
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  /**
   * Sets a key with an optional TTL in seconds
   */
  static async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    const serialized = JSON.stringify(value);

    try {
      if (isRedisReady()) {
        if (ttlSeconds && ttlSeconds > 0) {
          await redisClient.set(key, serialized, "EX", ttlSeconds);
        } else {
          await redisClient.set(key, serialized);
        }
        return true;
      }
    } catch {
      // Fall through to memory store
    }

    // Memory fallback
    memoryStore.set(key, {
      value: serialized,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
    return true;
  }

  /**
   * Deletes a specific key
   */
  static async del(key: string): Promise<boolean> {
    let deleted = false;
    try {
      if (isRedisReady()) {
        const result = await redisClient.del(key);
        deleted = result > 0;
      }
    } catch {
      // ignore
    }

    if (memoryStore.has(key)) {
      memoryStore.delete(key);
      deleted = true;
    }
    return deleted;
  }

  /**
   * Invalidates all keys matching a wildcard pattern (e.g. "products:*")
   */
  static async invalidatePattern(pattern: string): Promise<number> {
    let count = 0;

    try {
      if (isRedisReady()) {
        const stream = redisClient.scanStream({
          match: pattern,
          count: 100,
        });

        const keysToDelete: string[] = [];

        await new Promise<void>((resolve, reject) => {
          stream.on("data", (resultKeys: string[]) => {
            keysToDelete.push(...resultKeys);
          });
          stream.on("end", () => resolve());
          stream.on("error", (err) => reject(err));
        });

        if (keysToDelete.length > 0) {
          const pipeline = redisClient.pipeline();
          keysToDelete.forEach((k) => pipeline.del(k));
          await pipeline.exec();
          count += keysToDelete.length;
        }
      }
    } catch {
      // Fall through to memory check
    }

    // Memory store pattern invalidation
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
    for (const key of Array.from(memoryStore.keys())) {
      if (regex.test(key)) {
        memoryStore.delete(key);
        count++;
      }
    }

    return count;
  }

  // ==========================================================================
  // GUEST CART SESSION STORAGE (TTL 7 DAYS)
  // ==========================================================================
  static async getGuestCart(sessionId: string): Promise<any | null> {
    return this.get(`cart:guest:${sessionId}`);
  }

  static async setGuestCart(sessionId: string, cartData: any): Promise<boolean> {
    const SEVEN_DAYS = 7 * 24 * 60 * 60; // 604,800 seconds
    return this.set(`cart:guest:${sessionId}`, cartData, SEVEN_DAYS);
  }

  static async deleteGuestCart(sessionId: string): Promise<boolean> {
    return this.del(`cart:guest:${sessionId}`);
  }

  // ==========================================================================
  // OTP AUTHENTICATION STORAGE (TTL 5 MINUTES)
  // ==========================================================================
  static async setOtp(identifier: string, code: string): Promise<boolean> {
    const FIVE_MINUTES = 5 * 60; // 300 seconds
    return this.set(`otp:${identifier.toLowerCase()}`, { code, createdAt: Date.now() }, FIVE_MINUTES);
  }

  static async verifyOtp(identifier: string, code: string): Promise<boolean> {
    const key = `otp:${identifier.toLowerCase()}`;
    const cached = await this.get<{ code: string }>(key);
    if (!cached || cached.code !== code) {
      return false;
    }
    // Delete OTP once used to prevent replay attacks
    await this.del(key);
    return true;
  }

  /**
   * Helper to clear memory fallback for tests
   */
  static clearMemoryStore(): void {
    memoryStore.clear();
  }
}
