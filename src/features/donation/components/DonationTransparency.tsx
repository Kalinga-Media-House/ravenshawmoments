import React from "react";
import {
  ShieldCheck,
  UserCheck,
  EyeOff,
  ClipboardCheck,
  HandHeart,
  BarChart3,
} from "lucide-react";

const principles = [
  {
    icon: ShieldCheck,
    title: "Verified Contribution Records",
    description:
      "Contribution information is recorded only after secure payment verification.",
  },
  {
    icon: UserCheck,
    title: "Respect for Contributor Privacy",
    description:
      "Public recognition appears only with explicit contributor consent.",
  },
  {
    icon: EyeOff,
    title: "No Public Contact Information",
    description:
      "Email, phone number, and private details are never displayed publicly.",
  },
  {
    icon: ClipboardCheck,
    title: "Clear Contribution Status",
    description:
      "Each contribution is tracked with verified payment and confirmation status.",
  },
  {
    icon: HandHeart,
    title: "Public Recognition Only with Consent",
    description:
      "Contributors choose whether their name appears in the public directory.",
  },
  {
    icon: BarChart3,
    title: "Approved Financial Updates When Available",
    description:
      "Transparency reports will be published when verified financial information becomes available.",
  },
];

export const DonationTransparency: React.FC = () => {
  return (
    <section
      aria-labelledby="transparency-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2
            id="transparency-heading"
            className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight"
          >
            Built with Transparency
          </h2>
          <p className="text-sm text-[#756A6E] leading-relaxed">
            Ravenshaw Moments aims to keep approved contribution information
            clear and accountable. Public contributor recognition, contribution
            summaries, and future financial updates will be displayed only when
            verified information and appropriate privacy permissions are
            available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="bg-white shadow-sm rounded-2xl p-5 border border-[#8F0028]/10 space-y-2.5 hover:border-[#E8B83F]/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#8F0028]/10 border border-[#E8B83F]/30 flex items-center justify-center text-[#8F0028]">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-black text-[#171214]">
                  {principle.title}
                </h3>
                <p className="text-xs text-[#756A6E] leading-relaxed">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
