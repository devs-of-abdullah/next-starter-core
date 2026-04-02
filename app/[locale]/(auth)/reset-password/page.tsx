"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setTokenMissing(true);
    } else {
      setToken(t);
    }
  }, [searchParams]);

  if (tokenMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>{t("invalidResetLink")}</CardTitle>
            <CardDescription>{t("invalidResetLinkDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/forget-password"
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {t("requestNewLink")}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? t("genericError"));
        return;
      }

      toast.success(t("passwordResetSuccess"));
      router.push("/login");
    } catch {
      toast.error(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 rtl:font-sans">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle>{t("resetTitle")}</CardTitle>
          <CardDescription>{t("newPasswordDesc")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("newPassword")}
              </label>
              <Input
                type="password"
                icon={<Lock />}
                dir={isRtl ? "rtl" : "ltr"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("confirmPassword")}
              </label>
              <Input
                type="password"
                icon={<Lock />}
                dir={isRtl ? "rtl" : "ltr"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-6 flex gap-2">
              <span>{t("resetPassword")}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="font-semibold text-zinc-900 dark:text-white hover:underline"
          >
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
