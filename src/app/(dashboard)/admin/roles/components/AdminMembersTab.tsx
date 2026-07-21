"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Shield, Loader2, CheckCircle2, User, Building2, Home } from "lucide-react";
import { getAdministrativeMembers, AdminMember } from "@/app/actions/userManagement";
import Link from "next/link";

export function AdminMembersTab() {
  const [filter, setFilter] = useState<"ALL" | "ADMIN" | "CR" | "BMC">("ALL");
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers(filter);
  }, [filter]);

  const fetchMembers = (currentFilter: "ALL" | "ADMIN" | "CR" | "BMC") => {
    setError(null);
    startTransition(async () => {
      const res = await getAdministrativeMembers(currentFilter, 1, 100); // 100 for simplicity now
      if (res.success && res.members) {
        setMembers(res.members);
        setTotal(res.total || 0);
      } else {
        setError(res.error || "Failed to load members.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["ALL", "ADMIN", "CR", "BMC"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === f
                ? "bg-[#8F0028] text-white"
                : "bg-white text-[#756A6E] hover:bg-[#8F0028]/[0.05] border border-[#8F0028]/[0.12]"
            }`}
          >
            {f === "ALL" ? "All" : f === "ADMIN" ? "Admins" : f === "CR" ? "CRs" : "BMCs"}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#8F0028]/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#756A6E]">
            {loading ? <Loader2 className="w-3 h-3 animate-spin inline-block mr-1" /> : total}{" "}
            Members Found
          </span>
        </div>

        {members.length === 0 && !loading ? (
          <div className="p-8 text-center text-sm text-[#756A6E]">
            No administrative members found in this category.
          </div>
        ) : (
          <div className="divide-y divide-[#8F0028]/[0.06]">
            {members.map((member) => (
              <div key={member.assignmentId} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#8F0028]/[0.06] flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-[#8F0028]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171214] truncate">
                        {member.fullName}
                      </span>
                      {member.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="text-xs text-[#756A6E] truncate">
                      @{member.username || "unknown"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0 min-w-[140px]">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    member.roleCode === "SUPER_ADMIN" ? "bg-[#E8B83F]/15 text-[#8F6D10] border border-[#E8B83F]/25" :
                    member.roleCode === "ADMIN" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    "bg-[#8F0028]/[0.06] text-[#8F0028] border border-[#8F0028]/[0.10]"
                  }`}>
                    <Shield className="w-3.5 h-3.5" />
                    {member.roleName}
                  </span>
                  
                  {member.departmentName && (
                    <span className="text-xs text-[#756A6E] flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{member.departmentName}</span>
                    </span>
                  )}
                  {member.hostelName && (
                    <span className="text-xs text-[#756A6E] flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{member.hostelName}</span>
                    </span>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#756A6E] bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {member.profileType.replace(/_/g, " ")}
                  </span>
                  <Link
                    href={`/profile/${member.username || member.profileId}`}
                    className="text-xs font-bold text-[#8F0028] hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
