import { z } from "zod";

const serverEnvSchema = z
  .object({
    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),

    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  })
  .refine(
    (data) =>
      (!data.UPSTASH_REDIS_REST_URL && !data.UPSTASH_REDIS_REST_TOKEN) ||
      (data.UPSTASH_REDIS_REST_URL && data.UPSTASH_REDIS_REST_TOKEN),
    {
      message: "Redis URL and TOKEN must be provided together",
    },
  );

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;

  const message = Object.entries(errors)
    .map(([key, val]) => `${key}: ${val?.join(", ")}`)
    .join("\n");

  throw new Error(`❌ Invalid SERVER env:\n${message}`);
}

export const serverEnv = parsed.data;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
