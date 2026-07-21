import React from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck2 } from "lucide-react";
import { ProfileCertificate } from "@/types/profile";

interface AlumniCertificatesProps {
  certificates?: ProfileCertificate[];
}

export const AlumniCertificates: React.FC<AlumniCertificatesProps> = ({
  certificates,
}) => {
  const items = Array.isArray(certificates)
    ? certificates.filter((c) => !c.is_revoked)
    : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-certificates-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <FileCheck2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-certificates-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Certificates and Recognition
            </h2>
            <p className="text-xs text-white/70">
              Verified digital certificates issued through Ravenshaw Moments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((cert) => (
            <div
              key={cert.id}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4 hover:border-[var(--color-rm-gold)]/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Verified Official Certificate</span>
                </div>
                <h3 className="text-base font-black text-white">{cert.title}</h3>
                {cert.issued_on && (
                  <p className="text-xs text-white/60">
                    Issued: {cert.issued_on.slice(0, 10)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[11px] font-mono text-white/50 truncate max-w-[200px]">
                  ID: {cert.certificate_number || cert.id}
                </span>

                <Link
                  href={`/certificates?id=${encodeURIComponent(cert.certificate_number || cert.id)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-gold)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-colors"
                >
                  <span>Verify Certificate</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
