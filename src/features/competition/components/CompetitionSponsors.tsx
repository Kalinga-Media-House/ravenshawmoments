import React from "react";
import { sponsorService } from "../services/extendedServices";

export async function CompetitionSponsors({ competitionId }: { competitionId: string }) {
  const sponsors = await sponsorService.getSponsors(competitionId);
  
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section aria-labelledby="sponsors-heading" className="space-y-6 mt-12">
      <h2 id="sponsors-heading" className="text-2xl font-black text-center text-rm-maroon-dark">
        Sponsors & Partners
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center mb-3 overflow-hidden border-2 border-stone-100 shadow-sm p-4">
              {sponsor.logo_path ? (
                <img src={sponsor.logo_path} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-stone-400 font-bold text-center leading-tight">
                  {sponsor.name}
                </span>
              )}
            </div>
            <h3 className="font-bold text-stone-900 text-center text-sm sm:text-base">{sponsor.name}</h3>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium mt-1">
              {sponsor.tier}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
