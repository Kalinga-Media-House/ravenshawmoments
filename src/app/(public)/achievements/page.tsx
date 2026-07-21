import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ACHIEVEMENT_ITEMS } from "@/features/achievement/data/achievements";
import { AchievementsDirectory } from "@/features/achievement/components";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Achievements | Ravenshaw Moments",
  description: "Celebrate Ravenshaw achievements across academics, research, sports, culture, leadership, careers, service, departments, hostels, organizations, students, teachers, and alumni.",
};

export default function AchievementsPage() {
  const publishedAchievements = ACHIEVEMENT_ITEMS;

  return (
    <div className="flex flex-col min-h-screen">
      <InnerPageHero
        title="Celebrating Excellence"
        eyebrow="Ravenshaw Wall of Pride"
        description="Honouring the achievements, dedication, talent, and contributions that continue to inspire the Ravenshaw community across generations."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Achievements" }
        ]}
        backgroundImage={innerPageHeroImages.achievements}
      />

      {/* Main Directory Area */}
      <section className="w-full pb-24">
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
          <AchievementsDirectory initialAchievements={publishedAchievements} />
        </div>
      </section>

      {/* Add Your Achievement CTA */}
      <section className="w-full py-24 bg-[var(--color-rm-bg-deep)] border-t border-[var(--color-rm-glass-border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] text-center">
          <div className="max-w-3xl mx-auto rm-reveal">
            <h2 className="text-3xl md:text-4xl font-extrabold rm-heading-primary text-white mb-6">
              Share Your Success Story
            </h2>
            <p className="text-lg text-white/80 font-medium mb-10 leading-relaxed">
              Have you or someone you know from the Ravenshaw community achieved something remarkable? Share it with us to feature on the Wall of Pride.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-rm-gold)] text-[#12070B] font-bold rounded-xl hover:bg-white hover:shadow-[0_10px_25px_rgba(217,164,65,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Submit an Achievement
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
