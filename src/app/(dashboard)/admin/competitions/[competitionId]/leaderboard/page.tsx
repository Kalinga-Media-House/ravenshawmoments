import React from "react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { judgingService } from "@/features/competition/services/judgingService";

export const metadata = {
  title: "Leaderboard | Competition Admin",
};

export default async function CompetitionLeaderboardPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);
  if (!comp) return null;

  const evaluations = await judgingService.getLeaderboardData(comp.id);

  // Simple aggregation for demonstration:
  // In production, this would aggregate scores by registration_id or team_id
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Leaderboard</h2>
          <p className="text-sm text-stone-500 mt-1">Live standings based on judge evaluations.</p>
        </div>
        <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors">
          Export Standings
        </button>
      </div>

      <div className="space-y-6">
        {evaluations && evaluations.length > 0 ? (
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Participant / Team ID</th>
                  <th className="px-4 py-3 font-medium">Evaluations Count</th>
                  <th className="px-4 py-3 font-medium text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {evaluations.map((ev: any, i: number) => (
                  <tr key={ev.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-900">{ev.team_id || ev.registration_id}</td>
                    <td className="px-4 py-3 text-stone-600">1</td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">{ev.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <h3 className="text-stone-900 font-medium mb-1">No evaluations yet</h3>
            <p className="text-stone-500 text-sm">The leaderboard will populate once judges submit their scores.</p>
          </div>
        )}
      </div>
    </div>
  );
}
