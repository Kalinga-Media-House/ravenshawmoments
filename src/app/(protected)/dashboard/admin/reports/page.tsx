import React from 'react';
import { getReportsAction } from '@/features/admin-intelligence/actions/intelligence.actions';
import { FileText, Download, Clock, Filter, FileSpreadsheet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ReportsPage() {
  const reportsRes = await getReportsAction();
  const reports = reportsRes.success ? reportsRes.data : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#800000]">Report Engine</h1>
          <p className="text-gray-500 mt-2">Generate, schedule, and export platform intelligence.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-[#F5F5DC] text-[#800000]">
            <Clock className="w-4 h-4 mr-2" />
            Schedules
          </Button>
          <Button className="bg-[#800000] text-white hover:bg-[#800000]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#F5F5DC] p-6 rounded-xl shadow-sm">
          <FileText className="h-8 w-8 text-[#800000] mb-4" />
          <h3 className="font-semibold text-gray-900">PDF Exports</h3>
          <p className="text-sm text-gray-500 mt-1">Formatted executive summaries and charts ready for presentation.</p>
        </div>
        <div className="bg-white border border-[#F5F5DC] p-6 rounded-xl shadow-sm">
          <FileSpreadsheet className="h-8 w-8 text-[#800000] mb-4" />
          <h3 className="font-semibold text-gray-900">Excel Data</h3>
          <p className="text-sm text-gray-500 mt-1">Raw multi-sheet data exports for deep analysis.</p>
        </div>
        <div className="bg-white border border-[#F5F5DC] p-6 rounded-xl shadow-sm">
          <Filter className="h-8 w-8 text-[#800000] mb-4" />
          <h3 className="font-semibold text-gray-900">Custom Filters</h3>
          <p className="text-sm text-gray-500 mt-1">Save complex query parameters across departments, hostels, and batches.</p>
        </div>
      </div>

      <div className="bg-white border border-[#F5F5DC] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#F5F5DC] bg-gray-50 font-medium text-[#800000]">
          Recent Reports
        </div>
        {reports && reports.length > 0 ? (
          <div className="divide-y divide-[#F5F5DC]">
            {reports.map((report: any) => (
              <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {report.format === 'pdf' ? <FileText className="w-5 h-5 text-red-500" /> : <FileSpreadsheet className="w-5 h-5 text-green-600" />}
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">Generated {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[#800000]">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <p>No reports generated yet.</p>
            <Button variant="link" className="text-[#800000]">Generate your first report</Button>
          </div>
        )}
      </div>
    </div>
  );
}
