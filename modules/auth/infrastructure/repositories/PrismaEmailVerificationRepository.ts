import { PrismaClient } from "@/generated/prisma/client";
import {
  IEmailVerificationRepository,
  EmailVerificationTokenRecord,
} from "@/modules/auth/domain/interfaces/IRepositories";

export class PrismaEmailVerificationRepository
  implements IEmailVerificationRepository
{
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    // Invalidate any existing token before creating a new one
    await this.prisma.emailVerificationToken.deleteMany({ where: { userId } });
    await this.prisma.emailVerificationToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<EmailVerificationTokenRecord | null> {
    return this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({ where: { userId } });
  }
}
