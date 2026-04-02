// Global Error boundary
"use client";

import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Send error to your error reporting service (e.g. Sentry)
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-zinc-500 mb-8">An unexpected layer error occurred.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium"
      >
        Try again
      </button>
    </div>
  );
}
