import React from "react";
import {
  Share2,
  Linkedin,
  Instagram,
  Facebook,
  Globe,
  ExternalLink,
} from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniSocialLinksProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniSocialLinks: React.FC<AlumniSocialLinksProps> = ({
  alumnus,
}) => {
  const links = alumnus.socialLinks;
  if (!links) {
    return null;
  }

  const validLinks = [
    links.linkedin
      ? {
          name: "LinkedIn",
          url: links.linkedin,
          icon: Linkedin,
        }
      : null,
    links.twitter
      ? {
          name: "X (Twitter)",
          url: links.twitter,
          icon: Globe,
        }
      : null,
    links.instagram
      ? {
          name: "Instagram",
          url: links.instagram,
          icon: Instagram,
        }
      : null,
    links.facebook
      ? {
          name: "Facebook",
          url: links.facebook,
          icon: Facebook,
        }
      : null,
    links.website
      ? {
          name: "Personal Website",
          url: links.website,
          icon: Globe,
        }
      : null,
  ].filter(Boolean);

  if (validLinks.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-social-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Share2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-social-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Connect
            </h2>
            <p className="text-xs text-white/70">
              Approved public social channels and professional links.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {validLinks.map((link, idx) => {
            const Icon = link?.icon || Globe;
            return (
              <a
                key={idx}
                href={link?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-bold hover:bg-[var(--color-rm-maroon)]/60 hover:border-[var(--color-rm-gold)]/50 transition-all shadow-sm"
              >
                <Icon className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
                <span>{link?.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/50" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
