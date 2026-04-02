import { env } from "@/lib/env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fallback in-memory map
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function clearMemoryStore() {
  const now = Date.now();
  for (const [key, val] of memoryStore.entries()) {
    if (val.resetAt < now) {
      memoryStore.delete(key);
    }
  }
}
setInterval(clearMemoryStore, 60000);

let upstashLimiter: Ratelimit | null = null;
if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
  upstashLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    timeout: 3000, 
  });
}

function memoryRateLimitCheck(ip: string, maxAttempts: number, windowMs: number) {
  const now = Date.now();
  const record = memoryStore.get(ip);
  if (!record || record.resetAt < now) {
    memoryStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxAttempts - 1, resetAt: now + windowMs };
  }
  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }
  record.count++;
  return { success: true, remaining: maxAttempts - record.count, resetAt: record.resetAt };
}

export async function checkRateLimit(ip: string, action: "login" | "register" | "reset-password" | "forgot-password" | string): Promise<{ success: boolean; retryAfter?: number }> {
  let maxAttempts = 5;
  let windowDurationMs = 15 * 60 * 1000;
  let upstashWindow: `${number} ${"s" | "m" | "h" | "d"}` = "15 m";

  if (action === "register") {
    maxAttempts = 3;
    windowDurationMs = 60 * 60 * 1000;
    upstashWindow = "1 h";
  } else if (action === "reset-password" || action === "forgot-password") {
    maxAttempts = 3;
    windowDurationMs = 60 * 60 * 1000;
    upstashWindow = "1 h";
  }

  const identifier = `ratelimit:${action}:${ip}`;

  if (upstashLimiter) {
    // We recreate limiter loosely to allow dynamic windows based on action,
    // Note: in a pure implementation you might cache instances of Ratelimit for each action.
    const specificLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(maxAttempts, upstashWindow),
      timeout: 3000, 
    });
    
    try {
      const { success, reset } = await specificLimiter.limit(identifier);
      return { success, retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000) };
    } catch {
      // Fallback if upstash throws
    }
  }

  const { success, resetAt } = memoryRateLimitCheck(identifier, maxAttempts, windowDurationMs);
  return { success, retryAfter: success ? undefined : Math.ceil((resetAt - Date.now()) / 1000) };
}
