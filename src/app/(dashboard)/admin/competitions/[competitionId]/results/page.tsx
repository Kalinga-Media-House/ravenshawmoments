import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { competitionResultsRepository } from "@/features/competition/repositories/competitionResultsRepository";
import { CompetitionResultsAdmin } from "@/features/competition/components";

export const metadata: Metadata = {
  title: "Manage Competition Results | Admin Dashboard",
  description: "Administrative interface for evaluation, provisional ranking, tie resolution, and publication of competition results.",
};

export default async function CompetitionResultsAdminPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const supabase = await createClient();

  // 1. Verify Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/admin/competitions/${competitionId}/results`);
  }

  // 2. Server-side RBAC verification via is_competition_admin RPC
  // @ts-ignore
  const { data: isAdmin, error: rbacError } = await supabase.rpc("is_competition_admin", {
    p_competition_id: competitionId,
  });

  if (rbacError || !isAdmin) {
    return (
      <main className="container max-w-5xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-card border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You do not have administrative authorization to evaluate or publish results for this competition.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-bold inline-block hover:bg-stone-800 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. Fetch Competition Details
  const competition = await competitionResultsRepository.getCompetitionById(
    competitionId,
    // @ts-ignore
    supabase
  );

  if (!competition) {
    notFound();
  }

  // 4. Fetch Approved Participants merged with existing Competition Results
  const participants = await competitionResultsRepository.getExistingResultRecords(
    competitionId,
    // @ts-ignore
    supabase
  );

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/admin/competitions" className="hover:text-foreground transition-colors">
          Competitions
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{competition.title}</span>
        <span>/</span>
        <span className="text-red-700">Manage Results</span>
      </nav>

      {/* Interactive Admin Client Component */}
      <CompetitionResultsAdmin
        competitionId={competitionId}
        competitionTitle={competition.title}
        competitionCategory={competition.category || "General"}
        competitionLevel={competition.level || "University"}
        competitionSlug={competition.slug}
        startDate={competition.start_date || new Date().toISOString()}
        organizerName={competition.organizer_name || "Ravenshaw University"}
        initialParticipants={participants}
      />
    </main>
  );
}
