import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyEmailUseCase, resendVerificationUseCase } from "@/modules/auth/infrastructure/di/container";

const isDev = process.env.NODE_ENV === "development";

// GET /api/auth/verify-email?token=X&userId=Y
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  if (!token || !userId) {
    return NextResponse.json({ error: "Missing token or userId" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const ua = req.headers.get("user-agent") ?? "unknown";

  try {
    await verifyEmailUseCase.execute(token, userId, { ip, ua });
    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch (error: unknown) {
    if (isDev) {
      process.stdout.write(`[VERIFY EMAIL FAILED] ${error instanceof Error ? error.message : error}\n`);
    }
    return NextResponse.json({ success: false, error: "Invalid or expired verification token." }, { status: 400 });
  }
}

const resendSchema = z.object({
  email: z.string().email(),
});

// POST /api/auth/verify-email  { email }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = resendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const ua = req.headers.get("user-agent") ?? "unknown";

  try {
    await resendVerificationUseCase.execute(parsed.data.email, { ip, ua });
  } catch (error: unknown) {
    if (isDev) {
      process.stdout.write(`[RESEND VERIFY FAILED] ${error instanceof Error ? error.message : error}\n`);
    }
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ success: true, message: "If that email exists, a new verification link has been sent." });
}
