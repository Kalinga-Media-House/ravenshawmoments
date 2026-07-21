import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CompetitionFormWizard from "@/features/competition/components/admin/CompetitionFormWizard";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";

export const metadata = {
  title: "Edit Competition | Ravenshaw Moments Admin",
};

export default async function EditCompetitionPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);

  if (!comp) {
    notFound();
  }

  // Pre-fill values
  const defaultValues: Partial<CompetitionDraftValues> = {
    title: comp.title,
    slug: comp.slug,
    shortDescription: comp.shortDescription,
    description: comp.fullDescription,
    internalNotes: comp.internalNotes,
    mode: comp.mode as any,
    startsAt: comp.startsAt ? new Date(comp.startsAt).toISOString().slice(0, 16) : undefined,
    endsAt: comp.endsAt ? new Date(comp.endsAt).toISOString().slice(0, 16) : undefined,
    venueName: comp.venueName,
    reportingInstructions: comp.reportingInstructions,
    categoryId: comp.categoryId,
    level: comp.level as any,
    allowTeam: comp.allowTeam,
    minTeamSize: comp.minTeamSize,
    maxTeamSize: comp.maxTeamSize,
    externalParticipantsAllowed: comp.externalParticipantsAllowed,
    externalParticipationLevel: comp.externalParticipationLevel,
    eligibleParticipantTypes: comp.eligibleParticipantTypes || [],
    publicationAction: "preserve",
    organizerType: comp.departmentId ? "department" : comp.hostelId ? "hostel" : comp.organizationId ? "organization" : "ravenshaw_moments",
    departmentId: comp.departmentId,
    hostelId: comp.hostelId,
    organizationId: comp.organizationId,
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href={`/admin/competitions/${comp.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </Link>
            <h1 className="text-3xl font-bold text-stone-900">Edit {comp.title}</h1>
            <p className="text-stone-500 mt-1">
              Update your competition details.
            </p>
          </div>
        </div>

        {/* Wizard Form */}
        <CompetitionFormWizard initialData={defaultValues} competitionId={comp.id} />

      </div>
    </div>
  );
}
