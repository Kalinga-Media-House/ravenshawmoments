import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CompetitionFormWizard from "@/features/competition/components/admin/CompetitionFormWizard";

export const metadata = {
  title: "Create Competition | Ravenshaw Moments Admin",
};

export default function NewCompetitionPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/competitions"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Competitions
            </Link>
            <h1 className="text-3xl font-bold text-stone-900">Create New Competition</h1>
            <p className="text-stone-500 mt-1">
              Start by saving a draft. You can publish it once all requirements are met.
            </p>
          </div>
        </div>

        {/* Wizard Form */}
        <CompetitionFormWizard />

      </div>
    </div>
  );
}
