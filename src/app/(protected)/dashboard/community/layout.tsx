import React from 'react';
import Link from 'next/link';
import { Shield, Flag, Trash2, Settings } from 'lucide-react';

export default function AdminCommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#800000]">Community Moderation</h1>
          <p className="text-gray-500 mt-1">Global platform oversight, reports, and content governance.</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-white p-1 rounded-lg border border-[#F5F5DC] w-max">
        <Link href="/dashboard/community/moderation" className="px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center">
          <Shield className="w-4 h-4 mr-2" /> Action Center
        </Link>
        <Link href="/dashboard/community/reports" className="px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center">
          <Flag className="w-4 h-4 mr-2" /> Reports
        </Link>
        <Link href="/dashboard/community/deleted" className="px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center">
          <Trash2 className="w-4 h-4 mr-2" /> Deleted Content
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#F5F5DC] p-6">
        {children}
      </div>
    </div>
  );
}
