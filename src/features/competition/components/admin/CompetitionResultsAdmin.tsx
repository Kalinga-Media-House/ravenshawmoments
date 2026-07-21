"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  Search,
  RefreshCw,
  Eye,
  ExternalLink,
  FileSpreadsheet,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import {
  CompetitionResultParticipant,
  ProvisionalRanking,
  CompetitionParticipantOutcome,
} from "../../types/results";
import {
  saveBulkCompetitionMarksAction,
  updateParticipantOutcomeAction,
  calculateCompetitionResultsAction,
  resolveCompetitionTieAction,
  finalizeCompetitionResultsAction,
  publishCompetitionResultsAction,
} from "@/app/actions/competition-results";

export interface CompetitionResultsAdminProps {
  competitionId: string;
  competitionTitle: string;
  competitionCategory: string;
  competitionLevel: string;
  competitionSlug: string;
  startDate: string;
  organizerName: string;
  initialParticipants: CompetitionResultParticipant[];
}

export const CompetitionResultsAdmin: React.FC<CompetitionResultsAdminProps> = ({
  competitionId,
  competitionTitle,
  competitionCategory,
  competitionLevel,
  competitionSlug,
  startDate,
  organizerName,
  initialParticipants,
}) => {
  // Master Participants State
  const [participants, setParticipants] = useState<CompetitionResultParticipant[]>(
    initialParticipants
  );

  // Local Unsaved Draft Marks Map: registrationId -> { marksObtained, maximumMarks, remarks }
  const [draftEdits, setDraftEdits] = useState<
    Record<
      string,
      {
        marksObtained: string;
        maximumMarks: string;
        remarks: string;
      }
    >
  >({});

  // Provisional Rankings State
  const [provisionalRankings, setProvisionalRankings] = useState<ProvisionalRanking[] | null>(null);

  // UI / Status / Loading States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isResolvingTie, setIsResolvingTie] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals
  const [disqualificationModal, setDisqualificationModal] = useState<{
    isOpen: boolean;
    registrationId: string;
    participantName: string;
    reason: string;
  }>({
    isOpen: false,
    registrationId: "",
    participantName: "",
    reason: "",
  });

  const [ineligibleConfirmModal, setIneligibleConfirmModal] = useState<{
    isOpen: boolean;
    registrationId: string;
    participantName: string;
    newOutcome: CompetitionParticipantOutcome;
  }>({
    isOpen: false,
    registrationId: "",
    participantName: "",
    newOutcome: "absent",
  });

  const [tieBreakModal, setTieBreakModal] = useState<{
    isOpen: boolean;
    registrationId: string;
    participantName: string;
    originalScore: number | null;
    tieBreakScore: string;
    notes: string;
  }>({
    isOpen: false,
    registrationId: "",
    participantName: "",
    originalScore: null,
    tieBreakScore: "",
    notes: "",
  });

  const [finalizeConfirmModal, setFinalizeConfirmModal] = useState(false);
  const [publishConfirmModal, setPublishConfirmModal] = useState(false);

  // Determine overall workflow status
  const isPublished = participants.some((p) => p.resultStatus === "published");
  const isFinalized = isPublished || participants.some((p) => p.resultStatus === "finalized");
  const isReadOnly = isFinalized || isPublished;

  // Unsaved Edits Count
  const unsavedCount = Object.keys(draftEdits).length;

  // Statistics
  const totalApproved = participants.length;
  const evaluatedCount = participants.filter(
    (p) => p.marksObtained !== null && p.marksObtained !== undefined
  ).length;
  const pendingEvaluationCount = totalApproved - evaluatedCount;

  // Detect Unresolved Top-Three Ties
  const unresolvedTopThreeTie = useMemo(() => {
    return participants.some(
      (p) => p.requiresTieBreak && (p.rank === 1 || p.rank === 2 || p.rank === 3)
    );
  }, [participants]);

  // Filtered Participants List
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.fullName.toLowerCase().includes(query);
        const matchesId = p.registrationId.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }
      // Filter
      if (filterStatus === "pending") {
        return p.marksObtained === null || p.marksObtained === undefined;
      }
      if (filterStatus === "evaluated") {
        return p.marksObtained !== null && p.marksObtained !== undefined;
      }
      if (filterStatus === "participated") return p.outcome === "participated" || p.outcome === "eligible";
      if (filterStatus === "absent") return p.outcome === "absent";
      if (filterStatus === "withdrawn") return p.outcome === "withdrawn";
      if (filterStatus === "disqualified") return p.outcome === "disqualified";
      return true;
    });
  }, [participants, searchQuery, filterStatus]);

  // Handle Mark Field Change
  const handleMarkChange = (
    registrationId: string,
    field: "marksObtained" | "maximumMarks" | "remarks",
    value: string
  ) => {
    if (isReadOnly) return;
    setErrorMessage(null);

    const existing = draftEdits[registrationId] || {
      marksObtained:
        participants
          .find((p) => p.registrationId === registrationId)
          ?.marksObtained?.toString() || "",
      maximumMarks:
        participants
          .find((p) => p.registrationId === registrationId)
          ?.maximumMarks?.toString() || "100",
      remarks: "",
    };

    setDraftEdits((prev) => ({
      ...prev,
      [registrationId]: {
        ...existing,
        [field]: value,
      },
    }));
  };

  // Bulk Save Draft Marks Action
  const handleSaveDraft = async () => {
    if (unsavedCount === 0 || isReadOnly) return;
    setIsSavingDraft(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const entriesToSave: {
        registrationId: string;
        profileId: string | null;
        marksObtained: number;
        maximumMarks: number;
        remarks?: string;
      }[] = [];

      for (const [registrationId, edit] of Object.entries(draftEdits)) {
        const obtained = Number(edit.marksObtained);
        const maximum = Number(edit.maximumMarks || 100);

        if (isNaN(obtained) || obtained < 0) {
          throw new Error("Marks obtained must be a valid non-negative number.");
        }
        if (isNaN(maximum) || maximum <= 0) {
          throw new Error("Maximum marks must be greater than zero.");
        }
        if (obtained > maximum) {
          throw new Error("Marks obtained cannot exceed maximum marks.");
        }

        const participant = participants.find((p) => p.registrationId === registrationId);
        entriesToSave.push({
          registrationId,
          profileId: participant?.profileId || null,
          marksObtained: obtained,
          maximumMarks: maximum,
          remarks: edit.remarks,
        });
      }

      const res = await saveBulkCompetitionMarksAction(competitionId, entriesToSave);

      if (!res.success) {
        throw new Error(res.error?.message || "Failed to save draft marks.");
      }

      // Update local participants state with saved marks
      setParticipants((prev) =>
        prev.map((p) => {
          const edit = draftEdits[p.registrationId];
          if (!edit) return p;
          const obtained = Number(edit.marksObtained);
          const max = Number(edit.maximumMarks || 100);
          const normalized = Number(((obtained / max) * 100).toFixed(2));
          return {
            ...p,
            marksObtained: obtained,
            maximumMarks: max,
            normalizedScore: normalized,
            resultStatus: "draft",
          };
        })
      );

      setDraftEdits({});
      setSuccessMessage(`Saved draft marks for ${entriesToSave.length} participant(s).`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save draft marks.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Operational Outcome Change Handler
  const handleOutcomeChangeRequest = (
    participant: CompetitionResultParticipant,
    newOutcome: CompetitionParticipantOutcome
  ) => {
    if (isReadOnly) return;
    setErrorMessage(null);

    if (newOutcome === "disqualified") {
      setDisqualificationModal({
        isOpen: true,
        registrationId: participant.registrationId,
        participantName: participant.fullName,
        reason: "",
      });
      return;
    }

    if (
      (newOutcome === "absent" || newOutcome === "withdrawn") &&
      participant.marksObtained !== null
    ) {
      setIneligibleConfirmModal({
        isOpen: true,
        registrationId: participant.registrationId,
        participantName: participant.fullName,
        newOutcome,
      });
      return;
    }

    executeOutcomeChange(participant.registrationId, newOutcome);
  };

  const executeOutcomeChange = async (
    registrationId: string,
    outcome: CompetitionParticipantOutcome,
    reason?: string
  ) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await updateParticipantOutcomeAction(
        competitionId,
        registrationId,
        outcome,
        reason
      );

      if (!res.success) {
        throw new Error(res.error?.message || "Failed to update participant outcome.");
      }

      setParticipants((prev) =>
        prev.map((p) => {
          if (p.registrationId !== registrationId) return p;
          const isIneligible =
            outcome === "disqualified" || outcome === "withdrawn" || outcome === "absent";
          return {
            ...p,
            outcome,
            rank: isIneligible ? null : p.rank,
            position: isIneligible ? "participant" : p.position,
          };
        })
      );

      setSuccessMessage("Participant outcome updated successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update participant outcome.");
    }
  };

  // Calculate Provisional Results Action
  const handleCalculateProvisional = async () => {
    setIsCalculating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await calculateCompetitionResultsAction(competitionId);
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || "Failed to calculate provisional results.");
      }

      setProvisionalRankings(res.data);

      // Update participants state with backend rankings
      setParticipants((prev) =>
        prev.map((p) => {
          const ranking = res.data?.find((r) => r.registrationId === p.registrationId);
          if (!ranking) return p;
          return {
            ...p,
            rank: ranking.rank,
            position: ranking.position,
            normalizedScore: ranking.normalizedScore,
            requiresTieBreak: ranking.requiresTieBreak,
          };
        })
      );

      setSuccessMessage("Provisional results calculated successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to calculate provisional results.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Resolve Tie Action
  const handleResolveTie = async () => {
    const score = Number(tieBreakModal.tieBreakScore);
    if (isNaN(score) || score < 0) {
      setErrorMessage("Tie break score must be a non-negative numeric value.");
      return;
    }
    if (!tieBreakModal.notes.trim()) {
      setErrorMessage("Please enter a reason or note for this tie resolution.");
      return;
    }

    setIsResolvingTie(true);
    setErrorMessage(null);

    try {
      const res = await resolveCompetitionTieAction(
        competitionId,
        tieBreakModal.registrationId,
        score,
        tieBreakModal.notes
      );

      if (!res.success) {
        throw new Error(res.error?.message || "Failed to resolve tie.");
      }

      setTieBreakModal({
        isOpen: false,
        registrationId: "",
        participantName: "",
        originalScore: null,
        tieBreakScore: "",
        notes: "",
      });

      // Recalculate rankings immediately after resolving tie
      await handleCalculateProvisional();
      setSuccessMessage("Tie resolved and provisional rankings recalculated.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resolve tie.");
    } finally {
      setIsResolvingTie(false);
    }
  };

  // Finalize Results Action
  const handleFinalizeResults = async () => {
    setIsFinalizing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await finalizeCompetitionResultsAction(competitionId);
      if (!res.success) {
        throw new Error(res.error?.message || "Failed to finalize competition results.");
      }

      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          resultStatus: "finalized",
        }))
      );

      setFinalizeConfirmModal(false);
      setSuccessMessage("Results finalized successfully. Positions are now locked.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to finalize competition results.");
    } finally {
      setIsFinalizing(false);
    }
  };

  // Publish Results Action
  const handlePublishResults = async () => {
    setIsPublishing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await publishCompetitionResultsAction(competitionId);
      if (!res.success) {
        throw new Error(res.error?.message || "Failed to publish competition results.");
      }

      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          resultStatus: "published",
        }))
      );

      setPublishConfirmModal(false);
      setSuccessMessage(
        "Official competition results published successfully! Leaderboard and Winners Gallery have been revalidated."
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish competition results.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Messages */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{successMessage}</div>
        </div>
      )}

      {/* Header & Workflow Status */}
      <section className="p-6 sm:p-8 rounded-2xl bg-card border shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800">
                {competitionCategory}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                {competitionLevel} Level
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                {isPublished
                  ? "Published Official Results"
                  : isFinalized
                  ? "Finalized — Awaiting Publication"
                  : "Draft Evaluation"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {competitionTitle}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organized by {organizerName} • Date:{" "}
              {new Date(startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <Link
              href={`/competitions/${competitionSlug}`}
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Public Page
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Workflow Progress Indicator */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
            <span
              className={`flex items-center gap-1.5 ${
                !isFinalized && !isPublished ? "text-red-700 font-bold" : ""
              }`}
            >
              1. Draft Marks & Outcomes
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1.5 ${
                provisionalRankings && !isFinalized ? "text-red-700 font-bold" : ""
              }`}
            >
              2. Provisional Rankings
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1.5 ${
                unresolvedTopThreeTie ? "text-amber-600 font-bold" : ""
              }`}
            >
              3. Tie Resolution
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1.5 ${
                isFinalized && !isPublished ? "text-red-700 font-bold" : ""
              }`}
            >
              4. Finalized
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1.5 ${
                isPublished ? "text-green-700 font-bold" : ""
              }`}
            >
              5. Official Results Published
            </span>
          </div>
        </div>

        {/* Statistics Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase">
                Approved Participants
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">{totalApproved}</div>
            </div>
            <UserCheck className="w-8 h-8 text-stone-400" />
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase">
                Evaluated Participants
              </div>
              <div className="text-2xl font-bold text-green-700 mt-1">{evaluatedCount}</div>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-green-600 opacity-80" />
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase">
                Pending Evaluation
              </div>
              <div className="text-2xl font-bold text-amber-700 mt-1">{pendingEvaluationCount}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-600 opacity-80" />
          </div>
        </div>
      </section>

      {/* Unresolved Tie Alert */}
      {unresolvedTopThreeTie && !isFinalized && (
        <section className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Result finalization is blocked because a top-three tie requires resolution.
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                Please review participants with tied top-three scores below and apply a tie-break
                score and reason.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Bulk Draft Action Bar */}
      <section className="p-4 rounded-2xl bg-card border shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by participant name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search participants"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter participants by evaluation or outcome status"
            className="px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
          >
            <option value="all">All Approved Participants</option>
            <option value="pending">Pending Evaluation</option>
            <option value="evaluated">Evaluated</option>
            <option value="participated">Participated / Eligible</option>
            <option value="absent">Absent</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="disqualified">Disqualified</option>
          </select>
        </div>

        {/* Bulk Save Draft Button */}
        {!isReadOnly && (
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={unsavedCount === 0 || isSavingDraft}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              unsavedCount > 0
                ? "bg-red-700 hover:bg-red-800 text-white shadow-sm cursor-pointer"
                : "bg-stone-200 text-stone-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            {isSavingDraft ? "Saving Draft..." : `Save Draft (${unsavedCount} unsaved)`}
          </button>
        )}
      </section>

      {/* Approved Participant Table */}
      <section className="rounded-2xl bg-card border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 w-28">Marks</th>
                <th className="py-3 px-4 w-28">Max Marks</th>
                <th className="py-3 px-4">Score (%)</th>
                <th className="py-3 px-4">Rank / Position</th>
                <th className="py-3 px-4">Operational Outcome</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No approved participants match the current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => {
                  const edit = draftEdits[p.registrationId];
                  const currentMarks = edit
                    ? edit.marksObtained
                    : p.marksObtained !== null
                    ? p.marksObtained.toString()
                    : "";
                  const currentMax = edit
                    ? edit.maximumMarks
                    : p.maximumMarks
                    ? p.maximumMarks.toString()
                    : "100";
                  const initials = p.fullName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();

                  const isIneligible =
                    p.outcome === "absent" ||
                    p.outcome === "withdrawn" ||
                    p.outcome === "disqualified";

                  return (
                    <tr
                      key={p.registrationId}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      {/* Participant Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-xs font-bold text-red-800 flex-shrink-0">
                            {initials || "RM"}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{p.fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              Ref: {p.registrationId.slice(0, 8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {p.departmentOrInstitution}
                      </td>

                      {/* Marks Obtained Input */}
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          disabled={isReadOnly || isIneligible}
                          value={currentMarks}
                          onChange={(e) =>
                            handleMarkChange(
                              p.registrationId,
                              "marksObtained",
                              e.target.value
                            )
                          }
                          placeholder="—"
                          aria-label={`Marks obtained for ${p.fullName}`}
                          className={`w-24 px-2.5 py-1.5 text-sm rounded-lg border ${
                            edit
                              ? "border-amber-400 bg-amber-50/40"
                              : "border-stone-300 bg-white"
                          } focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-stone-100 disabled:text-stone-400`}
                        />
                      </td>

                      {/* Maximum Marks Input */}
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min="1"
                          disabled={isReadOnly || isIneligible}
                          value={currentMax}
                          onChange={(e) =>
                            handleMarkChange(
                              p.registrationId,
                              "maximumMarks",
                              e.target.value
                            )
                          }
                          aria-label={`Maximum marks for ${p.fullName}`}
                          className="w-20 px-2.5 py-1.5 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-stone-100 disabled:text-stone-400"
                        />
                      </td>

                      {/* Normalized Score */}
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {p.normalizedScore !== null ? `${p.normalizedScore}%` : "—"}
                      </td>

                      {/* Rank / Position Badge */}
                      <td className="py-3.5 px-4">
                        {p.rank ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800">
                            Rank #{p.rank} ({p.position.toUpperCase()})
                          </span>
                        ) : isIneligible ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-stone-200 text-stone-600">
                            Ineligible
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                      </td>

                      {/* Operational Outcome Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isReadOnly}
                          value={p.outcome}
                          onChange={(e) =>
                            handleOutcomeChangeRequest(
                              p,
                              e.target.value as CompetitionParticipantOutcome
                            )
                          }
                          aria-label={`Operational outcome for ${p.fullName}`}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-stone-100 disabled:text-stone-500"
                        >
                          <option value="eligible">Participated / Eligible</option>
                          <option value="absent">Absent</option>
                          <option value="withdrawn">Withdrawn</option>
                          <option value="disqualified">Disqualified</option>
                        </select>
                      </td>

                      {/* Tie-break button if tie detected */}
                      <td className="py-3.5 px-4 text-right">
                        {p.requiresTieBreak && !isReadOnly && (
                          <button
                            type="button"
                            onClick={() =>
                              setTieBreakModal({
                                isOpen: true,
                                registrationId: p.registrationId,
                                participantName: p.fullName,
                                originalScore: p.normalizedScore,
                                tieBreakScore: p.tieBreakScore?.toString() || "",
                                notes: "",
                              })
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                          >
                            Resolve Tie
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Provisional Results Calculation & Podium Section */}
      <section className="p-6 sm:p-8 rounded-2xl bg-card border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 mb-2">
              Provisional — Not Public
            </span>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Provisional Rankings & Podium Preview
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Authoritatively computed by backend ranking rules.
            </p>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={handleCalculateProvisional}
              disabled={isCalculating || pendingEvaluationCount > 0}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                pendingEvaluationCount === 0
                  ? "bg-red-700 hover:bg-red-800 text-white shadow-sm cursor-pointer"
                  : "bg-stone-200 text-stone-500 cursor-not-allowed"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isCalculating ? "animate-spin" : ""}`} />
              {isCalculating
                ? "Calculating..."
                : pendingEvaluationCount > 0
                ? `Evaluate All (${pendingEvaluationCount} remaining)`
                : "Calculate Provisional Results"}
            </button>
          )}
        </div>

        {/* Podium Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3].map((rankNum) => {
            const winner = participants.find((p) => p.rank === rankNum);
            const positionLabel =
              rankNum === 1 ? "First Place" : rankNum === 2 ? "Second Place" : "Third Place";

            return (
              <div
                key={rankNum}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    #{rankNum} • {positionLabel}
                  </span>
                  <Trophy
                    className={`w-5 h-5 ${
                      rankNum === 1
                        ? "text-amber-500"
                        : rankNum === 2
                        ? "text-stone-400"
                        : "text-amber-700"
                    }`}
                  />
                </div>

                {winner ? (
                  <div>
                    <div className="font-bold text-base text-foreground">{winner.fullName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {winner.departmentOrInstitution}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-red-800">
                      Score: {winner.normalizedScore}%
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-xs italic text-muted-foreground">
                    Position undetermined
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Finalize & Publish Controls */}
      <section className="p-6 sm:p-8 rounded-2xl bg-stone-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-lg font-serif font-bold">Official Results Lifecycle</h2>
          <p className="text-xs text-stone-300 max-w-xl">
            Finalize results to lock podium positions. Publish official results to expose them
            publicly on the leaderboard and Winners Gallery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Finalize Button */}
          {!isFinalized && (
            <button
              type="button"
              onClick={() => setFinalizeConfirmModal(true)}
              disabled={
                isFinalizing ||
                pendingEvaluationCount > 0 ||
                unresolvedTopThreeTie ||
                !provisionalRankings
              }
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                pendingEvaluationCount === 0 && !unresolvedTopThreeTie && provisionalRankings
                  ? "bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm cursor-pointer"
                  : "bg-stone-800 text-stone-500 cursor-not-allowed"
              }`}
            >
              <Lock className="w-4 h-4" />
              Finalize Results
            </button>
          )}

          {/* Publish Button */}
          {!isPublished && (
            <button
              type="button"
              onClick={() => setPublishConfirmModal(true)}
              disabled={isPublishing || !isFinalized || unresolvedTopThreeTie}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                isFinalized && !unresolvedTopThreeTie
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
                  : "bg-stone-800 text-stone-500 cursor-not-allowed"
              }`}
            >
              <Award className="w-4 h-4" />
              Publish Official Results
            </button>
          )}
        </div>
      </section>

      {/* Modals */}
      {/* 1. Disqualification Reason Modal */}
      {disqualificationModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-labelledby="disqualification-modal-title"
            className="w-full max-w-md p-6 rounded-2xl bg-card border shadow-xl space-y-4"
          >
            <h3 id="disqualification-modal-title" className="text-lg font-bold text-foreground">
              Disqualify Participant
            </h3>
            <p className="text-xs text-muted-foreground">
              Disqualifying <span className="font-bold">{disqualificationModal.participantName}</span>{" "}
              makes them ineligible for rank or points. A reason is mandatory.
            </p>
            <textarea
              rows={3}
              placeholder="Enter reason for disqualification..."
              value={disqualificationModal.reason}
              onChange={(e) =>
                setDisqualificationModal((prev) => ({ ...prev, reason: e.target.value }))
              }
              aria-label="Reason for disqualification"
              className="w-full p-3 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setDisqualificationModal({
                    isOpen: false,
                    registrationId: "",
                    participantName: "",
                    reason: "",
                  })
                }
                className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!disqualificationModal.reason.trim()}
                onClick={() => {
                  executeOutcomeChange(
                    disqualificationModal.registrationId,
                    "disqualified",
                    disqualificationModal.reason
                  );
                  setDisqualificationModal({
                    isOpen: false,
                    registrationId: "",
                    participantName: "",
                    reason: "",
                  });
                }}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold disabled:bg-stone-300 disabled:text-stone-500"
              >
                Confirm Disqualification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Ineligible Outcome Confirmation Modal */}
      {ineligibleConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-labelledby="ineligible-modal-title"
            className="w-full max-w-md p-6 rounded-2xl bg-card border shadow-xl space-y-4"
          >
            <h3 id="ineligible-modal-title" className="text-lg font-bold text-foreground">
              Confirm Status Change
            </h3>
            <p className="text-xs text-muted-foreground">
              Participant <span className="font-bold">{ineligibleConfirmModal.participantName}</span>{" "}
              already has marks entered. Changing status to{" "}
              <span className="font-bold uppercase">{ineligibleConfirmModal.newOutcome}</span> will
              remove them from ranking and points calculation.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setIneligibleConfirmModal({
                    isOpen: false,
                    registrationId: "",
                    participantName: "",
                    newOutcome: "absent",
                  })
                }
                className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  executeOutcomeChange(
                    ineligibleConfirmModal.registrationId,
                    ineligibleConfirmModal.newOutcome
                  );
                  setIneligibleConfirmModal({
                    isOpen: false,
                    registrationId: "",
                    participantName: "",
                    newOutcome: "absent",
                  });
                }}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
              >
                Confirm Outcome
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tie Resolution Modal */}
      {tieBreakModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-labelledby="tiebreak-modal-title"
            className="w-full max-w-md p-6 rounded-2xl bg-card border shadow-xl space-y-4"
          >
            <h3 id="tiebreak-modal-title" className="text-lg font-bold text-foreground">
              Resolve Top-Three Tie
            </h3>
            <p className="text-xs text-muted-foreground">
              Resolve tie for <span className="font-bold">{tieBreakModal.participantName}</span>{" "}
              (Original Score: {tieBreakModal.originalScore}%). Enter a tie-break score and reason.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Tie-Break Score
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 85.50"
                  value={tieBreakModal.tieBreakScore}
                  onChange={(e) =>
                    setTieBreakModal((prev) => ({ ...prev, tieBreakScore: e.target.value }))
                  }
                  aria-label="Tie-Break Score"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Resolution Note / Reason
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter reason for tie-break..."
                  value={tieBreakModal.notes}
                  onChange={(e) =>
                    setTieBreakModal((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  aria-label="Resolution Note or Reason"
                  className="w-full p-3 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setTieBreakModal({
                    isOpen: false,
                    registrationId: "",
                    participantName: "",
                    originalScore: null,
                    tieBreakScore: "",
                    notes: "",
                  })
                }
                className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!tieBreakModal.tieBreakScore || !tieBreakModal.notes.trim()}
                onClick={handleResolveTie}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold disabled:bg-stone-300 disabled:text-stone-500"
              >
                Save Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Finalize Confirmation Modal */}
      {finalizeConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-labelledby="finalize-modal-title"
            className="w-full max-w-md p-6 rounded-2xl bg-card border shadow-xl space-y-4"
          >
            <h3 id="finalize-modal-title" className="text-lg font-bold text-foreground">
              Finalize Competition Results?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Finalizing will lock First, Second, and Third positions. Normal draft editing will be
              disabled. Results will remain non-public until you click &quot;Publish Official
              Results&quot;.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFinalizeConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalizeResults}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-sm font-bold"
              >
                Confirm Finalization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Publish Confirmation Modal */}
      {publishConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-labelledby="publish-modal-title"
            className="w-full max-w-md p-6 rounded-2xl bg-card border shadow-xl space-y-4"
          >
            <h3 id="publish-modal-title" className="text-lg font-bold text-foreground">
              Publish Official Competition Results?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Publishing will make official results publicly visible across the Current
              Leaderboard, Champion Spotlight, and Winners Gallery. Points will be authoritatively
              awarded via the idempotent ledger.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPublishConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishResults}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
              >
                Confirm Official Publication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
