import { getTranslations } from "next-intl/server";
import {
  User as UserIcon,
  Mail,
  ShieldAlert,
  Award,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ProfilePage() {
  const t = await getTranslations("common");

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">
          {t("profile")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Manage your identity and account security status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-2 overflow-hidden border-2 border-zinc-100 dark:border-zinc-800/50">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute -bottom-12 inset-inline-start-8">
              <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-4xl text-zinc-400 border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden group">
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-transform group-hover:scale-110">
                  <UserIcon className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
                </div>
              </div>
            </div>
          </div>

          <CardContent className="pt-16 pb-8 px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Abdullah Ahmad
                </h3>
                <p className="text-zinc-500 font-medium">Administrator</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-6 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Email Address
                </label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  admin@example.com
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Account Role
                </label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  Enterprise Administrator
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Member Since
                </label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  March 31, 2026
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Status
                </label>
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <Award className="w-4 h-4" />
                  Fully Verified
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 text-white border-none shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                Security Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <span className="text-sm text-zinc-300">2FA Status</span>
                <span className="text-sm font-bold text-emerald-400">
                  Enabled
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <span className="text-sm text-zinc-300">Last Login</span>
                <span className="text-sm font-bold">2 mins ago</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <span className="text-sm text-zinc-300">Sessions</span>
                <span className="text-sm font-bold">3 Active</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20">
            <h4 className="text-blue-900 dark:text-blue-100 font-bold mb-2">
              Need to rotate secrets?
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              Your session key was last rotated 2 hours ago. Keep your account
              secure.
            </p>
            <Button
              variant="default"
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none"
            >
              Force Rotate Sessions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
