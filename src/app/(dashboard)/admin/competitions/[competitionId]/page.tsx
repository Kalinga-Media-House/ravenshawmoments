import React from "react";
import { notFound } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";

export const metadata = {
  title: "Competition Overview | Ravenshaw Moments Admin",
};

export default async function CompetitionOverviewPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);

  if (!comp) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-4 border-b border-stone-100 pb-3">
            Competition Information
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-stone-500">Mode</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900 capitalize">{comp.mode}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">Level</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900 capitalize">{comp.level?.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">Start Date</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900">
                {comp.startsAt ? new Date(comp.startsAt).toLocaleString() : "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">End Date</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900">
                {comp.endsAt ? new Date(comp.endsAt).toLocaleString() : "Not set"}
              </dd>
            </div>
          </dl>
          <div className="mt-6">
            <dt className="text-sm font-medium text-stone-500">Short Description</dt>
            <dd className="mt-1 text-sm text-stone-900">{comp.shortDescription || "None provided"}</dd>
          </div>
          {comp.internalNotes && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <dt className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Internal Notes
              </dt>
              <dd className="text-sm text-yellow-900 whitespace-pre-wrap">{comp.internalNotes}</dd>
            </div>
          )}
        </div>
        
        {/* Eligibility Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-4 border-b border-stone-100 pb-3">
            Eligibility & Teams
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-stone-500">Team Participation</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900 flex items-center gap-1">
                {comp.allowTeam ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : "Individual only"}
              </dd>
            </div>
            {comp.allowTeam && (
              <div>
                <dt className="text-sm font-medium text-stone-500">Team Size</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-900">
                  {comp.minTeamSize || "?"} - {comp.maxTeamSize || "?"} members
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-stone-500">External Participants</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900 flex items-center gap-1">
                {comp.externalParticipantsAllowed ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : "Not allowed"}
              </dd>
            </div>
            {comp.externalParticipantsAllowed && comp.externalParticipationLevel && (
              <div>
                <dt className="text-sm font-medium text-stone-500">External Level Limit</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-900">
                  {comp.externalParticipationLevel}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <h3 className="text-base font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">Status Progress</h3>
          <ul className="space-y-3 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Basic Information saved
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Schedule & Mode saved
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Eligibility saved
            </li>
            <li className="flex items-center gap-2 text-stone-800 font-medium">
              <div className="w-4 h-4 rounded-full border-2 border-green-600 bg-green-600" />
              Judging & Teams Active
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
