import { createHash } from "crypto";
import {
  IUserRepository,
  IPasswordResetRepository,
  ISessionRepository,
  IAuditRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";
import { ICryptoService } from "@/modules/auth/domain/interfaces/IServices";

export class ResetPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetRepository: IPasswordResetRepository,
    private sessionRepository: ISessionRepository,
    private auditRepository: IAuditRepository,
    private cryptoService: ICryptoService,
  ) {}

  async execute(
    token: string,
    newPassword: string,
    meta: { ip: string; ua: string },
  ): Promise<void> {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const record = await this.passwordResetRepository.findByTokenHash(tokenHash);

    if (!record || record.expiresAt < new Date()) {
      // Same error for not-found and expired — prevents token oracle attacks
      throw new Error("Invalid or expired password reset link.");
    }

    const user = await this.userRepository.findById(record.userId);
    if (!user || !user.isActive) {
      throw new Error("Invalid or expired password reset link.");
    }

    const newPasswordHash = await this.cryptoService.hash(newPassword);

    // Update password, clear lockout state, invalidate token and all sessions atomically
    await Promise.all([
      this.userRepository.update(user.id, {
        passwordHash: newPasswordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      }),
      this.passwordResetRepository.deleteByUserId(user.id),
      this.sessionRepository.revokeAllUserSessions(user.id),
    ]);

    await this.auditRepository.log(
      user.id,
      "PASSWORD_RESET",
      meta.ip,
      meta.ua,
    );
  }
}
