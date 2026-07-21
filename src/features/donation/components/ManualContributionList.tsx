"use client";

import React, { useState } from "react";
import { verifyManualContribution, hideManualContribution, rejectManualContribution } from "@/app/actions/donations";
import { useRouter } from "next/navigation";

export function ManualContributionList({ contributions }: { contributions: any[] }) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    setProcessing(id);
    await verifyManualContribution(id);
    setProcessing(null);
    router.refresh();
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    await rejectManualContribution(id);
    setProcessing(null);
    router.refresh();
  };

  const handleHide = async (id: string) => {
    setProcessing(id);
    await hideManualContribution(id);
    setProcessing(null);
    router.refresh();
  };

  return (
    <div className="bg-[var(--color-rm-surface)] border border-[var(--color-rm-glass-border)] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#171214]">
          <thead className="bg-white border-b border-[var(--color-rm-glass-border)] text-xs uppercase text-[#756A6E]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Contributor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((c) => (
              <tr key={c.id} className="border-b border-[var(--color-rm-glass-border)] hover:bg-white">
                <td className="px-4 py-3 whitespace-nowrap text-[#756A6E]">
                  {new Date(c.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#171214]">{c.name}</div>
                  <div className="text-xs text-[#756A6E]">{c.email}</div>
                  {c.adminNote && (
                    <div className="text-[10px] text-red-300 mt-1 truncate max-w-[200px]" title={c.adminNote}>
                      Note: {c.adminNote}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono">
                  {c.currency} {c.amount}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    c.status === "paid" ? "bg-green-500/20 text-green-300" :
                    c.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-red-500/20 text-red-300"
                  }`}>
                    {c.status}
                  </span>
                  <div className="text-[10px] text-[#756A6E] mt-1">
                    {c.visibility}
                  </div>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {c.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleVerify(c.id)}
                        disabled={processing === c.id}
                        className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs text-[#171214] disabled:opacity-50"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleReject(c.id)}
                        disabled={processing === c.id}
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs text-[#171214] disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {c.status === "paid" && c.visibility !== "anonymous" && (
                    <button
                      onClick={() => handleHide(c.id)}
                      disabled={processing === c.id}
                      className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs text-[#171214] disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {contributions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#756A6E]">
                  No manual contributions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
