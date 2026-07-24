"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { QrCode, FileText, CheckCircle2 } from "lucide-react";
import { verifyCertificateAction } from "../actions/verifyCertificate";
import { VerificationLookupResult } from "../types/certificate";
import { CertificateVerificationForm } from "./CertificateVerificationForm";
import { CertificateVerificationResult } from "./CertificateVerificationResult";

export interface CertificateVerificationProps {
  initialCodeFromRoute?: string;
}

export const CertificateVerification: React.FC<
  CertificateVerificationProps
> = ({ initialCodeFromRoute = "" }) => {
  const searchParams = useSearchParams();
  const initialParam =
    initialCodeFromRoute ||
    searchParams?.get("id") ||
    searchParams?.get("code") ||
    "";

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationLookupResult | null>(null);

  const handleVerify = useCallback(async (rawCode: string) => {
    const trimmed = rawCode.trim();
    if (!trimmed) {
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const res = await verifyCertificateAction(trimmed);
      setResult(res);
    } catch {
      setResult({
        status: "Error",
        message:
          "We could not complete the verification request. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialParam && !result && !isLoading) {
      handleVerify(initialParam);
    }
  }, [initialParam, result, isLoading, handleVerify]);

  const handleTryAgain = () => {
    setResult(null);
  };

  return (
    <div className="w-full">
      {/* Dynamic Render based on result */}
      {result ? (
        <div aria-live="polite" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CertificateVerificationResult
            result={result}
            onTryAgain={handleTryAgain}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* LEFT: The Form */}
          <div className="w-full">
            <CertificateVerificationForm
              initialCode={initialParam}
              onVerify={handleVerify}
              isLoading={isLoading}
            />
          </div>

          {/* RIGHT: Visual Sample Certificate Preview */}
          <div className="hidden lg:flex flex-col items-center justify-center p-8 rounded-3xl bg-black/5 border border-[#C8A046]/20 relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3A0016]/10 to-transparent" />
            
            <div className="relative z-10 w-full max-w-sm aspect-[1/1.414] bg-white rounded-lg shadow-2xl p-6 flex flex-col border border-neutral-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Sample Certificate Content */}
              <div className="w-full border-2 border-double border-[#C8A046] h-full p-4 flex flex-col relative">
                
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                     <Image src="/logo.webp" width={64} height={64} alt="Ravenshaw Moments Official Logo" className="object-contain drop-shadow-sm" />
                  </div>
                  <h3 className="font-serif text-[#3A0016] text-lg font-bold uppercase tracking-widest">Ravenshaw Moments</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Official Certificate</p>
                </div>

                {/* Body placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-1/2 h-1 bg-neutral-200 rounded-full" />
                  <div className="w-3/4 h-2 bg-neutral-200 rounded-full" />
                  <div className="w-5/6 h-2 bg-neutral-200 rounded-full" />
                  <div className="w-2/3 h-2 bg-neutral-200 rounded-full" />
                </div>

                {/* Footer with QR and Seal */}
                <div className="mt-auto flex justify-between items-end">
                  <div className="w-16 h-16 border border-neutral-300 p-1 flex items-center justify-center text-neutral-300">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#3A0016] flex items-center justify-center relative shadow-sm">
                    <div className="absolute inset-1 border border-dashed border-[#C8A046] rounded-full" />
                  </div>
                </div>

                {/* Verified Overlay Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full shadow-lg transform -rotate-12">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">Verifiable</span>
                </div>
              </div>
            </div>
            
            <p className="relative z-10 text-center text-sm font-bold text-[#5A1024]/60 mt-8 uppercase tracking-widest">
              Digital Certificate Preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
