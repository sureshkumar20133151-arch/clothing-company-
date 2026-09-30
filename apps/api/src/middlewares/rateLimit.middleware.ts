import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient, isRedisReady } from "../config/redis";
import { Request, Response } from "express";

function createStore() {
  if (isRedisReady()) {
    try {
      return new RedisStore({
        // @ts-expect-error - rate-limit-redis expects ioredis sendCommand signature
        sendCommand: (...args: string[]) => redisClient.call(...args),
        prefix: "rl:",
      });
    } catch {
      return undefined; // fallback to in-memory store
    }
  }
  return undefined; // in-memory fallback
}

/**
 * General API rate limiter (150 requests per 15 minutes per IP)
 * Backed by Redis across PM2 cluster workers
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again after 15 minutes.",
    });
  },
});

/**
 * Strict authentication rate limiter (10 attempts per 15 minutes)
 * Protects login, registration, and OTP verification from brute-force
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts. Please try again after 15 minutes.",
    });
  },
});
