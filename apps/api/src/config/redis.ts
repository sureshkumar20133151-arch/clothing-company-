import Redis, { RedisOptions } from "ioredis";
import { env } from "./env";

let isReady = false;

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    if (times > 3) {
      return null; // Stop retrying after 3 attempts
    }
    return Math.min(times * 200, 1000);
  },
};

export const redisClient = new Redis(env.REDIS_URL, redisOptions);

redisClient.on("connect", () => {
  // Connected
});

redisClient.on("ready", () => {
  isReady = true;
});

redisClient.on("error", (err) => {
  isReady = false;
  // Non-fatal warning so local dev or offline tests without live redis container don't crash
  if (env.NODE_ENV !== "test") {
    console.warn(`[Redis Warning] Unable to reach Redis at ${env.REDIS_URL}: ${err.message}`);
  }
});

redisClient.on("close", () => {
  isReady = false;
});

// Attempt initial non-blocking connection
if (env.NODE_ENV !== "test") {
  redisClient.connect().catch((err) => {
    isReady = false;
    console.warn(`[Redis Initial Connection] Running in fallback mode: ${err.message}`);
  });
}

export function isRedisReady(): boolean {
  return isReady && redisClient.status === "ready";
}
