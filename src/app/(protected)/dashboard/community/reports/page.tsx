import React from 'react';
import { getReportsAction } from '@/features/community/actions/community.actions';
import { Flag } from 'lucide-react';
import { ReportActionsCell } from './report-actions-cell';

export default async function ModerationReportsPage() {
  const res = await getReportsAction();
  const reports = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Flagged Content Reports</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-[#F5F5DC]">
            <tr>
              <th className="px-6 py-3">Reporter</th>
              <th className="px-6 py-3">Entity Type</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report: any) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {report.reporter?.full_name || 'Unknown'}
                    <div className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {report.reported_entity_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{report.reason}</span>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">{report.details}</p>
                  </td>
                  <td className="px-6 py-4">
                    {report.status === 'pending' ? (
                      <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium">Pending Review</span>
                    ) : (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Resolved</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ReportActionsCell report={report} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Flag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  No reports currently pending review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
