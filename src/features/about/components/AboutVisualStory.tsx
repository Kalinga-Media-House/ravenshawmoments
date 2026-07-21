import React from "react";
import Image from "next/image";

export const AboutVisualStory: React.FC = () => {
  return (
    <section
      aria-labelledby="about-visual-story-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2
            id="about-visual-story-heading"
            className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight"
          >
            Every Photograph Holds a Chapter
          </h2>
          <p className="text-sm text-[#756A6E] font-medium">
            A glimpse into the moments that make Ravenshaw unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#8F0028]/10 group shadow-lg">
            <Image
              src="/hero/hero-1.webp"
              alt="Ravenshaw heritage campus view"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#8F0028]/5 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#8F0028]/10 group shadow-lg">
            <Image
              src="/hero/hero-2.webp"
              alt="Students connected across generations"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#8F0028]/5 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#8F0028]/10 group shadow-lg">
            <Image
              src="/hero/hero-3.webp"
              alt="Celebrating university achievements"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#8F0028]/5 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#8F0028]/10 group shadow-lg">
            <Image
              src="/hero/hero-4.webp"
              alt="The living legacy of Ravenshaw moments"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#8F0028]/5 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};
