import { PrismaClient } from "@/generated/prisma/client";
import {
  IPasswordResetRepository,
  PasswordResetTokenRecord,
} from "@/modules/auth/domain/interfaces/IRepositories";

export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    // Remove any existing tokens for this user before creating a new one
    await this.prisma.passwordResetToken.deleteMany({ where: { userId } });
    await this.prisma.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetTokenRecord | null> {
    return this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    }) as Promise<PasswordResetTokenRecord | null>;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({ where: { userId } });
  }
}
