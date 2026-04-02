import {
  IUserRepository,
  IAuditRepository,
  IEmailVerificationRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";
import {
  ICryptoService,
  IMailerService,
} from "@/modules/auth/domain/interfaces/IServices";
import { ApiRegisterDTO } from "../dtos/auth.dto";
import { randomBytes, createHash } from "crypto";

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private auditRepository: IAuditRepository,
    private cryptoService: ICryptoService,
    private mailerService: IMailerService,
    private emailVerificationRepository: IEmailVerificationRepository,
  ) {}

  async execute(dto: ApiRegisterDTO, meta: { ip: string; ua: string }) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const passwordHash = await this.cryptoService.hash(dto.password);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: "USER",
      isActive: true,
      failedLoginAttempts: 0,
    });

    const verificationToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(verificationToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await this.emailVerificationRepository.create(user.id, tokenHash, expiresAt);
    await this.mailerService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.id,
    );
    await this.auditRepository.log(
      user.id,
      "REGISTER",
      meta.ip,
      meta.ua,
    );

    return {
      success: true,
      message: "Please check your email to verify your account.",
    };
  }
}
