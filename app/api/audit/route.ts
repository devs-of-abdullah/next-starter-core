import { NextRequest, NextResponse } from "next/server";
import { dependencies } from "@/modules/auth/infrastructure/di/container";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function GET(req: NextRequest) {
  // Require a valid access token
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    if (!payload.userId || typeof payload.userId !== "string") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await dependencies.getAuditLogsUseCase.execute(userId);
    return NextResponse.json({ success: true, data: logs });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
