"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Mail, Lock, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
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

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register");
      toast.success(
        data.message || "Registration successful! Check your email.",
      );
      router.push("/verify-email");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 rtl:font-sans">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle>{t("registerTitle")}</CardTitle>
          <CardDescription>{t("registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("email")}
              </label>
              <Input
                type="email"
                icon={<Mail />}
                dir={isRtl ? "rtl" : "ltr"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t("password")}
              </label>
              <Input
                type="password"
                icon={<Lock />}
                dir={isRtl ? "rtl" : "ltr"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
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
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full mt-6 flex gap-2"
            >
              <span>{t("signUp")}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            {t("haveAccount")}{" "}
            <Link
              href="/login"
              className="font-semibold text-zinc-900 dark:text-white hover:underline rtl:mr-1"
            >
              {t("signIn")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
