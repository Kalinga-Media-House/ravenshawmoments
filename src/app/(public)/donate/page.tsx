import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Zap } from "lucide-react";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Support Us | Ravenshaw Moments",
  description: "Contribute to the continuous development of Ravenshaw Moments.",
};

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      <InnerPageHero
        title="Support Our Vision"
        description="Ravenshaw Moments is maintained by passionate alumni and students. Your support helps us keep the servers running, expand features, and preserve our university's digital legacy."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Support Us" }
        ]}
        backgroundImage={innerPageHeroImages.donations}
      />

       <div className="container mx-auto py-16 px-4 max-w-5xl text-center">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
           {/* Campaigns Card */}
           <div className="rm-reveal p-8 md:p-10 bg-white border border-[#8F0028]/10 rounded-[2rem] relative overflow-hidden group hover:border-[#8F0028]/30 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1" style={{ transitionDelay: '100ms' }}>
              <h3 className="text-2xl font-bold mb-2 text-[#171214]">Campaigns</h3>
              <p className="text-[#756A6E] mb-8">Support specific infrastructure projects, events, and immediate needs.</p>
              <a href="/donate/campaigns" className="mt-auto w-full py-3.5 block text-center bg-white text-[#8F0028] font-bold rounded-xl border-2 border-[#8F0028]/20 group-hover:bg-[#8F0028] group-hover:text-white transition-all duration-300">View Campaigns</a>
           </div>

           {/* Endowments Card (Featured) */}
           <div className="rm-reveal p-8 md:p-10 bg-gradient-to-br from-[#3A000E] via-[#520014] to-[#6B0019] rounded-[2rem] relative overflow-hidden transform md:-translate-y-4 shadow-xl border border-[#E8B83F]/30 flex flex-col h-full group hover:-translate-y-6 transition-transform duration-500" style={{ transitionDelay: '200ms' }}>
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#E8B83F] text-[#3A000E] rounded-bl-xl text-xs font-bold tracking-widest uppercase shadow-sm">PERMANENT IMPACT</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Endowments</h3>
              <p className="text-[#FFF9F1]/80 mb-8">Contribute to permanent funds ensuring the long-term sustainability of scholarships and research.</p>
              <a href="/donate/endowments" className="mt-auto block text-center w-full py-3.5 bg-[#E8B83F] text-[#3A000E] font-bold rounded-xl hover:bg-white hover:text-[#8F0028] transition-all duration-300 shadow-md">Explore Funds</a>
           </div>

           {/* Sponsors Card */}
           <div className="rm-reveal p-8 md:p-10 bg-white border border-[#8F0028]/10 rounded-[2rem] relative overflow-hidden group hover:border-[#8F0028]/30 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1" style={{ transitionDelay: '300ms' }}>
              <h3 className="text-2xl font-bold mb-2 text-[#171214]">Sponsorships</h3>
              <p className="text-[#756A6E] mb-8">Partner with Ravenshaw as a corporate or media sponsor for festivals, competitions, and events.</p>
              <a href="/donate/sponsors" className="mt-auto block text-center w-full py-3.5 bg-white text-[#8F0028] font-bold rounded-xl border-2 border-[#8F0028]/20 group-hover:bg-[#8F0028] group-hover:text-white transition-all duration-300">Partner With Us</a>
           </div>
        </div>
        
        <div className="rm-reveal flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-[#756A6E] text-sm sm:text-base font-medium" style={{ transitionDelay: '400ms' }}>
           <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-full bg-[#8F0028]/10 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-4 h-4 text-[#8F0028]"/> 
             </div>
             <span className="tracking-wide">Secure payments via Enterprise Gateway</span>
           </div>
           <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-full bg-[#E8B83F]/10 flex items-center justify-center shrink-0">
               <Zap className="w-4 h-4 text-[#E8B83F]"/> 
             </div>
             <span className="tracking-wide">80G Tax Exemption Receipts</span>
           </div>
        </div>
      </div>
    </div>
  );
}
