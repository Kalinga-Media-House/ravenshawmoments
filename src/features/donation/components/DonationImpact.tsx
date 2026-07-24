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
    description: "Hosting, domain, and global platform delivery for Ravenshaw Moments.",
  },
  {
    icon: Server,
    title: "Secure Hosting",
    description: "Maintains secure and reliable environments for user data.",
  },
  {
    icon: HardDrive,
    title: "Media Storage",
    description: "Scalable storage for photographs, documents, and rich media files.",
  },
  {
    icon: Archive,
    title: "Digital Archive Preservation",
    description: "Long-term organization and preservation of Ravenshaw's digital records.",
  },
  {
    icon: Users,
    title: "Community Features",
    description: "Alumni profiles, directories, memories, and shared experiences.",
  },
  {
    icon: Award,
    title: "Certificate Infrastructure",
    description: "Verified digital certificate generation and on-demand verification.",
  }
];

export const DonationImpact: React.FC = () => {
  return (
    <section id="impact" aria-labelledby="impact-heading" className="py-20 lg:py-28 bg-[#FFFDF8]">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-widest mb-4">The Impact</h2>
          <h3 id="impact-heading" className="text-3xl md:text-5xl font-black text-[#3A0016] font-serif mb-6">
            Where Contributions Go
          </h3>
          <p className="text-lg text-[#3A0016]/70">
            Contributions support the following approved platform areas to ensure Ravenshaw Moments remains free, fast, and accessible for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {impactAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="group relative bg-white p-8 rounded-3xl border border-[#3A0016]/10 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4AF37]/10 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3A0016] to-[#4A0D1A] flex items-center justify-center text-[#D4AF37] mb-6 shadow-lg group-hover:-translate-y-1 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-[#3A0016] mb-3">{area.title}</h4>
                  <p className="text-[#3A0016]/60 leading-relaxed text-sm">
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
