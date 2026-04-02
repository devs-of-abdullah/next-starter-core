"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 429) {
        toast.error(t("tooManyRequests"));
        return;
      }

      // Always show the same message regardless of whether the email exists
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(t("genericError"));
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-7 h-7" />
            </div>
            <CardTitle>{t("checkYourEmail")}</CardTitle>
            <CardDescription>{t("resetEmailSent")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {t("backToLogin")}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 rtl:font-sans">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("forgotPasswordTitle")}</CardTitle>
          <CardDescription>{t("resetSubtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-start">
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
                placeholder="you@example.com"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-6">
              {t("sendResetLink")}
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
