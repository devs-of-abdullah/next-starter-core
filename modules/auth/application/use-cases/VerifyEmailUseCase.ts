import { createHash } from "crypto";
import {
  IUserRepository,
  IAuditRepository,
  IEmailVerificationRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";

export class VerifyEmailUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailVerificationRepository: IEmailVerificationRepository,
    private auditRepository: IAuditRepository,
  ) {}

  async execute(token: string, userId: string, meta: { ip: string; ua: string }) {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const record = await this.emailVerificationRepository.findByTokenHash(tokenHash);

    if (!record || record.userId !== userId) {
      throw new Error("Invalid or expired verification token");
    }

    if (record.expiresAt < new Date()) {
      await this.emailVerificationRepository.deleteByUserId(userId);
      throw new Error("Verification token has expired");
    }

    await this.userRepository.update(userId, { isEmailVerified: true });
    await this.emailVerificationRepository.deleteByUserId(userId);
    await this.auditRepository.log(userId, "EMAIL_VERIFIED", meta.ip, meta.ua);
  }
}
