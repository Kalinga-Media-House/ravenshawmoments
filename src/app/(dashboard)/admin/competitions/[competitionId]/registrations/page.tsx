import React from "react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { teamService } from "@/features/competition/services/teamService";

export const metadata = {
  title: "Registrations & Teams | Competition Admin",
};

export default async function CompetitionRegistrationsPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);
  if (!comp) return null;

  const teams = await teamService.getTeamsByCompetition(comp.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
        <h2 className="text-xl font-bold text-stone-900">Registrations & Teams</h2>
        <button className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="space-y-6">
        {teams && teams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Team Name</th>
                  <th className="px-4 py-3 font-medium">Leader</th>
                  <th className="px-4 py-3 font-medium">Members</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {teams.map((team: any) => (
                  <tr key={team.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-900">{team.team_name}</td>
                    <td className="px-4 py-3 text-stone-600">{team.leader?.full_name}</td>
                    <td className="px-4 py-3 text-stone-600">{team.members?.length || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        team.team_status === 'approved' ? 'bg-green-100 text-green-800' :
                        team.team_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {team.team_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-stone-600 hover:text-stone-900 font-medium text-xs">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <h3 className="text-stone-900 font-medium mb-1">No registrations yet</h3>
            <p className="text-stone-500 text-sm">Teams and participants will appear here once they register.</p>
          </div>
        )}
      </div>
    </div>
  );
}
