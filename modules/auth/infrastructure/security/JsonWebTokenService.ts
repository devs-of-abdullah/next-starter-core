import * as jose from "jose";
import { IJwtService } from "@/modules/auth/domain/interfaces/IServices";
import { env } from "@/lib/env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export class JsonWebTokenService implements IJwtService {
  async signToken(
    payload: object,
    options: { expiresIn?: string | number } = { expiresIn: "15m" },
  ): Promise<string> {
    return new jose.SignJWT(payload as jose.JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(options.expiresIn ?? "15m")
      .sign(JWT_SECRET);
  }

  async verifyToken<T>(token: string): Promise<T | null> {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      return payload as T;
    } catch {
      return null;
    }
  }

  async signRefreshToken(
    payload: object,
    options: { expiresIn?: string | number } = { expiresIn: "7d" },
  ): Promise<string> {
    return new jose.SignJWT(payload as jose.JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(options.expiresIn ?? "7d")
      .sign(REFRESH_SECRET);
  }

  async verifyRefreshToken<T>(token: string): Promise<T | null> {
    try {
      const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);
      return payload as T;
    } catch {
      return null;
    }
  }
}
