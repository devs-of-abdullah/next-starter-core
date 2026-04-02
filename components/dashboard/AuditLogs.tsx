"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Shield, Clock, Globe, Info, User as UserIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Loader } from "@/components/feedback/Loader";
import { useTranslations } from "next-intl";

interface AuditLog {
  id: string;
  action: string;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  createdAt: string;
  user?: { email: string };
}

export function AuditLogs() {
  const t = useTranslations("common");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setLogs(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" text="Loading logs..." />;

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-zinc-500">
          <Shield className="w-12 h-12 mb-4 opacity-20" />
          <p>No audit logs found yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("auditLogs")}</CardTitle>
        <CardDescription>
          History of security and account activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 rounded-s-lg font-bold">Action</th>
                <th className="px-6 py-3 font-bold">IP & User Agent</th>
                <th className="px-6 py-3 font-bold">Details</th>
                <th className="px-6 py-3 rounded-e-lg font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          log.action.includes("FAILED")
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                            : log.action.includes("SUCCESS")
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                        }`}
                      >
                        {log.user ? (
                          <UserIcon size={14} />
                        ) : (
                          <Shield size={14} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {log.action}
                        </p>
                        {log.user && (
                          <p className="text-xs opacity-70">{log.user.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="opacity-50" />
                        <span>{log.ipAddress || "Unknown IP"}</span>
                      </div>
                      <p
                        className="text-[10px] truncate max-w-[150px] opacity-50"
                        title={log.userAgent || ""}
                      >
                        {log.userAgent || "Unknown User Agent"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 opacity-80">
                      <Info size={12} />
                      <span className="truncate max-w-[200px]">
                        {log.metadata ? JSON.stringify(log.metadata) : "No extra info"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="opacity-50" />
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
