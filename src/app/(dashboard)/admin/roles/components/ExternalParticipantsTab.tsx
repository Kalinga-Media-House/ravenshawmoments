"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Search,
  Loader2,
  Globe2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Trophy,
  ArrowUpDown,
} from "lucide-react";
import {
  searchExternalParticipants,
  getExternalParticipantCounts,
  ExternalParticipant,
  ExternalParticipantFilters,
  ExternalParticipantCounts,
} from "@/app/actions/userManagement";
import Link from "next/link";

const COURSE_LEVEL_LABELS: Record<string, string> = {
  plus_two: "+2",
  ug: "UG",
  pg: "PG",
  phd: "PhD",
  other: "Other",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function VerificationBadge({ isVerified }: { isVerified: boolean }) {
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" />
      Unverified
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Active
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-700 border border-red-200">
          <AlertTriangle className="w-3 h-3" />
          Suspended
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Pending
        </span>
      );
    case "unclaimed":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-50 text-gray-600 border border-gray-200">
          Unclaimed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-50 text-gray-600 border border-gray-200">
          {status}
        </span>
      );
  }
}

export function ExternalParticipantsTab() {
  const [filters, setFilters] = useState<ExternalParticipantFilters>({
    query: "",
    verification: "ALL",
    accountStatus: "ALL",
    courseLevel: "ALL",
    sortBy: "newest",
    page: 1,
  });

  const [participants, setParticipants] = useState<ExternalParticipant[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<ExternalParticipantCounts | null>(null);
  const [loading, startTransition] = useTransition();
  const [countsLoading, setCountsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch counts on mount
  useEffect(() => {
    async function fetchCounts() {
      const res = await getExternalParticipantCounts();
      if (res.success && res.counts) {
        setCounts(res.counts);
      }
      setCountsLoading(false);
    }
    fetchCounts();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParticipants(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilter = (key: keyof ExternalParticipantFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const fetchParticipants = (currentFilters: ExternalParticipantFilters) => {
    setError(null);
    startTransition(async () => {
      const res = await searchExternalParticipants(currentFilters);
      if (res.success && res.participants) {
        setParticipants(res.participants);
        setTotal(res.total || 0);
      } else {
        setError(res.error || "Failed to load participants.");
      }
    });
  };

  const summaryCards = [
    {
      label: "Total",
      value: counts?.total,
      icon: Users,
      color: "text-[#8F0028]",
      bg: "bg-[#8F0028]/[0.06]",
    },
    {
      label: "Verified",
      value: counts?.verified,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Unverified",
      value: counts?.unverified,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active",
      value: counts?.active,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Suspended",
      value: counts?.suspended,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white p-4 rounded-xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full ${card.bg} flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#756A6E]">
                  {card.label}
                </span>
              </div>
              <div className="text-xl font-serif font-bold text-[#171214]">
                {countsLoading ? (
                  <div className="h-6 w-10 bg-gray-100 rounded animate-pulse" />
                ) : (
                  card.value?.toLocaleString() || "0"
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <label className="block text-sm font-bold text-[#171214] mb-2">
          Search External Participants
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756A6E]" />
          <input
            type="text"
            value={filters.query || ""}
            onChange={(e) => updateFilter("query", e.target.value)}
            placeholder="Search by name, email, username, college, or university..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-sm text-[#171214] placeholder:text-[#756A6E]/60 focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40 focus:border-[#E8B83F]/60 transition-all"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <select
            value={filters.verification}
            onChange={(e) => updateFilter("verification", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          <select
            value={filters.accountStatus}
            onChange={(e) => updateFilter("accountStatus", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filters.courseLevel}
            onChange={(e) => updateFilter("courseLevel", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Levels</option>
            <option value="plus_two">+2</option>
            <option value="ug">UG</option>
            <option value="pg">PG</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#756A6E]">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Searching...
            </span>
          ) : (
            `${total} participant${total !== 1 ? "s" : ""} found`
          )}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Participant Cards / Table */}
      {!loading && participants.length === 0 && !error && (
        <div className="text-center py-16">
          <Globe2 className="w-12 h-12 mx-auto text-[#8F0028]/20 mb-4" />
          <h3 className="text-sm font-bold text-[#171214] mb-1">
            No External Participants Found
          </h3>
          <p className="text-xs text-[#756A6E]">
            {filters.query || filters.verification !== "ALL" || filters.accountStatus !== "ALL" || filters.courseLevel !== "ALL"
              ? "Try adjusting your search or filters."
              : "No external participants have registered on the platform yet."}
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {participants.length > 0 && (
        <>
          {/* Desktop view */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-[#8F0028]/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FFFDF8] border-b border-[#8F0028]/[0.08]">
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#756A6E]">
                    Participant
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#756A6E]">
                    Institution
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#756A6E]">
                    Level
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#756A6E]">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#756A6E]">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Comps
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#756A6E]">
                    Joined
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#756A6E]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#8F0028]/[0.04] hover:bg-[#8F0028]/[0.01] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8F0028]/[0.08] flex items-center justify-center text-xs font-bold text-[#8F0028]">
                          {getInitials(p.fullName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#171214] truncate">
                              {p.fullName}
                            </span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#8F0028]/[0.06] text-[#8F0028]">
                              <Globe2 className="w-2.5 h-2.5" />
                              External
                            </span>
                          </div>
                          <p className="text-[11px] text-[#756A6E] truncate">
                            {p.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-xs text-[#171214] truncate max-w-[180px]">
                          {p.collegeName || p.universityName || "Not provided"}
                        </p>
                        {p.state && (
                          <p className="text-[11px] text-[#756A6E]">
                            {p.state}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#171214]">
                        {p.courseLevel
                          ? COURSE_LEVEL_LABELS[p.courseLevel] || p.courseLevel
                          : "—"}
                      </span>
                      {p.courseName && (
                        <p className="text-[11px] text-[#756A6E] truncate max-w-[100px]">
                          {p.courseName}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <VerificationBadge isVerified={p.isVerified} />
                        <StatusBadge status={p.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-[#171214]">
                        {p.competitionCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#756A6E]">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/roles/profiles/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#8F0028] bg-[#8F0028]/[0.04] hover:bg-[#8F0028]/[0.10] rounded-lg border border-[#8F0028]/[0.12] transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {participants.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-[#8F0028]/[0.08] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#8F0028]/[0.08] flex items-center justify-center text-sm font-bold text-[#8F0028] shrink-0">
                    {getInitials(p.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#171214]">
                        {p.fullName}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#8F0028]/[0.06] text-[#8F0028]">
                        <Globe2 className="w-2.5 h-2.5" />
                        External
                      </span>
                    </div>
                    <p className="text-[11px] text-[#756A6E] truncate">
                      {p.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-[#756A6E]">Institution</span>
                    <p className="font-medium text-[#171214] truncate">
                      {p.collegeName || p.universityName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#756A6E]">Level</span>
                    <p className="font-medium text-[#171214]">
                      {p.courseLevel
                        ? COURSE_LEVEL_LABELS[p.courseLevel] || p.courseLevel
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#756A6E]">Competitions</span>
                    <p className="font-medium text-[#171214]">
                      {p.competitionCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#756A6E]">Joined</span>
                    <p className="font-medium text-[#171214]">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <VerificationBadge isVerified={p.isVerified} />
                  <StatusBadge status={p.status} />
                </div>

                <Link
                  href={`/admin/roles/profiles/${p.id}`}
                  className="flex items-center justify-center gap-1 w-full px-3 py-2 text-xs font-bold text-[#8F0028] bg-[#8F0028]/[0.04] hover:bg-[#8F0028]/[0.10] rounded-lg border border-[#8F0028]/[0.12] transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.max(1, (prev.page || 1) - 1),
              }))
            }
            disabled={(filters.page || 1) <= 1}
            className="px-3 py-1.5 text-xs font-bold text-[#756A6E] bg-white border border-[#8F0028]/[0.12] rounded-lg disabled:opacity-40 hover:bg-[#FFFDF8] transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-[#756A6E]">
            Page {filters.page || 1} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: (prev.page || 1) + 1,
              }))
            }
            disabled={(filters.page || 1) >= Math.ceil(total / 20)}
            className="px-3 py-1.5 text-xs font-bold text-[#756A6E] bg-white border border-[#8F0028]/[0.12] rounded-lg disabled:opacity-40 hover:bg-[#FFFDF8] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
