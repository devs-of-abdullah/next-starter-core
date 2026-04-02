import { PrismaClient } from "@/generated/prisma/client";
import { IUserRepository } from '@/modules/auth/domain/interfaces/IRepositories';
import { User } from '@/modules/auth/domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } }) as unknown as Promise<User | null>;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } }) as unknown as Promise<User | null>;
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email!,
        passwordHash: data.passwordHash!,
        role: data.role || 'USER',
        failedLoginAttempts: 0,
        isActive: true,
      }
    }) as unknown as Promise<User>;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data
      }
    }) as unknown as Promise<User>;
  }

  async incrementFailedLogins(id: string): Promise<User> {
    // Atomic increment avoids a read-then-write race condition.
    // The transaction ensures the lock is applied in the same round-trip when the threshold is crossed.
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: { failedLoginAttempts: { increment: 1 } },
      });

      if (updated.failedLoginAttempts >= 5 && !updated.lockedUntil) {
        return tx.user.update({
          where: { id },
          data: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000) },
        });
      }

      return updated;
    }) as unknown as Promise<User>;
  }

  async resetFailedLogins(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date()
      }
    }) as unknown as Promise<User>;
  }
}
