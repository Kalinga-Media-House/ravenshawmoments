import React from "react";
import { User, Phone, Briefcase, Mail } from "lucide-react";

export const AboutManager: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFDF8]">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-widest mb-4">Leadership</h2>
          <h3 className="text-3xl md:text-5xl font-black font-serif text-[#3A0016]">
            Managed By
          </h3>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#3A0016] to-[#5C0528] rounded-[2.5rem] shadow-2xl overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4AF37]/20 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-2">
                <User className="w-10 h-10" aria-hidden="true" />
              </div>
              
              <div>
                <h4 className="text-3xl font-black text-white mb-2">BANAMALI KANHAR</h4>
                <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#D4AF37] text-sm font-bold uppercase tracking-wider backdrop-blur-sm border border-[#D4AF37]/20">
                  <Briefcase className="w-4 h-4" />
                  Project Lead & Platform Administrator
                </p>
              </div>

              <div className="w-16 h-px bg-white/20 my-4" />

              <div className="flex flex-col gap-4 w-full">
                <a 
                  href="tel:+918260672009" 
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 transition-all text-white font-medium group/btn"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover/btn:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-lg tracking-wide">+91 8260672009</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
