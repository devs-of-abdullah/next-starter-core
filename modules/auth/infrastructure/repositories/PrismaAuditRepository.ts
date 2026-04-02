import { PrismaClient, Prisma } from "@/generated/prisma/client";
import { IAuditRepository, AuditLogEntry } from "@/modules/auth/domain/interfaces/IRepositories";

export class PrismaAuditRepository implements IAuditRepository {
  constructor(private prisma: PrismaClient) {}

  async log(
    userId: string | null,
    action: string,
    ipAddress: string | null = null,
    userAgent: string | null = null,
    metadata?: object,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  async findManyByUserId(userId: string): Promise<AuditLogEntry[]> {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }) as unknown as Promise<AuditLogEntry[]>;
  }

  async findAll(): Promise<AuditLogEntry[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true },
        },
      },
    }) as unknown as Promise<AuditLogEntry[]>;
  }
}
