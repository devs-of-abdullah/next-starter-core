import { NextRequest, NextResponse } from "next/server";
import { clearCookie } from "@/lib/utils/cookies";
import { LogoutUseCase } from "@/modules/auth/application/use-cases/LogoutUseCase";
import { dependencies } from "@/modules/auth/infrastructure/di/container";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const ua = req.headers.get("user-agent") ?? "unknown";
    
    if (refreshToken) {
      const logoutUseCase = new LogoutUseCase(
         dependencies.sessionRepository, 
         dependencies.cryptoService, 
         dependencies.jwtService,
         dependencies.auditRepository
      );
      await logoutUseCase.execute(refreshToken, { ip, ua });
    }
    
    await clearCookie("refreshToken");
    await clearCookie("accessToken");

    return NextResponse.json({ success: true, message: "Logged out" });
  } catch {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 400 });
  }
}
