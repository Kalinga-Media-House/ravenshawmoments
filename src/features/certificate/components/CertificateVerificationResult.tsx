"use client";

import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Download,
  ShieldAlert,
  CheckCircle2,
  FileBadge
} from "lucide-react";
import {
  VerificationLookupResult,
} from "../types/certificate";
import { CertificateStatus } from "./CertificateStatus";

export interface CertificateVerificationResultProps {
  result: VerificationLookupResult | null;
  onTryAgain: () => void;
}

export const CertificateVerificationResult: React.FC<
  CertificateVerificationResultProps
> = ({ result, onTryAgain }) => {
  if (!result) {
    return null;
  }

  // FAILURE: Certificate Not Found
  if (result.status === "NotFound") {
    return (
      <div
        role="region"
        aria-label="Certificate Not Found"
        className="bg-white rounded-3xl p-8 border border-neutral-200 text-center w-full max-w-3xl mx-auto space-y-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-700" />
        
        <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mx-auto text-red-500 shadow-sm">
          <AlertTriangle className="w-10 h-10" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#3A0016]">
            Verification Failed
          </h2>
          <p className="text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
            {result.message ||
              "We could not find a publicly verifiable certificate matching the information entered. Please check the ID and try again."}
          </p>
        </div>

        {/* Clear Recovery Guidance */}
        <div className="bg-neutral-50 rounded-xl p-5 text-left border border-neutral-100 max-w-lg mx-auto mb-6">
          <h3 className="font-bold text-neutral-800 mb-2 text-sm uppercase tracking-wider">Troubleshooting</h3>
          <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
            <li>Ensure you entered the exact 12-16 character code.</li>
            <li>Make sure there are no accidental spaces.</li>
            <li>If the certificate was recently issued, it may take 24 hours to index.</li>
          </ul>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="min-h-[50px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#3A0016] hover:bg-[#5A1024] text-sm font-extrabold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A046] shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Verify Another Certificate</span>
          </button>
        </div>
      </div>
    );
  }

  // FAILURE: Verification Service Error
  if (result.status === "Error") {
    return (
      <div
        role="alert"
        aria-label="Verification Service Unavailable"
        className="bg-white rounded-3xl p-8 border border-neutral-200 text-center w-full max-w-3xl mx-auto space-y-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
        
        <div className="w-20 h-20 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center mx-auto text-orange-500 shadow-sm">
          <ShieldAlert className="w-10 h-10" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#3A0016]">
            Service Unavailable
          </h2>
          <p className="text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
            {result.message ||
              "The verification server is temporarily unreachable. Please try again in a few moments."}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="min-h-[50px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#3A0016] hover:bg-[#5A1024] text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A046] shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS: Verified / Valid / Revoked / Expired
  const cert = result.certificate;

  if (!cert) {
    return null;
  }

  const isRevoked = result.status === "Revoked" || cert.isRevoked === true;

  return (
    <article
      role="region"
      aria-label="Certificate Verification Record"
      className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl relative w-full"
    >
      {/* Decorative Header Bar */}
      <div className={`h-4 w-full ${isRevoked ? 'bg-red-600' : 'bg-[#C8A046]'}`} />

      <div className="p-8 sm:p-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Details (Left) */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              {!isRevoked ? (
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Verified Record</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Revoked</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-[#3A0016] leading-tight mb-2">
                {cert.title}
              </h2>
              {cert.certificateType && (
                <p className="text-sm font-bold text-[#C8A046] uppercase tracking-widest">
                  {cert.certificateType}
                </p>
              )}
            </div>

            {isRevoked && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="font-bold text-red-800 text-sm mb-1 uppercase">Revocation Notice</p>
                <p className="text-red-700 text-sm">
                  {cert.revocationNote || "This certificate is no longer considered valid by the issuing authority."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
              {cert.recipientName && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Certificate Holder
                  </dt>
                  <dd className="text-lg font-black text-[#3A0016]">
                    {cert.recipientName}
                  </dd>
                </div>
              )}

              {cert.issueDate && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Issue Date
                  </dt>
                  <dd className="text-base font-bold text-neutral-800">
                    {new Date(cert.issueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}

              {cert.issuingOrganization && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Issued By
                  </dt>
                  <dd className="text-sm font-bold text-neutral-800">
                    {cert.issuingOrganization}
                  </dd>
                </div>
              )}

              {cert.department && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Department
                  </dt>
                  <dd className="text-sm font-bold text-neutral-800">
                    {cert.department}
                  </dd>
                </div>
              )}

              {cert.award && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Award Distinction
                  </dt>
                  <dd className="text-sm font-bold text-neutral-800">
                    {cert.award}
                  </dd>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
               <button
                  type="button"
                  onClick={onTryAgain}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm font-bold text-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A046]"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>Verify Another</span>
                </button>

                {cert.downloadUrl && (
                  <a
                    href={cert.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-[#3A0016] hover:bg-[#5A1024] text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A046] shadow-md"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download PDF</span>
                  </a>
                )}
            </div>

          </div>

          {/* Validation Meta (Right Card) */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-[#3A0016] rounded-2xl p-6 text-white shadow-xl h-full flex flex-col border border-[#C8A046]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileBadge className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <h3 className="font-serif text-[#C8A046] text-lg font-bold mb-6 border-b border-[#C8A046]/20 pb-4">
                  Verification Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">
                      Certificate ID
                    </span>
                    <code className="text-sm font-mono font-extrabold text-white break-all bg-black/30 px-2 py-1 rounded">
                      {cert.certificateId}
                    </code>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">
                      Verification Status
                    </span>
                    <CertificateStatus status={result.status} />
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">
                      Timestamp
                    </span>
                    <div className="text-xs text-white/80 font-mono">
                      {new Date(cert.verificationTimestamp || Date.now()).toLocaleString("en-IN")}
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-[#C8A046]/20">
                    <p className="text-xs text-white/50 leading-relaxed">
                      This record has been cryptographically validated against the official Ravenshaw Moments issuing authority database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};
