import { AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
        404 - Not Found
      </h1>
      <p className="text-zinc-500 text-center mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg font-medium transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
