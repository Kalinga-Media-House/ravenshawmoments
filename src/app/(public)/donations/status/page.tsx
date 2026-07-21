import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Heart,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Status | Ravenshaw Moments",
  description: "View the status of your contribution to Ravenshaw Moments.",
  robots: {
    index: false,
    follow: false,
  },
};

interface StatusPageProps {
  searchParams: Promise<{
    result?: string;
    ref?: string;
    amt?: string;
    v?: string;
    mode?: string;
  }>;
}

export default async function DonationStatusPage({
  searchParams,
}: StatusPageProps) {
  const params = await searchParams;
  const result = params.result || "unknown";
  const ref = params.ref || "";
  const amount = params.amt || "";
  const verification = params.v || "";

  return (
    <div className="min-h-screen bg-[var(--color-rm-background)] text-white">
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {result === "success" && (
            <SuccessState
              ref_id={ref}
              amount={amount}
              verification={verification}
            />
          )}
          {result === "failed" && <FailedState ref_id={ref} />}
          {result === "cancelled" && <CancelledState />}
          {result === "verification_pending" && (
            <PendingState ref_id={ref} />
          )}
          {result === "hash_error" && <HashErrorState />}
          {result === "error" && <ErrorState />}
          {![
            "success",
            "failed",
            "cancelled",
            "verification_pending",
            "hash_error",
            "error",
          ].includes(result) && <UnknownState />}
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// Status Components
// =============================================================================

function SuccessState({
  ref_id,
  amount,
  verification,
}: {
  ref_id: string;
  amount: string;
  verification: string;
}) {
  return (
    <div className="rm-glass-card rounded-3xl border border-green-500/30 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 border-2 border-green-500/40 text-green-400 mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Thank You for Supporting Ravenshaw Moments
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          Your contribution has been securely verified and recorded. Your
          support helps strengthen the digital home where Ravenshaw memories,
          stories, achievements, events, and journeys can remain connected.
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 space-y-3 text-left max-w-sm mx-auto">
        {ref_id && (
          <DetailRow label="Reference" value={ref_id} />
        )}
        {amount && (
          <DetailRow
            label="Amount"
            value={`\u20B9${parseFloat(amount).toLocaleString("en-IN")}`}
          />
        )}
        <DetailRow label="Currency" value="INR" />
        <DetailRow
          label="Status"
          value={
            verification === "api_verified"
              ? "Verified"
              : "Callback Verified"
          }
        />
        <DetailRow
          label="Date"
          value={new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
      </div>

      <p className="text-[10px] text-white/40">
        Receipt generation will be available after the approved receipt service
        is connected.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/donations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all"
        >
          <Heart className="w-3.5 h-3.5" aria-hidden="true" />
          Return to Donations
        </Link>
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
        >
          Explore Memories
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function FailedState({ ref_id }: { ref_id: string }) {
  return (
    <div className="rm-glass-card rounded-3xl border border-red-500/30 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/30 border-2 border-red-500/40 text-red-400 mx-auto">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Payment Could Not Be Completed
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          Your payment was not completed. No successful contribution has been
          confirmed.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/donations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all"
        >
          Try Again
        </Link>
        <Link
          href="/donations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
        >
          Return to Donations
        </Link>
      </div>
    </div>
  );
}

function CancelledState() {
  return (
    <div className="rm-glass-card rounded-3xl border border-amber-500/30 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-900/30 border-2 border-amber-500/40 text-amber-400 mx-auto">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Payment Was Cancelled
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          You cancelled the payment. No contribution has been recorded.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/donations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all"
        >
          Try Again
        </Link>
        <Link
          href="/donations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
        >
          Return to Donations
        </Link>
      </div>
    </div>
  );
}

function PendingState({ ref_id }: { ref_id: string }) {
  return (
    <div className="rm-glass-card rounded-3xl border border-blue-500/30 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-900/30 border-2 border-blue-500/40 text-blue-400 mx-auto">
        <Clock className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Payment Verification Pending
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          Your payment is being verified. This may take a few moments. Please
          do not make another payment attempt until verification is complete.
        </p>
        {ref_id && (
          <p className="text-xs text-white/50">Reference: {ref_id}</p>
        )}
      </div>

      <Link
        href="/donations"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
      >
        Return to Donations
      </Link>
    </div>
  );
}

function HashErrorState() {
  return (
    <div className="rm-glass-card rounded-3xl border border-red-500/30 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/30 border-2 border-red-500/40 text-red-400 mx-auto">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Payment Verification Failed
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          The payment response could not be securely verified. No successful
          contribution has been confirmed. If you believe this is an error,
          please contact support.
        </p>
      </div>

      <Link
        href="/donations"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all"
      >
        Return to Donations
      </Link>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rm-glass-card rounded-3xl border border-red-500/30 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/30 border-2 border-red-500/40 text-red-400 mx-auto">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Payment Status Unavailable
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          We could not determine the status of your payment. Please do not
          make another payment attempt until you have verified your bank
          statement or contacted support.
        </p>
      </div>

      <Link
        href="/donations"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
      >
        Return to Donations
      </Link>
    </div>
  );
}

function UnknownState() {
  return (
    <div className="rm-glass-card rounded-3xl border border-white/10 p-8 sm:p-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 text-white/40 mx-auto">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Payment Status Unavailable
        </h1>
        <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
          No payment status information is available for this request.
        </p>
      </div>

      <Link
        href="/donations"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
      >
        Return to Donations
      </Link>
    </div>
  );
}

// =============================================================================
// Detail Row
// =============================================================================

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="text-xs text-white font-medium text-right break-all">
        {value}
      </span>
    </div>
  );
}
