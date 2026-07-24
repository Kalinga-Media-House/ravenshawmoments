import React from "react";
import { Archive, Trophy, Sparkles, Code2, University, Users } from "lucide-react";

export const DonationWhyContribute = () => {
  const features = [
    {
      icon: Archive,
      title: "Digital Archive",
      description: "Preserve decades of Ravenshaw history, photographs, and records in our permanent digital vault."
    },
    {
      icon: Trophy,
      title: "Competition Platform",
      description: "Support the infrastructure that runs university-wide hackathons and cultural competitions."
    },
    {
      icon: Sparkles,
      title: "Student Recognition",
      description: "Fund certificates, digital badges, and hall-of-fame features for outstanding students."
    },
    {
      icon: Code2,
      title: "Website Development",
      description: "Keep our servers running and enable new features on the Ravenshaw Moments platform."
    },
    {
      icon: University,
      title: "Campus Heritage",
      description: "Support initiatives to document and digitize the architectural heritage of the university."
    },
    {
      icon: Users,
      title: "Community Initiatives",
      description: "Help build alumni networks, mentorship programs, and global community connections."
    }
  ];

  return (
    <section id="why-donate" className="py-20 lg:py-28 bg-[#3A0016] text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-widest mb-4">Why Contribute</h2>
          <h3 className="text-3xl md:text-5xl font-black font-serif mb-6">Building Our Future Together</h3>
          <p className="text-lg text-white/70">
            Your contributions directly fund the preservation of our history and the development of our digital ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-white/60 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
