"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Search, Loader2, User, ShieldCheck, CheckCircle2 } from "lucide-react";
import { searchAndExploreUsers, UserSearchFilters, UserSearchResult } from "@/app/actions/userManagement";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function UserSearchTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<UserSearchFilters>({
    query: searchParams.get("q") || "",
    communityIdentity: searchParams.get("identity") || "ALL",
    adminRole: searchParams.get("role") || "ALL",
    verification: searchParams.get("verified") || "ALL",
    claimStatus: searchParams.get("claim") || "ALL",
    page: 1,
  });

  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(filters);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilter = (key: keyof UserSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    
    // Update URL gracefully
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      if (key === 'query') params.set("q", value);
      else if (key === 'communityIdentity') params.set("identity", value);
      else if (key === 'adminRole') params.set("role", value);
      else if (key === 'verification') params.set("verified", value);
      else if (key === 'claimStatus') params.set("claim", value);
    } else {
      if (key === 'query') params.delete("q");
      else if (key === 'communityIdentity') params.delete("identity");
      else if (key === 'adminRole') params.delete("role");
      else if (key === 'verification') params.delete("verified");
      else if (key === 'claimStatus') params.delete("claim");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const fetchUsers = (currentFilters: UserSearchFilters) => {
    setError(null);
    startTransition(async () => {
      const res = await searchAndExploreUsers(currentFilters);
      if (res.success && res.users) {
        setUsers(res.users);
        setTotal(res.total || 0);
      } else {
        setError(res.error || "Failed to load users.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <label className="block text-sm font-bold text-[#171214] mb-2">
          Search & Explore Users
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756A6E]" />
          <input
            type="text"
            value={filters.query || ""}
            onChange={(e) => updateFilter("query", e.target.value)}
            placeholder="Search by name, username, email, or roll number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-sm text-[#171214] placeholder:text-[#756A6E]/60 focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40 focus:border-[#E8B83F]/60 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <select 
            value={filters.communityIdentity} 
            onChange={e => updateFilter("communityIdentity", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Identities</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="teacher">Teacher</option>
            <option value="external_participant">External Participant</option>
          </select>

          <select 
            value={filters.adminRole} 
            onChange={e => updateFilter("adminRole", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="DEPARTMENT_CR">CR</option>
            <option value="HOSTEL_BMC">BMC</option>
            <option value="NONE">No Administrative Role</option>
          </select>

          <select 
            value={filters.verification} 
            onChange={e => updateFilter("verification", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          <select 
            value={filters.claimStatus} 
            onChange={e => updateFilter("claimStatus", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#8F0028]/[0.12] bg-[#FFFDF8] text-[#171214] focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/40"
          >
            <option value="ALL">All Profiles</option>
            <option value="claimed">Claimed</option>
            <option value="unclaimed">Unclaimed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#8F0028]/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#756A6E]">
            {loading ? <Loader2 className="w-3 h-3 animate-spin inline-block mr-1" /> : total}{" "}
            users found
          </span>
        </div>

        {users.length === 0 && !loading ? (
          <div className="p-8 text-center text-sm text-[#756A6E]">
            No users match your criteria.
          </div>
        ) : (
          <div className="divide-y divide-[#8F0028]/[0.06]">
            {users.map((user) => (
              <div key={user.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[#8F0028]/[0.01] transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#8F0028]/[0.06] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#8F0028]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171214] truncate">
                        {user.fullName || "Unknown"}
                      </span>
                      {user.isVerified && (
                        <span title="Verified">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#756A6E] truncate">
                      @{user.username || "unknown"} • {user.email || "No email"}
                      {user.rollNumber && ` • Roll: ${user.rollNumber}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#8F0028]/[0.06] text-[#8F0028] border border-[#8F0028]/[0.10]">
                    {user.profileType.replace(/_/g, " ")}
                  </span>
                  {!user.isProfileClaimed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                      Unclaimed
                    </span>
                  )}
                  {user.platformRoles.map(role => (
                    <span key={role.code} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8B83F]/15 text-[#8F6D10] border border-[#E8B83F]/25 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {role.name}
                    </span>
                  ))}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/profile/${user.username || user.id}`}
                    className="px-3 py-1.5 rounded-lg border border-[#8F0028]/[0.12] text-[#171214] hover:bg-[#8F0028]/[0.02] text-xs font-bold transition-colors"
                  >
                    View
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
