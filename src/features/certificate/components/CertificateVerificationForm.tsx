"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle, ShieldCheck, UploadCloud, QrCode } from "lucide-react";

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
    <div className="bg-[#3A0016]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 border border-[#C8A046]/40 shadow-2xl space-y-8 w-full">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A046]/20 border border-[#C8A046]/40 text-[#C8A046] text-xs font-extrabold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Official Verification Panel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#F8F4EC]">
          Verify a Certificate
        </h2>
        <p className="text-sm text-[#F8F4EC]/70 leading-relaxed">
          Enter the certificate ID or verification code to check its current verification status.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="certificate-code-input"
            className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C8A046]"
          >
            Certificate ID or Verification Code
          </label>

          <div className="relative group">
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
              placeholder="e.g. RM-2026-ABCD"
              disabled={isLoading}
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ? "certificate-code-error" : undefined
              }
              className="w-full min-h-[56px] pl-5 pr-12 py-3 rounded-2xl bg-black/40 border border-[#C8A046]/30 focus:border-[#C8A046] text-[#F8F4EC] placeholder-white/30 text-base font-mono tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A046]/50 disabled:opacity-60 shadow-inner group-hover:border-[#C8A046]/60"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C8A046]/70 pointer-events-none">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          {validationError && (
            <p
              id="certificate-code-error"
              role="alert"
              className="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-1.5 pt-1"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{validationError}</span>
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full min-h-[56px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#C8A046] hover:bg-[#e0b85a] border border-[#C8A046] text-base font-extrabold text-[#3A0016] transition-all shadow-xl hover:shadow-[#C8A046]/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A046] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A0016]"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="w-5 h-5 animate-spin text-[#3A0016]"
                  aria-hidden="true"
                />
                <span>Verifying Database...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-[#3A0016]" aria-hidden="true" />
                <span>Verify Certificate</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Visual Dividers for Future Features */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#C8A046]/20"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#3A0016] px-4 text-xs font-bold text-[#F8F4EC]/50 uppercase tracking-widest">Or Verify Using</span>
        </div>
      </div>

      {/* Coming Soon Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          disabled
          type="button" 
          className="relative overflow-hidden group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-black/20 border border-dashed border-[#C8A046]/30 opacity-70 transition-all"
        >
          <div className="absolute top-2 right-2 bg-[#C8A046]/20 text-[#C8A046] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
            Coming Soon
          </div>
          <QrCode className="w-8 h-8 text-[#C8A046]/50" />
          <span className="text-sm font-bold text-[#F8F4EC]/60">Scan QR Code</span>
        </button>
        
        <button 
          disabled
          type="button" 
          className="relative overflow-hidden group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-black/20 border border-dashed border-[#C8A046]/30 opacity-70 transition-all"
        >
          <div className="absolute top-2 right-2 bg-[#C8A046]/20 text-[#C8A046] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
            Coming Soon
          </div>
          <UploadCloud className="w-8 h-8 text-[#C8A046]/50" />
          <span className="text-sm font-bold text-[#F8F4EC]/60">Upload PDF</span>
        </button>
      </div>

      {/* Loading state announcement */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-[#C8A046]/10 border border-[#C8A046]/30 text-center space-y-1 animate-pulse"
        >
          <p className="text-sm font-extrabold text-[#C8A046]">
            Establishing Secure Connection
          </p>
          <p className="text-xs text-[#F8F4EC]/70">
            Please wait while we validate the digital signature.
          </p>
        </div>
      )}
    </div>
  );
};
