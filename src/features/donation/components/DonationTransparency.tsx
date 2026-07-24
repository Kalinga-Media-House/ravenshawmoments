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
    description: "Contribution information is recorded only after secure payment verification.",
  },
  {
    icon: UserCheck,
    title: "Respect for Contributor Privacy",
    description: "Public recognition appears only with explicit contributor consent.",
  },
  {
    icon: EyeOff,
    title: "No Public Contact Information",
    description: "Email, phone number, and private details are never displayed publicly.",
  },
  {
    icon: ClipboardCheck,
    title: "Clear Contribution Status",
    description: "Each contribution is tracked with verified payment and confirmation status.",
  },
  {
    icon: HandHeart,
    title: "Public Recognition Only with Consent",
    description: "Contributors choose whether their name appears in the public directory.",
  },
  {
    icon: BarChart3,
    title: "Approved Financial Updates When Available",
    description: "Transparency reports will be published when verified financial information becomes available.",
  },
];

export const DonationTransparency: React.FC = () => {
  return (
    <section aria-labelledby="transparency-heading" className="py-20 lg:py-28 bg-[#3A0016] text-white">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-widest mb-4">Our Commitment</h2>
          <h3 id="transparency-heading" className="text-3xl md:text-5xl font-black font-serif mb-6">
            Built with Transparency
          </h3>
          <p className="text-lg text-white/70">
            Ravenshaw Moments aims to keep approved contribution information clear and accountable. Public contributor recognition, contribution summaries, and future financial updates will be displayed only when verified information and appropriate privacy permissions are available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h4 className="text-xl font-bold mb-3">{principle.title}</h4>
                <p className="text-white/60 leading-relaxed text-sm">
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
