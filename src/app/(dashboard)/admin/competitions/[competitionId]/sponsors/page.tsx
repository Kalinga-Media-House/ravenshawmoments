import React from "react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { sponsorService } from "@/features/competition/services/extendedServices";

export const metadata = {
  title: "Sponsors | Competition Admin",
};

export default async function CompetitionSponsorsPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);
  if (!comp) return null;

  const sponsors = await sponsorService.getSponsors(comp.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
        <h2 className="text-xl font-bold text-stone-900">Sponsors & Partners</h2>
        <button className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors">
          Add Sponsor
        </button>
      </div>

      <div className="space-y-6">
        {sponsors && sponsors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="border border-stone-200 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-stone-200">
                  {sponsor.logo_path ? (
                    <img src={sponsor.logo_path} alt={sponsor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-stone-400 text-sm">No Logo</span>
                  )}
                </div>
                <h3 className="font-bold text-stone-900">{sponsor.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-stone-100 text-stone-600 mt-2">
                  {sponsor.tier}
                </span>
                <div className="mt-4 flex gap-2 w-full">
                  <button className="flex-1 px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-medium rounded-lg hover:bg-stone-50">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <h3 className="text-stone-900 font-medium mb-1">No sponsors added</h3>
            <p className="text-stone-500 text-sm">Add sponsors to display them on the public competition page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
