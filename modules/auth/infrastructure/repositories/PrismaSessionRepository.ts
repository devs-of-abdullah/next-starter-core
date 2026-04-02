import { PrismaClient } from "@/generated/prisma/client";
import { ISessionRepository } from "@/modules/auth/domain/interfaces/IRepositories";
import { Session } from "@/modules/auth/domain/entities/User";

export class PrismaSessionRepository implements ISessionRepository {
  constructor(private prisma: PrismaClient) {}

  async createSession(data: Partial<Session>): Promise<Session> {
    return this.prisma.session.create({
      data: {
        userId: data.userId!,
        refreshTokenHash: data.refreshTokenHash!,
        jti: data.jti!,
        fingerprint: data.fingerprint!,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt!,
      },
    }) as unknown as Promise<Session>;
  }

  async findActiveSessions(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    }) as unknown as Promise<Session[]>;
  }

  async findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { id },
    }) as unknown as Promise<Session | null>;
  }

  async revokeSession(id: string): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
