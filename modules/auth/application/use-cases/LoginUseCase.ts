import {
  IUserRepository,
  ISessionRepository,
  IAuditRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";
import {
  ICryptoService,
  IJwtService,
} from "@/modules/auth/domain/interfaces/IServices";
import { LoginDTO } from "../dtos/auth.dto";
import crypto from "crypto";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository,
    private auditRepository: IAuditRepository,
    private cryptoService: ICryptoService,
    private jwtService: IJwtService,
  ) {}

  async execute(dto: LoginDTO, meta: { ip: string; ua: string }) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      await this.auditRepository.log(
        null,
        "LOGIN_FAILED",
        meta.ip,
        meta.ua,
        { reason: "User not found" },
      );
      throw new Error("Invalid credentials"); // Use AppError/Custom Error in a real scenario
    }

    if (!user.isActive) throw new Error("Account is disabled");
    if (!user.isEmailVerified)
      throw new Error("Please verify your email first");

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await this.auditRepository.log(
        user.id,
        "LOGIN_LOCKED",
        meta.ip,
        meta.ua,
        { reason: "Account locked" },
      );
      throw new Error(
        "Account temporarily locked due to too many failed attempts",
      );
    }

    const isMatch = await this.cryptoService.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isMatch) {
      const updatedUser = await this.userRepository.incrementFailedLogins(
        user.id,
      );
      await this.auditRepository.log(
        user.id,
        "LOGIN_FAILED",
        meta.ip,
        meta.ua,
        { reason: "Invalid password" },
      );
      if (updatedUser.lockedUntil) {
        throw new Error(
          "Account temporarily locked due to too many failed attempts",
        );
      }
      throw new Error("Invalid credentials");
    }

    // Success login
    await this.userRepository.resetFailedLogins(user.id);
    await this.auditRepository.log(user.id, "LOGIN_SUCCESS", meta.ip, meta.ua);

    const accessToken = await this.jwtService.signToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = await this.jwtService.signRefreshToken({ userId: user.id });

    const refreshHash = await this.cryptoService.hash(refreshToken);

    const jti = crypto.randomUUID();
    const fingerprint = crypto.createHash("sha256").update(meta.ip + meta.ua).digest("hex");

    await this.sessionRepository.createSession({
      userId: user.id,
      refreshTokenHash: refreshHash,
      jti,
      fingerprint,
      ipAddress: meta.ip,
      userAgent: meta.ua,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, role: user.role, email: user.email },
    };
  }
}
