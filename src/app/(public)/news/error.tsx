"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("News directory error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-24 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-red-900/20 text-red-400 rounded-2xl mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
        <AlertCircle className="w-12 h-12" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-3xl md:text-4xl font-extrabold rm-heading-primary mb-4 text-red-50">
        Something went wrong
      </h2>
      
      <p className="text-[1.05rem] rm-text-body max-w-lg mb-10 font-medium">
        We encountered an error while trying to load the news directory. Please try again.
      </p>
      
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
      >
        <RotateCcw className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
}
