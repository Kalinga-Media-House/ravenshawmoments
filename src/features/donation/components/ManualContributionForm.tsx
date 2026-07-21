"use client";

import React, { useState } from "react";
import { createManualContribution } from "@/app/actions/donations";
import { useRouter } from "next/navigation";

export function ManualContributionForm() {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const publicRecognition = formData.get("publicRecognition") === "true";

    const res = await createManualContribution({
      isGuest,
      profileId: (formData.get("profileId") as string) || undefined,
      guestName: (formData.get("guestName") as string) || undefined,
      guestEmail: (formData.get("guestEmail") as string) || undefined,
      guestPhone: (formData.get("guestPhone") as string) || undefined,
      amount,
      currency: (formData.get("currency") as string) || "INR",
      paymentMethod: (formData.get("paymentMethod") as any) || "manual",
      contributionDate: new Date().toISOString(),
      publicRecognition,
      publicAmount: false,
      adminNote: (formData.get("adminNote") as string) || undefined,
    });

    if (res.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-rm-surface)] border border-[var(--color-rm-glass-border)] rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#171214] mb-4">Add Manual Contribution</h2>

      {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-200">{error}</div>}

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={isGuest} onChange={() => setIsGuest(true)} className="accent-[var(--color-rm-gold)]" />
          <span className="text-sm text-[#171214]">Guest Contributor</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={!isGuest} onChange={() => setIsGuest(false)} className="accent-[var(--color-rm-gold)]" />
          <span className="text-sm text-[#171214]">Existing Profile</span>
        </label>
      </div>

      {isGuest ? (
        <>
          <input name="guestName" required placeholder="Guest Full Name" className="w-full bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214]" />
          <input name="guestEmail" type="email" placeholder="Guest Email (Optional)" className="w-full bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214]" />
          <input name="guestPhone" placeholder="Guest Phone (Optional)" className="w-full bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214]" />
        </>
      ) : (
        <input name="profileId" required placeholder="Profile UUID" className="w-full bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214] font-mono text-sm" />
      )}

      <div className="flex gap-2">
        <input name="amount" type="number" required min="1" step="0.01" placeholder="Amount" className="w-full bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214]" />
        <select name="currency" className="bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214] w-24">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <select name="paymentMethod" className="w-full bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] rounded px-3 py-2 text-[#171214]">
        <option value="manual">Manual / Offline</option>
        <option value="cash">Cash</option>
        <option value="upi">UPI (External)</option>
        <option value="bank_transfer">Bank Transfer</option>
      </select>

      <div className="grid grid-cols-1 gap-2">
        <label className="flex items-center gap-2 cursor-pointer bg-[#FFFDF8] border border-[var(--color-rm-glass-border)] p-2 rounded">
          <input type="checkbox" name="publicRecognition" value="true" className="accent-[var(--color-rm-gold)]" />
          <span className="text-xs text-[#171214]">Display Contributor Publicly</span>
        </label>
      </div>

      <input name="adminNote" placeholder="Internal Admin Note (Never public)" className="w-full bg-red-900/20 border border-red-500/30 rounded px-3 py-2 text-[#171214] text-sm" />

      <button disabled={loading} type="submit" className="w-full py-2 bg-[#8F0028] text-black font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50">
        {loading ? "Recording..." : "Record & Pend Verification"}
      </button>
    </form>
  );
}
