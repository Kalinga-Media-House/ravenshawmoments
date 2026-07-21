import React from "react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { judgingService } from "@/features/competition/services/judgingService";

export const metadata = {
  title: "Judges & Criteria | Competition Admin",
};

export default async function CompetitionJudgesPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);
  if (!comp) return null;

  const judges = await judgingService.getJudges(comp.id);
  const criteria = await judgingService.getCriteria(comp.id);

  return (
    <div className="space-y-8">
      {/* Judges Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <h2 className="text-xl font-bold text-stone-900">Assigned Judges</h2>
          <button className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors">
            Assign Judge
          </button>
        </div>

        {judges && judges.length > 0 ? (
          <ul className="divide-y divide-stone-100">
            {judges.map((judge: any) => (
              <li key={judge.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{judge.profile?.full_name}</p>
                  <p className="text-xs text-stone-500">Assigned: {new Date(judge.assigned_at).toLocaleDateString()}</p>
                </div>
                <button className="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <p className="text-stone-500 text-sm">No judges assigned yet.</p>
          </div>
        )}
      </div>

      {/* Criteria Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <h2 className="text-xl font-bold text-stone-900">Evaluation Criteria</h2>
          <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors">
            Add Criteria
          </button>
        </div>

        {criteria && criteria.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Criteria Name</th>
                  <th className="px-4 py-3 font-medium">Max Score</th>
                  <th className="px-4 py-3 font-medium">Weightage</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {criteria.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-900">{item.name}</td>
                    <td className="px-4 py-3 text-stone-600">{item.max_score}</td>
                    <td className="px-4 py-3 text-stone-600">{item.weightage}x</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-stone-600 hover:text-stone-900 font-medium text-xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <p className="text-stone-500 text-sm">No evaluation criteria defined.</p>
          </div>
        )}
      </div>
    </div>
  );
}
