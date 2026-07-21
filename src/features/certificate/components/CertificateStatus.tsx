"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { VerificationStatusType } from "../types/certificate";

export interface CertificateStatusProps {
  status: VerificationStatusType;
  className?: string;
}

export const CertificateStatus: React.FC<CertificateStatusProps> = ({
  status,
  className = "",
}) => {
  switch (status) {
    case "Verified":
    case "Valid":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" aria-hidden="true" />
          <span>Certificate Verified</span>
        </span>
      );

    case "Revoked":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <XCircle className="w-4 h-4 shrink-0 text-rose-400" aria-hidden="true" />
          <span>Certificate Revoked</span>
        </span>
      );

    case "Expired":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <Clock className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />
          <span>Certificate Expired</span>
        </span>
      );

    case "Superseded":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <RefreshCw className="w-4 h-4 shrink-0 text-blue-400" aria-hidden="true" />
          <span>Certificate Superseded</span>
        </span>
      );

    case "Pending":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <Clock className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />
          <span>Verification Pending</span>
        </span>
      );

    case "NotFound":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />
          <span>Certificate Not Found</span>
        </span>
      );

    case "Prepared":
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/50 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Verification Service Prepared</span>
        </span>
      );

    default:
      return (
        <span
          role="status"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-black uppercase tracking-wider ${className}`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Status Unknown</span>
        </span>
      );
  }
};
