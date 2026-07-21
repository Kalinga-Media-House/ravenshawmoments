import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ManualContributionForm } from "@/features/donation/components/ManualContributionForm";
import { ManualContributionList } from "@/features/donation/components/ManualContributionList";

export const metadata = {
  title: "Manage Contributions | Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const { data: isPlatformAdmin } = await supabase.rpc("is_platform_admin_rpc");
  if (!isPlatformAdmin) {
    redirect("/dashboard");
  }

  // Fetch recent manual payments
  const { data: manualPayments, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      currency_code,
      payment_status,
      paid_at,
      payer_name,
      payer_email,
      donations!inner (
        id,
        visibility,
        admin_note,
        verified_by
      ),
      profiles (
        full_name,
        email
      )
    `)
    .eq("payment_provider", "manual")
    .order("created_at", { ascending: false })
    .limit(50);

  const formattedPayments = (manualPayments || []).map((p: any) => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency_code,
    status: p.payment_status,
    date: p.paid_at,
    name: p.profiles?.full_name || p.payer_name || "Unknown",
    email: p.profiles?.email || p.payer_email || "N/A",
    visibility: p.donations[0]?.visibility,
    adminNote: p.donations[0]?.admin_note,
    verifiedBy: p.donations[0]?.verified_by,
  }));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex justify-between items-center border-b border-[var(--color-rm-glass-border)] pb-4">
        <div>
          <h1 className="text-3xl font-serif text-white">Manage Manual Contributions</h1>
          <p className="text-sm text-[var(--color-rm-muted-text)] mt-1">
            Super Admin access only. Manage cash, bank transfers, and offline donations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ManualContributionForm />
        </div>
        <div className="lg:col-span-2">
          <ManualContributionList contributions={formattedPayments} />
        </div>
      </div>
    </div>
  );
}
