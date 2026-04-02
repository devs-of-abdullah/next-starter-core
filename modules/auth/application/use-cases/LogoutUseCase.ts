import {
  ISessionRepository,
  IAuditRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";
import {
  ICryptoService,
  IJwtService,
} from "@/modules/auth/domain/interfaces/IServices";

export class LogoutUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private cryptoService: ICryptoService,
    private jwtService: IJwtService,
    private auditRepository: IAuditRepository,
  ) {}

  async execute(refreshToken: string, meta: { ip: string; ua: string }) {
    const decoded = await this.jwtService.verifyRefreshToken<{ userId: string }>(
      refreshToken,
    );
    if (!decoded) return; // If it's already invalid, ignore

    const sessions = await this.sessionRepository.findActiveSessions(
      decoded.userId,
    );

    for (const s of sessions) {
      if (await this.cryptoService.compare(refreshToken, s.refreshTokenHash)) {
        await this.sessionRepository.revokeSession(s.id);
        await this.auditRepository.log(decoded.userId, "LOGOUT", meta.ip, meta.ua);
        break;
      }
    }
  }
}
