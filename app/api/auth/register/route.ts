import { NextRequest, NextResponse } from "next/server";
import { registerUseCase } from "@/modules/auth/infrastructure/di/container";
import { z } from "zod";
import { checkRateLimit } from "@/lib/middleware/rate-limit.middleware";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limit = await checkRateLimit(ip, "register");
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many registrations." }),
        { status: 429, headers: { "Retry-After": limit.retryAfter?.toString() || "3600" } }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") ?? "unknown";
    const result = await registerUseCase.execute(parsed.data, { ip, ua });
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 });
  }
}
