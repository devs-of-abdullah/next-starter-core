import { NextRequest, NextResponse } from "next/server";
import { dependencies } from "@/modules/auth/infrastructure/di/container";
import { setRefreshTokenCookie, clearCookie } from "@/lib/utils/cookies";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await dependencies.jwtService.verifyRefreshToken<{ userId: string }>(refreshToken);

    if (!payload?.userId) {
      await clearCookie("refreshToken");
      await clearCookie("accessToken");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const ua = req.headers.get("user-agent") ?? "unknown";
    const fingerprint = crypto.createHash("sha256").update(ip + ua).digest("hex");

    // Find an active session whose token hash matches and fingerprint matches
    const activeSessions = await dependencies.sessionRepository.findActiveSessions(payload.userId);

    // Validate via bcrypt compare (hash stored, not plain)
    let sessionValid = false;
    for (const session of activeSessions) {
      const matches = await dependencies.cryptoService.compare(refreshToken, session.refreshTokenHash);
      if (matches && session.fingerprint === fingerprint) {
        sessionValid = true;
        // Rotate: revoke old session
        await dependencies.sessionRepository.revokeSession(session.id);
        break;
      }
    }

    if (!sessionValid) {
      // Token reuse or fingerprint mismatch — revoke all sessions as precaution
      await dependencies.sessionRepository.revokeAllUserSessions(payload.userId);
      await clearCookie("refreshToken");
      await clearCookie("accessToken");
      await dependencies.auditRepository.log(
        payload.userId,
        "SESSION_HIJACK_SUSPECTED",
        ip,
        ua,
        { reason: "Refresh token fingerprint mismatch or reuse detected" },
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await dependencies.userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      await clearCookie("refreshToken");
      await clearCookie("accessToken");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Issue new tokens
    const newAccessToken = await dependencies.jwtService.signToken({
      userId: user.id,
      role: user.role,
    });
    const newRefreshToken = await dependencies.jwtService.signRefreshToken({ userId: user.id });
    const newRefreshHash = await dependencies.cryptoService.hash(newRefreshToken);
    const jti = crypto.randomUUID();

    await dependencies.sessionRepository.createSession({
      userId: user.id,
      refreshTokenHash: newRefreshHash,
      jti,
      fingerprint,
      ipAddress: ip,
      userAgent: ua,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await setRefreshTokenCookie({ name: "refreshToken", value: newRefreshToken });
    await setRefreshTokenCookie({ name: "accessToken", value: newAccessToken, maxAge: 15 * 60 });

    return NextResponse.json({ success: true });
  } catch {
    await clearCookie("refreshToken");
    await clearCookie("accessToken");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
