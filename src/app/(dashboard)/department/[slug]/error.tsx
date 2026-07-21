"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function DepartmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Department CMS Error:", error);
  }, [error]);

  const isPermissionError =
    error.message.includes("Forbidden") || error.message.includes("permission");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#F5E6EA]">
            {isPermissionError ? "Access Denied" : "Something went wrong"}
          </h2>
          <p className="text-sm text-[#8B7078]">
            {isPermissionError
              ? "You do not have permission to access this page. Contact your department administrator."
              : error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7C2D3E] to-[#9B3A4D] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2D1F23] bg-[#1A1214] px-6 py-2.5 text-sm font-medium text-[#8B7078] transition-colors hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
