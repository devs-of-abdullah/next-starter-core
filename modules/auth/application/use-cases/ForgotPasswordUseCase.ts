import { randomBytes, createHash } from "crypto";
import {
  IUserRepository,
  IPasswordResetRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";
import { IMailerService } from "@/modules/auth/domain/interfaces/IServices";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetRepository: IPasswordResetRepository,
    private mailerService: IMailerService,
  ) {}

  async execute(email: string): Promise<void> {
    // Always resolve successfully — never reveal whether the email exists
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) return;

    // Generate a cryptographically random token (plain) and store its hash
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await this.passwordResetRepository.create(user.id, tokenHash, expiresAt);
    await this.mailerService.sendPasswordResetEmail(user.email, token);
  }
}
