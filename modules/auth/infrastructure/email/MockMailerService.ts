import { IMailerService } from "@/modules/auth/domain/interfaces/IServices";

const isDev = process.env.NODE_ENV === "development";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export class MockMailerService implements IMailerService {
  async sendVerificationEmail(to: string, token: string, userId: string): Promise<void> {
    if (isDev) {
      const url = `${appUrl}/en/verify-email?token=${token}&userId=${userId}`;
      process.stdout.write(`[MOCK EMAIL] Verification email to: ${to}\n`);
      process.stdout.write(`[MOCK EMAIL] Verify link: ${url}\n`);
    }
    // Production: replace with Resend, SendGrid, AWS SES, etc.
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    if (isDev) {
      const url = `${appUrl}/en/reset-password?token=${token}`;
      process.stdout.write(`[MOCK EMAIL] Password reset email to: ${to}\n`);
      process.stdout.write(`[MOCK EMAIL] Reset link: ${url}\n`);
    }
    // Production: replace with Resend, SendGrid, AWS SES, etc.
  }
}

