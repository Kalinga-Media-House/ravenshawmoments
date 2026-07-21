"use client";

import React, { useEffect, useState, useTransition } from "react";
import { History, Loader2, User, Clock, ShieldAlert } from "lucide-react";
import { getAuditHistory, AuditLog } from "@/app/actions/userManagement";
import Link from "next/link";

export function AuditHistoryTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setError(null);
    startTransition(async () => {
      const res = await getAuditHistory(1, 100);
      if (res.success && res.logs) {
        setLogs(res.logs);
        setTotal(res.total || 0);
      } else {
        setError(res.error || "Failed to load audit history.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFDF8] rounded-xl border border-[#E8B83F]/20 p-5">
        <h3 className="text-sm font-bold text-[#171214] flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-[#E8B83F]" />
          Super Admin Restricted Area
        </h3>
        <p className="text-xs text-[#756A6E]">
          The audit history records all administrative actions for accountability. This log is immutable and only visible to Super Admins.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#8F0028]/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#756A6E]">
            {loading ? <Loader2 className="w-3 h-3 animate-spin inline-block mr-1" /> : total}{" "}
            Audit Records
          </span>
        </div>

        {error && (
          <div className="p-4 m-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        {logs.length === 0 && !loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#8F0028]/[0.06] flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-[#8F0028]" />
            </div>
            <h3 className="text-sm font-bold text-[#171214] mb-1">No Audit Logs</h3>
            <p className="text-xs text-[#756A6E] max-w-sm">
              No administrative actions have been recorded yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#8F0028]/[0.06]">
            {logs.map((log) => (
              <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#8F0028]/[0.01] transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <History className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171214]">
                        {log.action}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#8F0028]/[0.06] text-[#8F0028] border border-[#8F0028]/[0.10]">
                        {log.entityType}
                      </span>
                    </div>
                    <div className="text-xs text-[#756A6E] mt-1 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>
                        Performed by <span className="font-semibold text-[#171214]">{log.actorName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <div className="text-[10px] text-[#756A6E] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                  {log.actorUsername && (
                    <Link
                      href={`/profile/${log.actorUsername}`}
                      className="text-[10px] font-bold text-[#8F0028] hover:underline"
                    >
                      View Actor
                    </Link>
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
