import { NextRequest, NextResponse } from "next/server";
import { resetPasswordUseCase } from "@/modules/auth/infrastructure/di/container";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input.", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const ua = req.headers.get("user-agent") ?? "unknown";

    await resetPasswordUseCase.execute(parsed.data.token, parsed.data.password, {
      ip,
      ua,
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been reset. You can now sign in.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reset failed";

    if (isDev) {
      process.stdout.write(`[RESET PASSWORD ERROR] ${message}\n`);
    }

    // Use the use-case error message verbatim only for token errors — it's generic by design
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
