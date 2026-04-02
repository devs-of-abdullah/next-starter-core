import { db } from "@/modules/auth/infrastructure/di/container";
import type { Prisma } from "@/generated/prisma/client";

export async function logAudit(
  userId: string | null,
  action: string,
  ipAddress: string | null,
  userAgent: string | null,
  metadata?: Record<string, unknown>,
) {
  try {
    await db.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  } catch {
    // Silent fail — audit logging must never crash the main request
  }
}
