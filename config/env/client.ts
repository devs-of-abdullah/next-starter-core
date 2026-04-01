import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;

  const message = Object.entries(errors)
    .map(([key, val]) => `${key}: ${val?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid CLIENT env:\n${message}`);
}

export const clientEnv = parsed.data;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
