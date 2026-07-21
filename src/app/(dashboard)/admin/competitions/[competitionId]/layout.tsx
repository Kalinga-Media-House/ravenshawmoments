import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit2 } from "lucide-react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { CompetitionAdminTabs } from "./CompetitionAdminTabs";

export default async function CompetitionAdminLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ competitionId: string }> 
}) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);

  if (!comp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/competitions"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Competitions
            </Link>
            <h1 className="text-3xl font-bold text-stone-900">{comp.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                comp.status === "Draft" 
                  ? "bg-stone-200 text-stone-800" 
                  : comp.status === "Cancelled" 
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {comp.status}
              </span>
              <span className="text-sm text-stone-500">Slug: {comp.slug}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/competitions/${comp.id}/edit`}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Details
            </Link>
            {comp.status === "Draft" && (
              <button
                disabled
                title="Available in Phase B"
                className="px-4 py-2 rounded-xl border-2 border-red-700 text-red-700 text-sm font-bold opacity-50 cursor-not-allowed transition-colors"
              >
                Publish (Phase B)
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <CompetitionAdminTabs competitionId={comp.id} />

        {/* Main Content */}
        <div className="mt-8">
          {children}
        </div>

      </div>
    </div>
  );
}
