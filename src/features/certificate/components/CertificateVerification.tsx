"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { verifyCertificateAction } from "../actions/verifyCertificate";
import { VerificationLookupResult } from "../types/certificate";
import { CertificateVerificationForm } from "./CertificateVerificationForm";
import { CertificateVerificationResult } from "./CertificateVerificationResult";
import { CertificateVerificationNotice } from "./CertificateVerificationNotice";

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
    <div className="space-y-10">
      {/* Verification Form */}
      <CertificateVerificationForm
        initialCode={initialParam}
        onVerify={handleVerify}
        isLoading={isLoading}
      />

      {/* Verification Result */}
      <div aria-live="polite">
        <CertificateVerificationResult
          result={result}
          onTryAgain={handleTryAgain}
        />
      </div>

      {/* Verification & Privacy Notices */}
      <CertificateVerificationNotice />
    </div>
  );
};
