import React from "react";
import { judgingService } from "../services/judgingService";
import { Gavel } from "lucide-react";

export async function CompetitionJudges({ competitionId }: { competitionId: string }) {
  const judges = await judgingService.getJudges(competitionId);
  
  if (!judges || judges.length === 0) return null;

  return (
    <section aria-labelledby="judges-heading" className="space-y-4">
      <h2 id="judges-heading" className="text-xl font-bold text-rm-maroon-dark flex items-center gap-2 border-b border-stone-200 pb-2">
        <Gavel className="w-5 h-5 text-rm-gold" />
        Panel of Judges
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {judges.map((judge: any) => (
          <div key={judge.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0 border border-stone-200 overflow-hidden">
              {judge.profile?.avatar_url ? (
                <img src={judge.profile.avatar_url} alt={judge.profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-stone-400 font-bold text-lg">
                  {judge.profile?.full_name?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm leading-tight">{judge.profile?.full_name}</h3>
              <p className="text-xs text-stone-500 mt-0.5">Official Judge</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
