import React from "react";
import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniHostelProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniHostel: React.FC<AlumniHostelProps> = ({ alumnus }) => {
  if (!alumnus.hostelName) {
    return null;
  }

  const hostelSlug =
    alumnus.hostelSlug ||
    alumnus.hostelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return (
    <section aria-labelledby="alumni-hostel-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rm-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--color-rm-gold)]">
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>My Hostel</span>
          </div>
          <h2
            id="alumni-hostel-heading"
            className="text-xl sm:text-2xl font-black text-white"
          >
            {alumnus.hostelName}
          </h2>
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            Shared life and lifelong memories forged at {alumnus.hostelName}. A
            cornerstone of residential campus culture and brotherhood at
            Ravenshaw University.
          </p>
        </div>

        {hostelSlug && (
          <Link
            href={`/hostels/${hostelSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black/40 border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-black/60 transition-all shrink-0"
          >
            <span>Explore Hostel</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
};
