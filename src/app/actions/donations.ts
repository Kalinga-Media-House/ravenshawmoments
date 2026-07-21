"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PublicContributor } from "@/features/donation/types/donation";

export type RecognitionTier = "premium" | "regular" | "none";

export interface ContributorStats {
  premiumCount: number;
  regularCount: number;
  totalPublicCount: number;
}

/**
 * Fetches public contributors for a specific month and year.
 * Safe public projection that respects RLS/view definitions.
 */
export async function getPublicContributors(
  month: number,
  year: number
): Promise<{ premium: PublicContributor[]; regular: PublicContributor[] }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vw_public_contributors")
    .select("*")
    .eq("contribution_year", year)
    .eq("contribution_month", month)
    .order("amount", { ascending: false, nullsFirst: false });

  if (error || !data) {
    console.error("Error fetching contributors:", error);
    return { premium: [], regular: [] };
  }

  const mappedData: PublicContributor[] = data.map((c: any) => ({
    id: c.id,
    publicDisplayName: c.display_name,
    profilePhoto: c.avatar_url, // Null from DB for now, falls back gracefully to default avatar
    profileSlug: c.profile_slug,
    label: c.tier === "premium" ? "Premium Contributor" : "Contributor",
    // We add tier dynamically just for filtering below, though it's not strictly in the type
    _tier: c.tier,
    _year: c.contribution_year,
    _month: c.contribution_month,
  } as any));

  // Split into premium and regular
  const premium = mappedData.filter((c: any) => c._tier === "premium");
  
  // Regular contributors are only shown for the CURRENT calendar month
  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;
    
  const regular = isCurrentMonth
    ? mappedData.filter((c: any) => c._tier === "regular")
    : [];

  return { premium, regular };
}

/**
 * Fetches available years that have premium contributors.
 */
export async function getContributorYears(): Promise<number[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vw_public_contributors")
    .select("contribution_year")
    .eq("tier", "premium"); // Only premium contributors have a history archive

  if (error || !data) {
    return [new Date().getFullYear()];
  }

  // @ts-ignore
  const years = Array.from(new Set(data.map((d) => d.contribution_year)));
  years.sort((a, b) => b - a); // Descending

  // Always ensure current year exists
  const currentYear = new Date().getFullYear();
  if (!years.includes(currentYear)) {
    years.unshift(currentYear);
  }

  return years;
}

/**
 * Fetches statistics for the current month.
 */
export async function getContributorStats(): Promise<ContributorStats> {
  const supabase = await createClient();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, error } = await supabase
    .from("vw_public_contributors")
    .select("tier")
    .eq("contribution_year", year)
    .eq("contribution_month", month);

  if (error || !data) {
    return { premiumCount: 0, regularCount: 0, totalPublicCount: 0 };
  }

  // @ts-ignore
  const premiumCount = data.filter((d) => d.tier === "premium").length;
  // @ts-ignore
  const regularCount = data.filter((d) => d.tier === "regular").length;

  return {
    premiumCount,
    regularCount,
    totalPublicCount: data.length, // Only public ones are in this view anyway
  };
}

// ============================================================================
// SUPER ADMIN: Manual Contributions
// ============================================================================

export interface ManualContributionInput {
  isGuest: boolean;
  profileId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  amount: number;
  currency: string;
  paymentMethod: "manual" | "cash" | "bank_transfer";
  contributionDate: string; // ISO string
  publicRecognition: boolean;
  publicAmount: boolean;
  adminNote?: string;
}

export async function createManualContribution(input: ManualContributionInput) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { error: "Unauthorized" };
  }

  const adminId = authData.user.id;

  // Verify super admin
  const { data: isSuperAdmin } = await supabase.rpc("is_platform_admin_rpc");
  if (!isSuperAdmin) {
    return { error: "Only Super Admins can perform this action" };
  }

  // 1. Create Payment Record
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      // @ts-ignore
      profile_id: input.isGuest ? null : input.profileId,
      entity_type: "university",
      entity_id: null,
      amount: input.amount,
      currency_code: input.currency,
      payment_provider: "manual", // Only strictly valid enums
      provider_order_id: `man_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      payment_status: "pending", // Must be verified
      paid_at: input.contributionDate,
      payer_name: input.isGuest ? input.guestName : null,
      payer_email: input.isGuest ? input.guestEmail : null,
      payer_phone: input.isGuest ? input.guestPhone : null,
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    console.error("Failed to create manual payment:", paymentError);
    return { error: "Failed to create payment record" };
  }

  // 2. Create Donation Record
  let visibility = "anonymous";
  if (input.publicRecognition) {
    visibility = "public_hide_amount";
  }

  const { error: donationError } = await supabase
    .from("donations")
    .insert({
      // @ts-ignore
      profile_id: input.isGuest ? null : input.profileId,
      // @ts-ignore
      payment_id: payment.id,
      amount: input.amount,
      visibility,
      donor_name_override: input.isGuest ? input.guestName : null,
      donor_email: input.isGuest ? input.guestEmail : null,
      donor_phone: input.isGuest ? input.guestPhone : null,
      admin_note: input.adminNote
        ? `[Method: ${input.paymentMethod}] ${input.adminNote}`
        : `[Method: ${input.paymentMethod}]`,
      created_by: adminId,
    });

  if (donationError) {
    console.error("Failed to create manual donation:", donationError);
    return { error: "Failed to create donation record" };
  }

  revalidatePath("/admin/donations");
  return { success: true };
}

export async function verifyManualContribution(paymentId: string) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { error: "Unauthorized" };
  }

  const adminId = authData.user.id;

  // Verify super admin
  const { data: isSuperAdmin } = await supabase.rpc("is_platform_admin_rpc");
  if (!isSuperAdmin) {
    return { error: "Only Super Admins can perform this action" };
  }

  // Update payment status
  const { error: paymentError } = await supabase
    .from("payments")
    // @ts-ignore
    .update({ payment_status: "paid" })
    .eq("id", paymentId)
    .eq("payment_provider", "manual"); // Safeguard

  if (paymentError) {
    console.error("Failed to verify payment:", paymentError);
    return { error: "Failed to verify payment" };
  }

  // Update donation audit tracking
  const { error: donationError } = await supabase
    .from("donations")
    // @ts-ignore
    .update({
      verified_by: adminId,
      verified_at: new Date().toISOString(),
    })
    .eq("payment_id", paymentId);

  if (donationError) {
    console.error("Failed to update donation audit info:", donationError);
    return { error: "Failed to update donation audit info" };
  }

  revalidatePath("/admin/donations");
  revalidatePath("/donations");
  return { success: true };
}

export async function rejectManualContribution(paymentId: string) {
    const supabase = await createClient();
    
    // Verify super admin
    const { data: isSuperAdmin } = await supabase.rpc("is_platform_admin_rpc");
    if (!isSuperAdmin) {
      return { error: "Only Super Admins can perform this action" };
    }
  
    // Update payment status to failed/rejected
    const { error: paymentError } = await supabase
      .from("payments")
      // @ts-ignore
      .update({ payment_status: "failed" })
      .eq("id", paymentId)
      .eq("payment_provider", "manual");
  
    if (paymentError) return { error: "Failed to reject payment" };
  
    revalidatePath("/admin/donations");
    revalidatePath("/donations");
    return { success: true };
}

export async function hideManualContribution(paymentId: string) {
    const supabase = await createClient();
    
    // Verify super admin
    const { data: isSuperAdmin } = await supabase.rpc("is_platform_admin_rpc");
    if (!isSuperAdmin) {
      return { error: "Only Super Admins can perform this action" };
    }
  
    // Update donation visibility to anonymous
    const { error: donationError } = await supabase
      .from("donations")
      // @ts-ignore
      .update({ visibility: "anonymous" })
      .eq("payment_id", paymentId);
  
    if (donationError) return { error: "Failed to hide contribution" };
  
    revalidatePath("/admin/donations");
    revalidatePath("/donations");
    return { success: true };
}
