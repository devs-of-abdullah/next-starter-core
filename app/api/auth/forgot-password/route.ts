import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordUseCase } from "@/modules/auth/infrastructure/di/container";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

const isDev = process.env.NODE_ENV === "development";

// Generic success message — never reveal whether the email exists
const GENERIC_RESPONSE = {
  success: true,
  message: "If that email is registered, you will receive a reset link shortly.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    await forgotPasswordUseCase.execute(parsed.data.email);

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error: unknown) {
    if (isDev) {
      process.stdout.write(
        `[FORGOT PASSWORD ERROR] ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
    // Always return the generic response — never leak internal errors
    return NextResponse.json(GENERIC_RESPONSE);
  }
}
