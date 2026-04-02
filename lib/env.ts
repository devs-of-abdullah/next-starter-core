import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Using a proxy or direct access - since Next.js statically replaces process.env.NEXT_PUBLIC_*
// and dynamically provides the rest on server. This parses only on the server, except 
// NEXT_PUBLIC_APP_URL which is needed on client too.
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
};

// Only validate server variables if we are on the server
const isServer = typeof window === "undefined";

const parsed = isServer 
  ? envSchema.safeParse(processEnv)
  : z.object({ NEXT_PUBLIC_APP_URL: z.string().url() }).safeParse({ NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL });


if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  const message = Object.entries(errors)
    .map(([key, val]) => `${key}: ${val?.join(", ")}`)
    .join("\n");
  throw new Error(`❌ Invalid environment variables:\n${message}`);
}

export const env = parsed.data as z.infer<typeof envSchema>;
