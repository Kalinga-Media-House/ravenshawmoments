import React from "react";
import { Camera, Database, Users, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: Camera,
    title: "Preserve Memories",
    description:
      "Help protect photographs, stories, events, and shared experiences for future generations.",
  },
  {
    icon: Database,
    title: "Strengthen the Archive",
    description:
      "Support reliable infrastructure for organizing and preserving Ravenshaw's growing digital history.",
  },
  {
    icon: Users,
    title: "Connect Generations",
    description:
      "Help students, alumni, departments, hostels, and organizations remain connected through their shared journeys.",
  },
  {
    icon: Sparkles,
    title: "Support Community Experiences",
    description:
      "Contributions may support approved community features, events, competitions, certificates, and preservation initiatives.",
  },
];

export const DonationWhyContribute: React.FC = () => {
  return (
    <section
      aria-labelledby="why-contribute-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#8F0028]">
            Why It Matters
          </p>
          <h2
            id="why-contribute-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#171214] tracking-tight"
          >
            A Home for Memories That Deserve to Remain
          </h2>
          <p className="text-sm sm:text-base text-[#756A6E] leading-relaxed">
            Ravenshaw Moments is being created to preserve the experiences that
            often disappear with time. Photographs, friendships, hostel life,
            department stories, achievements, celebrations, events, and personal
            journeys can remain connected in one meaningful digital space.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="bg-white shadow-sm rounded-2xl p-6 border border-[#8F0028]/10 space-y-3 hover:border-[#E8B83F]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8F0028]/10 border border-[#E8B83F]/30 flex items-center justify-center text-[#8F0028]">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#171214]">
                  {reason.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#756A6E] leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
