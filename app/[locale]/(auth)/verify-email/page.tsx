"use client";

import { toast } from "sonner";
import { MailCheck, CheckCircle, XCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>(
    token && userId ? "verifying" : "idle",
  );
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  // Auto-verify when token + userId are present in URL
  useEffect(() => {
    if (!token || !userId) return;

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        setVerifyStatus(data.success ? "success" : "error");
      })
      .catch(() => setVerifyStatus("error"));
  }, [token, userId]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    try {
      await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      // Always show success to prevent email enumeration
      toast.success("If that email exists, a new verification link has been sent.");
      setResendEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Verification result view
  if (verifyStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <MailCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">Verifying your email…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Email verified!</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Your account is now active. You can sign in.</p>
            <Link href="/login">
              <Button className="w-full mt-4">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Verification failed</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              This link is invalid or has expired. Request a new one below.
            </p>
            <form onSubmit={handleResend} className="space-y-3 pt-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                disabled={resendLoading}
              />
              <Button type="submit" loading={resendLoading} className="w-full">
                Resend verification email
              </Button>
            </form>
            <Link href="/login" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default: "check your email" view (after registration, no token in URL)
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 rtl:font-sans">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mb-6">
            <MailCheck className="w-8 h-8" />
          </div>
          <CardTitle className="mb-2">{t("verifyEmailTitle")}</CardTitle>
          <CardDescription className="mb-8">{t("verifyEmailSubtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleResend} className="space-y-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              disabled={resendLoading}
            />
            <Button type="submit" loading={resendLoading} variant="outline" className="w-full">
              {t("resendVerification")}
            </Button>
          </form>

          <Link
            href="/login"
            className="block text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            {t("backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
