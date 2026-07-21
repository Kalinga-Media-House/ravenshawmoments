"use client";

import React from "react";
import { History, ShieldAlert, CheckCircle2, XCircle, RotateCcw, Trash2, Edit } from "lucide-react";

export interface AuditLogEntry {
  id: string;
  action: string;
  created_at: string;
  actor_profile_id: string;
  actor_name?: string; // We'll try to fetch this
  actor_role?: string;
  old_data?: any;
  new_data?: any;
}

interface AdminHistoryCardProps {
  logs: AuditLogEntry[];
}

export function AdminHistoryCard({ logs }: AdminHistoryCardProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#171214] border-b border-black/5 pb-2 flex items-center gap-2">
          <History className="w-4 h-4 text-[#756A6E]" /> Administrative History
        </h3>
        <p className="text-sm text-gray-500 mt-4 text-center py-4">No administrative actions recorded yet.</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "PROFILE_VERIFIED": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "PROFILE_VERIFICATION_REJECTED": return <XCircle className="w-4 h-4 text-red-600" />;
      case "PROFILE_CORRECTION_REQUESTED": return <Edit className="w-4 h-4 text-blue-600" />;
      case "PROFILE_SUSPENDED": return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case "PROFILE_RESTORED": return <RotateCcw className="w-4 h-4 text-orange-600" />;
      case "PROFILE_SOFT_DELETED": return <Trash2 className="w-4 h-4 text-gray-600" />;
      default: return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "PROFILE_VERIFIED": return "bg-green-50 text-green-800 border-green-100";
      case "PROFILE_VERIFICATION_REJECTED": return "bg-red-50 text-red-800 border-red-100";
      case "PROFILE_CORRECTION_REQUESTED": return "bg-blue-50 text-blue-800 border-blue-100";
      case "PROFILE_SUSPENDED": return "bg-amber-50 text-amber-800 border-amber-100";
      case "PROFILE_RESTORED": return "bg-orange-50 text-orange-800 border-orange-100";
      case "PROFILE_SOFT_DELETED": return "bg-gray-50 text-gray-800 border-gray-200";
      default: return "bg-gray-50 text-gray-800 border-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#8F0028]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mt-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#171214] border-b border-black/5 pb-2 flex items-center gap-2">
        <History className="w-4 h-4 text-[#756A6E]" /> Administrative History
      </h3>
      
      <div className="mt-4 space-y-3">
        {logs.map((log) => (
          <div key={log.id} className={`p-3 rounded-lg border ${getActionColor(log.action)} flex gap-3`}>
            <div className="mt-0.5">{getActionIcon(log.action)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {log.action.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-xs mt-1 text-gray-700">
                <span className="font-semibold">By:</span> {log.actor_name || log.actor_profile_id.substring(0,8)+'...'}
                {log.actor_role && <span className="ml-1 opacity-70">({log.actor_role})</span>}
              </p>
              
              {log.new_data?.reason && (
                <p className="text-xs mt-1 font-medium italic opacity-80">"{log.new_data.reason}"</p>
              )}
              {log.new_data?.message && (
                <p className="text-xs mt-1 font-medium italic opacity-80">"{log.new_data.message}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
