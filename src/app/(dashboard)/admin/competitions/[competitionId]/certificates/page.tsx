import React from "react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { certificateService } from "@/features/competition/services/extendedServices";

export const metadata = {
  title: "Certificates | Competition Admin",
};

export default async function CompetitionCertificatesPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);
  if (!comp) return null;

  const certificates = await certificateService.getCertificates(comp.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Certificates</h2>
          <p className="text-sm text-stone-500 mt-1">Manage and issue certificates for participants, winners, and judges.</p>
        </div>
        <button className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors">
          Generate Batch
        </button>
      </div>

      <div className="space-y-6">
        {certificates && certificates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Recipient</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Issued At</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {certificates.map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-900">{cert.profile?.full_name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-stone-100 text-stone-800">
                        {cert.certificate_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {new Date(cert.issued_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-stone-600 hover:text-stone-900 font-medium text-xs mr-3">View</button>
                      <button className="text-red-600 hover:text-red-800 font-medium text-xs">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <h3 className="text-stone-900 font-medium mb-1">No certificates issued</h3>
            <p className="text-stone-500 text-sm">Generate certificates after the competition concludes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
