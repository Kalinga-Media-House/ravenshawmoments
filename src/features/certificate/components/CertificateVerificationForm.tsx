"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export interface CertificateVerificationFormProps {
  initialCode?: string;
  onVerify: (code: string) => Promise<void>;
  isLoading: boolean;
}

export const CertificateVerificationForm: React.FC<
  CertificateVerificationFormProps
> = ({ initialCode = "", onVerify, isLoading }) => {
  const [code, setCode] = useState(initialCode);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();

    if (!trimmed) {
      setValidationError("Enter a certificate ID or verification code.");
      return;
    }

    setValidationError(null);
    await onVerify(trimmed);
  };

  return (
    <div className="rm-glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--color-rm-gold)]/30 bg-black/60 shadow-2xl space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-rm-maroon)]/80 border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-extrabold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Official Verification Panel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Verify a Certificate
        </h2>
        <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed">
          Enter the certificate ID or verification code to check its current verification status.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="certificate-code-input"
            className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90"
          >
            Certificate ID or Verification Code
          </label>

          <div className="relative">
            <input
              id="certificate-code-input"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (validationError) {
                  setValidationError(null);
                }
              }}
              placeholder="Enter certificate ID or verification code"
              disabled={isLoading}
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ? "certificate-code-error" : undefined
              }
              className="w-full min-h-[52px] pl-4 pr-12 py-3 rounded-2xl bg-black/80 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-sm sm:text-base font-mono tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]/50 disabled:opacity-60"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          {validationError && (
            <p
              id="certificate-code-error"
              role="alert"
              className="text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-1.5 pt-1"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" aria-hidden="true" />
              <span>{validationError}</span>
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-sm sm:text-base font-extrabold text-white transition-all shadow-xl hover:shadow-[var(--color-rm-gold)]/10 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="w-5 h-5 animate-spin text-[var(--color-rm-gold)]"
                  aria-hidden="true"
                />
                <span>Verifying Certificate...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
                <span>Verify Certificate</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Section 7: Loading state announcement */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 animate-pulse"
        >
          <p className="text-sm font-extrabold text-white">
            Verifying Certificate
          </p>
          <p className="text-xs text-white/70">
            Please wait while we check the certificate information.
          </p>
        </div>
      )}
    </div>
  );
};
