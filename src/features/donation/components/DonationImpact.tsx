import React from "react";
import {
  Globe,
  Server,
  HardDrive,
  Archive,
  Accessibility,
  Wrench,
  Users,
  CalendarDays,
  Award,
  Clock,
} from "lucide-react";

const impactAreas = [
  {
    icon: Globe,
    title: "Website Infrastructure",
    description:
      "May support hosting, domain, and platform delivery for Ravenshaw Moments.",
  },
  {
    icon: Server,
    title: "Secure Hosting",
    description:
      "Can help maintain secure and reliable server environments.",
  },
  {
    icon: HardDrive,
    title: "Media Storage",
    description:
      "Contributes toward storage for photographs, documents, and media files.",
  },
  {
    icon: Archive,
    title: "Digital Archive Preservation",
    description:
      "May support the long-term organization and preservation of Ravenshaw's digital records.",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    description:
      "Can help improve access for all users across devices and abilities.",
  },
  {
    icon: Wrench,
    title: "Platform Maintenance",
    description:
      "Contributes toward regular updates, security patches, and system reliability.",
  },
  {
    icon: Users,
    title: "Community Features",
    description:
      "May support alumni profiles, directories, memories, and shared experiences.",
  },
  {
    icon: CalendarDays,
    title: "Events and Competitions",
    description:
      "Can help support approved campus events, competitions, and participation features.",
  },
  {
    icon: Award,
    title: "Certificate Infrastructure",
    description:
      "Contributes toward verified digital certificate generation and verification.",
  },
  {
    icon: Clock,
    title: "Long-Term Preservation",
    description:
      "May support the continued availability of Ravenshaw Moments for future generations.",
  },
];

export const DonationImpact: React.FC = () => {
  return (
    <section
      id="impact"
      aria-labelledby="impact-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2
            id="impact-heading"
            className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight"
          >
            How Contributions May Help
          </h2>
          <p className="text-sm text-[#756A6E] max-w-2xl mx-auto">
            Contributions may support the following approved platform areas.
            Allocation depends on platform needs and is not guaranteed to any
            single area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {impactAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="bg-white shadow-sm rounded-2xl p-5 border border-[#8F0028]/10 flex items-start gap-4 hover:border-[#E8B83F]/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#8F0028]/10 border border-[#E8B83F]/30 flex items-center justify-center text-[#8F0028] shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#171214]">
                    {area.title}
                  </h3>
                  <p className="text-xs text-[#756A6E] leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
