import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 minute
let limitMethod;
try {
  limitMethod = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
  });
} catch {
  // Graceful fallback for environments missing Redis configuration
  limitMethod = {
    limit: async () => ({
      success: true,
      limit: 5,
      remaining: 4,
      reset: 0,
    }),
  };
}

export const authRateLimiter = limitMethod;

export interface IRateLimiter {
  check(identifier: string): Promise<{ success: boolean }>;
}

export class UpstashRateLimiter implements IRateLimiter {
  async check(identifier: string): Promise<{ success: boolean }> {
    return authRateLimiter.limit(identifier);
  }
}

export const rateLimiter = new UpstashRateLimiter();
