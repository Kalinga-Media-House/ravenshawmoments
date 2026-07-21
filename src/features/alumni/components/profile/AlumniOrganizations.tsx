import React from "react";
import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniOrganizationsProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniOrganizations: React.FC<AlumniOrganizationsProps> = ({
  alumnus,
}) => {
  const orgs = [
    ...(Array.isArray(alumnus.organizations) ? alumnus.organizations : []),
    ...(Array.isArray(alumnus.communities) ? alumnus.communities : []),
  ].filter((item, index, self) => self.indexOf(item) === index);

  if (orgs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-organizations-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-organizations-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Organizations and Communities
            </h2>
            <p className="text-xs text-white/70">
              Approved campus societies, clubs, and organizations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map((org, idx) => {
            const orgSlug = org
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

            return (
              <div
                key={idx}
                className="rm-glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4 hover:border-[var(--color-rm-gold)]/40 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
                    Member / Participant
                  </span>
                  <h3 className="text-base font-black text-white">{org}</h3>
                </div>

                <Link
                  href={`/organizations/${orgSlug}`}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[var(--color-rm-gold)] hover:border-[var(--color-rm-gold)]/50 transition-colors shrink-0"
                  aria-label={`View ${org} organization page`}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
