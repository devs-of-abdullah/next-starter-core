import { NextRequest, NextResponse } from "next/server";
import { loginUseCase } from "@/modules/auth/infrastructure/di/container";
import { setRefreshTokenCookie } from "@/lib/utils/cookies";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const ua = req.headers.get("user-agent") ?? "unknown";

    const result = await loginUseCase.execute({ email, password }, { ip, ua });

    await setRefreshTokenCookie({ name: "refreshToken", value: result.refreshToken });
    await setRefreshTokenCookie({ name: "accessToken", value: result.accessToken, maxAge: 15 * 60 });

    return NextResponse.json({ success: true, user: result.user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";

    // Server-side only — helps diagnose seeding/config issues during development
    if (isDev) {
      process.stdout.write(`[LOGIN FAILED] ${message}\n`);
    }

    // Always return a generic message to the client to prevent user enumeration
    return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
  }
}
