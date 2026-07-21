"use client";

import React, { useEffect, useState, useTransition } from "react";
import { UserCheck, Loader2, User, Clock } from "lucide-react";
import { getPendingVerifications, VerificationRequest } from "@/app/actions/userManagement";
import Link from "next/link";

export function VerificationCenterTab() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setError(null);
    startTransition(async () => {
      const res = await getPendingVerifications(1, 100);
      if (res.success && res.requests) {
        setRequests(res.requests);
        setTotal(res.total || 0);
      } else {
        setError(res.error || "Failed to load verification requests.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#8F0028]/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#756A6E]">
            {loading ? <Loader2 className="w-3 h-3 animate-spin inline-block mr-1" /> : total}{" "}
            Pending Requests
          </span>
        </div>

        {error && (
          <div className="p-4 m-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        {requests.length === 0 && !loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-[#171214] mb-1">All Caught Up!</h3>
            <p className="text-xs text-[#756A6E] max-w-sm">
              There are no pending profile verification requests at this time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#8F0028]/[0.06]">
            {requests.map((req) => (
              <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#8F0028]/[0.06] flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-[#8F0028]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171214]">
                        {req.fullName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-[#756A6E] mt-0.5">
                      @{req.username || "unknown"} • {req.profileType.replace(/_/g, " ")}
                    </div>
                    <div className="text-[10px] text-[#756A6E] mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Requested on {new Date(req.requestedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/profile/${req.username || req.profileId}`}
                    className="px-4 py-2 rounded-lg border border-[#8F0028]/[0.12] text-sm font-bold text-[#171214] hover:bg-[#8F0028]/[0.02] transition-colors"
                  >
                    View Profile
                  </Link>
                  <button className="px-4 py-2 rounded-lg bg-[#8F0028] text-white text-sm font-bold hover:bg-[#68001D] transition-colors shadow-sm">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
