import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyVerificationStatus, getVerificationHistory } from "@/actions/student/verification.actions";
import { VerificationPageClient } from "./verification-client";

export const metadata: Metadata = {
  title: "Verification | Ravenshaw Moments",
  description:
    "Submit verification requests, track approval status, and view your verification timeline.",
};

export default async function VerificationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [statusResult, historyResult] = await Promise.all([
    getMyVerificationStatus(),
    getVerificationHistory(),
  ]);

  // @ts-ignore
  const currentStatus = statusResult.success ? statusResult.data?.status : "unverified";
  const isVerified = currentStatus === "verified";
  // @ts-ignore
  const history = historyResult.success ? historyResult.data || [] : [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"
      >
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/profile" className="hover:text-foreground transition-colors">
          My Profile
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Verification</span>
      </nav>

      <VerificationPageClient
        profileId={user.id}
        isVerified={isVerified}
        verificationHistory={history}
      />
    </main>
  );
}
