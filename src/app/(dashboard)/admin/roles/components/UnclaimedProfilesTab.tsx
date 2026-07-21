"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Archive, Loader2, User, HelpCircle } from "lucide-react";
import { getUnclaimedProfiles, UnclaimedProfile } from "@/app/actions/userManagement";
import Link from "next/link";

export function UnclaimedProfilesTab() {
  const [profiles, setProfiles] = useState<UnclaimedProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = () => {
    setError(null);
    startTransition(async () => {
      const res = await getUnclaimedProfiles(1, 100);
      if (res.success && res.profiles) {
        setProfiles(res.profiles);
        setTotal(res.total || 0);
      } else {
        setError(res.error || "Failed to load unclaimed profiles.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFDF8] rounded-xl border border-[#E8B83F]/20 p-5">
        <h3 className="text-sm font-bold text-[#171214] flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-[#E8B83F]" />
          What are Unclaimed Profiles?
        </h3>
        <p className="text-xs text-[#756A6E]">
          These are profiles pre-created by the administration (usually from legacy data or bulk imports) that have not yet been claimed by their respective owners. Users can claim these profiles during registration by verifying their identity.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#8F0028]/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#756A6E]">
            {loading ? <Loader2 className="w-3 h-3 animate-spin inline-block mr-1" /> : total}{" "}
            Unclaimed Profiles
          </span>
        </div>

        {error && (
          <div className="p-4 m-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        {profiles.length === 0 && !loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#8F0028]/[0.06] flex items-center justify-center mb-4">
              <Archive className="w-8 h-8 text-[#8F0028]" />
            </div>
            <h3 className="text-sm font-bold text-[#171214] mb-1">No Unclaimed Profiles</h3>
            <p className="text-xs text-[#756A6E] max-w-sm">
              All pre-created profiles have been successfully claimed or none currently exist.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#8F0028]/[0.06]">
            {profiles.map((profile) => (
              <div key={profile.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#8F0028]/[0.06] flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-[#8F0028]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171214]">
                        {profile.fullName}
                      </span>
                      {profile.hasPendingClaim && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          Claim Pending
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#756A6E] mt-0.5">
                      {profile.profileType.replace(/_/g, " ")}
                      {profile.rollNumber && ` • Roll: ${profile.rollNumber}`}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {profile.id ? (
                    <Link
                      href={`/admin/roles/profiles/${profile.id}`}
                      className="px-4 py-2 rounded-lg border border-[#8F0028]/[0.12] text-sm font-bold text-[#171214] hover:bg-[#8F0028]/[0.02] transition-colors"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button disabled className="px-4 py-2 rounded-lg border border-[#8F0028]/[0.12] text-sm font-bold text-[#756A6E] opacity-50 cursor-not-allowed">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
