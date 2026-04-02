import { randomBytes, createHash } from "crypto";
import {
  IUserRepository,
  IAuditRepository,
  IEmailVerificationRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";
import { IMailerService } from "@/modules/auth/domain/interfaces/IServices";

export class ResendVerificationUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailVerificationRepository: IEmailVerificationRepository,
    private mailerService: IMailerService,
    private auditRepository: IAuditRepository,
  ) {}

  async execute(email: string, meta: { ip: string; ua: string }) {
    // Always return silently — prevents email enumeration
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive || user.isEmailVerified) return;

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await this.emailVerificationRepository.create(user.id, tokenHash, expiresAt);
    await this.mailerService.sendVerificationEmail(user.email, token, user.id);
    await this.auditRepository.log(user.id, "VERIFICATION_EMAIL_RESENT", meta.ip, meta.ua);
  }
}
