import React from "react";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";

export const DonationHero = () => {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/hero-1.webp"
          alt="Ravenshaw University Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#3A0016]/85 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B1C] via-[#3A0016]/70 to-[#3A0016]/30 z-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-[#1a000a]/60 z-30 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="container relative z-40 px-4 md:px-6 flex flex-col items-center text-center mt-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A046]/20 border border-[#C8A046]/50 text-[#C8A046] text-xs font-black uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Heart className="w-4 h-4" />
          <span>Support Ravenshaw Moments</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F8F4EC] mb-6 font-serif drop-shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
          Support the Legacy of<br className="hidden md:block" /> Ravenshaw
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl text-[#F8F4EC]/90 mb-10 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          Your contribution helps preserve memories, celebrate achievements, digitize history, and build the future of Ravenshaw Moments.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <a href="#donate" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#1E1B1C] bg-[#D4AF37] hover:bg-[#F8F4EC] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(248,244,236,0.6)] group">
            Donate Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#why-donate" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#F8F4EC] bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-md transition-all duration-300 group">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};
