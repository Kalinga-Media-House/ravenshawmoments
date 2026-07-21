import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { CertificateVerification } from "@/features/certificate";

export const metadata: Metadata = {
  title: "Certificate Verification | Ravenshaw Moments",
  description:
    "Verify approved certificates issued through Ravenshaw Moments using a valid certificate ID or verification code.",
  openGraph: {
    title: "Certificate Verification | Ravenshaw Moments",
    description:
      "Verify approved certificates issued through Ravenshaw Moments using a valid certificate ID or verification code.",
    url: "https://ravenshawmoments.com/certificates",
    siteName: "Ravenshaw Moments",
    type: "website",
  },
};

export default function CertificatesPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Section 3: Compact Premium Page Hero */}
      <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none -z-10" 
          style={{ background: "linear-gradient(135deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.38))" }} 
        />

        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-xs font-bold text-white/60 tracking-wider uppercase"
          >
            <Link
              href="/"
              className="hover:text-[var(--color-rm-gold)] transition-colors"
            >
              Home
            </Link>
            <span className="text-white/30" aria-hidden="true">
              /
            </span>
            <span className="text-[var(--color-rm-gold)]">
              Certificate Verification
            </span>
          </nav>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-rm-maroon)]/80 border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>VERIFY WITH CONFIDENCE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Certificate Verification
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Verify the authenticity and public details of certificates issued
            through Ravenshaw Moments using a valid certificate ID or verification
            code.
          </p>

          {/* Supporting Text */}
          <p className="text-xs sm:text-sm font-bold text-[var(--color-rm-gold)]/90 tracking-wide">
            Enter the certificate information exactly as displayed on the issued certificate.
          </p>
        </div>
      </section>

      {/* Main Verification Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Suspense
          fallback={
            <div className="rm-glass-card rounded-3xl p-10 border border-white/10 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--color-rm-gold)] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-bold text-white/70">
                Loading Verification Service...
              </p>
            </div>
          }
        >
          <CertificateVerification />
        </Suspense>
      </main>
    </div>
  );
}
