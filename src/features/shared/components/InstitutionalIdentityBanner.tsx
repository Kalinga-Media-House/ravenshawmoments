import React from "react";
import Image from "next/image";

export const InstitutionalIdentityBanner = () => {
  return (
    <section className="w-full bg-white border-b border-[var(--color-maroon)]/10 py-6 md:py-8 lg:py-10 z-10 relative">
      <div className="container mx-auto px-[clamp(1rem,4vw,3rem)]">
        <div 
          className="grid gap-2 sm:gap-4 md:gap-6 lg:gap-8 items-center justify-items-center w-full"
          style={{
            gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.9fr) minmax(0, 2.1fr)"
          }}
        >
          {/* Logo 1: Ravenshaw University */}
          <div className="relative w-full flex justify-center items-center h-8 sm:h-12 md:h-14 lg:h-16">
            <Image 
              src="/logof.png" 
              alt="Ravenshaw University" 
              fill
              sizes="(max-width: 640px) 30vw, (max-width: 1024px) 30vw, 25vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Logo 2: G20 India */}
          <div className="relative w-full flex justify-center items-center h-8 sm:h-12 md:h-14 lg:h-16">
            <Image 
              src="/g20f.png" 
              alt="G20 India" 
              fill
              sizes="(max-width: 640px) 15vw, (max-width: 1024px) 15vw, 15vw"
              className="object-contain"
            />
          </div>

          {/* Logo 3: NAAC A++ Accreditation */}
          <div className="relative w-full flex justify-center items-center h-8 sm:h-12 md:h-14 lg:h-16">
            <Image 
              src="/naacf.png" 
              alt="NAAC A++ Accreditation" 
              fill
              sizes="(max-width: 640px) 15vw, (max-width: 1024px) 15vw, 15vw"
              className="object-contain"
            />
          </div>

          {/* Logo 4: University Grants Commission */}
          <div className="relative w-full flex justify-center items-center h-8 sm:h-12 md:h-14 lg:h-16">
            <Image 
              src="/ugcf.png" 
              alt="University Grants Commission" 
              fill
              sizes="(max-width: 640px) 12vw, (max-width: 1024px) 12vw, 12vw"
              className="object-contain"
            />
          </div>

          {/* Logo 5: Higher Education Department, Government of Odisha */}
          <div className="relative w-full flex justify-center items-center h-8 sm:h-12 md:h-14 lg:h-16">
            <Image 
              src="/highereduf.png" 
              alt="Higher Education Department, Government of Odisha" 
              fill
              sizes="(max-width: 640px) 28vw, (max-width: 1024px) 28vw, 25vw"
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
